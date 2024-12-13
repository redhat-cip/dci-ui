import NotAuthenticatedLoadingPage from "pages/NotAuthenticatedLoadingPage";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "store";
import { setJWT } from "services/localStorage";
import { showError } from "alerts/alertsSlice";
import { manager } from "./sso";

interface LocationState {
  from: {
    pathname: string;
  };
}

export default function LoginRedirectPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    manager
      .signinRedirectCallback()
      .then((user) => {
        if (user?.access_token) {
          setJWT(user.access_token);
          const { from } = (user.state as LocationState) || {
            from: { pathname: "/" },
          };
          navigate(from);
        } else {
          dispatch(
            showError("Something went wrong, contact a DCI administrator"),
          );
        }
      })
      .catch((error) => {
        dispatch(
          showError(
            "Something went wrong, check your connectivity or contact a DCI administrator",
          ),
        );
        console.error(error);
      });
  }, [navigate, dispatch]);

  return <NotAuthenticatedLoadingPage />;
}
