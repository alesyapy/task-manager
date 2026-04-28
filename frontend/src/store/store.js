import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import boardsReducer from "./boardsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardsReducer,
  },
});