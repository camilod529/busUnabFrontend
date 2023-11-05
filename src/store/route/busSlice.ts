import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bus, BusesState } from "../../types/types";

const initialState: BusesState = {};

export const busSlice = createSlice({
  name: "bus",
  initialState,
  reducers: {
    updateBusLocation: (state, action: PayloadAction<Bus>) => {
      const { bus } = action.payload;
      state[bus] = action.payload;
    },
    restoreDefaultBusLocation: (state) => {
      Object.keys(state).forEach((bus) => {
        delete state[bus];
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateBusLocation, restoreDefaultBusLocation } = busSlice.actions;
