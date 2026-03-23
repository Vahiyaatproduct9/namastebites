import { APICall } from "../apiClient";
import { orderListSchema } from "@/app/types/types";

export async function getOrders(
  token: string,
): Promise<orderListSchema | null> {
  return await APICall("/order", {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}
