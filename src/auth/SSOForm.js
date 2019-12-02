import React, { Component } from "react";
import { connect } from "react-redux";
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

export class SSOForm extends Component {
  render() {
    const { auth } = this.props;
    return (
      <LoginBox>
        <ActionGroup>
          <Toolbar>
            <ToolbarGroup>
              <Button
                variant="danger"
                onClick={() => {
                  auth.signinRedirect();
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

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps)(SSOForm);
