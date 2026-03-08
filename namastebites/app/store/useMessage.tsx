import { create } from "zustand";
type type = "error" | "success" | "info" | "warning";
type messageHandler = {
  message: string;
  setMessage: (message: string) => void;
  type: type;
  setType: (type: type) => void;
};
export default create<messageHandler>((set) => ({
  message: "",
  type: "info",
  setMessage: (message: string) => set(() => ({ message })),
  setType: (type) => set(() => ({ type })),
}));
