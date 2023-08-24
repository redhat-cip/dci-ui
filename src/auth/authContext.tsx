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
import {
  Button,
  Flex,
  FlexItem,
  Modal,
  ModalVariant,
} from "@patternfly/react-core";
import { showError } from "alerts/alertsActions";

interface AuthContextType {
  identity: ICurrentUser | null;
  refreshIdentity: () => Promise<ICurrentUser>;
  changeCurrentTeam: (
    team: ITeam,
    currentUser: ICurrentUser,
  ) => Promise<ICurrentUser>;
  logout: () => void;
  openChangeTeamModal: () => void;
  closeChangeTeamModal: () => void;
  hasMultipleTeams: boolean;
  hasAtLeastOneTeam: boolean;
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      dispatch(authActions.getCurrentUser())
        .then(setIdentity)
        .catch((error) => {
          if (error.response.status === 400) {
            dispatch(
              showError(
                "Something went wrong during the SSO connection, please contact a DCI administrator.",
              ),
            );
          }
        })
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
        },
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
    openChangeTeamModal: () => setIsModalOpen(true),
    closeChangeTeamModal: () => setIsModalOpen(false),
    hasMultipleTeams: identity ? identity.teams.length > 1 : false,
    hasAtLeastOneTeam: identity ? identity.teams.length > 0 : false,
  };

  return (
    <AuthContext.Provider value={value}>
      {identity && (
        <Modal
          variant={ModalVariant.small}
          title="Change team"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <Flex gap={{ default: "gapXl" }}>
            {identity.teams.map((team) => (
              <FlexItem key={team.id}>
                <Button
                  variant="tertiary"
                  onClick={() => {
                    value.changeCurrentTeam(team, identity);
                    setIsModalOpen(false);
                  }}
                >
                  {team.name}
                </Button>
              </FlexItem>
            ))}
          </Flex>
        </Modal>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
