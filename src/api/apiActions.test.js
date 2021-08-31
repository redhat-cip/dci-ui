import axios from "axios";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import axiosMockAdapter from "axios-mock-adapter";

import { createActions } from "./apiActions";
import { createActionsTypes } from "./apiActionsTypes";

const usersActions = createActions("user");
const jobsActions = createActions("job");

const jobActionsTypes = createActionsTypes("job");
const userActionsTypes = createActionsTypes("user");

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const axiosMock = new axiosMockAdapter(axios);

it("fetch jobs", () => {
  axiosMock
    .onGet("https://api2.distributed-ci.io/api/v1/jobs")
    .reply(200, { jobs: [{ id: "j1" }], _meta: { count: 1 } });

  const expectedActions = [
    { type: jobActionsTypes.FETCH_ALL_REQUEST },
    {
      type: jobActionsTypes.FETCH_ALL_SUCCESS,
      result: ["j1"],
      entities: {
        jobs: { j1: { id: "j1" } },
      },
    },
    {
      type: jobActionsTypes.SET_COUNT,
      count: 1,
    },
  ];
  const store = mockStore();
  return store.dispatch(jobsActions.all()).then(() => {
    expect(store.getActions()).toEqual(expectedActions);
  });
});

it("fetch users params", () => {
  const params = { embed: "team" };
  axiosMock
    .onGet("https://api2.distributed-ci.io/api/v1/users", { params })
    .reply(200, { users: [], _meta: { count: 0 } });
  const expectedActions = [
    { type: userActionsTypes.FETCH_ALL_REQUEST },
    {
      type: userActionsTypes.FETCH_ALL_SUCCESS,
      result: [],
      entities: {},
    },
    {
      type: userActionsTypes.SET_COUNT,
      count: 0,
    },
  ];
  const store = mockStore();
  return store.dispatch(usersActions.all(params)).then(() => {
    expect(store.getActions()).toEqual(expectedActions);
  });
});

it("fetch error", () => {
  axiosMock.onGet("https://api2.distributed-ci.io/api/v1/jobs").reply(401, {
    message: "Authorization header missing",
    status_code: 401,
  });
  const store = mockStore();
  return store.dispatch(jobsActions.all()).then(() => {
    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: jobActionsTypes.FETCH_ALL_REQUEST });
    expect(actions[2].alert.title).toBe("Authorization header missing");
  });
});

it("fetch error no message", () => {
  axiosMock.onGet("https://api2.distributed-ci.io/api/v1/jobs").reply(500);
  const store = mockStore();
  return store.dispatch(jobsActions.all()).then(() => {
    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: jobActionsTypes.FETCH_ALL_REQUEST });
    expect(actions[2].alert.message).toBe(
      "We are sorry, an unknown error occurred. Can you try again in a few minutes or contact an administrator?"
    );
  });
});

it("jobs remove cache", () => {
  const expectedAction = {
    type: jobActionsTypes.CLEAR_CACHE,
  };
  expect(jobsActions.clear()).toEqual(expectedAction);
});

it("fetch job", () => {
  axiosMock
    .onGet("https://api2.distributed-ci.io/api/v1/jobs/j1")
    .reply(200, { job: { id: "j1" } });

  const expectedActions = [
    { type: jobActionsTypes.FETCH_REQUEST },
    {
      type: jobActionsTypes.FETCH_SUCCESS,
      result: "j1",
      entities: {
        jobs: { j1: { id: "j1" } },
      },
    },
  ];
  const store = mockStore();
  return store.dispatch(jobsActions.one("j1")).then(() => {
    expect(store.getActions()).toEqual(expectedActions);
  });
});

it("fetch job with params", () => {
  const params = { embed: "team" };
  axiosMock
    .onGet("https://api2.distributed-ci.io/api/v1/jobs/j2", { params })
    .reply(200, { job: { id: "j2" } });

  const expectedActions = [
    { type: jobActionsTypes.FETCH_REQUEST },
    {
      type: jobActionsTypes.FETCH_SUCCESS,
      result: "j2",
      entities: {
        jobs: { j2: { id: "j2" } },
      },
    },
  ];
  const store = mockStore();
  return store.dispatch(jobsActions.one("j2", params)).then(() => {
    expect(store.getActions()).toEqual(expectedActions);
  });
});

it("create one user", () => {
  const user = { name: "user 1" };

  axiosMock
    .onPost("https://api2.distributed-ci.io/api/v1/users", user)
    .reply(201, { user: { id: "u1", name: "user 1" } });

  const expectedActions = [
    { type: userActionsTypes.CREATE_REQUEST },
    {
      type: userActionsTypes.CREATE_SUCCESS,
      result: "u1",
      entities: {
        users: {
          u1: { id: "u1", name: "user 1" },
        },
      },
    },
  ];
  const store = mockStore();
  return store.dispatch(usersActions.create(user)).then(() => {
    const actions = store.getActions();
    expect(actions[0]).toEqual(expectedActions[0]);
    expect(actions[1]).toEqual(expectedActions[1]);
    expect(actions.length).toBe(3);
  });
});

it("update one user", () => {
  const user = { id: "u3", name: "user 1", etag: "etag1" };
  axiosMock
    .onPut("https://api2.distributed-ci.io/api/v1/users/u3", user)
    .reply(200, { user: { id: "u3", name: "user 1", etag: "etag2" } });

  const expectedActions = [
    { type: userActionsTypes.UPDATE_REQUEST },
    {
      type: userActionsTypes.UPDATE_SUCCESS,
      result: "u3",
      entities: {
        users: {
          u3: { id: "u3", name: "user 1", etag: "etag2" },
        },
      },
    },
  ];
  const store = mockStore();
  return store.dispatch(usersActions.update(user)).then(() => {
    const actions = store.getActions();
    expect(actions[0]).toEqual(expectedActions[0]);
    expect(actions[1]).toEqual(expectedActions[1]);
    expect(actions.length).toBe(3);
  });
});

it("delete one user", () => {
  axiosMock
    .onDelete("https://api2.distributed-ci.io/api/v1/users/u4")
    .reply(204);
  const user = { id: "u4", etag: "eu4", name: "user 1" };
  const store = mockStore();
  return store.dispatch(usersActions.delete(user)).then(() => {
    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: userActionsTypes.DELETE_REQUEST });
    expect(actions[1].alert.title).toBe("user user 1 deleted successfully!");
    expect(actions[2]).toEqual({
      type: userActionsTypes.DELETE_SUCCESS,
      id: "u4",
    });
  });
});
