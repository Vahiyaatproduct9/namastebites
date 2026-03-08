import { createHmac } from "crypto";
import { createOrderSchema, verifyOrderSchema } from "@/types/payment.type";
import razorpay from "@libs/razorpay";
import { Context, status } from "elysia";
import { PoolClient, Pool } from "pg";

const RZP_SECRET = process.env.RZP_SECRET || "";
const createOrderService =
  (ctx: Context) => async (client: PoolClient, pool: Pool) => {
    console.log("body: ", ctx.body);
    const { items } = createOrderSchema.parse(ctx.body);
    const item_ids = items.map((item) => item.id);
    // Fetching from Database instead of using client data to make sure the data is safe
    const itemInfo = (
      await pool.query(
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
    //   await client.query(`
    //     INSERT INTO transactions()
    //     VALUES()
    //   `)
    // ).rows[0];

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
