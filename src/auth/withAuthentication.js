import React from "react";
import { useAuth } from "./authContext";
import { Redirect, useLocation } from "react-router-dom";

const withAuthentication = Component => props => {
  const { identity } = useAuth();
  const location = useLocation();
  return identity ? (
    <Component {...props} />
  ) : (
    <Redirect to={{ pathname: "/login", state: { from: location } }} />
  );
};

export default withAuthentication;
