import path from "@/app/path/path";
import withResult from "../../internal/withResult";
import { orderListSchema } from "@/app/types/types";

export async function getOrders(
  token: string,
): Promise<orderListSchema | Error> {
  const response = await withResult(
    fetch(`${path}/order`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }),
  );
  return response;
}
