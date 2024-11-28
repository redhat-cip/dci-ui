import { UserManager } from "oidc-client-ts";

export const SSOUrl = process.env.REACT_APP_SSO_URL || "https://sso.redhat.com";
const SSORealm = process.env.REACT_APP_SSO_REALM || "redhat-external";
const SSOClientId = process.env.REACT_APP_SSO_CLIENT_ID || "dci";
const SSOScope = (process.env.REACT_APP_SSO_SCOPE || "api.dci")
  .split(",")
  .join(" ");

const origin = window.location.origin;
const settings = {
  authority: `${SSOUrl}/auth/realms/${SSORealm}`,
  client_id: SSOClientId,
  redirect_uri: `${origin}/login_callback`,
  post_logout_redirect_uri: `${origin}/login`,
  silent_redirect_uri: `${origin}/silent_redirect`,
  response_type: "code",
  automaticSilentRenew: true,
  scope: SSOScope,
};

export const manager = new UserManager(settings);
