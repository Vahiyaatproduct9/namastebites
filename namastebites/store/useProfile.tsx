import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
type Profile = {
  name: string | null;
  email: string | null;
  phone: string | null;
  setName: (arg: string) => Promise<void>;
  setEmail: (arg: string) => Promise<void>;
  setPhone: (arg: string) => Promise<void>;

}
export default create<Profile>()(
  persist(
    (set) => ({
      name: null,
      email: null,
      phone: null,
      setName: async (name) => {
        set({ name });
      },
      setEmail: async (email: string) => {
        set({ email });
      },
      setPhone: async (phone: string) => {
        set({ phone });
      }
    }),
    {
      name: 'profile',
      storage: createJSONStorage(() => localStorage)
    }
  ))
