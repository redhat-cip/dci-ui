import NotAuthenticatedLoadingPage from "pages/NotAuthenticatedLoadingPage";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { setJWT } from "services/localStorage";
import { useAuth } from "./authContext";
import { useSSO } from "./ssoContext";

interface LocationState {
  from: {
    pathname: string;
  };
}

export default function LoginCallbackPage() {
  const { sso } = useSSO();
  const { refreshIdentity } = useAuth();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [location, setLocation] = useState<LocationState>({
    from: { pathname: "/jobs" },
  });

  useEffect(() => {
    if (sso !== null) {
      sso
        .signinRedirectCallback()
        .then((user) => {
          if (user) {
            const state = user.state as LocationState;
            if (state) {
              setLocation(state);
            }
            setJWT(user.access_token);
          }
          return refreshIdentity();
        })
        .catch(() => undefined)
        .then(() => setIsLoadingUser(false));
    }
  }, [refreshIdentity, sso]);

  return isLoadingUser ? (
    <NotAuthenticatedLoadingPage />
  ) : (
    <Navigate replace to={location.from} />
  );
}
