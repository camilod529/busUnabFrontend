import { createSlice } from "@reduxjs/toolkit";

export const busSlice = createSlice({
  name: "bus",
  initialState: {
    buses: {},
  },
  reducers: {
    updateBusLocation: (state, action) => {
      state.buses[action.payload.bus] = action.payload;
    },
    restoreDefaultBusLocation: (state, action) => {
      state.buses = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateBusLocation, restoreDefaultBusLocation } = busSlice.actions;
