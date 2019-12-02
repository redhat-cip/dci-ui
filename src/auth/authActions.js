import { UserManager } from "oidc-client";
import { setJWT } from "services/localStorage";
import * as types from "./authActionsTypes";

function setAccessToken(user) {
  if (user) {
    setJWT(user.access_token);
  }
}

export function configureSSO(config) {
  return dispatch => {
    const origin = window.location.origin;
    const redirect_uri = `${origin}/login_callback`;
    const post_logout_redirect_uri = `${origin}/login`;
    const settings = {
      authority: `${config.sso.url}/auth/realms/${config.sso.realm}`,
      client_id: config.sso.clientId,
      redirect_uri,
      post_logout_redirect_uri,
      response_type: "id_token token"
    };
    const manager = new UserManager(settings);
    manager.events.addAccessTokenExpiring(() => {
      manager.signinSilent().then(user => {
        setAccessToken(user);
      });
    });
    dispatch({
      type: types.AUTH_SETTED,
      auth: manager
    });
    return manager.getUser().then(user => {
      setAccessToken(user);
      return user;
    });
  };
}
