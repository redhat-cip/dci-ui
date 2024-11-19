import { useEffect } from "react";
import { manager } from "./sso";

export default function SilentRedirectPage() {
  useEffect(() => {
    manager.signinSilentCallback();
  }, []);

  return <></>;
}
