import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router-dom";
import "@patternfly/react-core/dist/styles/base.css";
import "./index.css";
import App from "./App";
import { SSOProvider } from "auth/ssoContext";
import { AuthProvider } from "auth/authContext";

ReactDOM.render(
  <Provider store={store}>
    <SSOProvider>
      <AuthProvider>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </SSOProvider>
  </Provider>,
  document.getElementById("root")
);
