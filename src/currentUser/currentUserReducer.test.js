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
          parent_id: null,
          name: "admin",
        },
      },
    },
  });
  expect(newState).toEqual({
    hasEPMRole: true,
    hasReadOnlyRole: true,
    id: "i1",
    isReadOnly: false,
    isSuperAdmin: true,
    name: "identity",
    email: "identity@example.org",
    teams: {
      t1: { id: "t1", parent_id: null, name: "admin" },
    },
    team: { id: "t1", parent_id: null, name: "admin" },
  });
});

it("SET_ACTIVE_TEAM", () => {
  const newState = reducer(
    {
      hasEPMRole: true,
      hasReadOnlyRole: true,
      id: "i1",
      isReadOnly: false,
      isSuperAdmin: true,
      name: "identity",
      teams: {
        t1: {
          id: "t1",
          parent_id: null,
          name: "admin",
        },
        t2: {
          id: "t2",
          parent_id: "t1",
          name: "EPM",
        },
      },
      team: {
        id: "t1",
        parent_id: null,
        name: "admin",
      },
    },
    {
      type: types.SET_ACTIVE_TEAM,
      team: {
        id: "t2",
        parent_id: "t1",
        name: "EPM",
      },
    }
  );
  expect(newState).toEqual({
    hasEPMRole: true,
    hasReadOnlyRole: true,
    id: "i1",
    isReadOnly: false,
    isSuperAdmin: false,
    name: "identity",
    teams: {
      t1: {
        id: "t1",
        parent_id: null,
        name: "admin",
      },
      t2: {
        id: "t2",
        parent_id: "t1",
        name: "EPM",
      },
    },
    team: {
      id: "t2",
      parent_id: "t1",
      name: "EPM",
    },
  });
});

it("set SUPER_ADMIN shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_IDENTITY,
    identity: {
      id: "i1",
      email: "currentUser@example.org",
      teams: {
        t1: {
          parent_id: null,
          name: "admin",
        },
      },
    },
  });
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.hasEPMRole).toBe(true);
  expect(newState.hasReadOnlyRole).toBe(true);
  expect(newState.isSuperAdmin).toBe(true);
  expect(newState.isReadOnly).toBe(false);
});

it("set PRODUCT_OWNER shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_IDENTITY,
    identity: {
      id: "i1",
      email: "currentUser@example.org",
      teams: {
        t2: {
          parent_id: "t1",
          name: "EPM",
        },
      },
    },
  });
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.hasEPMRole).toBe(true);
  expect(newState.hasReadOnlyRole).toBe(true);
  expect(newState.isSuperAdmin).toBe(false);
  expect(newState.isReadOnly).toBe(false);
});

it("set READ_ONLY_USER shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_IDENTITY,
    identity: {
      id: "i1",
      email: "currentUser@example.org",
      teams: {
        t2: {
          parent_id: "t1",
          name: "Red Hat",
        },
      },
    },
  });
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.hasEPMRole).toBe(false);
  expect(newState.hasReadOnlyRole).toBe(true);
  expect(newState.isSuperAdmin).toBe(false);
  expect(newState.isReadOnly).toBe(true);
});

it("SET_IDENTITY unset shortcut", () => {
  const newState = reducer(
    {
      hasEPMRole: true,
      hasReadOnlyRole: true,
      isSuperAdmin: true,
      isReadOnly: false,
    },
    {
      type: types.SET_IDENTITY,
      identity: {
        id: "i1",
        email: "currentUser@example.org",
        teams: {
          t2: {
            parent_id: "t1",
            name: "Red Hat",
          },
        },
      },
    }
  );
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.hasEPMRole).toBe(false);
  expect(newState.hasReadOnlyRole).toBe(true);
  expect(newState.isSuperAdmin).toBe(false);
  expect(newState.isReadOnly).toBe(true);
});

it("SET_IDENTITY USER shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_IDENTITY,
    identity: {
      id: "i1",
      email: "currentUser@example.org",
      teams: {
        t2: {
          parent_id: null,
          name: null,
        },
      },
    },
  });
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.hasEPMRole).toBe(false);
  expect(newState.hasReadOnlyRole).toBe(false);
  expect(newState.isSuperAdmin).toBe(false);
  expect(newState.isReadOnly).toBe(false);
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

it("SET_IDENTITY null", () => {
  const newState = reducer(undefined, {
    type: types.SET_IDENTITY,
    identity: null,
  });
  expect(newState).toBe(null);
});
