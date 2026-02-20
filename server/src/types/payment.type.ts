import * as z from "zod";
const paymentOrderSchema = z.object({
  amount: z.number(),
  notes: z.optional(
    z.object({
      message: z.string(),
    }),
  ),
});
const exploreRequestBody = z.object({
  single: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});
export { paymentOrderSchema, exploreRequestBody };
