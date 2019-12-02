import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

const withAuthorization = Component => {
  class WithAuthorization extends React.Component {
    render() {
      const { currentUser } = this.props;
      return currentUser === null ? (
        <Redirect to="/login" />
      ) : (
        <Component {...this.props} />
      );
    }
  }

  function mapStateToProps(state) {
    return {
      currentUser: state.currentUser
    };
  }

  return connect(mapStateToProps)(WithAuthorization);
};

export default withAuthorization;
