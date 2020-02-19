import React, { useEffect } from "react";
import { values } from "lodash";
import pages from "../pages";
import { UserManager } from "oidc-client";
import { useConfig, configProps } from "./configContext";
import http from "../services/http";
import { useDispatch } from "react-redux";
import { setIdentity, deleteCurrentUser } from "currentUser/currentUserActions";
import { removeToken, setJWT } from "services/localStorage";

type Team = {
  id: string;
  name: string;
};

type IdentityProps = {
  email: string;
  etag: string;
  fullname: string;
  id: string;
  name: string;
  teams: {
    [id: string]: Team;
  };
  timezone: string;
} | null;

type AuthContextProps = {
  isLoadingIdentity: boolean;
  identity: IdentityProps;
  refreshIdentity: () => Promise<IdentityProps>;
  sso: UserManager | null;
  logout: () => void;
};

const AuthContext = React.createContext({} as AuthContextProps);

function buildShortcut(team: Team) {
  const adminTeamName = "admin";
  const EPMTeamName = "EPM";
  const RedHatTeamName = "Red Hat";
  return {
    isSuperAdmin: team.name === adminTeamName,
    hasEPMRole: team.name === adminTeamName || team.name === EPMTeamName,
    hasReadOnlyRole:
      team.name === adminTeamName ||
      team.name === EPMTeamName ||
      team.name === RedHatTeamName,
    isReadOnly: team.name === RedHatTeamName
  };
}

const getCurrentUser: (
  config: configProps
) => Promise<IdentityProps> = config => {
  return http.get(`${config.apiURL}/api/v1/identity`).then(response => {
    const identity = response.data.identity;
    const firstTeam = values(identity.teams)[0];
    return {
      ...identity,
      ...buildShortcut(firstTeam),
      team: firstTeam
    };
  });
};

export function getSSOUserManager(config: configProps) {
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
      if (user) {
        setJWT(user.access_token);
      }
    });
  });
  return manager;
}

type AuthProviderProps = {
  children: React.ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const { config } = useConfig();
  const dispatch = useDispatch();
  const [state, setState] = React.useState<{
    isLoadingIdentity: boolean;
    identity: IdentityProps;
    sso: UserManager | null;
  }>({
    isLoadingIdentity: true,
    identity: null,
    sso: null
  });

  useEffect(() => {
    const sso = getSSOUserManager(config);
    (async () => {
      try {
        const identity = await getCurrentUser(config);
        dispatch(setIdentity(identity));
        setState({ sso, isLoadingIdentity: false, identity });
      } catch (e) {
        setState({ sso, isLoadingIdentity: false, identity: null });
      }
    })();
  }, [dispatch, config]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        refreshIdentity: () => {
          return getCurrentUser(config).then(identity => {
            setState({ ...state, identity });
            dispatch(setIdentity(identity));
            return identity;
          });
        },
        logout: () => {
          setState({ ...state, identity: null });
          dispatch(deleteCurrentUser());
          removeToken();
        }
      }}
    >
      {state.isLoadingIdentity ? (
        <pages.NotAuthenticatedLoadingPage />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
