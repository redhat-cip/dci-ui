import React, { useEffect, useState } from "react";
import pages from "../pages";
import { UserManager } from "oidc-client";
import { setJWT } from "services/localStorage";

export type SSOContextProps = {
  sso: UserManager | null;
};

const SSOContext = React.createContext({} as SSOContextProps);

const SSOUrl = process.env.REACT_APP_SSO_URL || "https://sso.redhat.com";
const SSORealm = process.env.REACT_APP_SSO_REALM || "redhat-external";
const SSOClientId = process.env.REACT_APP_SSO_CLIENT_ID || "dci";

export function getSSOUserManager() {
  const origin = window.location.origin;
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
    manager.signinSilent().then((user) => {
      if (user) {
        setJWT(user.access_token);
      }
    });
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
    return <pages.NotAuthenticatedLoadingPage />;
  }
  return <SSOContext.Provider value={{ sso }}>{children}</SSOContext.Provider>;
}

const useSSO = () => React.useContext(SSOContext);

export { SSOProvider, useSSO };
