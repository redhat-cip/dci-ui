import React from "react";
import Loadable from "react-loadable";
import JobsPage from "./jobs/JobsPage";
import JobPage from "./jobs/JobPage";
import GlobalStatusPage from "./globalStatus/GlobalStatusPage";
import TopicsPage from "./topics/TopicsPage";
import ComponentsPage from "./components/ComponentsPage";
import RemotecisPage from "./remotecis/RemotecisPage";
import NotificationsPage from "./remotecis/NotificationsPage";
import ProductsPage from "./products/ProductsPage";
import TeamsPage from "./teams/TeamsPage";
import UsersPage from "./users/UsersPage";
import EditUserPage from "./users/EditUserPage";
import CreateUserPage from "./users/CreateUserPage";
import ProfilePage from "./profile/ProfilePage";
import PermissionsPage from "./permissions/PermissionsPage";
import LoadingPage from "./layout/LoadingPage";
import NotAuthenticatedLoadingPage from "./layout/NotAuthenticatedLoadingPage";
import LoginPage from "./login/LoginPage";

const TrendsPage = Loadable({
  loader: () => import("./trends/TrendsPage"),
  loading: () => <LoadingPage title="Trend" />
});

export default {
  JobsPage,
  JobPage,
  GlobalStatusPage,
  TopicsPage,
  ComponentsPage,
  RemotecisPage,
  ProductsPage,
  TeamsPage,
  UsersPage,
  EditUserPage,
  CreateUserPage,
  PermissionsPage,
  ProfilePage,
  NotificationsPage,
  NotAuthenticatedLoadingPage,
  LoginPage,
  TrendsPage
};
