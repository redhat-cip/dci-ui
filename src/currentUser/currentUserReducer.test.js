import reducer from "./currentUserReducer";
import * as types from "./currentUserActionsTypes";

test("SET_IDENTITY", () => {
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

test("deleteCurrentUser", () => {
  const newState = reducer(
    {
      id: "u1",
    },
    {
      type: types.DELETE_CURRENT_USER,
    }
  );
  expect(newState).toEqual(null);
});
