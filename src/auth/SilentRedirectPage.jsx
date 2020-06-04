import React, { useEffect } from "react";
import { useAuth } from "./authContext";

const SilentRedirectPage = () => {
  const { sso } = useAuth();

  useEffect(() => {
    sso.signinSilentCallback();
  }, [sso]);

  return <></>;
};

export default SilentRedirectPage;
