import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setUser, logoutUser } from "../Store/Slices/UserSlice";
import { apiFetch } from "../utils/api";
import type { UserType } from "../Types/User.type";

export const useAuth = () => {
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(logoutUser());
      setIsAuthChecked(true);
      return;
    }

    try {
      const res = await apiFetch("/api/v1/auth/me", {
        method: "GET",
      });

  
      const data: { user: UserType } = await res.data;
      dispatch(setUser(data.user));
    } catch {
      // dispatch(logoutUser());
      console.log('calling logoutUser from auth.hook.ts line 34');
    } finally {
      setIsAuthChecked(true);
    }
  }, [dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { refresh, isAuthChecked };
};