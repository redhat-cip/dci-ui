import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import "@patternfly/react-core/dist/styles/base.css";
import App from "./App";
import { ConfigProvider } from "./auth/configContext";
import { AuthProvider } from "auth/authContext";

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ConfigProvider>
  </Provider>,
  document.getElementById("root")
);
