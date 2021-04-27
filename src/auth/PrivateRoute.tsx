import * as React from "react";
import { useAuth } from "./authContext";
import { Redirect, Route, RouteProps } from "react-router-dom";

interface PrivateRouteProps extends RouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children, ...rest }: PrivateRouteProps) {
  const { identity } = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        identity === null ? (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        ) : (
          children
        )
      }
    />
  );
}
