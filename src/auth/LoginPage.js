import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, LoginFooterItem, LoginPage } from "@patternfly/react-core";
import LoginForm from "./LoginForm";
import SSOForm from "./SSOForm";
import { getIdentity } from "currentUser/currentUserActions";
import { setBasicToken } from "services/localStorage";
import Logo from "logo.svg";
import { showError } from "alerts/alertsActions";

export class DCILoginPage extends Component {
  state = {
    seeSSOForm: true
  };

  submit = user => {
    const token = window.btoa(user.username.concat(":", user.password));
    setBasicToken(token);
    const { getIdentity, showError, history } = this.props;
    getIdentity()
      .then(() => history.push("/jobs"))
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
    const { seeSSOForm } = this.state;
    const loginSubtitle = seeSSOForm
      ? "To continue on DCI you need to log in using your Red Hat account. Click on the Log in button to be redirected to the Red Hat login page."
      : "To continue on DCI you need to log in. For a better experience we encourage you to use your Red Hat account.";

    return (
      <LoginPage
        footerListVariants="inline"
        brandImgSrc={Logo}
        brandImgAlt="DCI logo"
        footerListItems={
          <LoginFooterItem
            href="https://doc.distributed-ci.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </LoginFooterItem>
        }
        textContent="DCI or Distributed CI is a continuous integration project that aims to bring partners inside Red Hat CI framework by running CI on dedicated lab environments that are running in their data centers with their configurations and their applications."
        loginTitle="Log in to your account"
        loginSubtitle={loginSubtitle}
      >
        {seeSSOForm ? <SSOForm /> : <LoginForm submit={this.submit} />}
        <Button
          variant="link"
          className="pf-u-p-0 pf-u-mt-2xl"
          onClick={() =>
            this.setState(prevState => ({
              seeSSOForm: !prevState.seeSSOForm
            }))
          }
        >
          toggle login form
        </Button>
      </LoginPage>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getIdentity: () => dispatch(getIdentity()),
    showError: message => dispatch(showError(message))
  };
}

export default connect(null, mapDispatchToProps)(DCILoginPage);
