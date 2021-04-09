import React from "react";
import Loadable from "react-loadable";
import DashboardPage from "./dashboard/DashboardPage";
import DashboardDetailsPage from "./dashboard/DashboardDetailsPage";
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
import UsersPage from "./users/UsersPage";
import EditUserPage from "./users/edit/EditUserPage";
import CreateFeederPage from "./feeders/create/CreateFeederPage";
import EditFeederPage from "./feeders/edit/EditFeederPage";
import SettingsPage from "./currentUser/settings/SettingsPage";
import NotificationsPage from "./currentUser/notifications/NotificationsPage";
import PermissionsPage from "./permissions/PermissionsPage";
import LoadingPage from "./layout/LoadingPage";
import NotAuthenticatedLoadingPage from "./layout/NotAuthenticatedLoadingPage";
import LoginPage from "./auth/LoginPage";
import LoginCallbackPage from "./auth/LoginCallbackPage";
import SilentRedirectPage from "./auth/SilentRedirectPage";
import Page404 from "./layout/Page404";

const TrendsPage = Loadable({
  loader: () => import("./stats/trends/TrendsPage"),
  loading: () => <LoadingPage title="Trend" />,
});

const PerformancePage = Loadable({
  loader: () => import("./stats/performance/PerformancePage"),
  loading: () => <LoadingPage title="Performance" />,
});

export default {
  DashboardPage,
  DashboardDetailsPage,
  JobsPage,
  JobPage,
  FilePage,
  PerformancePage,
  ProductsPage,
  TopicsPage,
  TopicPage,
  ComponentPage,
  RemotecisPage,
  FeedersPage,
  CreateFeederPage,
  EditFeederPage,
  TeamsPage,
  UsersPage,
  EditUserPage,
  PermissionsPage,
  SettingsPage,
  NotificationsPage,
  NotAuthenticatedLoadingPage,
  LoginPage,
  LoginCallbackPage,
  SilentRedirectPage,
  TrendsPage,
  Page404,
};
