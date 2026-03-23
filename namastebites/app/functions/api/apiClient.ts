/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "@/app/path/path";
import useMessage from "@/app/store/useMessage";

export interface APIOptions {
  headers?: Record<string, string>;
  body?: unknown;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

export async function APICall(endpoint: string, options: APIOptions = {}) {
  const result = await APICallFull(endpoint, options);
  if (result.success) {
    return result.data;
  }
  return null;
}

export async function APICallFull(endpoint: string, options: APIOptions = {}) {
  const setMessage = useMessage.getState().setMessage;
  const setType = useMessage.getState().setType;

  const url = `${path}${endpoint}`;
  const { headers, body, method = "GET" } = options;

  const fetchOptions: any = {
    method,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
      ...headers,
    },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
    if (method === "GET") {
      fetchOptions.method = "POST";
    }
  }

  try {
    const response = await fetch(url, fetchOptions);
    const result = await response.json();

    if (result.success) {
      if (result.message) {
        setType("success");
        setMessage(result.message);
      }
      console.log("result: ", result);
    } else {
      const errorMsg = result.message || "Something went wrong!";
      setType("error");
      setMessage(errorMsg);
    }
    return result;
  } catch (error) {
    console.error(`API Call failed for ${url}:`, error);
    setType("error");
    setMessage("Failed to connect to server");
    return { success: false, message: "Failed to connect to server" };
  }
}
