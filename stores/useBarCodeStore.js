import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useBarCodeStore = create(
  persist(
    (set, get) => ({
      barCode: [],
      setBarCode: (barCode) => set({ barCode: [...get().barCode, barCode] }),
      editBarCode: (barCode) =>
        set({
          barCode: get().barCode.map((item) =>
            item.id === barCode.id ? barCode : item
          ),
        }),
      removeBarCode: (id) =>
        set({ barCode: get().barCode.filter((item) => item.id !== id) }),
    }),
    {
      name: "barCode-storage", // unique name
      storage: createJSONStorage(() => AsyncStorage), // use the AsyncStorage with a clean abstraction layer
    }
  )
);
