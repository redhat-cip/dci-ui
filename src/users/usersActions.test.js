import axios from "axios";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import axiosMockAdapter from "axios-mock-adapter";

import {
  fetchUserTeams,
  addUserToTeam,
  deleteUserFromTeam,
} from "./usersActions";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const axiosMock = new axiosMockAdapter(axios);

it("fetchUserTeams", () => {
  axiosMock
    .onGet("https://api.distributed-ci.io/api/v1/users/abc/teams")
    .reply(200);

  const store = mockStore();
  return store.dispatch(fetchUserTeams({ id: "abc" }));
});

it("addUserToTeam", () => {
  axiosMock
    .onPost("https://api.distributed-ci.io/api/v1/teams/def/users/abc", {})
    .reply(201);

  const store = mockStore();
  const team = { id: "def" };
  return store.dispatch(addUserToTeam("abc", team));
});

it("deleteUserFromTeam", () => {
  axiosMock
    .onDelete("https://api.distributed-ci.io/api/v1/teams/def/users/abc")
    .reply(204);

  const store = mockStore();
  const user = { id: "abc" };
  const team = { id: "def" };
  return store.dispatch(deleteUserFromTeam(user, team));
});
