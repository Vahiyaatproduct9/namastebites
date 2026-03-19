import withResult from "../../internal/withResult";
import path from "@/app/path/path";

import useMessage from "@/app/store/useMessage";
const setMessage = useMessage.getState().setMessage;
const setType = useMessage.getState().setType;
export async function updateUser(
  data: {
    phone?: string;
    email?: string;
    name?: string;
  },
  token: string | null | undefined,
) {
  if (!token) {
    setType("error");
    setMessage("Please login to update your profile");
  }
  const res = await withResult(
    fetch(`${path}/user/`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    }),
  );
  return res;
}
