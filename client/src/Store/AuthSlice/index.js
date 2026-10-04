

import { createSlice } from "@reduxjs/toolkit";

const savedToken = localStorage.getItem("token");
const savedUser = localStorage.getItem("user");

const initialState = {
  token: savedToken || null,
  user: savedUser ? JSON.parse(savedUser) : null,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,

  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem(
        "user",
        JSON.stringify(action.payload.user)
      );
    },

    logout: (state) => {
      state.token = null;
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    updateUser: (state, action) => {
      state.user = action.payload;

      localStorage.setItem(
        "user",
        JSON.stringify(action.payload)
      );
    },
  },
});

export default authSlice.reducer;

export const { login, logout, updateUser } = authSlice.actions;