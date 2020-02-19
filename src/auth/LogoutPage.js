import React, { useEffect } from "react";
import pages from "pages";
import { useAuth } from "./authContext";

const LogoutPage = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return <pages.NotAuthenticatedLoadingPage />;
};

export default LogoutPage;
