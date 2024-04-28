import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

export type BaseAxiosAiResponse<D extends any> = {
  code: number
  result: D
  msg: string
  status: boolean
}

const aiBaseUrl = process.env.NEXT_PUBLIC_AI_URL;

type State = {
  email: string;
  setEmail: (email: string) => void;
  token: string;
  setToken: (token: string) => void;
  getChatToken: () => Promise<BaseAxiosAiResponse<{ token: string }> | null>;
  sendMessage: (message: string, setLoading?: (loading: boolean) => void) => Promise<string | null>;
}

// 创建一个自定义的存储
export const sessionStoragePersistStorage: PersistStorage<any> = {
  getItem: async (name) => {
    const value = sessionStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name, value) => {
    sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    sessionStorage.removeItem(name);
  }
};

export const useKfStore = create(
  persist<State>(
    (set, get) => ({
      email: "",
      setEmail: (email: string) => set({ email }),
      token: "",
      setToken: (token: string) => set({ token }),
      getChatToken: async () => {
        try {
          const result = await fetch(`${aiBaseUrl}/api/v1/js_injection/chat_login`, {
            method: "POST"
          });
          const data = await result.json() as BaseAxiosAiResponse<{ token: string }>;
          if (data.code === 200) {
            get().setToken(data.result.token);
            return data;
          }
          return null;
        } catch (e) {
          return null;
        }
      },
      sendMessage: async (msg, setLoading) => {
        try {
          setLoading && setLoading(true);
          if (get().email || get().token) {
            const res = await fetch(`${aiBaseUrl}/api/v1/js_injection/chat_text_to_text`, {
              method: "POST",
              body: JSON.stringify({
                message: msg,
                from_account: get().email,
                to_account: "admin",
                view_id: "admin"
              }),
              headers: {
                Authorization: "Bearer " + get().token,
                "Content-Type": "application/json"
              }
            });
            if (res.status === 200) {
              const data = await res.json() as BaseAxiosAiResponse<{
                data: {
                  message: { text: string; image: string }[]
                }
              }>;
              if (data.code === 200) {
                return data.result.data.message[0].text;
              }
            }
            return null;
          }
          return null;
        } catch (e) {
          return null;
        } finally {
          setLoading && setLoading(false);
        }
      }
    }),
    {
      name: "kf-store",
      storage: sessionStoragePersistStorage
    }
  )
);
