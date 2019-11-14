import React from "react";
import Loadable from "react-loadable";
import JobsPage from "./jobs/JobsPage";
import JobPage from "./jobs/JobPage";
import GlobalStatusPage from "./stats/globalStatus/GlobalStatusPage";
import ProductsPage from "./products/ProductsPage";
import TopicsPage from "./topics/TopicsPage";
import ComponentsPage from "./components/ComponentsPage";
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
import LoginPage from "./login/LoginPage";

const TrendsPage = Loadable({
  loader: () => import("./stats/trends/TrendsPage"),
  loading: () => <LoadingPage title="Trend" />
});

export default {
  JobsPage,
  JobPage,
  GlobalStatusPage,
  ProductsPage,
  TopicsPage,
  ComponentsPage,
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
  TrendsPage
};
