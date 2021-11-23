import { useEffect, useState } from "react";
import * as React from "react";
import pages from "../pages";
import { useDispatch } from "react-redux";
import { deleteCurrentUser } from "currentUser/currentUserActions";
import { getToken, removeToken } from "services/localStorage";
import { ITeam, ICurrentUser } from "types";
import { useKeycloak } from "./ssoContext";
import * as authActions from "./authActions";
import { AppDispatch } from "store";

export interface AuthContextProps {
  identity: ICurrentUser | null;
  refreshIdentity: () => Promise<ICurrentUser>;
  changeCurrentTeam: (
    team: ITeam,
    currentUser: ICurrentUser
  ) => Promise<ICurrentUser>;
  logout: () => void;
}

const AuthContext = React.createContext({} as AuthContextProps);

type AuthProviderProps = {
  children: React.ReactElement;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { keycloak } = useKeycloak();
  const dispatch = useDispatch<AppDispatch>();
  const [identity, setIdentity] = useState<ICurrentUser | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      dispatch(authActions.getCurrentUser())
        .then(setIdentity)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [dispatch]);

  if (isLoading) {
    return <pages.NotAuthenticatedLoadingPage />;
  }

  return (
    <AuthContext.Provider
      value={{
        identity,
        changeCurrentTeam: (team: ITeam, currentUser: ICurrentUser) => {
          return dispatch(
            authActions.changeCurrentTeam(team, currentUser)
          ).then((identity) => {
            setIdentity(identity);
            return identity;
          });
        },
        refreshIdentity: () => {
          return dispatch(authActions.getCurrentUser()).then((identity) => {
            setIdentity(identity);
            return identity;
          });
        },
        logout: () => {
          try {
            keycloak?.logout();
            setIdentity(null);
            removeToken();
            //todo: dispatch logout event not specific action
            dispatch(deleteCurrentUser());
          } catch (error) {
            console.error(error);
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
