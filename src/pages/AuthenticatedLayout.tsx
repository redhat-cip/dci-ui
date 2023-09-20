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
  Text,
  TextVariants,
  PageSidebarBody,
  Switch,
} from "@patternfly/react-core";
import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator,
  DropdownPosition,
} from "@patternfly/react-core/deprecated";
import Logo from "logo.min.svg";
import {
  BarsIcon,
  QuestionCircleIcon,
  UserIcon,
  UsersIcon,
} from "@patternfly/react-icons";
import {
  global_palette_black_100,
  global_palette_black_500,
  global_palette_black_800,
} from "@patternfly/react-tokens";
import { useAuth } from "auth/authContext";
import styled from "styled-components";
import { useTheme } from "ui/Theme/themeContext";

const ToolbarItemStyledLikeDropdown = styled(ToolbarItem)<{ isDark: boolean }>`
  &:after {
    background-color: ${({ isDark }) =>
      isDark ? global_palette_black_800.value : global_palette_black_100.value};
  }
`;

function UserDropdownMenuMobile() {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Dropdown
      isPlain
      position={DropdownPosition.right}
      onSelect={() => setIsOpen(!isOpen)}
      toggle={
        <DropdownToggle
          toggleIndicator={null}
          onToggle={(_event, val) => setIsOpen(val)}
        >
          <UserIcon />
        </DropdownToggle>
      }
      isOpen={isOpen}
      dropdownItems={[
        <DropdownItem
          key="dropdown_kebab_settings"
          component="button"
          onClick={() => navigate("/currentUser/settings")}
        >
          My profile
        </DropdownItem>,
        <DropdownItem
          key="dropdown_kebab_logout"
          component="button"
          onClick={() => {
            logout();
          }}
        >
          Log out
        </DropdownItem>,
      ]}
    />
  );
}

function UserDropdownMenu() {
  const { identity, logout, openChangeTeamModal, hasMultipleTeams } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (identity === null) return null;

  return (
    <Dropdown
      isFullHeight
      isOpen={isOpen}
      position={DropdownPosition.right}
      onSelect={() => setIsOpen(!isOpen)}
      toggle={
        <DropdownToggle onToggle={(_event, val) => setIsOpen(val)}>
          {identity.fullname || identity.name}
        </DropdownToggle>
      }
      dropdownItems={[
        <DropdownItem key="email" component="div" isPlainText>
          <Text component={TextVariants.small}>Email:</Text>
          <Text>{identity.email}</Text>
        </DropdownItem>,
        <DropdownItem
          key="team"
          onClick={() => hasMultipleTeams && openChangeTeamModal()}
          isPlainText={!hasMultipleTeams}
          style={{
            cursor: hasMultipleTeams ? "cursor" : "default",
          }}
        >
          <Text component={TextVariants.small}>Team:</Text>
          <Text>{identity.team ? identity.team.name : ""}</Text>
        </DropdownItem>,
        <DropdownSeparator key="dropdown_user_separator" />,
        <DropdownItem
          key="dropdown_user_settings"
          component="button"
          onClick={() => navigate("/currentUser/settings")}
        >
          My profile
        </DropdownItem>,
        <DropdownItem
          key="dropdown_user_logout"
          component="button"
          onClick={() => {
            logout();
          }}
        >
          Log out
        </DropdownItem>,
      ]}
    />
  );
}

function DCIDocLinkIcon() {
  return (
    <Button
      component="a"
      variant="link"
      href="https://docs.distributed-ci.io/"
      target="top"
      aria-label="Link to Distributed CI Documentation page"
      style={{ color: "white" }}
    >
      <QuestionCircleIcon />
    </Button>
  );
}

interface HeaderProps {
  toggleSidebarVisibility: VoidFunction;
}

