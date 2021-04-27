import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import axios from "axios";
import axiosMockAdapter from "axios-mock-adapter";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import { AuthProvider } from "auth/authContext";
import { SSOProvider } from "auth/ssoContext";
import { createMemoryHistory } from "history";

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
    teams: {
      "03485867-d100-aab2-46a0-d4dd4d9ed18d": {
        id: "03485867-d100-aab2-46a0-d4dd4d9ed18d",
        name: "First Team",
      },
    },
    timezone: "Europe/Paris",
    updated_at: "2018-07-23T10:30:39.171087",
  },
});

it("renders without crashing", async () => {
  await act(async () => {
    render(
      <Provider store={store}>
        <SSOProvider>
          <AuthProvider>
            <Router history={createMemoryHistory()}>
              <App />
            </Router>
          </AuthProvider>
        </SSOProvider>
      </Provider>
    );
  });
});
