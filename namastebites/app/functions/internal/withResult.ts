import { JsonResponse } from "@/app/types/types";

export default async function withResult(res: Promise<Response>) {
  const result = await res;
  if (!result.ok) {
    const error_msg = "Error in Response";
    console.log(error_msg);
    return new Error(error_msg);
  }
  if (result.status >= 400) {
    const error_msg = "Server Sent Error";
    console.log(error_msg);
    return new Error(error_msg);
  }
  const response: JsonResponse = await result.json();
  console.log(response);
  return response.data;
}
