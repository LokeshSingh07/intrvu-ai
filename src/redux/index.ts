import { configureStore } from "@reduxjs/toolkit";
import interviewReducer from "./slice/interviewSlice";



export const store = configureStore({
  reducer: {
    interview: interviewReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
