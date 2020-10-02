import React, { useEffect, useState } from "react";
import pages from "../pages";
import { UserManager } from "oidc-client";
import { useSelector } from "react-redux";
import { setJWT } from "services/localStorage";
import { IConfig } from "types";
import { RootState } from "store";

export type SSOContextProps = {
  sso: UserManager | null;
};

const SSOContext = React.createContext({} as SSOContextProps);

export function getSSOUserManager(config: IConfig) {
  const origin = window.location.origin;
  const settings = {
    authority: `${config.sso.url}/auth/realms/${config.sso.realm}`,
    client_id: config.sso.clientId,
    redirect_uri: `${origin}/login_callback`,
    post_logout_redirect_uri: `${origin}/login`,
    silent_redirect_uri: `${origin}/silent_redirect`,
    response_type: "id_token token",
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
  const config = useSelector((state: RootState) => state.config);
  const [sso] = React.useState<UserManager>(getSSOUserManager(config));
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
