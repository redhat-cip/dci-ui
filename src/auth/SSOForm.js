import React from "react";
import {
  Button,
  ActionGroup,
  Toolbar,
  ToolbarGroup,
} from "@patternfly/react-core";
import { useAuth } from "./authContext";
import { useLocation } from "react-router-dom";

const SSOForm = () => {
  const { sso } = useAuth();
  const location = useLocation();
  return (
    <div>
      <ActionGroup>
        <Toolbar>
          <ToolbarGroup>
            <Button
              variant="danger"
              className="mt-md"
              onClick={() => {
                sso.signinRedirect({ state: location.state });
              }}
            >
              Log in
            </Button>
          </ToolbarGroup>
        </Toolbar>
      </ActionGroup>
    </div>
  );
};

export default SSOForm;
