import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";

import "./App.css";
import "./ui/styles";
import store from "./store";
import Pages from "./pages";
import { PrivateRoute, Page404 } from "./router";
import { getConfig } from "./config/configActions";
import { getIdentity } from "./currentUser/currentUserActions";
import { configureSSO } from "./services/sso";
import Alerts from "./alerts/Alerts";
import { BackgroundImage } from "./ui";

class App extends Component {
  state = {
    loading: true
  };

  componentDidMount() {
    store
      .dispatch(getConfig())
      .then(config => configureSSO(config))
      .then(() => store.dispatch(getIdentity()))
      .catch(error => console.error(error))
      .then(() => this.setState({ loading: false }));
  }

  render() {
    const { loading } = this.state;
    if (loading) {
      return <Pages.NotAuthenticatedLoadingPage />;
    }
    return (
      <Provider store={store}>
        <React.Fragment>
          <Alerts />
          <BackgroundImage />
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Switch>
              <Redirect from="/" exact to="/jobs" />
              <PrivateRoute path="/jobs" exact component={Pages.JobsPage} />
              <Redirect from="/jobs/:id" exact to="/jobs/:id/jobStates" />
              <PrivateRoute
                path="/jobs/:id/:endpoint"
                component={Pages.JobPage}
              />
              <PrivateRoute
                path="/globalStatus"
                component={Pages.GlobalStatusPage}
              />
              <PrivateRoute path="/trends" component={Pages.TrendsPage} />
              <PrivateRoute path="/performance" component={Pages.PerformancePage} />
              <PrivateRoute path="/products" component={Pages.ProductsPage} />
              <PrivateRoute path="/topics" component={Pages.TopicsPage} />
              <PrivateRoute
                path="/components"
                component={Pages.ComponentsPage}
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
              <Route component={Page404} />
            </Switch>
          </BrowserRouter>
        </React.Fragment>
      </Provider>
    );
  }
}

export default App;
