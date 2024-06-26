import { Button, ActionGroup } from "@patternfly/react-core";
import { useSSO } from "./ssoContext";
import { useLocation } from "react-router-dom";
import { showError } from "alerts/alertsSlice";
import { useAppDispatch } from "store";

export default function SSOForm() {
  const { sso } = useSSO();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const errorMessage =
    "We are sorry! We can't connect to sso.redhat.com. Can you try later ?";
  return (
    <div>
      <ActionGroup>
        <Button
          variant="danger"
          onClick={() => {
            if (sso === null) {
              dispatch(showError(errorMessage));
            } else {
              sso.signinRedirect({ state: location.state }).catch(() => {
                dispatch(showError(errorMessage));
              });
            }
          }}
        >
          Log in
        </Button>
      </ActionGroup>
    </div>
  );
}
