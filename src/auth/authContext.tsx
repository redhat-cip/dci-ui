import React, { useEffect } from "react";
import { values } from "lodash";
import pages from "../pages";
import { UserManager } from "oidc-client";
import { useConfig, configProps } from "./configContext";
import http from "../services/http";
import { useDispatch } from "react-redux";
import { setIdentity, deleteCurrentUser } from "currentUser/currentUserActions";
import { removeToken, setJWT } from "services/localStorage";
import { Team, Identity } from "types";

export type AuthContextProps = {
  isLoadingIdentity: boolean;
  identity: Identity;
  refreshIdentity: () => Promise<Identity>;
  changeCurrentTeam: (team: Team) => void;
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
    isReadOnly: team.name === RedHatTeamName,
  };
}

function buildIdentity(identity: Identity, team: Team): Identity {
  return {
    ...identity,
    ...buildShortcut(team),
    team: team,
  } as Identity;
}

function getCurrentUser(config: configProps): Promise<Identity> {
  return http.get(`${config.apiURL}/api/v1/identity`).then((response) => {
    const identity = response.data.identity;
    const firstTeam = values(identity.teams)[0];
    return buildIdentity(identity, firstTeam);
  });
}

export function getSSOUserManager(config: configProps) {
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

type AuthProviderProps = {
  children: React.ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const { config } = useConfig();
  const dispatch = useDispatch();
  const [state, setState] = React.useState<{
    isLoadingIdentity: boolean;
    identity: Identity;
    sso: UserManager | null;
  }>({
    isLoadingIdentity: true,
    identity: null,
    sso: null,
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
        changeCurrentTeam: (team: Team) => {
          const identity = buildIdentity(state.identity, team);
          setState({
            ...state,
            identity,
          });
          dispatch(setIdentity(identity));
        },
        refreshIdentity: () => {
          return getCurrentUser(config).then((identity) => {
            setState({ ...state, identity });
            dispatch(setIdentity(identity));
            return identity;
          });
        },
        logout: () => {
          try {
            setState({ ...state, identity: null });
            removeToken();
            dispatch(deleteCurrentUser());
          } catch (error) {
            console.error(error);
          }
        },
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
