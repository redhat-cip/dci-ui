import * as authActions from "./authActions";
import * as types from "./authActionsTypes";

it("login", () => {
  const expectedAction = {
    type: types.LOGIN
  };
  expect(authActions.login()).toEqual(expectedAction);
});

it("logout", () => {
  const expectedAction = {
    type: types.LOGOUT
  };
  expect(authActions.logout()).toEqual(expectedAction);
});
