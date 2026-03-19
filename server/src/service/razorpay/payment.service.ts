import { createHmac } from "crypto";
import { createOrderSchema, verifyOrderSchema } from "@/types/payment.type";
import razorpay from "@libs/razorpay";
import { Context } from "elysia";
import { PoolClient } from "pg";
import { RZP_SECRET } from "@/env";

const createOrderService = (ctx: Context) => async (client: PoolClient) => {
  console.log("body: ", ctx.body);
  const {
    items,
    user_id: clerk_id,
    special_instructions,
    mode,
  } = createOrderSchema.parse(ctx.body);
  const item_ids = items.map((item) => item.id);
  // Fetching from Database instead of using client data to make sure the data is safe
  const itemInfo = (
    await client.query(
      `
      SELECT * FROM items
      WHERE item_id = ANY($1)`,
      [item_ids],
    )
  ).rows;
  let amount: number = 0;
  // Run a loop to calculate the total amount
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const item_price = itemInfo.find(
      (t) => t.item_id === Number(item.id),
    ).price;
    const item_quantity = item.quantity;
    amount += Number(item_price) * item_quantity;
  }
  console.log("total_amount:", amount);
  if (mode === "online") {
    const order = await razorpay.orders.create({
      // Multiplying by 100 to convert to Rupees
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt",
      notes: {
        message: "Order initiated!",
      },
    });
    console.log("razorpay order created:", order);
    const createOrder = (
      await client.query(
        // WE HAVE TO CREATE USER FIRST
        `
        WITH u as (
          SELECT user_id
          FROM USERS
          WHERE CLERK_ID = $1
        ),
        t AS (
          INSERT INTO transactions
          (
            payment_method,
            amount_paid,
            razorpay_order_id
          )
          VALUES (
            'online'::paymentmethod,
            0,
            $2
          )
          RETURNING *
        ),
        o AS (
          INSERT INTO orders
            (user_id,
            transaction_id,
            location_id,
            total_price,
            status,
            special_instructions)
          SELECT (SELECT u.user_id FROM u), t.id, NULL, $3, 'initiated'::orderstatus, $4
          FROM t
          RETURNING *
        ),
        oi AS (
          INSERT INTO ORDER_ITEMS(
            order_id,
            item_id,
            quantity
          )
        SELECT (SELECT o.id FROM o), item_id, quantity
        FROM UNNEST($5::INT[], $6::INT[]) DATA(item_id, quantity)
        )
        SELECT TO_JSONB(t) as transactions,
        TO_JSONB(o) AS orders
        FROM t
        JOIN o ON TRUE;
      `,
        [
          clerk_id,
          order.id,
          amount,
          special_instructions || null,
          items.map((t) => t.id),
          items.map((t) => t.quantity),
        ],
      )
    ).rows[0];
    return {
      status: 201,
      message: "Order created successfully",
      data: { order, amount },
    };
  } else if (mode === "cash_on_delivery") {
    // run offline method
    // pgadmin is too heavy, ill just use nvim
    const createOfflineOrder = (
      await client.query(
        `
-- first we get the user info
      WITH u as (
          SELECT user_id
          FROM USERS
          WHERE CLERK_ID = $1
        ),
-- insert the order data into transactions
        t AS (
          INSERT INTO transactions
          (
            payment_method,
            amount_paid,
            razorpay_order_id
          )
          VALUES (
            'cash_on_delivery'::paymentmethod,
            $2,
            NULL
          )
          RETURNING *
        ),
-- finally insert into the orders section
        o AS (
          INSERT INTO orders
            (user_id,
            transaction_id,
            location_id,
            total_price,
            status,
            special_instructions)
          SELECT
            (SELECT u.user_id FROM u),
            t.id,
-- location id is null FOR NOW, it cannot be null
            NULL,
            $2,
            'confirmed'::orderstatus, $3
          FROM t
          RETURNING *
        ),
-- insert the items that we ordered
        oi AS (
          INSERT INTO ORDER_ITEMS(
            order_id,
            item_id,
            quantity
          )
        SELECT
          (SELECT o.id FROM o),
          item_id,
          quantity
        FROM UNNEST($4::INT[], $5::INT[]) DATA(item_id, quantity)
        )
        SELECT TO_JSONB(t) as transactions,
        TO_JSONB(o) AS orders
        FROM t
        JOIN o ON TRUE;
`,
        [
          clerk_id,
          amount,
          special_instructions || null,
          items.map((t) => t.id),
          items.map((t) => t.quantity),
        ],
        // we couldve reused amount here but i forgot </3
      )
    ).rows[0];
  }
  return {
    status: 200,
    message: "Order created successfully",
    data: { amount },
  };
};

const verifyPaymentService = (ctx: Context) => async (client: PoolClient) => {
  console.log("body: ", ctx.body);
  const {
    user_id,
    razorpay_signature,
    razorpay_order_id,
    razorpay_payment_id,
  } = verifyOrderSchema.parse(ctx.body);
  if (!user_id)
    return { status: 400, message: "Please Sign In to Create Order." };
  await Bun.write("./verifypayment.json", JSON.stringify(ctx.body)).then(
    (res) => console.log("Done!", res),
  );
  const local_generated_signature = createHmac("sha256", RZP_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  // Verifying the signature
  if (razorpay_signature !== local_generated_signature) {
    console.log("Payment Verification Failed");
    await client.query(
      `
      UPDATE transactions
      SET status = 'failed'
      WHERE razorpay_order_id = $1
      `,
      [razorpay_order_id],
    );
    return {
      status: 401,
      message: "Signature verification failed",
    };
  }
  const payment = await razorpay.payments.fetch(razorpay_payment_id);
  console.log("payment: ", payment);
  // converting paise to rupees
  const amount = Number(payment.amount) / 100;
  // I HOPE I HAVE SET IT UP ALL WELL 😅
  await client.query(
    `
    WITH U AS (
      UPDATE transactions
      SET razorpay_payment_id = $1,
      status = 'completed'::transactionstatus,
      amount_paid = $2
      WHERE razorpay_order_id = $3
    ),
    O AS (
      UPDATE orders
      SET STATUS = 'confirmed'::orderstatus
      WHERE transaction_id IN (
        SELECT id FROM transactions
        WHERE razorpay_order_id = $3
      )
    )
      SELECT 1;
    `,
    [razorpay_payment_id, amount, razorpay_order_id],
  );

  return {
    message: "Signature verified successfully",
    status: 201,
  };
};

const functions = {
  createOrderService,
  verifyPaymentService,
};

export default functions;
