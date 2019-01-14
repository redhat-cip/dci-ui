import reducer from "./authReducer";
import * as types from "./authActionsTypes";

it("returns the initial state", () => {
  expect(reducer(undefined, {})).toEqual({ isAuthenticated: false });
});

it("LOGIN", () => {
  const newState = reducer(
    { isAuthenticated: false },
    {
      type: types.LOGIN
    }
  );
  expect(newState).toEqual({
    isAuthenticated: true
  });
});

it("LOGOUT", () => {
  const newState = reducer(
    { isAuthenticated: true },
    {
      type: types.LOGOUT
    }
  );
  expect(newState).toEqual({
    isAuthenticated: false
  });
});
