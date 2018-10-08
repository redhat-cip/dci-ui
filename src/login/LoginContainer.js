import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import LoginForm from "./LoginForm";
import { getCurrentUser } from "../currentUser/currentUserActions";
import { setBasicToken } from "../services/localStorage";
import Logo from "../logo.svg";
import { Cover } from "../ui";
import { showError } from "../alerts/alertsActions";
import { SiteContent } from "../layout";

export class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      seeLoginForm: false
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
      <SiteContent>
        <Cover className="login-pf-page">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-4 col-lg-offset-4">
                <header className="login-pf-page-header">
                  <img
                    className="login-pf-brand mt-0"
                    src={Logo}
                    alt="Distributed CI"
                  />
                  <p>
                    DCI or Distributed CI is a continuous integration project
                    that aims to bring partners inside our CI framework by
                    running CI on dedicated lab environments that are running in
                    their data centers with their configurations and their
                    applications.
                  </p>
                </header>
                <div className="card-pf">
                  <header className="login-pf-header">
                    <h1>Log In to Your Account</h1>
                  </header>
                  {this.state.seeLoginForm ? (
                    <LoginForm submit={this.submit} />
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary btn-block btn-lg"
                      onClick={() => {
                        const redirectUri = `${window.location.origin}${
                          from.pathname
                        }`;
                        window._sso.login({ redirectUri });
                      }}
                    >
                      Red Hat SSO
                    </button>
                  )}

                  <p className="login-pf-signup">
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() =>
                        this.setState(prevState => ({
                          seeLoginForm: !prevState.seeLoginForm
                        }))
                      }
                    >
                      toggle login form
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Cover>
      </SiteContent>
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
