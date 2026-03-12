import z, { object } from "zod";

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
