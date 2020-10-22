import reducer from "./currentUserReducer";
import * as types from "./currentUserActionsTypes";

it("SET_IDENTITY", () => {
  const newState = reducer(undefined, {
    type: types.SET_IDENTITY,
    identity: {
      id: "i1",
      name: "identity",
      email: "identity@example.org",
      teams: {
        t1: {
          id: "t1",
          name: "admin",
        },
      },
    },
  });
  expect(newState).toEqual({
    id: "i1",
    name: "identity",
    email: "identity@example.org",
    teams: {
      t1: { id: "t1", name: "admin" },
    },
  });
});

it("deleteCurrentUser", () => {
  const newState = reducer(
    {
      id: "u1",
    },
    {
      type: types.DELETE_CURRENT_USER,
    }
  );
  expect(newState).toEqual({});
});

it("subscribe to a remoteci", () => {
  const newState = reducer(
    {
      remotecis: [],
    },
    {
      type: types.SUBSCRIBED_TO_A_REMOTECI,
      remoteci: {
        id: "r1",
      },
    }
  );
  expect(newState.remotecis[0].id).toBe("r1");
});

it("subscribe to a remoteci in remotecis", () => {
  const newState = reducer(
    {
      remotecis: [{ id: "r2" }],
    },
    {
      type: types.SUBSCRIBED_TO_A_REMOTECI,
      remoteci: {
        id: "r1",
      },
    }
  );
  expect(newState.remotecis[0].id).toBe("r1");
});

it("unsubscribe from a remoteci", () => {
  const newState = reducer(
    {
      remotecis: [{ id: "r1" }, { id: "r2" }, { id: "r3" }],
    },
    {
      type: types.UNSUBSCRIBED_FROM_A_REMOTECI,
      remoteci: {
        id: "r2",
      },
    }
  );
  expect(newState.remotecis).toEqual([{ id: "r1" }, { id: "r3" }]);
});
