import * as React from "react";
import { useAuth } from "./authContext";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactElement;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { identity } = useAuth();

  return identity === null ? (
    <Navigate to="/login" state={{ origin: window.location.href }} />
  ) : (
    children
  );
}
