import { useEffect, useState } from "react";
import * as React from "react";
import { useDispatch } from "react-redux";
import { removeToken, getToken } from "services/localStorage";
import {
  ITeam,
  ICurrentUser,
  IIdentityTeam,
  ICurrentUserWithPasswordsFields,
} from "types";
import { useSSO } from "./ssoContext";
import * as authApi from "./authApi";
import { AppDispatch } from "store";
import NotAuthenticatedLoadingPage from "pages/NotAuthenticatedLoadingPage";
import {
  Button,
  Flex,
  FlexItem,
  Modal,
  ModalVariant,
} from "@patternfly/react-core";
import { showError, showSuccess } from "alerts/alertsActions";

interface AuthContextType {
  currentUser: ICurrentUser | null;
  updateCurrentUser: (currentUser: ICurrentUser) => Promise<void>;
  changePassword: (
    currentUser: ICurrentUserWithPasswordsFields,
  ) => Promise<void>;
  refreshIdentity: () => Promise<ICurrentUser>;
  changeCurrentTeam: (currentUser: ICurrentUser, team: ITeam) => ICurrentUser;
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
  const [currentUser, setCurrentUser] = useState<ICurrentUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      authApi
        .getCurrentUser()
        .then(setCurrentUser)
        .catch((error) => {
          console.log(error);
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

  const logout = () => {
    try {
      const token = getToken();
      if (sso && token && token.type === "Bearer") {
        sso.signoutRedirect();
      }
      setCurrentUser(null);
      removeToken();
    } catch (error) {
      console.error(error);
    }
  };

  const value = {
    currentUser,
    changeCurrentTeam: (currentUser: ICurrentUser, team: IIdentityTeam) => {
      const newCurrentUser = authApi.changeCurrentTeam(currentUser, team);
      setCurrentUser(newCurrentUser);
      return newCurrentUser;
    },
    changePassword: (currentUser: ICurrentUserWithPasswordsFields) => {
      return authApi
        .updateCurrentUser(currentUser)
        .then(() => {
          dispatch(
            showSuccess(
              "Your password has been changed successfully, please log in again with your new password",
            ),
          );
          logout();
        })
        .catch((error) => {
          if (error.response.status === 400) {
            dispatch(
              showError("Your current password is invalid, please check again"),
            );
          }
        });
    },
    updateCurrentUser: (currentUser: ICurrentUser) => {
      return authApi
        .updateCurrentUser(currentUser)
        .then(() => authApi.getCurrentUser().then(setCurrentUser));
    },
    refreshIdentity: () => {
      return authApi.getCurrentUser().then((currentUser) => {
        setCurrentUser(currentUser);
        return currentUser;
      });
    },
    logout,
    openChangeTeamModal: () => setIsModalOpen(true),
    closeChangeTeamModal: () => setIsModalOpen(false),
    hasMultipleTeams: currentUser ? currentUser.teams.length > 1 : false,
    hasAtLeastOneTeam: currentUser ? currentUser.teams.length > 0 : false,
  };

  return (
    <AuthContext.Provider value={value}>
      {currentUser && (
        <Modal
          id="change-team-modal"
          aria-label="Change team modal"
          variant={ModalVariant.small}
          title="Change team"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <Flex gap={{ default: "gapXl" }}>
            {currentUser.teams.map((team) => (
              <FlexItem key={team.id}>
                <Button
                  variant="tertiary"
                  onClick={() => {
                    value.changeCurrentTeam(currentUser, team);
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
