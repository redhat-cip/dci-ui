import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import LoginForm from "./LoginForm";
import SSOForm from "./SSOForm";
import styled from "styled-components";
import { getCurrentUser } from "../currentUser/currentUserActions";
import { setBasicToken } from "../services/localStorage";
import Logo from "../logo.svg";
import { showError } from "../alerts/alertsActions";
import { Button } from "@patternfly/react-core";

class LoginBox extends Component {
  render() {
    const { className, children } = this.props;
    return <div className={`pf-c-login-box ${className}`}>{children}</div>;
  }
}

const DCILoginBox = styled(LoginBox)`
  min-height: 575px;
`;


export class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      seeSSOForm: true
    };
  }

  submit = user => {
    const token = window.btoa(user.username.concat(":", user.password));
    setBasicToken(token);
    this.props
      .getCurrentUser()
      .then(() => {
        this.setState({ redirectToReferrer: true });
      })
      .catch(error => {
        if (error.response && error.response.status) {
          this.props.showError("Invalid username or password");
        } else {
          this.props.showError(
            "Network error, check your connectivity or contact a DCI administrator"
          );
        }
      });
  };

  render() {
    const { location, isAuthenticated } = this.props;
    const { from } = location.state || { from: { pathname: "/jobs" } };
    const { redirectToReferrer, seeSSOForm } = this.state;

    if (redirectToReferrer || isAuthenticated) {
      return <Redirect to={from} />;
    }

    return (
      <React.Fragment>
        <div className="pf-c-background-image " />
        <div className="pf-l-login">
          <div className="pf-l-login__container">
            <header className="pf-l-login__header">
              <div className="pf-l-login__header-brand">
                <img className="pf-c-brand" src={Logo} alt="Distributed CI" />
              </div>
              <div className="pf-c-content">
                <p>
                  DCI or Distributed CI is a continuous integration project that
                  aims to bring partners inside Red Hat CI framework by running
                  CI on dedicated lab environments that are running in their
                  data centers with their configurations and their applications.
                </p>
              </div>
            </header>
            <main className="pf-l-login__main">
              <DCILoginBox>
                {seeSSOForm ? (
                  <React.Fragment>
                    <div className="pf-c-login-box__header pf-u-mt-3xl">
                      <h1 className="pf-c-title pf-m-3xl pf-u-mb-sm">
                        SSO Login
                      </h1>
                    </div>
                    <div className="pf-c-login-box__body">
                      <SSOForm from={from} />
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className="pf-c-login-box__header">
                      <h1 className="pf-c-title pf-m-3xl pf-u-mb-sm">
                        DCI Login
                      </h1>
                    </div>
                    <div className="pf-c-login-box__body">
                      <LoginForm submit={this.submit} />
                    </div>
                  </React.Fragment>
                )}
                <div className="pf-c-login-box__footer">
                  <Button
                    variant="link"
                    onClick={() =>
                      this.setState(prevState => ({
                        seeSSOForm: !prevState.seeSSOForm
                      }))
                    }
                  >
                    toggle login form
                  </Button>
                </div>
              </DCILoginBox>
            </main>
            <footer className="pf-l-login__footer">
              <ul className="pf-c-list pf-m-inline">
                <li>
                  <a
                    href="https://doc.distributed-ci.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </footer>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    config: state.config,
    isAuthenticated: Object.keys(state.currentUser).length !== 0
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCurrentUser: () => dispatch(getCurrentUser()),
    showError: message => dispatch(showError(message))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginContainer);
