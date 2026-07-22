import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { saveUser } from "../../services/localStorageService";

interface UserType {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  user: UserType | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

// UserSlice.ts
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
      saveUser(action.payload)
      state.isAuthenticated = true;
    },
    // UserSlice.tsx
    logoutUser: (state) => {
    
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setAuth: (state, action: PayloadAction<boolean>) => {
     
      state.isAuthenticated = action.payload;
      if (!action.payload) state.user = null;
    },
  },
});
export const { setUser, logoutUser, setAuth } = userSlice.actions;

// selectors
export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;

export default userSlice.reducer;