function Header({ toggleSidebarVisibility }: HeaderProps) {
  const navigate = useNavigate();
  const { isDark, toggleColor } = useTheme();
  const { identity, openChangeTeamModal, hasAtLeastOneTeam, hasMultipleTeams } =
    useAuth();

  if (identity === null) {
    return null;
  }

  return (
    <>
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
          <MastheadBrand component="a" onClick={() => navigate("/")}>
            <img src={Logo} alt="DCI Logo" />
          </MastheadBrand>
        </MastheadMain>
        <MastheadContent>
          <Toolbar id="toolbar" isFullHeight>
            <ToolbarContent>
              <ToolbarGroup
                variant="icon-button-group"
                align={{ default: "alignRight" }}
                spacer={{ default: "spacerNone" }}
                visibility={{ md: "hidden" }}
              >
                <ToolbarItem>
                  <DCIDocLinkIcon />
                </ToolbarItem>
                {hasMultipleTeams && (
                  <ToolbarItem>
                    <Button
                      variant="plain"
                      onClick={() => openChangeTeamModal()}
                    >
                      <UsersIcon />
                    </Button>
                  </ToolbarItem>
                )}
                <ToolbarItem>
                  <UserDropdownMenuMobile />
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarGroup
                align={{ default: "alignRight" }}
                spacer={{ default: "spacerMd" }}
                visibility={{ default: "hidden", md: "visible" }}
              >
                <ToolbarItem>
                  <Switch
                    id="toggle-theme-switch"
                    label="Dark theme"
                    isChecked={isDark}
                    onChange={toggleColor}
                  />
                </ToolbarItem>
                <ToolbarItemStyledLikeDropdown
                  isDark={isDark}
                  variant="separator"
                />
                <ToolbarItem>
                  <DCIDocLinkIcon />
                </ToolbarItem>
                {hasAtLeastOneTeam && (
                  <>
                    <ToolbarItemStyledLikeDropdown
                      isDark={isDark}
                      variant="separator"
                    />
                    <ToolbarItem>
                      <Button
                        variant="plain"
                        onClick={() =>
                          hasMultipleTeams && openChangeTeamModal()
                        }
                        style={{
                          cursor: hasMultipleTeams ? "cursor" : "default",
                        }}
                      >
                        {identity.team?.name}
                      </Button>
                    </ToolbarItem>
                  </>
                )}
                <ToolbarItem>
                  <UserDropdownMenu />
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarContent>
          </Toolbar>
        </MastheadContent>
      </Masthead>
    </>
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
  const { isDark } = useTheme();
  if (identity === null) return null;
  const identityTeams = values(identity.teams);
  const PageNav = (
    <Nav aria-label="Nav" theme={isDark ? "dark" : "light"}>
      <NavGroup
        // @ts-ignore
        title={
          <span style={{ color: global_palette_black_500.value }}>DCI</span>
        }
      >
        <DCINavItem to="/analytics">Analytics</DCINavItem>
        <DCINavItem to="/jobs">Jobs</DCINavItem>
        <DCINavItem to="/products">Products</DCINavItem>
        <DCINavItem to="/topics">Topics</DCINavItem>
        {isEmpty(identityTeams) ? null : (
          <DCINavItem to="/remotecis">Remotecis</DCINavItem>
        )}
      </NavGroup>
      <NavGroup
        // @ts-ignore
        title={
          <span style={{ color: global_palette_black_500.value }}>
            User Preferences
          </span>
        }
      >
        <DCINavItem to="/currentUser/settings">My profile</DCINavItem>
        <DCINavItem to="/currentUser/notifications">Notifications</DCINavItem>
      </NavGroup>
      {identity.hasEPMRole && (
        <NavGroup
          // @ts-ignore
          title={
            <span style={{ color: global_palette_black_500.value }}>
              Administration
            </span>
          }
        >
          <DCINavItem to="/teams">Teams</DCINavItem>
          <DCINavItem to="/users">Users</DCINavItem>
          {identity.isSuperAdmin && (
            <DCINavItem to="/feeders">Feeders</DCINavItem>
          )}
        </NavGroup>
      )}
    </Nav>
  );
  return (
    <PageSidebar theme={isDark ? "dark" : "light"} isSidebarOpen={isNavOpen}>
      <PageSidebarBody>{PageNav}</PageSidebarBody>
    </PageSidebar>
  );
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
      onPageResize={(_event, { windowSize }) => {
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
