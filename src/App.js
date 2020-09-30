import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "./App.css";
import "./ui/styles";
import "./css/alignment.css";
import "./css/spacing.css";
import "./css/flex.css";
import Pages from "./pages";
import Alerts from "./alerts/Alerts";
import { BackgroundImage } from "./ui";
import withAuthentication from "./auth/withAuthentication";

const PrivateRoute = withAuthentication(Route);

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Alerts />
        <BackgroundImage />
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Switch>
            <PrivateRoute
              path="/dashboard"
              exact
              component={Pages.DashboardPage}
            />
            <PrivateRoute
              path="/dashboard/:topic_name"
              exact
              component={Pages.DashboardDetailsPage}
            />
            <Redirect from="/" exact to="/jobs" />
            <PrivateRoute path="/jobs" exact component={Pages.JobsPage} />
            <Redirect from="/jobs/:id" exact to="/jobs/:id/jobStates" />
            <PrivateRoute
              path="/jobs/:id/:endpoint"
              component={Pages.JobPage}
            />
            <PrivateRoute path="/trends" component={Pages.TrendsPage} />
            <PrivateRoute
              path="/performance"
              component={Pages.PerformancePage}
            />
            <PrivateRoute path="/products" component={Pages.ProductsPage} />
            <PrivateRoute path="/topics" component={Pages.TopicsPage} exact />
            <PrivateRoute
              path="/topics/:id/components"
              component={Pages.TopicPage}
            />
            <PrivateRoute path="/remotecis" component={Pages.RemotecisPage} />
            <PrivateRoute path="/feeders" component={Pages.FeedersPage} />
            <PrivateRoute path="/teams" component={Pages.TeamsPage} />
            <PrivateRoute path="/users" exact component={Pages.UsersPage} />
            <PrivateRoute
              path="/users/create"
              exact
              component={Pages.CreateUserPage}
            />
            <PrivateRoute path="/users/:id" component={Pages.EditUserPage} />
            <PrivateRoute
              path="/currentUser/settings"
              component={Pages.SettingsPage}
            />
            <PrivateRoute
              path="/currentUser/notifications"
              component={Pages.NotificationsPage}
            />
            <PrivateRoute
              path="/permissions"
              component={Pages.PermissionsPage}
            />
            <Route path="/login" component={Pages.LoginPage} />
            <Route path="/login_callback" component={Pages.LoginCallbackPage} />
            <Route
              path="/silent_redirect"
              component={Pages.SilentRedirectPage}
            />
            <Route component={Pages.Page404} />
          </Switch>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;
