import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import LoginForm from "./LoginForm";
import { getCurrentUser } from "../currentUser/currentUserActions";
import { setBasicToken } from "../services/localStorage";
import Logo from "../logo.svg";
import { showError } from "../alerts/alertsActions";
import { SiteContent } from "../layout";
import { Button } from "@patternfly/react-core";

export class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false
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
    const { redirectToReferrer } = this.state;

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
                  aims to bring partners inside our CI framework by running CI
                  on dedicated lab environments that are running in their data
                  centers with their configurations and their applications.
                </p>
              </div>
            </header>
            <main className="pf-l-login__main">
              <div className="pf-c-login-box">
                <div className="pf-c-login-box__header">
                  <h1 className="pf-c-title pf-m-3xl pf-u-mb-sm">SSO Login</h1>
                </div>
                <div className="pf-c-login-box__body">
                  <div className="pf-c-form__group pf-m-action pf-u-align-items-center pf-u-display-flex pf-u-flex-direction-column pf-u-flex-direction-row-on-md">
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
                  </div>
                </div>
                <div className="pf-c-login-box__header">
                  <h1 className="pf-c-title pf-m-3xl pf-u-mb-sm">DCI Login</h1>
                </div>
                <div className="pf-c-login-box__body">
                  <LoginForm submit={this.submit} />
                </div>
              </div>
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
