import { createOrderSchema } from "@/types/payment.type";
import razorpay from "@libs/razorpay";
import { Context } from "elysia";
import { PoolClient, Pool } from "pg";

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

const verifyPayment =
  (ctx: Context) => async (client: PoolClient, Pool: Pool) => {};

const functions = {
  createOrderService,
};

export default functions;
