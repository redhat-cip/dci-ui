import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import "./ui/styles";
import "./css/alignment.css";
import "./css/spacing.css";
import "./css/flex.css";
import Pages from "./pages";
import Alerts from "./alerts/Alerts";
import PrivateRoute from "auth/PrivateRoute";

export default function App() {
  return (
    <>
      <Alerts />
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
          <PrivateRoute path="/dashboard" exact>
            <Pages.DashboardPage />
          </PrivateRoute>
          <PrivateRoute path="/dashboard/:topic_name" exact>
            <Pages.DashboardDetailsPage />
          </PrivateRoute>
          <Redirect from="/" exact to="/jobs" />
          <PrivateRoute path="/jobs" exact>
            <Pages.JobsPage />
          </PrivateRoute>
          <Redirect from="/jobs/:id" exact to="/jobs/:id/jobStates" />
          <PrivateRoute path="/jobs/:id/:endpoint">
            <Pages.JobPage />
          </PrivateRoute>
          <PrivateRoute path="/files/:id">
            <Pages.FilePage />
          </PrivateRoute>
          <PrivateRoute path="/trends">
            <Pages.TrendsPage />
          </PrivateRoute>
          <PrivateRoute path="/performance">
            <Pages.PerformancePage />
          </PrivateRoute>
          <PrivateRoute path="/products">
            <Pages.ProductsPage />
          </PrivateRoute>
          <PrivateRoute path="/topics" exact>
            <Pages.TopicsPage />
          </PrivateRoute>
          <PrivateRoute path="/components/:id">
            <Pages.ComponentPage />
          </PrivateRoute>
          <PrivateRoute path="/topics/:id/components">
            <Pages.TopicPage />
          </PrivateRoute>
          <PrivateRoute path="/remotecis">
            <Pages.RemotecisPage />
          </PrivateRoute>
          <PrivateRoute path="/feeders/create" exact>
            <Pages.CreateFeederPage />
          </PrivateRoute>
          <PrivateRoute path="/feeders/:id">
            <Pages.EditFeederPage />
          </PrivateRoute>
          <PrivateRoute path="/feeders">
            <Pages.FeedersPage />
          </PrivateRoute>
          <PrivateRoute path="/teams">
            <Pages.TeamsPage />
          </PrivateRoute>
          <PrivateRoute path="/users" exact>
            <Pages.UsersPage />
          </PrivateRoute>
          <PrivateRoute path="/users/create" exact>
            <Pages.CreateUserPage />
          </PrivateRoute>
          <PrivateRoute path="/users/:id">
            <Pages.EditUserPage />
          </PrivateRoute>
          <PrivateRoute path="/currentUser/settings">
            <Pages.SettingsPage />
          </PrivateRoute>
          <PrivateRoute path="/currentUser/notifications">
            <Pages.NotificationsPage />
          </PrivateRoute>
          <PrivateRoute path="/permissions">
            <Pages.PermissionsPage />
          </PrivateRoute>
          <Route path="/login" component={Pages.LoginPage} />
          <Route path="/login_callback" component={Pages.LoginCallbackPage} />
          <Route path="/silent_redirect" component={Pages.SilentRedirectPage} />
          <Route component={Pages.Page404} />
        </Switch>
      </BrowserRouter>
    </>
  );
}
