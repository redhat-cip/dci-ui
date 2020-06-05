import React from "react";
import Loadable from "react-loadable";
import JobsPage from "./jobs/JobsPage";
import JobPage from "./jobs/JobPage";
import GlobalStatusPage from "./stats/globalStatus/GlobalStatusPage";
import ProductsPage from "./products/ProductsPage";
import TopicsPage from "./topics/TopicsPage";
import TopicPage from "./topics/TopicPage";
import RemotecisPage from "./remotecis/RemotecisPage";
import FeedersPage from "./feeders/FeedersPage";
import TeamsPage from "./teams/TeamsPage";
import UsersPage from "./users/UsersPage";
import EditUserPage from "./users/EditUserPage";
import CreateUserPage from "./users/CreateUserPage";
import SettingsPage from "./currentUser/settings/SettingsPage";
import NotificationsPage from "./currentUser/notifications/NotificationsPage";
import PermissionsPage from "./permissions/PermissionsPage";
import LoadingPage from "./layout/LoadingPage";
import NotAuthenticatedLoadingPage from "./layout/NotAuthenticatedLoadingPage";
import LoginPage from "./auth/LoginPage";
import LoginCallbackPage from "./auth/LoginCallbackPage";
import SilentRedirectPage from "./auth/SilentRedirectPage";
import LogoutPage from "./auth/LogoutPage";
import Page404 from "./layout/Page404";

const TrendsPage = Loadable({
  loader: () => import("./stats/trends/TrendsPage"),
  loading: () => <LoadingPage title="Trend" />
});

const PerformancePage = Loadable({
  loader: () => import("./stats/performance/PerformancePage"),
  loading: () => <LoadingPage title="Performance" />
});

export default {
  JobsPage,
  JobPage,
  GlobalStatusPage,
  PerformancePage,
  ProductsPage,
  TopicsPage,
  TopicPage,
  RemotecisPage,
  FeedersPage,
  TeamsPage,
  UsersPage,
  EditUserPage,
  CreateUserPage,
  PermissionsPage,
  SettingsPage,
  NotificationsPage,
  NotAuthenticatedLoadingPage,
  LoginPage,
  LoginCallbackPage,
  LogoutPage,
  SilentRedirectPage,
  TrendsPage,
  Page404
};
