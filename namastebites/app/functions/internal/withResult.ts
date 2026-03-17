import useMessage from "@/app/store/useMessage";
import { JsonResponse } from "@/app/types/types";

export default async function withResult(res: Promise<Response>) {
  const setMessage = useMessage.getState().setMessage;
  const setType = useMessage.getState().setType;
  const result = await res;
  if (!result.ok) {
    const error_msg = "Error in Response";
    setMessage(error_msg);
    setType("error");
    return new Error(error_msg);
  }
  if (result.status >= 400) {
    const error_msg = "Server Sent Error";
    setType("error");
    setMessage(error_msg);
    return new Error(error_msg);
  }
  const response: JsonResponse = await result.json();
  if (!response.success) {
    const error_msg = response.message || "Server Error";
    setType("error");
    setMessage(error_msg);
    return new Error(error_msg);
  }
  console.log(response);
  return response.data;
}
