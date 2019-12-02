import config from "./authReducer";
import * as types from "./authActionsTypes";

it("returns the initial state", () => {
  expect(config(undefined, {})).toEqual(null);
});

it("AUTH_SETTED", () => {
  const state = config(
    {},
    {
      type: types.AUTH_SETTED,
      auth: {}
    }
  );
  expect(state).toEqual({});
});
