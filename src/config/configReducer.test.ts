import config from "./configReducer";
import * as types from "./configActionsTypes";

it("SET_CONFIG", () => {
  const state = config(undefined, {
    type: types.SET_CONFIG,
    config: {
      apiURL: "https://api.distributed-ci.io",
      sso: {
        url: "https://sso.redhat.com",
        realm: "redhat-external",
        clientId: "dci",
      },
    },
  });
  expect(state.apiURL).toBe("https://api.distributed-ci.io");
});
