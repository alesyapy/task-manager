import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: localStorage.getItem("userId"),
  username: localStorage.getItem("username"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.userId = action.payload.userId;
      state.username = action.payload.username;

      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem("username", action.payload.username);
    },

    logout(state) {
      state.userId = null;
      state.username = null;

      localStorage.removeItem("userId");
      localStorage.removeItem("username");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;