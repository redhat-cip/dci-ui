import React, { useEffect, useState } from "react";
import pages from "../pages";
import { useDispatch } from "react-redux";
import { deleteCurrentUser } from "currentUser/currentUserActions";
import { removeToken } from "services/localStorage";
import { ITeam, ICurrentUser } from "types";
import { useSSO } from "./ssoContext";
import * as authActions from "./authActions";
import { AppDispatch } from "store";

export interface AuthContextProps {
  identity: ICurrentUser | null;
  refreshIdentity: () => Promise<ICurrentUser>;
  changeCurrentTeam: (team: ITeam, currentUser: ICurrentUser) => void;
  logout: () => void;
}

const AuthContext = React.createContext({} as AuthContextProps);

type AuthProviderProps = {
  children: React.ReactElement;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [isLoadingIdentity, setIsLoadingIdentity] = useState(true);
  const { sso } = useSSO();
  const dispatch = useDispatch<AppDispatch>();
  const [identity, setIdentity] = useState<ICurrentUser | null>(null);

  useEffect(() => {
    dispatch(authActions.getCurrentUser())
      .then(setIdentity)
      .catch(console.error)
      .then(() => setIsLoadingIdentity(false));
  }, [dispatch]);

  if (isLoadingIdentity) {
    return <pages.NotAuthenticatedLoadingPage />;
  }

  return (
    <AuthContext.Provider
      value={{
        identity,
        changeCurrentTeam: (team: ITeam, currentUser: ICurrentUser) => {
          dispatch(authActions.changeCurrentTeam(team, currentUser));
          setIdentity(currentUser);
        },
        refreshIdentity: () => {
          return dispatch(authActions.getCurrentUser()).then((identity) => {
            setIdentity(identity);
            return identity;
          });
        },
        logout: () => {
          try {
            if (sso) {
              sso.signoutRedirect();
            }
            setIdentity(null);
            removeToken();
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
