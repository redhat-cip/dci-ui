import { useEffect } from "react";
import { useSSO } from "./ssoContext";

export default function SilentRedirectPage() {
  const { sso } = useSSO();

  useEffect(() => {
    if (sso !== null) {
      sso.signinSilentCallback();
    }
  }, [sso]);

  return <></>;
}
