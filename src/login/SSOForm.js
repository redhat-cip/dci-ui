import React, { Component } from "react";
import { connect } from "react-redux";
import Keycloak from "keycloak-js";
import {
  Button,
  ActionGroup,
  Toolbar,
  ToolbarGroup
} from "@patternfly/react-core";
import styled from "styled-components";
import { setJWT } from "../services/localStorage";
import { login, logout } from "../auth/authActions";

const LoginBox = styled.div`
  min-height: 260px;
`;

export class SSOForm extends Component {
  state = { canSubmit: false };

  componentDidMount() {
    const { config, login, logout } = this.props;
    const ssoConfig = config.sso;
    const sso = Keycloak({
      url: `${ssoConfig.url}/auth`,
      realm: `${ssoConfig.realm}`,
      clientId: `${ssoConfig.clientId}`
    });
    window._sso = sso;
    sso
      .init({ onLoad: "check-sso" })
      .success(authenticated => {
        if (authenticated) {
          setJWT(sso.token);
          login();
        } else {
          logout();
          sso.logout();
        }
      })
      .error(e => {
        console.error(e);
        logout();
        sso.logout();
      });
  }

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
                  const redirectUri = `${window.location.origin}${
                    from.pathname
                  }`;
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

function mapStateToProps(state) {
  return {
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: () => dispatch(login()),
    logout: () => dispatch(logout())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SSOForm);
