import { configureStore } from "@reduxjs/toolkit";
import { routeSlice } from "./route/routeSlice";
import { busSlice } from "./route/busSlice";

export const store = configureStore({
  reducer: {
    route: routeSlice.reducer,
    buses: busSlice.reducer,
  },
});
