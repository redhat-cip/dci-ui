import axios from "axios";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "./configActions";
import * as types from "./configActionsTypes";

jest.mock("axios");

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

it("getConfig()", () => {
  const config = {
    apiURL: "https://api.distributed-ci.io",
    sso: {
      url: "https://sso.redhat.com",
      realm: "redhat-external",
      clientId: "dci"
    }
  };
  axios.get.mockImplementation(() => Promise.resolve({ data: config }));
  const expectedActions = [
    {
      type: types.SET_CONFIG,
      config
    }
  ];
  const store = mockStore();
  return store.dispatch(actions.getConfig()).then(returnedConfig => {
    expect(returnedConfig).toEqual(config);
    expect(store.getActions()).toEqual(expectedActions);
  });
});
