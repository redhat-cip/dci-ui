import { useEffect, useState } from "react";
import * as React from "react";
import { useDispatch } from "react-redux";
import { deleteCurrentUser } from "currentUser/currentUserActions";
import { removeToken, getToken } from "services/localStorage";
import { ITeam, ICurrentUser } from "types";
import { useSSO } from "./ssoContext";
import * as authActions from "./authActions";
import { AppDispatch } from "store";
import NotAuthenticatedLoadingPage from "pages/NotAuthenticatedLoadingPage";

interface AuthContextType {
  identity: ICurrentUser | null;
  refreshIdentity: () => Promise<ICurrentUser>;
  changeCurrentTeam: (
    team: ITeam,
    currentUser: ICurrentUser
  ) => Promise<ICurrentUser>;
  logout: () => void;
}
export const AuthContext = React.createContext<AuthContextType>(null!);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { sso } = useSSO();
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
    return <NotAuthenticatedLoadingPage />;
  }

  const value = {
    identity,
    changeCurrentTeam: (team: ITeam, currentUser: ICurrentUser) => {
      return dispatch(authActions.changeCurrentTeam(team, currentUser)).then(
        (identity) => {
          setIdentity(identity);
          return identity;
        }
      );
    },
    refreshIdentity: () => {
      return dispatch(authActions.getCurrentUser()).then((identity) => {
        setIdentity(identity);
        return identity;
      });
    },
    logout: () => {
      try {
        const token = getToken();
        if (sso && token && token.type === "Bearer") {
          sso.signoutRedirect();
        }
        setIdentity(null);
        removeToken();
        dispatch(deleteCurrentUser());
      } catch (error) {
        console.error(error);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
