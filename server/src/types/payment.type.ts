import * as z from "zod";

const paymentOrderSchema = z.object({
  amount: z.number(),
  notes: z.optional(
    z.object({
      message: z.string(),
    }),
  ),
});

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
    }),
  ),
  user_id: z.string(),
  special_instructions: z.optional(z.string()),
});

const verifyOrderSchema = z.object({
  user_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_signature: z.string(),
});

const exploreType = [
  "single-select",
  "multi-select",
  "global-search",
  "range",
  "date",
] as const;

const exploreRequestBody = z.union([
  z.object({
    single: z.string().optional(),
    filter: z
      .array(
        z.object({
          id: z.string(),
          value: z.union([z.string(), z.array(z.string())]),
          type: z.enum(exploreType),
        }),
      )
      .optional(),
    sorting: z.union([
      z.object({
        id: z.string(),
        desc: z.boolean(),
      }),
      z.undefined(),
      z.null(),
    ]),
    globalSearch: z.string().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
  }),
  z.undefined(),
]);
export {
  paymentOrderSchema,
  exploreRequestBody,
  createOrderSchema,
  verifyOrderSchema,
  createUserSchema,
};
