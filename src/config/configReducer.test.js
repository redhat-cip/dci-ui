import config from "./configReducer";
import * as types from "./configActionsTypes";

it("returns the initial state", () => {
  expect(config(undefined, {})).toEqual({});
});

it("SET_CONFIG", () => {
  const state = config(
    {},
    {
      type: types.SET_CONFIG,
      config: {
        apiURL: "https://api.distributed-ci.io",
        sso: {
          url: "https://sso.redhat.com",
          realm: "redhat-external",
          clientId: "dci",
        },
      },
    }
  );
  expect(state.apiURL).toBe("https://api.distributed-ci.io");
});
