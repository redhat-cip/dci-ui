import { UserManager } from "oidc-client-ts";

export const SSOUrl = import.meta.env.VITE_SSO_URL || "https://sso.redhat.com";
const SSORealm = import.meta.env.VITE_SSO_REALM || "redhat-external";
const SSOClientId = import.meta.env.VITE_SSO_CLIENT_ID || "dci";
const SSOScope = (import.meta.env.VITE_SSO_SCOPE || "api.dci")
  .split(",")
  .join(" ");

const SSOAuthorityURL = `${SSOUrl}/auth/realms/${SSORealm}`;
export const ProfilePageUrl = `${SSOAuthorityURL}/account/`;

const origin = window.location.origin;
const settings = {
  authority: SSOAuthorityURL,
  client_id: SSOClientId,
  redirect_uri: `${origin}/login_callback`,
  post_logout_redirect_uri: `${origin}/login`,
  silent_redirect_uri: `${origin}/silent_redirect`,
  response_type: "code",
  automaticSilentRenew: true,
  scope: SSOScope,
};

export const manager = new UserManager(settings);
