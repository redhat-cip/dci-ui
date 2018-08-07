import Keycloak from "keycloak-js";
import { setJWT } from "./localStorage";

export function configureSSO(config) {
  const ssoConfig = config.sso;
  const sso = new Keycloak({
    url: `${ssoConfig.url}/auth`,
    realm: `${ssoConfig.realm}`,
    clientId: `${ssoConfig.clientId}`
  });

  return new Promise(resolve => {
    sso.init({ onLoad: "check-sso" }).success(authenticated => {
      if (authenticated) {
        setJWT(sso.token);
      }
      window._sso = sso;
      resolve(config);
    });
  });
}
