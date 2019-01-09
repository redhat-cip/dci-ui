import Keycloak from "keycloak-js";
import { setJWT } from "./localStorage";

export function configureSSO(config) {
  const ssoConfig = config.sso;
  const sso = Keycloak({
    url: `${ssoConfig.url}/auth`,
    realm: `${ssoConfig.realm}`,
    clientId: `${ssoConfig.clientId}`
  });

  const ssoPromise = sso.init({ onLoad: "check-sso" }).then(authenticated => {
    if (authenticated) {
      setJWT(sso.token);
    }
    window._sso = sso;
  });

  const timeoutPromise = new Promise(resolve => {
    setTimeout(() => {
      console.error(`Error in configureSSO, cannot reach ${ssoConfig.url}`);
      resolve();
    }, 5000);
  });

  return Promise.race([ssoPromise, timeoutPromise]);
}
