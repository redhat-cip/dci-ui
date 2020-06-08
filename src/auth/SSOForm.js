import React from "react";
import { Button, ActionGroup } from "@patternfly/react-core";
import { useAuth } from "./authContext";
import { useLocation } from "react-router-dom";

const SSOForm = () => {
  const { sso } = useAuth();
  const location = useLocation();
  return (
    <div>
      <ActionGroup>
        <Button
          variant="danger"
          className="mt-md"
          onClick={() => {
            sso.signinRedirect({ state: location.state });
          }}
        >
          Log in
        </Button>
      </ActionGroup>
    </div>
  );
};

export default SSOForm;
