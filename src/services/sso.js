import Keycloak from "keycloak-js";
import { setJWT } from "./localStorage";

export function configureSSO(config) {
  const ssoConfig = config.sso;
  const sso = Keycloak({
    url: `${ssoConfig.url}/auth`,
    realm: `${ssoConfig.realm}`,
    clientId: `${ssoConfig.clientId}`
  });

  window._sso = sso;

  const ssoPromise = sso.init({ onLoad: "check-sso" }).success(authenticated => {
    if (authenticated) {
      setJWT(sso.token);
    }
    return "sso";
  });

  const timeoutPromise = new Promise(resolve => {
    setTimeout(() => {
      resolve("timeout");
    }, 5000);
  });

  return Promise.race([ssoPromise, timeoutPromise]).then(value => {
    if (value === "timeout") {
      console.error(`Error in configureSSO, cannot reach ${ssoConfig.url}`);
    }
  });
}
