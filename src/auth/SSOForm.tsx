import { Button, ActionGroup } from "@patternfly/react-core";
import { useKeycloak } from "./ssoContext";
import { useLocation } from "react-router-dom";
import { showError } from "alerts/alertsActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";

export default function SSOForm() {
  const { keycloak } = useKeycloak();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const errorMessage =
    "We are sorry! We can't connect to sso.redhat.com. Can you try later ?";
  return (
    <div>
      <ActionGroup>
        <Button
          variant="danger"
          className="mt-md"
          onClick={() => {
            if (keycloak === null) {
              dispatch(showError(errorMessage));
            } else {
              keycloak
                .login({ redirectUri: location.state.origin })
                .catch(() => dispatch(showError(errorMessage)));
            }
          }}
        >
          Log in
        </Button>
      </ActionGroup>
    </div>
  );
}
