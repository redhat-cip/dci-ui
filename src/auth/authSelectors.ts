import { useMemo } from "react";
import { selectCurrentUser } from "./authSlice";
import { useAppSelector } from "store";

export const useAuth = () => {
  const currentUser = useAppSelector(selectCurrentUser);

  return useMemo(() => ({ currentUser }), [currentUser]);
};
