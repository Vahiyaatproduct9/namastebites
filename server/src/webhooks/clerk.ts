import userService from "@/functions/userService";
import DBTransaction from "@/utils/databaseTransaction";
import { Elysia } from "elysia";
import { Webhook } from "svix";
import { WEBHOOK_SECRET } from "@/env";

export const clerkWebhook = new Elysia({ prefix: "/webhook" }).post(
  "/clerk",
  async (ctx) => {
    const { request } = ctx;
    const headers = request.headers;
    const svix_id = headers.get("svix-id");
    const svix_timestamp = headers.get("svix-timestamp");
    const svix_signature = headers.get("svix-signature");

    const body = await request.text();
    const wh = new Webhook(WEBHOOK_SECRET);

    let event: any;
    try {
      event = wh.verify(body, {
        "svix-id": svix_id!,
        "svix-timestamp": svix_timestamp!,
        "svix-signature": svix_signature!,
      });
    } catch (err) {
      return {
        status: 400,
        message: "Webhook verification failed",
        error: err instanceof Error ? err.message : String(err),
      };
    }

    console.log("webhook hit at", new Date().toLocaleString());
    const result = await DBTransaction(userService(event));
    return result;
  },
);
