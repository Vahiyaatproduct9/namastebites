import { createHmac } from "crypto";
import { createOrderSchema, verifyOrderSchema } from "@/types/payment.type";
import razorpay from "@libs/razorpay";
import { Context } from "elysia";
import { PoolClient } from "pg";

const RZP_SECRET = process.env.RZP_SECRET;
if (!RZP_SECRET) {
  throw new Error("RZP_SECRET is not set");
}
const createOrderService = (ctx: Context) => async (client: PoolClient) => {
  console.log("body: ", ctx.body);
  const { items, user_id, special_instructions } = createOrderSchema.parse(
    ctx.body,
  );
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

  // const createOrder = (
  //   await client.query(
  //     `
  //     WITH t AS (
  //       INSERT INTO transactions
  //       (
  //         razorpay_transaction_id,
  //         payment_method,
  //         status,
  //         amount_paid
  //       )
  //       VALUES (
  //         $1, 'online'::paymentmethod,
  //         'completed'::transactionstatus,
  //         $2
  //       )
  //       RETURNING *
  //     ),
  //     o AS (
  //       INSERT INTO orders
  //         (user_id,
  //         transaction_id,
  //         location_id,
  //         total_price,
  //         status,
  //         special_instructions)
  //       SELECT $3, t.id, NULL, $4, 'pending'::orderstatus, $5
  //       FROM t
  //       RETURNING *
  //     )
  //     SELECT TO_JSONB(t) as transactions,
  //     TO_JSONB(o) AS orders
  //     FROM t
  //     JOIN o ON TRUE;
  //   `,
  //     [user_id, amount, special_instructions || null],
  //   )
  // ).rows[0];
  const createOrder = (
    await client.query(
      `
        INSERT INTO orders (user_id, location_id, total_price, status, special_instructions)
      VALUES ($1, NULL, $2, 'pending'::orderstatus, $3)
      `,
      [user_id, amount, special_instructions || null],
    )
  ).rows[0];
  console.log("insertion: ", createOrder);
  const order = await razorpay.orders.create({
    // Multiplying by 100 to convert to Rupees
    amount: amount * 100,
    currency: "INR",
    receipt: "receipt",
    notes: {
      message: "Order initiated!",
    },
  });

  console.log("order:", order);
  return {
    status: 200,
    message: "Order created successfully",
    data: { order, amount },
  };
};

const verifyPaymentService = async (ctx: Context) => {
  console.log("body: ", ctx.body);
  const {
    user_id,
    razorpay_signature,
    razorpay_order_id,
    razorpay_payment_id,
  } = verifyOrderSchema.parse(ctx.body);

  await Bun.write("./verifypayment.json", JSON.stringify(ctx.body)).then(
    (res) => console.log("Done!", res),
  );
  const local_generated_signature = createHmac("sha256", RZP_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  // Verifying the signature
  if (razorpay_signature === local_generated_signature) {
    console.log("Payment Verified");
    return {
      message: "Signature verified successfully",
      status: 201,
    };
  }

  return {
    status: 401,
    message: "Signature verification failed",
  };
};

const functions = {
  createOrderService,
  verifyPaymentService,
};

export default functions;
