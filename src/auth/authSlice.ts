import { createSlice } from "@reduxjs/toolkit";
import { type RootState } from "store";
import type { ICurrentUser } from "types";
import { authApi } from "./authApi";

type AuthState = {
  currentUser: ICurrentUser | null;
};

const initialState: AuthState = {
  currentUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedOut: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.getCurrentUser.matchFulfilled,
      (state, { payload }) => {
        state.currentUser = payload;
      },
    );
  },
});

export const { loggedOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
