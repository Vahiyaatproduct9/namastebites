import * as z from "zod";
const paymentOrderSchema = z.object({
  amount: z.number(),
  notes: z.optional(
    z.object({
      message: z.string(),
    }),
  ),
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
export { paymentOrderSchema, exploreRequestBody };
