import * as React from "react";
import { useAuth } from "./authContext";
import { useLocation, Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactElement;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { identity } = useAuth();
  const location = useLocation();

  return identity === null ? (
    <Navigate to="/login" state={{ from: location }} />
  ) : (
    children
  );
}
