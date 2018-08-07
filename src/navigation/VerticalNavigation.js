import React from "react";
import { connect } from "react-redux";
import { withRouter, Route, Link } from "react-router-dom";
import { isEmpty } from "lodash";
import "./VerticalNavigation.css";
import Logo from "../logo.svg";

export function NavItem({ children, to, exact = true }) {
  return (
    <Route
      path={to}
      exact={exact}
      children={({ match }) => (
        <li
          className={
            match ? "pf-vertical-nav__item active" : "pf-vertical-nav__item"
          }
        >
          <Link
            id={`"navbar-primary__${to}-link"`}
            to={to}
            className="pf-vertical-nav__link"
          >
            {children}
          </Link>
        </li>
      )}
    />
  );
}

export function VerticalNavigation({ currentUser }) {
  if (isEmpty(currentUser)) return null;
  return (
    <div className="pf-vertical-nav">
      <div className="pf-vertical-nav__logo">
        <Link to="/jobs">
          <img
            className="pf-vertical-nav__img"
            src={Logo}
            alt="Distributed CI"
          />
        </Link>
      </div>
      <div className="pf-vertical-nav__category">DCI</div>
      <ul className="pf-vertical-nav__menu">
        <NavItem to="/jobs" exact={false}>
          <i className="fa fa-fw fa-list pf-vertical-nav__icon" />
          <span className="pf-vertical-nav__link-value">Jobs</span>
        </NavItem>
        {currentUser.hasReadOnlyRole ? (
          <NavItem to="/globalStatus">
            <i className="fa fa-fw fa-dashboard pf-vertical-nav__icon" />
            <span className="pf-vertical-nav__link-value">Global Status</span>
          </NavItem>
        ) : null}
        <NavItem to="/topics">
          <i className="fa fa-fw fa-cube pf-vertical-nav__icon" />
          <span className="pf-vertical-nav__link-value">Topics</span>
        </NavItem>
        <NavItem to="/components">
          <i className="fa fa-fw fa-cubes pf-vertical-nav__icon" />
          <span className="pf-vertical-nav__link-value">Components</span>
        </NavItem>
        {currentUser.hasAdminRole ? (
          <NavItem to="/remotecis">
            <i className="fa fa-fw fa-server pf-vertical-nav__icon" />
            <span className="pf-vertical-nav__link-value">Remote CIs</span>
          </NavItem>
        ) : null}
        {currentUser.hasProductOwnerRole ? (
          <NavItem to="/feeders">
            <i className="fa fa-fw fa-cloud-upload pf-vertical-nav__icon" />
            <span className="pf-vertical-nav__link-value">Feeders</span>
          </NavItem>
        ) : null}
        {currentUser.isSuperAdmin ? (
          <NavItem to="/products">
            <i className="fa fa-fw fa-archive pf-vertical-nav__icon" />
            <span className="pf-vertical-nav__link-value">Products</span>
          </NavItem>
        ) : null}
      </ul>
      {currentUser.hasAdminRole ? (
        <React.Fragment>
          <div className="pf-vertical-nav__category">Admin</div>
          <ul className="pf-vertical-nav__menu">
            <NavItem to="/teams">
              <i className="fa fa-fw fa-users pf-vertical-nav__icon" />
              <span className="pf-vertical-nav__link-value">Team</span>
            </NavItem>
            <NavItem to="/users">
              <i className="fa fa-fw fa-user-plus pf-vertical-nav__icon" />
              <span className="pf-vertical-nav__link-value">Users</span>
            </NavItem>
          </ul>
        </React.Fragment>
      ) : null}
      <div className="pf-vertical-nav__category">Preferences</div>
      <ul className="pf-vertical-nav__menu">
        <NavItem to="/profile">
          <i className="fa fa-fw fa-user pf-vertical-nav__icon" />
          <span className="pf-vertical-nav__link-value">Profile</span>
        </NavItem>
        <NavItem to="/subscriptions">
          <i className="fa fa-fw fa-bell pf-vertical-nav__icon" />
          <span className="pf-vertical-nav__link-value">Subscriptions</span>
        </NavItem>
      </ul>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}

export default withRouter(connect(mapStateToProps)(VerticalNavigation));
