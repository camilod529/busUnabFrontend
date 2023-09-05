import { configureStore } from "@reduxjs/toolkit";
import { routeSlice } from "./route/routeSlice";

export const store = configureStore({
  reducer: {
    route: routeSlice.reducer,
  },
});
