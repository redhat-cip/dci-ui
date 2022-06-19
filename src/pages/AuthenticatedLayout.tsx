import { useState } from "react";
import {
  Link,
  useNavigate,
  useResolvedPath,
  useLocation,
  Outlet,
  Navigate,
} from "react-router-dom";
import { isEmpty, values } from "lodash";
import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator,
  DropdownPosition,
  Nav,
  NavGroup,
  NavItem,
  Page,
  PageSidebar,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  Button,
  Masthead,
  MastheadToggle,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
  ToolbarContent,
} from "@patternfly/react-core";
import Logo from "logo.min.svg";
import {
  BarsIcon,
  HelpIcon,
  UserIcon,
  UsersIcon,
} from "@patternfly/react-icons";
import { useAuth } from "auth/authContext";

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

interface HeaderProps {
  toggleSidebarVisibility: VoidFunction;
}

function Header({ toggleSidebarVisibility }: HeaderProps) {
  const { identity, logout, changeCurrentTeam } = useAuth();
  const navigate = useNavigate();
  if (identity === null) return null;
  const identityTeams = values(identity.teams);

  const dropdownUserLinks = [
    <DropdownItem
      key="dropdown_user_settings"
      component="button"
      onClick={() => navigate("/currentUser/settings")}
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
  ];

  const dropdownTeamsLinks = identityTeams.map((team) => (
    <DropdownItem
      key={team.name}
      component="button"
      onClick={() => changeCurrentTeam(team, identity)}
    >
      {team.name}
    </DropdownItem>
  ));

  return (
    <Masthead id="masthead">
      <MastheadToggle>
        <Button
          variant="plain"
          onClick={toggleSidebarVisibility}
          aria-label="Global navigation"
        >
          <BarsIcon />
        </Button>
      </MastheadToggle>
      <MastheadMain>
        <MastheadBrand onClick={() => navigate("/")}>
          <img src={Logo} alt="DCI Logo" />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar id="toolbar" isFullHeight isStatic>
          <ToolbarContent>
            <ToolbarGroup
              variant="icon-button-group"
              alignment={{ default: "alignRight" }}
              spacer={{ default: "spacerNone", md: "spacerMd" }}
            >
              <ToolbarItem>
                <Button
                  component="a"
                  variant="link"
                  href="https://docs.distributed-ci.io/"
                  target="top"
                  aria-label="Link to Distributed CI Documentation page"
                  style={{ color: "white" }}
                >
                  <HelpIcon />
                </Button>
              </ToolbarItem>
              <ToolbarItem
                visibility={{
                  default: "visible",
                  md: "hidden",
                  lg: "hidden",
                  xl: "hidden",
                  "2xl": "hidden",
                }}
              >
                <MenuDropdown
                  position={DropdownPosition.right}
                  title={<UserIcon />}
                  dropdownItems={dropdownUserLinks}
                />
              </ToolbarItem>
              <ToolbarItem visibility={{ default: "hidden", md: "visible" }}>
                <MenuDropdown
                  position={DropdownPosition.right}
                  title={
                    <span>
                      <UserIcon className="mr-md" />
                      {identity.fullname || identity.name}
                    </span>
                  }
                  dropdownItems={dropdownUserLinks}
                />
              </ToolbarItem>
              {identityTeams.length > 1 && (
                <>
                  <ToolbarItem
                    visibility={{
                      default: "visible",
                      md: "hidden",
                      lg: "hidden",
                      xl: "hidden",
                      "2xl": "hidden",
                    }}
                  >
                    <MenuDropdown
                      position={DropdownPosition.right}
                      title={<UsersIcon />}
                      dropdownItems={dropdownTeamsLinks}
                    />
                  </ToolbarItem>
                  <ToolbarItem
                    visibility={{ default: "hidden", md: "visible" }}
                  >
                    <MenuDropdown
                      position={DropdownPosition.right}
                      title={
                        <span>
                          <UsersIcon className="mr-md" />
                          {identity.team && identity.team.name}
                        </span>
                      }
                      dropdownItems={dropdownTeamsLinks}
                    />
                  </ToolbarItem>
                </>
              )}
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );
}

function DCINavItem({
  children,
  to,
  ...props
}: {
  children: React.ReactNode;
  to: string;
  exact?: boolean;
}) {
  const location = useLocation();
  const path = useResolvedPath(to);
  const isActive = location.pathname.startsWith(path.pathname);
  return (
    <NavItem isActive={isActive}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </NavItem>
  );
}

interface SidebarProps {
  isNavOpen: boolean;
}

function Sidebar({ isNavOpen }: SidebarProps) {
  const { identity } = useAuth();
  if (identity === null) return null;
  const identityTeams = values(identity.teams);
  const PageNav = (
    <Nav aria-label="Nav" theme="dark">
      <NavGroup title="DCI">
        <DCINavItem to="/analytics">Analytics</DCINavItem>
        <DCINavItem to="/jobs">Jobs</DCINavItem>
        <DCINavItem to="/products">Products</DCINavItem>
        <DCINavItem to="/topics">Topics</DCINavItem>
        {isEmpty(identityTeams) ? null : (
          <DCINavItem to="/remotecis">Remotecis</DCINavItem>
        )}
      </NavGroup>
      <NavGroup title="User Preferences">
        <DCINavItem to="/currentUser/settings">Settings</DCINavItem>
        <DCINavItem to="/currentUser/notifications">Notifications</DCINavItem>
      </NavGroup>
      {identity.hasEPMRole && (
        <NavGroup title="Administration">
          <DCINavItem to="/teams">Teams</DCINavItem>
          <DCINavItem to="/users">Users</DCINavItem>
          <DCINavItem to="/permissions/products">Permissions</DCINavItem>
          {identity.isSuperAdmin && (
            <DCINavItem to="/feeders">Feeders</DCINavItem>
          )}
        </NavGroup>
      )}
    </Nav>
  );
  return <PageSidebar nav={PageNav} theme="dark" isNavOpen={isNavOpen} />;
}

export default function AuthenticatedLayout({ ...props }) {
  const [isNavOpen, setIsNavOpen] = useState(window.innerWidth >= 1450);
  const { identity } = useAuth();
  const location = useLocation();

  if (identity === null) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Page
      header={
        <Header toggleSidebarVisibility={() => setIsNavOpen(!isNavOpen)} />
      }
      sidebar={<Sidebar isNavOpen={isNavOpen} />}
      isManagedSidebar={false}
      onPageResize={({ windowSize }) => {
        if (windowSize >= 1450) {
          setIsNavOpen(true);
        } else {
          setIsNavOpen(false);
        }
      }}
      {...props}
    >
      <Outlet />
    </Page>
  );
}
