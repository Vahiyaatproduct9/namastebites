import { AfterHandler, Context } from "elysia";

export default function (context: Context, response: any) {
  context.set.status = response.status;
  if (Number(context?.set?.status) >= 400) {
    return {
      ...response,
      success: response?.success ?? false,
    };
  }
}
