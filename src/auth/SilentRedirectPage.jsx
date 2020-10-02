import React, { useEffect } from "react";
import { useSSO } from "./ssoContext";

const SilentRedirectPage = () => {
  const { sso } = useSSO();

  useEffect(() => {
    sso.signinSilentCallback();
  }, [sso]);

  return <></>;
};

export default SilentRedirectPage;
