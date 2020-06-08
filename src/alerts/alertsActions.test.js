import * as actions from "./alertsActions";
import * as types from "./alertsActionsTypes";

it("showAlert", () => {
  const alert = {
    id: "a1",
  };
  const expectedAction = {
    type: types.SHOW_ALERT,
    alert,
  };
  expect(actions.showAlert(alert)).toEqual(expectedAction);
});

it("hideAlert", () => {
  const alert = {
    id: "a1",
  };
  const expectedAction = {
    type: types.HIDE_ALERT,
    alert,
  };
  expect(actions.hideAlert(alert)).toEqual(expectedAction);
});

it("createAlert", () => {
  const data = {
    _status: "Unauthorized",
    message:
      "Could not verify your access level for that URL. Please login with proper credentials.",
  };
  const alert = actions.createAlert({ data, status: 401 });
  expect(alert.title).toBe(
    "Could not verify your access level for that URL. Please login with proper credentials."
  );
  expect(alert.type).toBe("danger");
  expect(alert.message).toBe("");
});

it("createAlert with one error", () => {
  const data = {
    message: "conflict on topics",
    payload: {
      error: {
        name: "already_exists",
      },
    },
    status_code: 409,
  };
  const alert = actions.createAlert({ data, status: 409 });
  expect(alert.title).toBe("conflict on topics");
  expect(alert.type).toBe("danger");
  expect(alert.message).toBe("name: already_exists");
});

it("createAlert with multiple errors", () => {
  const data = {
    message: "Request malformed",
    payload: {
      errors: {
        name: "already_exists",
        team_id: "not a valid team id",
      },
    },
    status_code: 400,
  };
  const alert = actions.createAlert({ data, status: 400 });
  expect(alert.title).toBe("Request malformed");
  expect(alert.type).toBe("danger");
  expect(alert.message).toBe(
    "name: already_exists\nteam_id: not a valid team id"
  );
});

it("createAlert with new error", () => {
  const data = {
    message: "Request malformed",
    payload: {
      error: "'team_id' is a required property",
      errors: ["'team_id' is a required property"],
    },
    status_code: 400,
  };
  const alert = actions.createAlert({ data, status: 400 });
  expect(alert.title).toBe("Request malformed");
  expect(alert.type).toBe("danger");
  expect(alert.message).toBe("'team_id' is a required property");
});

it("createAlert with empty payload", () => {
  const data = {
    message: "Request malformed",
    payload: {},
    status_code: 400,
  };
  const alert = actions.createAlert({ data, status: 400 });
  expect(alert.title).toBe("Request malformed");
  expect(alert.type).toBe("danger");
  expect(alert.message).toBe("");
});

it("createAlert with unknown format", () => {
  const data = {
    error: "Request malformed",
  };
  const alert = actions.createAlert({ data, status: 400 });
  expect(alert.title).toBe("Request malformed");
  expect(alert.type).toBe("danger");
  expect(alert.message).toBe("");
});

it("createAlert with no data format", () => {
  const alert = actions.createAlert({ status: 400 });
  expect(alert.title).toBe("Unknown error");
  expect(alert.type).toBe("danger");
  expect(alert.message).toBe(
    "We are sorry, an unknown error occurred. Can you try again in a few minutes or contact an administrator?"
  );
});
