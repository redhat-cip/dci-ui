import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";

import "./App.css";
import "./ui/styles";
import store from "./store";
import Pages from "./pages";
import { PrivateRoute, Container404 } from "./router";
import { getConfig } from "./config/configActions";
import { getCurrentUser } from "./currentUser/currentUserActions";
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
      .then(() => store.dispatch(getCurrentUser()))
      .catch(error => console.error(error))
      .then(() => this.setState({ loading: false }));
  }

  render() {
    const { loading } = this.state;
    if (loading) {
      return <Pages.LoadingContainer />;
    }
    return (
      <Provider store={store}>
        <React.Fragment>
          <Alerts />
          <BackgroundImage />
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Switch>
              <Redirect from="/" exact to="/jobs" />
              <PrivateRoute
                path="/jobs"
                exact
                component={Pages.JobsContainer}
              />
              <PrivateRoute
                path="/jobs/:id/:tab"
                component={Pages.JobContainer}
              />
              <PrivateRoute
                path="/globalStatus"
                component={Pages.GlobalStatusContainer}
              />
              <PrivateRoute path="/trends" component={Pages.TrendsContainer} />
              <PrivateRoute path="/topics" component={Pages.TopicsContainer} />
              <PrivateRoute
                path="/components"
                component={Pages.ComponentsContainer}
              />
              <PrivateRoute
                path="/remotecis"
                component={Pages.RemotecisContainer}
              />
              <PrivateRoute
                path="/products"
                component={Pages.ProductsContainer}
              />
              <PrivateRoute path="/teams" component={Pages.TeamsContainer} />
              <PrivateRoute path="/users" component={Pages.UsersContainer} />
              <PrivateRoute
                path="/profile"
                component={Pages.ProfileContainer}
              />
              <PrivateRoute
                path="/notifications"
                component={Pages.NotificationsContainer}
              />
              <PrivateRoute
                path="/permissions"
                component={Pages.PermissionsContainer}
              />
              <Route path="/login" component={Pages.LoginContainer} />
              <Route component={Container404} />
            </Switch>
          </BrowserRouter>
        </React.Fragment>
      </Provider>
    );
  }
}

export default App;
