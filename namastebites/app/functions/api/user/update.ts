import { APICall } from "../apiClient";
import useMessage from "@/app/store/useMessage";

export async function updateUser(
  data: {
    phone?: string;
    email?: string;
    name?: string;
  },
  token: string | null | undefined,
) {
  const setMessage = useMessage.getState().setMessage;
  const setType = useMessage.getState().setType;

  if (!token) {
    setType("error");
    setMessage("Please login to update your profile");
    return null;
  }

  return await APICall("/user/", {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: { data },
  });
}
