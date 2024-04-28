import { create } from "zustand";

type State = {
  selectAttribute: {
    label: string;
    name: string;
    value: string;
    id: number;
  }[],
  setSelectAttribute: (name: string, value: string, id: number, label: string) => void;
  removeSelectAttribute: () => void;
}

function upsertItem(arr: any, newItem: any) {
  const existingItemIndex = arr.findIndex((item: any) => item.id === newItem.id && item.name === newItem.name);
  if (existingItemIndex > -1) {
    arr[existingItemIndex].value = newItem.value;
  } else {
    arr.push(newItem);
  }
  return arr;
}

export const useProductAttributeStore = create<State>(
  (set, get) => ({
    selectAttribute: [],
    setSelectAttribute: (name: string, value: string, id: number, label: string) => {
      set({
        selectAttribute: upsertItem(JSON.parse(JSON.stringify(get().selectAttribute)), {
          label,
          name,
          value,
          id
        })
      });
    },
    removeSelectAttribute: () => {
      set({
        selectAttribute: []
      });
    }
  })
);
