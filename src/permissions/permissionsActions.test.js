import axios from "axios";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import axiosMockAdapter from "axios-mock-adapter";
import {
  getProductsWithTeams,
  getTopicsWithTeams,
  getTeams,
  grantTeamProductPermission,
  removeTeamProductPermission,
  grantTeamTopicPermission,
  removeTeamTopicPermission,
} from "./permissionsActions";
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const axiosMock = new axiosMockAdapter(axios);

test("getProductsWithTeams", () => {
  axiosMock.onGet("https://api.distributed-ci.io/api/v1/products").reply(200, {
    products: [
      { id: "p1", name: "RHEL" },
      { id: "p2", name: "OpenStack" },
    ],
    _meta: { count: 2 },
  });
  axiosMock
    .onGet("https://api.distributed-ci.io/api/v1/products/p1/teams")
    .reply(200, { teams: [{ id: "t1", name: "Team 1" }], _meta: { count: 1 } });
  axiosMock
    .onGet("https://api.distributed-ci.io/api/v1/products/p2/teams")
    .reply(200, {
      teams: [
        { id: "t2", name: "Team 2" },
        { id: "t1", name: "Team 1" },
      ],
      _meta: { count: 2 },
    });
  const store = mockStore();
  return store.dispatch(getProductsWithTeams()).then((products) => {
    expect(products[0].teams).toEqual([
      { id: "t1", name: "Team 1" },
      { id: "t2", name: "Team 2" },
    ]);
    expect(products[1].teams).toEqual([{ id: "t1", name: "Team 1" }]);
  });
});

test("getTopicsWithTeams", () => {
  axiosMock
    .onGet("https://api.distributed-ci.io/api/v1/topics")
    .reply(200, {
      topics: [
        { id: "to1", name: "Topic 1", teams: [{ id: "t1", name: "Team 1" }] },
        {
          id: "to2",
          name: "Topic 2",
          teams: [
            { id: "t1", name: "Team 1" },
            { id: "t2", name: "Team 2" },
          ],
        },
      ],
      _meta: { count: 2 },
    });
  const store = mockStore();
  return store.dispatch(getTopicsWithTeams()).then((topics) => {
    expect(topics[0].teams).toEqual([{ id: "t1", name: "Team 1" }]);
    expect(topics[1].teams).toEqual([
      { id: "t1", name: "Team 1" },
      { id: "t2", name: "Team 2" },
    ]);
  });
});

test("getTeams", () => {
  axiosMock.onGet("https://api.distributed-ci.io/api/v1/teams").reply(200, {
    teams: [
      { id: "t1", name: "Team 1" },
      { id: "t2", name: "Team 2" },
    ],
    _meta: { count: 2 },
  });
  const store = mockStore();
  return store.dispatch(getTeams()).then((teams) => {
    expect(teams[0].id).toBe("t1");
    expect(teams[1].id).toBe("t2");
  });
});

test("grantTeamProductPermission", () => {
  const data = { team_id: "t1" };
  axiosMock
    .onPost("https://api.distributed-ci.io/api/v1/products/p1/teams", data)
    .reply(201);
  const store = mockStore();
  const team = { id: "t1", name: "Team 1" };
  const product = { id: "p1" };
  return store
    .dispatch(grantTeamProductPermission(team, product))
    .then((response) => expect(response.status).toBe(201));
});

test("removeTeamProductPermission", () => {
  axiosMock
    .onDelete("https://api.distributed-ci.io/api/v1/products/p1/teams/t1")
    .reply(204);
  const store = mockStore();
  const team = { id: "t1", name: "Team 1" };
  const product = { id: "p1", etag: "ep1" };
  return store
    .dispatch(removeTeamProductPermission(team, product))
    .then((response) => expect(response.status).toBe(204));
});

test("grantTeamTopicPermission", () => {
  const data = { team_id: "t1" };
  axiosMock
    .onPost("https://api.distributed-ci.io/api/v1/topics/to1/teams", data)
    .reply(201);
  const store = mockStore();
  const team = { id: "t1", name: "Team 1" };
  const topic = { id: "to1" };
  return store
    .dispatch(grantTeamTopicPermission(team, topic))
    .then((response) => expect(response.status).toBe(201));
});

test("removeTeamTopicPermission", () => {
  axiosMock
    .onDelete("https://api.distributed-ci.io/api/v1/topics/to1/teams/t1")
    .reply(204);
  const store = mockStore();
  const team = { id: "t1", name: "Team 1" };
  const topic = { id: "to1", etag: "eto1" };
  return store
    .dispatch(removeTeamTopicPermission(team, topic))
    .then((response) => expect(response.status).toBe(204));
});
