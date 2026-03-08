import z from "zod";

export type ResponseType = {
  status: number;
  message: string;
  data?: any;
};

export const createUserSchema = z.object({
  clerk_id: z.string(),
  email_address: z.email(),
  name: z.string(),
  image_url: z.string(),
});
