import { useEffect, useState } from "react";
import * as React from "react";
import { UserManager } from "oidc-client-ts";
import { setJWT } from "services/localStorage";
import NotAuthenticatedLoadingPage from "pages/NotAuthenticatedLoadingPage";

export type SSOContextProps = {
  sso: UserManager | null;
};

const SSOContext = React.createContext({} as SSOContextProps);

const SSOUrl = process.env.REACT_APP_SSO_URL || "https://sso.redhat.com";
const SSORealm = process.env.REACT_APP_SSO_REALM || "redhat-external";
const SSOClientId = process.env.REACT_APP_SSO_CLIENT_ID || "dci";

function signinSilent(manager: UserManager) {
  manager.signinSilent().then((user) => {
    if (user) {
      setJWT(user.access_token);
    }
  });
}

export function getSSOUserManager() {
  const origin = window.location.href
    .split("/")
    .slice(0, -1)
    .join("/")
    .concat("/");
  const settings = {
    authority: `${SSOUrl}/auth/realms/${SSORealm}`,
    client_id: SSOClientId,
    redirect_uri: `${origin}/login_callback`,
    post_logout_redirect_uri: `${origin}/login`,
    silent_redirect_uri: `${origin}/silent_redirect`,
    response_type: "code",
    automaticSilentRenew: true,
  };
  const manager = new UserManager(settings);
  manager.events.addAccessTokenExpiring(() => {
    signinSilent(manager);
  });
  manager.events.addAccessTokenExpired(() => {
    signinSilent(manager);
  });
  return manager;
}

type SSOProviderProps = {
  children: React.ReactNode;
};

function SSOProvider({ children }: SSOProviderProps) {
  const [isLoadingIdentity, setIsLoadingIdentity] = useState(true);
  const [sso] = React.useState<UserManager>(getSSOUserManager());
  useEffect(() => {
    sso
      .getUser()
      .then((user) => {
        if (user) {
          setJWT(user.access_token);
        }
      })
      .catch(console.error)
      .then(() => setIsLoadingIdentity(false));
  }, [sso]);
  if (isLoadingIdentity) {
    return <NotAuthenticatedLoadingPage />;
  }
  return <SSOContext.Provider value={{ sso }}>{children}</SSOContext.Provider>;
}

const useSSO = () => React.useContext(SSOContext);

export { SSOProvider, useSSO };
