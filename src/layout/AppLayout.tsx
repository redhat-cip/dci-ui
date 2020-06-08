import React, { useState } from "react";
import { Route, Link, useHistory } from "react-router-dom";
import { isEmpty, values } from "lodash";
import {
  Brand,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator,
  DropdownPosition,
  Nav,
  NavGroup,
  NavItem,
  Page,
  PageHeader,
  PageSidebar,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
} from "@patternfly/react-core";
import Logo from "logo.min.svg";
import { UserIcon, UsersIcon } from "@patternfly/react-icons";
import { useAuth, AuthContextProps } from "auth/authContext";

const MenuDropdown = ({
  title,
  position,
  dropdownItems,
}: {
  title: React.ReactNode;
  position: DropdownPosition;
  dropdownItems: any[];
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <Dropdown
      isPlain
      position={position}
      onSelect={() => setIsDropdownOpen(!isDropdownOpen)}
      isOpen={isDropdownOpen}
      toggle={
        <DropdownToggle onToggle={setIsDropdownOpen}>{title}</DropdownToggle>
      }
      dropdownItems={dropdownItems}
    />
  );
};

const DCINavItem = ({
  children,
  to,
  exact = true,
}: {
  children: React.ReactNode;
  to: string;
  exact?: boolean;
}) => (
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

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { identity, logout, changeCurrentTeam }: AuthContextProps = useAuth();
  const history = useHistory();
  if (identity === null) return null;
  const PageNav = (
    <Nav aria-label="Nav" theme="dark">
      <NavGroup title="DCI">
        <DCINavItem to="/jobs" exact={false}>
          Jobs
        </DCINavItem>
        {identity.isSuperAdmin && (
          <React.Fragment>
            <DCINavItem to="/feeders">Feeders</DCINavItem>
            <DCINavItem to="/products">Products</DCINavItem>
          </React.Fragment>
        )}
        <DCINavItem to="/topics">Topics</DCINavItem>
        <DCINavItem to="/remotecis">Remotecis</DCINavItem>
      </NavGroup>
      {identity.hasReadOnlyRole && (
        <NavGroup title="Stats">
          <DCINavItem to="/globalStatus">Global Status</DCINavItem>
          <DCINavItem to="/trends">Trends</DCINavItem>
          <DCINavItem to="/performance">Performance</DCINavItem>
        </NavGroup>
      )}
      {identity.hasEPMRole && (
        <NavGroup title="Admin">
          <DCINavItem to="/teams">Teams</DCINavItem>
          <DCINavItem to="/users">Users</DCINavItem>
          {identity.hasEPMRole && (
            <DCINavItem to="/permissions">Permissions</DCINavItem>
          )}
        </NavGroup>
      )}
      <NavGroup title="User Preferences">
        <DCINavItem to="/currentUser/settings">Settings</DCINavItem>
        <DCINavItem to="/currentUser/notifications">Notifications</DCINavItem>
      </NavGroup>
    </Nav>
  );
  const identityTeams = values(identity.teams);
  const headerTools = (
    <PageHeaderTools>
      <PageHeaderToolsGroup>
        <PageHeaderToolsItem>
          <MenuDropdown
            position={DropdownPosition.right}
            title={
              <span>
                <UserIcon className="mr-md" />
                {identity.fullname || identity.name}
              </span>
            }
            dropdownItems={[
              <DropdownItem
                key="dropdown_user_settings"
                component="button"
                onClick={() => history.push("/currentUser/settings")}
              >
                Settings
              </DropdownItem>,
              <DropdownSeparator key="dropdown_user_separator" />,
              <DropdownItem
                key="dropdown_user_logout"
                component="button"
                onClick={logout}
              >
                Logout
              </DropdownItem>,
            ]}
          />
        </PageHeaderToolsItem>
      </PageHeaderToolsGroup>
      {identityTeams.length > 1 && (
        <PageHeaderToolsGroup>
          <PageHeaderToolsItem>
            <MenuDropdown
              position={DropdownPosition.right}
              title={
                <span>
                  <UsersIcon className="mr-md" />
                  {identity.team && identity.team.name}
                </span>
              }
              dropdownItems={identityTeams.map((team) => (
                <DropdownItem
                  key={team.name}
                  component="button"
                  onClick={() => changeCurrentTeam(team)}
                >
                  {team.name}
                </DropdownItem>
              ))}
            />
          </PageHeaderToolsItem>
        </PageHeaderToolsGroup>
      )}
    </PageHeaderTools>
  );

  const Header = (
    <PageHeader
      logo={<Brand src={Logo} alt="DCI Logo" />}
      headerTools={headerTools}
      showNavToggle
    />
  );
  const Sidebar = <PageSidebar nav={PageNav} theme="dark" />;
  return (
    <React.Fragment>
      <Page header={Header} sidebar={Sidebar} isManagedSidebar>
        {children}
      </Page>
    </React.Fragment>
  );
};

export default AppLayout;
