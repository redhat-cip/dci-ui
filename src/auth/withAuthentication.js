import React from "react";
import { connect } from "react-redux";
import Pages from "pages";
import { getIdentity } from "currentUser/currentUserActions";
import { getConfig } from "config/configActions";
import { configureSSO } from "auth/authActions";

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    state = {
      configLoaded: false
    };

    componentDidMount() {
      const { configureSSO, getConfig, getIdentity } = this.props;
      getConfig()
        .then(configureSSO)
        .then(getIdentity)
        .catch(() => undefined)
        .then(() => this.setState({ configLoaded: true }));
    }

    render() {
      const { configLoaded } = this.state;
      return configLoaded ? (
        <Component {...this.props} />
      ) : (
        <Pages.NotAuthenticatedLoadingPage />
      );
    }
  }

  const mapDispatchToProps = dispatch => ({
    getConfig: () => dispatch(getConfig()),
    configureSSO: config => dispatch(configureSSO(config)),
    getIdentity: () => dispatch(getIdentity())
  });

  return connect(
    null,
    mapDispatchToProps
  )(WithAuthentication);
};

export default withAuthentication;
