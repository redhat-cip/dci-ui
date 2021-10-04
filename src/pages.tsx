import JobsPage from "./jobs/JobsPage";
import JobPage from "./jobs/JobPage";
import FilePage from "./jobs/files/FilePage";
import ProductsPage from "./products/ProductsPage";
import TopicsPage from "./topics/TopicsPage";
import TopicPage from "./topics/TopicPage";
import ComponentPage from "./component/ComponentPage";
import RemotecisPage from "./remotecis/RemotecisPage";
import FeedersPage from "./feeders/FeedersPage";
import TeamsPage from "./teams/TeamsPage";
import TeamPage from "./teams/TeamPage";
import UsersPage from "./users/UsersPage";
import EditUserPage from "./users/edit/EditUserPage";
import CreateFeederPage from "./feeders/create/CreateFeederPage";
import EditFeederPage from "./feeders/edit/EditFeederPage";
import SettingsPage from "./currentUser/settings/SettingsPage";
import NotificationsPage from "./currentUser/notifications/NotificationsPage";
import PermissionsPage from "./permissions/PermissionsPage";
import NotAuthenticatedLoadingPage from "./layout/NotAuthenticatedLoadingPage";
import LoginPage from "./auth/LoginPage";
import Page404 from "./layout/Page404";
import TasksDurationPerJobPage from "./analytics/TasksDurationPerJob/TasksDurationPerJobPage";
import AnalyticsPage from "./analytics/AnalyticsPage";
import LatestJobStatusPage from "./analytics/LatestJobStatus/LatestJobStatusPage";
import LatestJobStatusDetailsPage from "./analytics/LatestJobStatus/LatestJobStatusDetailsPage";

const Pages = {
  AnalyticsPage,
  TasksDurationPerJobPage,
  LatestJobStatusPage,
  LatestJobStatusDetailsPage,
  JobsPage,
  JobPage,
  FilePage,
  ProductsPage,
  TopicsPage,
  TopicPage,
  ComponentPage,
  RemotecisPage,
  FeedersPage,
  CreateFeederPage,
  EditFeederPage,
  TeamsPage,
  TeamPage,
  UsersPage,
  EditUserPage,
  PermissionsPage,
  SettingsPage,
  NotificationsPage,
  NotAuthenticatedLoadingPage,
  LoginPage,
  Page404,
};

export default Pages;
