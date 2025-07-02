import { useState } from "react";
import {
  Link,
  useNavigate,
  useResolvedPath,
  useLocation,
  Outlet,
  Navigate,
} from "react-router";
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
  MastheadLogo,
  MastheadBrand,
  MastheadContent,
  ToolbarContent,
  Content,
  ContentVariants,
  PageSidebarBody,
  ToggleGroup,
  ToggleGroupItem,
  Brand,
  Dropdown,
  DropdownItem,
  DropdownList,
  Divider,
  MenuToggle,
  type MenuToggleElement,
} from "@patternfly/react-core";
import Logo from "logo.black.svg";
import LogoWhite from "logo.white.svg";
import {
  BarsIcon,
  ExternalLinkAltIcon,
  QuestionCircleIcon,
  UserIcon,
} from "@patternfly/react-icons";
import { useTheme } from "ui/Theme/themeContext";
import NotAuthenticatedLoadingPage from "./NotAuthenticatedLoadingPage";
import { loggedOut } from "auth/authSlice";
import { useAppDispatch } from "store";
import { useAuth } from "auth/authSelectors";
import { useGetCurrentUserQuery } from "auth/authApi";
import { ProfilePageUrl } from "auth/sso";
import { changeCurrentTeam } from "teams/teamLocalStorage";

function UserDropdownMenuMobile() {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Dropdown
      isPlain
      isOpen={isOpen}
      popperProps={{
        position: "right",
      }}
      onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          onClick={() => setIsOpen(!isOpen)}
          isExpanded={isOpen}
        >
          <UserIcon />
        </MenuToggle>
      )}
    >
      <DropdownList>
        <DropdownItem
          key="dropdown_kebab_settings"
          component="a"
          isExternalLink
          to={ProfilePageUrl}
        >
          My profile
        </DropdownItem>
        <DropdownItem
          key="dropdown_kebab_logout"
          component="button"
          onClick={() => {
            dispatch(loggedOut());
            navigate("/login");
          }}
        >
          Log out
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
}

function UserDropdownMenu() {
  const dispatch = useAppDispatch();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (currentUser === null) return null;

  return (
    <Dropdown
      isOpen={isOpen}
      popperProps={{
        position: "right",
      }}
      onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          isFullHeight
          ref={toggleRef}
          onClick={() => setIsOpen(!isOpen)}
          isExpanded={isOpen}
        >
          {currentUser.fullname || currentUser.name}
        </MenuToggle>
      )}
    >
      <DropdownList>
        <DropdownItem key="email" component="div" isDisabled>
          <Content component={ContentVariants.small}>Email:</Content>
          <Content component="p">{currentUser.email}</Content>
        </DropdownItem>
        <DropdownItem key="team" component="div" isDisabled>
          <Content component={ContentVariants.small}>Team:</Content>
          <Content component="p">
            {currentUser.team ? currentUser.team.name : "no team"}
          </Content>
        </DropdownItem>
        <Divider component="li" />
        <DropdownItem
          key="dropdown_user_settings"
          component="a"
          isExternalLink
          to={ProfilePageUrl}
        >
          My profile
        </DropdownItem>
        <DropdownItem
          key="dropdown_user_logout"
          component="button"
          onClick={() => {
            dispatch(loggedOut());
            navigate("/login");
          }}
        >
          Log out
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
}

function UserTeamToolbarItem() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (currentUser === null) return null;
  if (currentUser.teams.length === 0) return null;

  const currentTeam = currentUser.team;
  if (currentUser.teams.length === 1) {
    return (
      <ToolbarItem style={{ padding: "0.5rem" }}>
        Team {currentTeam?.name}
      </ToolbarItem>
    );
  }

  return (
    <ToolbarItem>
      <Dropdown
        isOpen={isOpen}
        onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle
            isFullHeight
            ref={toggleRef}
            onClick={() => setIsOpen(!isOpen)}
            isExpanded={isOpen}
          >
            Team {currentTeam?.name}
          </MenuToggle>
        )}
      >
        <DropdownList>
          <DropdownItem component="div" isDisabled>
            <Content component={ContentVariants.small}>Change team:</Content>
          </DropdownItem>
          {currentUser.teams.map((team) => (
            <DropdownItem
              key={team.id}
              isDisabled={currentTeam?.id === team.id}
              component="button"
              onClick={() => {
                changeCurrentTeam(team);
                window.location.replace(location.pathname);
              }}
            >
              {team.name}
            </DropdownItem>
          ))}
        </DropdownList>
      </Dropdown>
    </ToolbarItem>
  );
}

function DCIDocLinkIcon() {
  return (
    <Button
      icon={<QuestionCircleIcon />}
      component="a"
      variant="plain"
      href="https://docs.distributed-ci.io/"
      target="top"
      aria-label="Link to Distributed CI Documentation page"
      style={{ color: "white" }}
    ></Button>
  );
}

