import JobsPage from "./jobs/JobsPage";
import JobPage from "jobs/job/JobPage";
import JobStatesPage from "jobs/job/jobStates/JobStatesPage";
import JobTestsPage from "jobs/job/tests/JobTestsPage";
import JobFilesPage from "jobs/job/files/JobFilesPage";
import JobSettingsPage from "jobs/job/settings/JobSettingsPage";
import FilePage from "./jobs/job/files/FilePage";
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
import LoginCallbackPage from "./auth/LoginCallbackPage";
import SilentRedirectPage from "./auth/SilentRedirectPage";
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
  JobStatesPage,
  JobTestsPage,
  JobFilesPage,
  JobSettingsPage,
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
  LoginCallbackPage,
  SilentRedirectPage,
  Page404,
};

export default Pages;
