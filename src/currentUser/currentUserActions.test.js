import * as currentUserActions from "./currentUserActions";
import * as types from "./currentUserActionsTypes";

test("deleteCurrentUser", () => {
  const expectedAction = {
    type: types.DELETE_CURRENT_USER,
  };
  expect(currentUserActions.deleteCurrentUser()).toEqual(expectedAction);
});

test("setIdentity", () => {
  const identity = {
    id: "i1",
  };
  const expectedAction = {
    type: types.SET_IDENTITY,
    identity,
  };
  expect(currentUserActions.setIdentity(identity)).toEqual(expectedAction);
});
