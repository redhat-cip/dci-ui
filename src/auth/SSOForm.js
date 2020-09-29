import React from "react";
import { Button, ActionGroup } from "@patternfly/react-core";
import { useAuth } from "./authContext";
import { useLocation } from "react-router-dom";
import { showError } from "alerts/alertsActions";
import { useDispatch } from "react-redux";

const SSOForm = () => {
  const { sso } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();
  return (
    <div>
      <ActionGroup>
        <Button
          variant="danger"
          className="mt-md"
          onClick={() => {
            sso.signinRedirect({ state: location.state }).catch(() => {
              dispatch(
                showError(
                  "Oops, we are sorry! We can't connect to sso.redhat.com. Can you try later ?"
                )
              );
            });
          }}
        >
          Log in
        </Button>
      </ActionGroup>
    </div>
  );
};

export default SSOForm;
