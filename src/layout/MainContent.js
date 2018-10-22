import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { withRouter, Route, Link } from "react-router-dom";
import {
  Brand,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator,
  Nav,
  NavGroup,
  NavItem,
  Page,
  PageHeader,
  PageSidebar,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from "@patternfly/react-core";
import accessibleStyles from "@patternfly/patternfly-next/utilities/Accessibility/accessibility.css";
import { css } from "@patternfly/react-styles";
import Logo from "../logo.svg";
import { logout } from "../currentUser/currentUserActions";

function DCINavItem({ children, to, exact = true }) {
  return (
    <Route
      path={to}
      exact={exact}
      children={({ match }) => (
        <NavItem isActive={!isEmpty(match)}>
          <Link to={to}>{children}</Link>
        </NavItem>
      )}
    />
  );
}

class MainContent extends Component {
  static title = "Using grouped navigation";

  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
      isKebabDropdownOpen: false,
      activeItem: "grp-1_itm-1"
    };
  }

  onDropdownToggle = isDropdownOpen => {
    this.setState({
      isDropdownOpen
    });
  };

  onDropdownSelect = event => {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen
    });
  };

  onNavSelect = result => {
    this.setState({
      activeItem: result.itemId
    });
  };

  render() {
    const { children, currentUser, logout, history } = this.props;
    const { isDropdownOpen } = this.state;

    const PageNav = (
      <Nav onSelect={this.onNavSelect} aria-label="Nav">
        <NavGroup title="DCI">
          <DCINavItem to="/jobs" exact={false}>
            Jobs
          </DCINavItem>
          {currentUser.isSuperAdmin ? (
            <DCINavItem to="/products">Products</DCINavItem>
          ) : null}
          <DCINavItem to="/topics">Topics</DCINavItem>

          <DCINavItem to="/components">Components</DCINavItem>

          {currentUser.hasAdminRole ? (
            <DCINavItem to="/remotecis">Remotecis</DCINavItem>
          ) : null}
        </NavGroup>
        {currentUser.hasReadOnlyRole ? (
          <NavGroup title="Stats">
            <DCINavItem to="/globalStatus">Global Status</DCINavItem>
            <DCINavItem to="/trends">Trends</DCINavItem>
          </NavGroup>
        ) : null}
        {currentUser.hasAdminRole ? (
          <NavGroup title="Admin">
            <DCINavItem to="/teams">Team</DCINavItem>

            <DCINavItem to="/users">Users</DCINavItem>
          </NavGroup>
        ) : null}
        <NavGroup title="User Preferences">
          <DCINavItem to="/profile">Profile</DCINavItem>

          <DCINavItem to="/subscriptions">Subscriptions</DCINavItem>
        </NavGroup>
      </Nav>
    );

    const PageToolbar = (
      <Toolbar>
        <ToolbarGroup>
          <ToolbarItem
            className={css(
              accessibleStyles.srOnly,
              accessibleStyles.visibleOnMd
            )}
          >
            <Dropdown
              isPlain
              position="right"
              onSelect={this.onDropdownSelect}
              isOpen={isDropdownOpen}
              toggle={
                <DropdownToggle onToggle={this.onDropdownToggle}>
                  {currentUser.fullname || currentUser.name}
                </DropdownToggle>
              }
            >
              <DropdownItem
                component="button"
                onClick={() => history.push("/profile")}
              >
                User preferences
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem component="button" onClick={() => logout()}>
                Logout
              </DropdownItem>
            </Dropdown>
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
    );

    const Header = (
      <PageHeader
        logo={<Brand src={Logo} alt="DCI Logo" />}
        toolbar={PageToolbar}
      />
    );
    const Sidebar = <PageSidebar nav={PageNav} />;
    return (
      <React.Fragment>
        <div className="pf-c-background-image" />
        <Page header={Header} sidebar={Sidebar}>
          {children}
        </Page>
      </React.Fragment>
    );
  }
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MainContent)
);
