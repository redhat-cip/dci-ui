import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router-dom";
import "@patternfly/react-core/dist/styles/base.css";
import App from "./App";
import "./index.css";
import { SSOProvider } from "./auth/ssoContext";
import { AuthProvider } from "auth/authContext";
import Alerts from "alerts/Alerts";

ReactDOM.render(
  <Provider store={store}>
    <SSOProvider>
      <AuthProvider>
        <>
          <Alerts />
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <App />
          </BrowserRouter>
        </>
      </AuthProvider>
    </SSOProvider>
  </Provider>,
  document.getElementById("root")
);
