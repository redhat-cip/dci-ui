import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { setJWT } from "services/localStorage";
import pages from "pages";
import { getIdentity } from "currentUser/currentUserActions";

export class LoginCallbackPage extends Component {
  state = {
    redirectionLoaded: false
  };

  componentDidMount() {
    const { auth, getIdentity } = this.props;
    auth
      .signinRedirectCallback()
      .then(user => {
        if (user) {
          setJWT(user.access_token);
          return getIdentity();
        }
      })
      .catch(() => undefined)
      .then(() => this.setState({ redirectionLoaded: true }));
  }

  render() {
    const { redirectionLoaded } = this.state;
    if (redirectionLoaded) {
      return <Redirect to="/jobs" />;
    }
    return <pages.NotAuthenticatedLoadingPage />;
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

const mapDispatchToProps = dispatch => ({
  getIdentity: () => dispatch(getIdentity())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginCallbackPage);
