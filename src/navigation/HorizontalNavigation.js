import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import "./HorizontalNavigation.css";
import { logout } from "../currentUser/currentUserActions";

export function HorizontalNavigation({ currentUser, logout }) {
  if (isEmpty(currentUser)) return null;
  return (
    <div className="pf-masthead vertical-navigation">
      <ul className="pf-masthead__menu">
        <li className="pf-masthead__item" ng-if="$ctrl.currentUser.fullname">
          <Link
            to="/profile"
            id="navbar-utility__profile-link"
            className="pf-masthead__link"
          >
            <i className="fa fa-fw fa-user pf-masthead__icon" />
            <span className="pf-masthead__link-value">
              {currentUser.fullname || currentUser.name}
            </span>
          </Link>
        </li>
        <li className="pf-masthead__item">
          <button
            id="navbar-utility__logout-link"
            className="btn btn-link pf-masthead__link"
            onClick={() => logout()}
          >
            <i className="fa fa-fw fa-sign-out pf-masthead__icon" />
            <span className="pf-masthead__link-value">Sign out</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HorizontalNavigation);
