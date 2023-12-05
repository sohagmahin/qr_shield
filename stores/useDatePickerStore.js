import { create } from "zustand";

const useDatePickerStore = create((set) => ({
  show: false,
  toggle: () => set((state) => ({ show: !state.show })),
}));

export default useDatePickerStore;
