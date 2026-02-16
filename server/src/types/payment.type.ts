import * as z from "zod";
const paymentOrderSchema = z.object({
  amount: z.number(),
  notes: z.optional(
    z.object({
      message: z.string(),
    }),
  ),
});

export { paymentOrderSchema };
