import axios from "axios";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import axiosMockAdapter from "axios-mock-adapter";

import * as currentUserActions from "./currentUserActions";
import * as types from "./currentUserActionsTypes";
import * as alertaActionsTypes from "alerts/alertsActionsTypes";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const axiosMock = new axiosMockAdapter(axios);

it("deleteCurrentUser", () => {
  const expectedAction = {
    type: types.DELETE_CURRENT_USER
  };
  expect(currentUserActions.deleteCurrentUser()).toEqual(expectedAction);
});

it("getSubscribedRemotecis", () => {
  axiosMock
    .onGet("https://api.example.org/api/v1/users/u1/remotecis")
    .reply(200, { remotecis: [{ id: "r1" }, { id: "r2" }] });
  const expectedActions = [
    {
      type: types.SET_IDENTITY,
      identity: {
        id: "u1",
        remotecis: [{ id: "r1" }, { id: "r2" }]
      }
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store
    .dispatch(currentUserActions.getSubscribedRemotecis({ id: "u1" }))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
});

it("subscribeToARemoteci", () => {
  const currentUser = { id: "u1" };
  const remoteci = { id: "r1", name: "remoteci 1" };
  axiosMock
    .onPost("https://api.example.org/api/v1/remotecis/r1/users", currentUser)
    .reply(201, { remoteci_id: "r1", user_id: "u1" });

  const store = mockStore({
    config: { apiURL: "https://api.example.org" },
    currentUser
  });
  return store
    .dispatch(currentUserActions.subscribeToARemoteci(remoteci))
    .then(() => {
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: types.SUBSCRIBED_TO_A_REMOTECI,
        remoteci
      });
      expect(actions[1].type).toBe(alertaActionsTypes.SHOW_ALERT);
      expect(actions[1].alert.type).toBe("success");
      expect(actions[1].alert.title).toBe(
        "You are subscribed to the remoteci remoteci 1"
      );
    });
});

it("subscribeToARemoteci error", () => {
  const currentUser = { id: "u3", name: "currentUser 3" };
  axiosMock
    .onPost("https://api.example.org/api/v1/remotecis/r3/users", currentUser)
    .reply(500, {
      message: "Unknown error",
      status_code: 500
    });

  const store = mockStore({
    config: { apiURL: "https://api.example.org" },
    currentUser
  });
  return store
    .dispatch(
      currentUserActions.subscribeToARemoteci({ id: "r3", name: "remoteci 3" })
    )
    .then(() => {
      const action = store.getActions()[0];
      expect(action.type).toBe(alertaActionsTypes.SHOW_ALERT);
      expect(action.alert.type).toBe("danger");
      expect(action.alert.title).toBe(
        "Cannot subscribe to remoteci remoteci 3"
      );
    });
});

it("unsubscribeFromARemoteci", () => {
  axiosMock
    .onDelete("https://api.example.org/api/v1/remotecis/r2/users/u2")
    .reply(204);
  const remoteci = { id: "r2", name: "remoteci 2" };
  const store = mockStore({
    config: { apiURL: "https://api.example.org" },
    currentUser: { id: "u2" }
  });
  return store
    .dispatch(currentUserActions.unsubscribeFromARemoteci(remoteci))
    .then(() => {
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: types.UNSUBSCRIBED_FROM_A_REMOTECI,
        remoteci
      });
      expect(actions[1].type).toBe(alertaActionsTypes.SHOW_ALERT);
      expect(actions[1].alert.type).toBe("warning");
      expect(actions[1].alert.title).toBe(
        "You will no longer receive notification for the remoteci remoteci 2"
      );
    });
});

it("unsubscribeFromARemoteci error", () => {
  axiosMock
    .onDelete("https://api.example.org/api/v1/remotecis/r2/users/u4")
    .reply(500, {
      message: "Unknown error",
      status_code: 500
    });

  const store = mockStore({
    config: { apiURL: "https://api.example.org" },
    currentUser: { id: "u4" }
  });
  return store
    .dispatch(
      currentUserActions.unsubscribeFromARemoteci({
        id: "r4",
        name: "remoteci 4"
      })
    )
    .then(() => {
      const action = store.getActions()[0];
      expect(action.type).toBe(alertaActionsTypes.SHOW_ALERT);
      expect(action.alert.type).toBe("danger");
      expect(action.alert.title).toBe(
        "Cannot unsubscribe to remoteci remoteci 4"
      );
    });
});

it("setCurrentTeam", () => {
  const team = {
    id: "t1"
  };
  const expectedAction = {
    type: types.SET_ACTIVE_TEAM,
    team
  };
  expect(currentUserActions.setCurrentTeam(team)).toEqual(expectedAction);
});

it("setIdentity", () => {
  const identity = {
    id: "i1"
  };
  const expectedAction = {
    type: types.SET_IDENTITY,
    identity
  };
  expect(currentUserActions.setIdentity(identity)).toEqual(expectedAction);
});
