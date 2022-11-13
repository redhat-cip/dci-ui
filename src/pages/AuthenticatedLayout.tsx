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
  Avatar,
  ApplicationLauncher,
  ApplicationLauncherItem,
  Text,
  TextVariants,
  Tooltip,
} from "@patternfly/react-core";
import Logo from "logo.min.svg";
import {
  BarsIcon,
  QuestionCircleIcon,
  UserIcon,
  UsersIcon,
} from "@patternfly/react-icons";
import { useAuth } from "auth/authContext";
import avatarImg from "@patternfly/react-core/src/components/Avatar/examples/avatarImg.svg";
import { ICurrentUser, ITeam } from "types";
import { global_link_Color_light } from "@patternfly/react-tokens";

function TeamSelect({
  currentUser,
  onTeamSelected,
}: {
  currentUser: ICurrentUser;
  onTeamSelected: (team: ITeam) => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <ApplicationLauncher
      onSelect={() => setIsDropdownOpen(!isDropdownOpen)}
      onToggle={setIsDropdownOpen}
      isOpen={isDropdownOpen}
      items={Object.values(currentUser.teams).map((team) => (
        <ApplicationLauncherItem
          key={team.name}
          component="button"
          onClick={() => onTeamSelected(team)}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>{team.name}</span>
            {currentUser.team?.id === team.id && (
              <span
                className="ml-xs"
                style={{
                  backgroundColor: global_link_Color_light.value,
                  height: "5px",
                  width: "5px",
                  borderRadius: "50%",
                }}
              />
            )}
          </div>
        </ApplicationLauncherItem>
      ))}
      toggleIcon={<UsersIcon />}
    />
  );
}

interface HeaderProps {
  toggleSidebarVisibility: VoidFunction;
}

function Header({ toggleSidebarVisibility }: HeaderProps) {
  const { identity, logout, changeCurrentTeam } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isKebabDropdownOpen, setIsKebabDropdownOpen] = useState(false);

  const navigate = useNavigate();
  if (identity === null) return null;

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
              <ToolbarGroup variant="icon-button-group">
                <ToolbarItem>
                  <TeamSelect
                    currentUser={identity}
                    onTeamSelected={(team) => changeCurrentTeam(team, identity)}
                  />
                </ToolbarItem>
                <ToolbarItem>
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
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarItem
                visibility={{
                  md: "hidden",
                }}
              >
                <Dropdown
                  isPlain
                  position={DropdownPosition.right}
                  onSelect={() => setIsKebabDropdownOpen(!isKebabDropdownOpen)}
                  toggle={
                    <DropdownToggle
                      toggleIndicator={null}
                      onToggle={setIsKebabDropdownOpen}
                    >
                      <UserIcon />
                    </DropdownToggle>
                  }
                  isOpen={isKebabDropdownOpen}
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
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarItem visibility={{ default: "hidden", md: "visible" }}>
              <Dropdown
                isFullHeight
                isOpen={isDropdownOpen}
                position={DropdownPosition.right}
                onSelect={() => setIsDropdownOpen(!isDropdownOpen)}
                toggle={
                  <DropdownToggle
                    icon={<Avatar src={avatarImg} alt="Avatar" />}
                    onToggle={setIsDropdownOpen}
                  >
                    {identity.fullname || identity.name}
                  </DropdownToggle>
                }
                dropdownItems={[
                  <DropdownItem key="team" component="div" isPlainText>
                    <Text component={TextVariants.small}>Email:</Text>
                    <Text>{identity.email}</Text>
                  </DropdownItem>,
                  <DropdownItem key="team" component="div" isPlainText>
                    <Text component={TextVariants.small}>
                      Team:
                      <Tooltip
                        position="left"
                        content={
                          <div>
                            The team used in DCI. To change team, click the{" "}
                            <UsersIcon className="mr-xs" />
                            icon in the top menu. If you don't have a team,
                            contact DCI or your EPM.
                          </div>
                        }
                      >
                        <span className="ml-xs">
                          <QuestionCircleIcon />
                        </span>
                      </Tooltip>
                    </Text>
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
            </ToolbarItem>
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
        <DCINavItem to="/currentUser/settings">My profile</DCINavItem>
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
