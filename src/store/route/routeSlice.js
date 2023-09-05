import { createSlice } from "@reduxjs/toolkit";

export const routeSlice = createSlice({
  name: "route",
  initialState: {
    route: 1,
  },
  reducers: {
    changeRoute: (state, action) => {
      state.route = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeRoute } = routeSlice.actions;
