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
import LoadingBar from "./loading/LoadingBar";

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
      return <Pages.LoadingPage />;
    }
    return (
      <Provider store={store}>
        <React.Fragment>
          <LoadingBar />
          <Alerts />
          <BackgroundImage />
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Switch>
              <Redirect from="/" exact to="/jobs" />
              <PrivateRoute path="/jobs" exact component={Pages.JobsPage} />
              <PrivateRoute path="/jobs/:id/:tab" component={Pages.JobPage} />
              <PrivateRoute
                path="/globalStatus"
                component={Pages.GlobalStatusPage}
              />
              <PrivateRoute path="/trends" component={Pages.TrendsPage} />
              <PrivateRoute path="/topics" component={Pages.TopicsPage} />
              <PrivateRoute
                path="/components"
                component={Pages.ComponentsPage}
              />
              <PrivateRoute path="/remotecis" component={Pages.RemotecisPage} />
              <PrivateRoute path="/products" component={Pages.ProductsPage} />
              <PrivateRoute path="/teams" component={Pages.TeamsPage} />
              <PrivateRoute path="/users" component={Pages.UsersPage} />
              <PrivateRoute path="/profile" component={Pages.ProfilePage} />
              <PrivateRoute
                path="/notifications"
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
