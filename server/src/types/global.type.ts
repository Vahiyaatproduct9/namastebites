import z, { array, object, optional, string } from "zod";

export type ResponseType = {
  status: number;
  message: string;
  data?: any;
};

export const createOrUpdateUserSchema = z.object({
  data: z.object({
    created_at: z.number(),
    email_addresses: z.array(
      z.optional(
        z.object({
          email_address: z.string(),
        }),
      ),
    ),
    first_name: z.string(),
    last_name: z.union([z.string(), z.null()]),
    id: z.string(),
    profile_image_url: z.string(),
    username: z.union([z.string(), z.null()]),
  }),
  type: z.enum(["user.created", "user.updated"]),
  instance_id: z.optional(z.string()),
  timestamp: z.number(),
  object: z.enum(["event"]),
});

export const updateUserSchema = z.object({
  data: z.optional(
    z.object({
      name: z.optional(z.string()),
      phone: z.optional(z.string()),
      email: z.optional(z.email()),
    }),
  ),
});

export const deleteUserSchema = z.object({
  data: z.object({
    deleted: z.boolean(),
    id: z.string(),
    object: z.enum(["user"]),
  }),
  object: z.enum(["event"]),
  timestamp: z.number(),
  type: z.enum(["user.deleted"]),
});

export const orderListSchema = array(
  object({
    id: string(),
    items: array(
      object({
        diet: string(),
        name: string(),
        price: string(),
        active: string(),
        item_id: string(),
        category: string(),
        quantity: string(),
        image_url: string(),
        description: string(),
        order_frequency: optional(string()),
      }),
    ),
  }),
);
