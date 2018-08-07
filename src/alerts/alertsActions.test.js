import * as actions from "./alertsActions";
import * as types from "./alertsActionsTypes";

it("showAlert", () => {
  const alert = {
    id: "a1"
  };
  const expectedAction = {
    type: types.SHOW_ALERT,
    alert
  };
  expect(actions.showAlert(alert)).toEqual(expectedAction);
});

it("hideAlert", () => {
  const alert = {
    id: "a1"
  };
  const expectedAction = {
    type: types.HIDE_ALERT,
    alert
  };
  expect(actions.hideAlert(alert)).toEqual(expectedAction);
});

it("createAlertMessage", () => {
  const data = {
    _status: "Unauthorized",
    message:
      "Could not verify your access level for that URL. Please login with proper credentials."
  };
  expect(actions.createAlertMessage({ data, status: 401 })).toBe(
    "Could not verify your access level for that URL. Please login with proper credentials."
  );
});

it("createAlertMessage with one error", () => {
  const data = {
    message: "conflict on topics",
    payload: {
      error: {
        name: "already_exists"
      }
    },
    status_code: 409
  };
  expect(actions.createAlertMessage({ data, status: 409 })).toBe(
    "conflict on topics\nname: already_exists"
  );
});

it("createAlertMessage with multiple errors", () => {
  const data = {
    message: "Request malformed",
    payload: {
      errors: {
        name: "already_exists",
        team_id: "not a valid team id"
      }
    },
    status_code: 400
  };
  expect(actions.createAlertMessage({ data, status: 400 })).toBe(
    "Request malformed\nname: already_exists\nteam_id: not a valid team id"
  );
});

it("createAlertMessage with empty payload", () => {
  const data = {
    message: "Request malformed",
    payload: {},
    status_code: 400
  };
  expect(actions.createAlertMessage({ data, status: 400 })).toBe(
    "Request malformed"
  );
});

it("createAlertMessage with unknown format", () => {
  const data = {
    error: "Request malformed"
  };
  expect(actions.createAlertMessage({ data, status: 400 })).toBe(
    "We are sorry, an unknown error occurred. Can you try again in a few minutes or contact an administrator?"
  );
});

it("createAlertMessage with no data format", () => {
  expect(actions.createAlertMessage({ status: 400 })).toBe(
    "We are sorry, an unknown error occurred. Can you try again in a few minutes or contact an administrator?"
  );
});
