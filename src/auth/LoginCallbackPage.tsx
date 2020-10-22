import pages from "pages";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { setJWT } from "services/localStorage";
import { useAuth } from "./authContext";
import { useSSO } from "./ssoContext";

export default function LoginCallbackPage() {
  const { sso } = useSSO();
  const { refreshIdentity } = useAuth();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [location, setLocation] = useState({ from: { pathname: "/jobs" } });

  useEffect(() => {
    if (sso !== null) {
      sso
        .signinRedirectCallback()
        .then((user) => {
          if (user) {
            if (user.state) {
              setLocation(user.state);
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
    <pages.NotAuthenticatedLoadingPage />
  ) : (
    <Redirect to={location.from} />
  );
}
