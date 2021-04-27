import ReactDOM from "react-dom";
import axios from "axios";
import axiosMockAdapter from "axios-mock-adapter";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import { AuthProvider } from "auth/authContext";

const axiosMock = new axiosMockAdapter(axios);

axiosMock.onGet("https://api.distributed-ci.io/api/v1/identity").reply(200, {
  identity: {
    created_at: "2017-02-20T10:43:25.326282",
    email: "u1@redhat.com",
    etag: "191539996cb96d416cd386558de5d499",
    fullname: "First User",
    id: "a48ecab4-01d0-97d9-4f45-f7b938808e23",
    name: "u1",
    remotecis: [],
    sso_username: null,
    state: "active",
    team: {
      id: "03485867-d100-aab2-46a0-d4dd4d9ed18d",
      name: "First Team",
    },
    team_id: "03485867-d100-aab2-46a0-d4dd4d9ed18d",
    timezone: "Europe/Paris",
    updated_at: "2018-07-23T10:30:39.171087",
  },
});

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
