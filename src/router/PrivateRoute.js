import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { keys } from "lodash";

class PrivateRoute extends Component {
  render() {
    const { isAuthenticated, component: Component, ...props } = this.props;
    return (
      <Route
        {...props}
        render={props =>
          isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: keys(state.currentUser).length !== 0
  };
}

export default connect(mapStateToProps)(PrivateRoute);