interface HeaderProps {
  toggleSidebarVisibility: VoidFunction;
}

function Header({ toggleSidebarVisibility }: HeaderProps) {
  const navigate = useNavigate();
  const { isDark, toggleColor } = useTheme();
  const { currentUser } = useAuth();

  if (currentUser === null) return null;

  return (
    <>
      <Masthead id="masthead">
        <MastheadMain>
          <MastheadToggle>
            <Button
              icon={<BarsIcon />}
              variant="plain"
              onClick={toggleSidebarVisibility}
              aria-label="Global navigation"
            />
          </MastheadToggle>
          <MastheadBrand data-codemods>
            <MastheadLogo
              data-codemods
              component="a"
              onClick={() => navigate("/")}
            >
              <Brand
                src={isDark ? LogoWhite : Logo}
                alt="DCI Logo"
                heights={{ default: "36px" }}
              />
            </MastheadLogo>
          </MastheadBrand>
        </MastheadMain>
        <MastheadContent>
          <Toolbar id="toolbar" isFullHeight>
            <ToolbarContent>
              <ToolbarGroup
                variant="action-group-plain"
                align={{ default: "alignEnd" }}
                gap={{ default: "gapNone" }}
                visibility={{ md: "hidden" }}
              >
                <ToolbarItem>
                  <DCIDocLinkIcon />
                </ToolbarItem>
                <ToolbarItem>
                  <UserDropdownMenuMobile />
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarGroup
                align={{ default: "alignEnd" }}
                gap={{ default: "gapMd" }}
                visibility={{ default: "hidden", md: "visible" }}
              >
                <ToolbarItem>
                  <ToggleGroup aria-label="toggle-theme-switch">
                    <ToggleGroupItem
                      icon={
                        <svg
                          className="pf-v6-svg"
                          viewBox="0 0 512 512"
                          fill="currentColor"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                        >
                          <path d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z"></path>
                        </svg>
                      }
                      aria-label="light-theme-toggle"
                      isSelected={!isDark}
                      onChange={toggleColor}
                    />
                    <ToggleGroupItem
                      icon={
                        <svg
                          className="pf-v6-svg"
                          viewBox="0 0 512 512"
                          fill="currentColor"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                        >
                          <path d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z"></path>
                        </svg>
                      }
                      aria-label="dark-theme-toggle"
                      isSelected={isDark}
                      onChange={toggleColor}
                    />
                  </ToggleGroup>
                </ToolbarItem>
                <ToolbarItem>
                  <DCIDocLinkIcon />
                </ToolbarItem>
                <UserTeamToolbarItem />
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
  const { currentUser } = useAuth();
  if (currentUser === null) return null;
  const currentUserTeams = Object.values(currentUser.teams);
  const PageNav = (
    <Nav aria-label="Nav">
      <NavGroup title="DCI">
        <DCINavItem to="/analytics">Analytics</DCINavItem>
        <DCINavItem to="/jobs">Jobs</DCINavItem>
        <DCINavItem to="/products">Products</DCINavItem>
        <DCINavItem to="/topics">Topics</DCINavItem>
        <DCINavItem to="/components">Components</DCINavItem>
        {currentUserTeams.length === 0 ? null : (
          <DCINavItem to="/remotecis">Remotecis</DCINavItem>
        )}
      </NavGroup>
      <NavGroup title=" User Preferences">
        <NavItem>
          <a target="_blank" rel="noopener noreferrer" href={ProfilePageUrl}>
            My profile <ExternalLinkAltIcon style={{ height: "0.8em" }} />
          </a>
        </NavItem>
        <DCINavItem to="/notifications">Notifications</DCINavItem>
      </NavGroup>
      {currentUser.hasEPMRole && (
        <NavGroup title="Administration">
          <DCINavItem to="/teams">Teams</DCINavItem>
          <DCINavItem to="/users">Users</DCINavItem>
          {currentUser.isSuperAdmin && (
            <DCINavItem to="/feeders">Feeders</DCINavItem>
          )}
        </NavGroup>
      )}
    </Nav>
  );
  return (
    <PageSidebar isSidebarOpen={isNavOpen}>
      <PageSidebarBody>{PageNav}</PageSidebarBody>
    </PageSidebar>
  );
}

export default function AuthenticatedLayout({ ...props }) {
  const [isNavOpen, setIsNavOpen] = useState(window.innerWidth >= 1450);
  const { data: currentUser, isLoading } = useGetCurrentUserQuery();
  const location = useLocation();

  if (isLoading) {
    return <NotAuthenticatedLoadingPage />;
  }

  return currentUser ? (
    <Page
      masthead={
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
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
}
