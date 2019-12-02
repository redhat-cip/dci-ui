import React, { Component } from "react";
import { connect } from "react-redux";
import { removeToken } from "services/localStorage";
import pages from "pages";
import { deleteCurrentUser } from "currentUser/currentUserActions";

export class LogoutPage extends Component {
  
  componentDidMount() {
    const { auth, deleteCurrentUser } = this.props;
    deleteCurrentUser();
    removeToken();
    auth.signoutRedirect()
  }

  render() {
    return <pages.NotAuthenticatedLoadingPage />;
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

const mapDispatchToProps = dispatch => ({
  deleteCurrentUser: () => dispatch(deleteCurrentUser())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogoutPage);
