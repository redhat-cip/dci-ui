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
  ToolbarItem,
  Avatar
} from "@patternfly/react-core";
import accessibleStyles from "@patternfly/patternfly/utilities/Accessibility/accessibility.css";
import { css } from "@patternfly/react-styles";
import Logo from "logo.svg";
import { logout, setCurrentTeam } from "currentUser/currentUserActions";
import { UserIcon, UsersIcon } from "@patternfly/react-icons";
import avatarImg from "./img_avatar.svg";

class MenuDropdown extends React.Component {
  state = {
    isDropdownOpen: false
  };

  onDropdownToggle = isDropdownOpen => {
    this.setState({
      isDropdownOpen
    });
  };

  onDropdownSelect = () => {
    this.setState(prevState => ({
      isDropdownOpen: !prevState.isDropdownOpen
    }));
  };

  render() {
    const { isDropdownOpen } = this.state;
    const { title, position, dropdownItems } = this.props;
    return (
      <Dropdown
        isPlain
        position={position}
        onSelect={this.onDropdownSelect}
        isOpen={isDropdownOpen}
        toggle={
          <DropdownToggle onToggle={this.onDropdownToggle}>
            {title}
          </DropdownToggle>
        }
        dropdownItems={dropdownItems}
      />
    );
  }
}

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
  render() {
    const {
      children,
      currentUser,
      currentUserTeams,
      setCurrentTeam,
      logout,
      history
    } = this.props;
    const PageNav = (
      <Nav aria-label="Nav">
        <NavGroup title="DCI">
          <DCINavItem to="/jobs" exact={false}>
            Jobs
          </DCINavItem>
          {currentUser.isSuperAdmin && (
            <DCINavItem to="/products">Products</DCINavItem>
          )}
          <DCINavItem to="/topics">Topics</DCINavItem>

          <DCINavItem to="/components">Components</DCINavItem>
          <DCINavItem to="/remotecis">Remotecis</DCINavItem>
        </NavGroup>
        {currentUser.hasReadOnlyRole && (
          <NavGroup title="Stats">
            <DCINavItem to="/globalStatus">Global Status</DCINavItem>
            <DCINavItem to="/trends">Trends</DCINavItem>
          </NavGroup>
        )}
        {currentUser.hasProductOwnerRole && (
          <NavGroup title="Admin">
            <DCINavItem to="/teams">Teams</DCINavItem>
            <DCINavItem to="/users">Users</DCINavItem>
            {currentUser.hasProductOwnerRole && (
              <DCINavItem to="/permissions">Permissions</DCINavItem>
            )}
          </NavGroup>
        )}
        <NavGroup title="User Preferences">
          <DCINavItem to="/profile">Profile</DCINavItem>
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
            <MenuDropdown
              position="right"
              title={
                <span>
                  <UserIcon className="pf-u-mr-md" />
                  {currentUser.fullname || currentUser.name}
                </span>
              }
              dropdownItems={[
                <DropdownItem
                  component="button"
                  onClick={() => history.push("/profile")}
                >
                  User preferences
                </DropdownItem>,
                <DropdownSeparator />,
                <DropdownItem component="button" onClick={() => logout()}>
                  Logout
                </DropdownItem>
              ]}
            />
          </ToolbarItem>
        </ToolbarGroup>
        {currentUserTeams.length > 1 && (
          <ToolbarGroup
            className={css(
              accessibleStyles.screenReader,
              accessibleStyles.visibleOnLg
            )}
          >
            <ToolbarItem
              className={css(
                accessibleStyles.srOnly,
                accessibleStyles.visibleOnMd
              )}
            >
              <MenuDropdown
                position="right"
                title={
                  <span>
                    <UsersIcon className="pf-u-mr-md" />
                    {currentUser.team.team_name}
                  </span>
                }
                dropdownItems={currentUserTeams.map(team => (
                  <DropdownItem
                    key={team.team_name}
                    component="button"
                    onClick={() => setCurrentTeam(team)}
                  >
                    {team.team_name}
                  </DropdownItem>
                ))}
              />
            </ToolbarItem>
          </ToolbarGroup>
        )}
      </Toolbar>
    );

    const Header = (
      <PageHeader
        logo={<Brand src={Logo} alt="DCI Logo" />}
        toolbar={PageToolbar}
        avatar={<Avatar src={avatarImg} alt="Avatar image" />}
        showNavToggle
      />
    );
    const Sidebar = <PageSidebar nav={PageNav} />;
    return (
      <React.Fragment>
        <Page header={Header} sidebar={Sidebar} isManagedSidebar>
          {children}
        </Page>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    currentUserTeams: Object.values(state.currentUser.teams)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentTeam: team => dispatch(setCurrentTeam(team)),
    logout: () => dispatch(logout())
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MainContent)
);
