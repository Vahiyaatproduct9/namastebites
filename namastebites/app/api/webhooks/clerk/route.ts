/* eslint-disable @typescript-eslint/no-explicit-any */
import {Webhook} from "svix";
import {headers} from "next/headers";
import path from "@/app/path/path";

export async function POST(req: { text: () => any; }) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");
    const body = await req.text();
    const wh = new Webhook(WEBHOOK_SECRET!);

    let event: {
        type: string;
        data: any;
    };
    try {
        event = wh.verify(body, {
            "svix-id": svix_id!,
            "svix-timestamp": svix_timestamp!,
            "svix-signature": svix_signature!,
        }) as {
            type: string;
            data: any;
        };
    } catch (err) {
        console.error("error: ", err);
        return new Response("Unauthorised", {
            status: 401,
        });
    }
    if (event.type === "user.created" && event.data) {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;
        await fetch(`${path}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                clerk_id: id,
                email_address: email_addresses[0].email_address,
                name: `${first_name} ${last_name}`,
                image_url
            })
        })
    }
    if (event.type === "user.updated" && event.data) {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;
        await fetch(`${path}/user`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                clerk_id: id,
                email_address: email_addresses[0].email_address,
                name: `${first_name} ${last_name}`,
                image_url
            })
        })
    }
    if (event.type === "user.deleted" && event.data) {
        const { id } = event.data;
        await fetch(`${path}/user/${id}`, {
            method: "DELETE",
        })
    }
}