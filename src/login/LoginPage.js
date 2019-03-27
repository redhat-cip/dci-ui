import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Button } from "@patternfly/react-core";

import LoginForm from "./LoginForm";
import SSOForm from "./SSOForm";
import { getIdentity } from "currentUser/currentUserActions";
import { setBasicToken } from "services/localStorage";
import Logo from "logo.svg";
import { showError } from "alerts/alertsActions";

export class LoginPage extends Component {
  state = {
    redirectToReferrer: false,
    seeSSOForm: true
  };

  submit = user => {
    const token = window.btoa(user.username.concat(":", user.password));
    setBasicToken(token);
    const { getIdentity, showError } = this.props;
    getIdentity()
      .then(() => {
        this.setState({ redirectToReferrer: true });
      })
      .catch(error => {
        if (error.response && error.response.status) {
          showError("Invalid username or password");
        } else {
          showError(
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
        <div className="pf-c-login">
          <div className="pf-c-login__container">
            <header className="pf-c-login__header">
              <img className="pf-c-brand" src={Logo} alt="Distributed CI" />
              <p>
                DCI or Distributed CI is a continuous integration project that
                aims to bring partners inside Red Hat CI framework by running CI
                on dedicated lab environments that are running in their data
                centers with their configurations and their applications.
              </p>
            </header>
            <div className="pf-c-login__main">
              <header className="pf-c-login__main-header">
                <h1 className="pf-c-title pf-m-3xl">
                  {seeSSOForm ? "SSO Login" : "DCI Login"}
                </h1>
              </header>
              <div className="pf-c-login__main-body">
                {seeSSOForm ? (
                  <SSOForm from={from} />
                ) : (
                  <LoginForm submit={this.submit} />
                )}
              </div>
              <div className="pf-c-login__main-body">
                <Button
                  variant="link"
                  className="pf-u-p-0"
                  onClick={() =>
                    this.setState(prevState => ({
                      seeSSOForm: !prevState.seeSSOForm
                    }))
                  }
                >
                  toggle login form
                </Button>
              </div>
            </div>
            <footer className="pf-c-login__footer">
              <ul className="pf-c-list pf-m-inline">
                <li>
                  <a
                    href="https://doc.distributed-ci.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pf-c-login__footer-link"
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
    getIdentity: () => dispatch(getIdentity()),
    showError: message => dispatch(showError(message))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
