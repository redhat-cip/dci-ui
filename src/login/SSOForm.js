import React, { Component } from "react";
import {
  Button,
  ActionGroup,
  Toolbar,
  ToolbarGroup
} from "@patternfly/react-core";
import styled from "styled-components";

const LoginBox = styled.div`
  min-height: 260px;
`;

export default class SSOForm extends Component {
  state = { canSubmit: false };

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    const { from } = this.props;
    return (
      <LoginBox>
        <ActionGroup>
          <Toolbar>
            <ToolbarGroup>
              <Button
                variant="danger"
                onClick={() => {
                  const redirectUri = `${window.location.origin}${from.pathname}`;
                  window._sso.login({ redirectUri });
                }}
              >
                Red Hat SSO
              </Button>
            </ToolbarGroup>
          </Toolbar>
        </ActionGroup>
      </LoginBox>
    );
  }
}
