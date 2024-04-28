import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  inquiryList: {
    [key in string]: {
      count: number;
    }
  },
  replaceInquiry:(list:State["inquiryList"])=>void,
  addInquiry: (id: string, count: number) => void,
  removeInquiry: (id: string) => void,
  setCount: (id: string, count: number) => void,
  isExistence: (id: string) => boolean,
  removeAll: () => void
}

export const useInquiryStore = create(
  persist<State>(
    (set, get) => ({
      inquiryList: {},
      replaceInquiry: function(list) {
        return set({
          inquiryList: list
        });
      },
      addInquiry: function(id, count) {
        return set({
          inquiryList: {
            ...get().inquiryList,
            [id]: {
              count
            }
          }
        });
      },
      isExistence: (id) => {
        return get()?.inquiryList.hasOwnProperty(id);
      },
      removeInquiry: function(id) {
        if (!get().isExistence(id)) return;
        const old = JSON.parse(JSON.stringify(get().inquiryList));
        delete old[id];
        return set({
          inquiryList: old
        });
      },
      setCount: function(id, count) {
        if (!get().isExistence(id)) return;
        return set({
          inquiryList: {
            ...get().inquiryList,
            [id]: {
              count
            }
          }
        });
      },
      removeAll: () => {
        return set({
          inquiryList: {}
        });
      }
    }),
    {
      name: "inquiryState"
    }
  )
);
