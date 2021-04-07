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

function MenuDropdown({
  title,
  position,
  dropdownItems,
}: {
  title: React.ReactNode;
  position: DropdownPosition;
  dropdownItems: any[];
}) {
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
}

function DCINavItem({
  children,
  to,
  exact = true,
}: {
  children: React.ReactNode;
  to: string;
  exact?: boolean;
}) {
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

interface AppLayoutProps {
  children: React.ReactNode;
  [key: string]: any;
}

export default function AppLayout({ children, ...props }: AppLayoutProps) {
  const { identity, logout, changeCurrentTeam }: AuthContextProps = useAuth();
  const history = useHistory();
  if (identity === null) return null;
  const identityTeams = values(identity.teams);
  const PageNav = (
    <Nav aria-label="Nav" theme="dark">
      <NavGroup title="DCI">
        <DCINavItem to="/dashboard" exact={false}>
          Dashboard
        </DCINavItem>
        <DCINavItem to="/jobs" exact={false}>
          Jobs
        </DCINavItem>
        <DCINavItem to="/topics">Topics</DCINavItem>
        {isEmpty(identityTeams) ? null : (
          <DCINavItem to="/remotecis">Remotecis</DCINavItem>
        )}
      </NavGroup>
      <NavGroup title="User Preferences">
        <DCINavItem to="/currentUser/settings">Settings</DCINavItem>
        <DCINavItem to="/currentUser/notifications">Notifications</DCINavItem>
      </NavGroup>
      {identity.hasReadOnlyRole && (
        <NavGroup title="Red Hat">
          <DCINavItem to="/trends">Trends</DCINavItem>
          <DCINavItem to="/performance">Performance</DCINavItem>
        </NavGroup>
      )}
      {identity.hasEPMRole && (
        <NavGroup title="EPM">
          <DCINavItem to="/teams">Teams</DCINavItem>
          <DCINavItem to="/users">Users</DCINavItem>
          <DCINavItem to="/permissions">Permissions</DCINavItem>
        </NavGroup>
      )}
      {identity.isSuperAdmin && (
        <NavGroup title="Admin">
          <DCINavItem to="/products">Products</DCINavItem>
          <DCINavItem to="/feeders">Feeders</DCINavItem>
        </NavGroup>
      )}
    </Nav>
  );
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
                onClick={() => {
                  logout();
                }}
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
                  onClick={() => changeCurrentTeam(team, identity)}
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
    <Page header={Header} sidebar={Sidebar} isManagedSidebar {...props}>
      {children}
    </Page>
  );
}
