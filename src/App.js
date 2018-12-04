import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { Provider } from "react-redux";

import "@patternfly/patternfly-next/patternfly.css";
import "c3/c3.css";
import "balloon-css/balloon.css";
import "./App.css";
import "./favicon.ico";

import store from "./store";
import Pages from "./pages";
import { PrivateRoute, Container404 } from "./router";
import { getConfig } from "./config/configActions";
import { getCurrentUser } from "./currentUser/currentUserActions";
import { configureSSO } from "./services/sso";
import Alerts from "./alerts/Alerts";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    store
      .dispatch(getConfig())
      .then(config => configureSSO(config))
      .then(() => store.dispatch(getCurrentUser()))
      .catch(error => console.error(error))
      .then(() => this.setState({ loading: false }));
  }

  render() {
    return (
      <div className="App">
        {this.state.loading ? (
          <Pages.LoadingContainer />
        ) : (
          <Provider store={store}>
            <React.Fragment>
              <Alerts />
              <Router>
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
                  <PrivateRoute
                    path="/trends"
                    component={Pages.TrendsContainer}
                  />
                  <PrivateRoute
                    path="/topics"
                    component={Pages.TopicsContainer}
                  />
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
                  <PrivateRoute
                    path="/teams"
                    component={Pages.TeamsContainer}
                  />
                  <PrivateRoute
                    path="/users"
                    component={Pages.UsersContainer}
                  />
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
              </Router>
            </React.Fragment>
          </Provider>
        )}
      </div>
    );
  }
}

export default App;
