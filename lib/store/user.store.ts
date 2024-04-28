import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserInfoInterface } from "@/lib/types/rest-api/user/user.type";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

export type UserLoginInfo = {
  username: string;
  password: string;
}
type State = {
  userInfo: UserInfoInterface | undefined;
  getUserInfo: () => void;
  setUserLoginInfo: (info: UserLoginInfo) => void;
  getUserLoginInfo: () => void;
  deleteUserLoginInfo: () => void;
}

export const useUserStore = create(
  persist<State>(
    (set, get) => ({
      userInfo: getCookie("__user__login__info") ? JSON.parse(getCookie("__user__login__info") as string) : undefined,
      getUserInfo: () => {
        setInterval(() => {
          const user = getCookie("__user__login__info");
          if (!user) {
            deleteCookie("61d4053611a9da4f76685ca0f7b56fed5301");
          }
          set(state => ({
            userInfo: user ? JSON.parse(user as string) : undefined
          }));
        }, 1000);
      },
      setUserLoginInfo: (info) => {
        setCookie("61d4053611a9da4f76685ca0f7b56fed5301", info);
      },
      getUserLoginInfo: (): UserLoginInfo | null => {
        const u = getCookie("61d4053611a9da4f76685ca0f7b56fed5301");
        if (u) {
          return JSON.parse(u) as UserLoginInfo;
        } else {
          return null;
        }
      },
      deleteUserLoginInfo: () => {
        deleteCookie("61d4053611a9da4f76685ca0f7b56fed5301");
      }
    }),
    {
      name: "userState"
    }
  )
);
