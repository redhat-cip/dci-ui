import reducer from "./currentUserReducer";
import * as types from "./currentUserActionsTypes";

it("set currentUser", () => {
  const newState = reducer(undefined, {
    type: types.SET_CURRENT_USER,
    user: {
      email: "currentUser@example.org",
      role: {
        label: "USER"
      }
    }
  });
  expect(newState.email).toBe("currentUser@example.org");
});

it("set SUPER_ADMIN role shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_CURRENT_USER,
    user: {
      email: "currentUser@example.org",
      role: {
        label: "SUPER_ADMIN"
      }
    }
  });
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.hasProductOwnerRole).toBe(true);
  expect(newState.hasAdminRole).toBe(true);
  expect(newState.hasReadOnlyRole).toBe(true);
});

it("set PRODUCT_OWNER role shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_CURRENT_USER,
    user: {
      email: "currentUser@example.org",
      role: {
        label: "PRODUCT_OWNER"
      }
    }
  });
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.hasProductOwnerRole).toBe(true);
  expect(newState.hasAdminRole).toBe(true);
  expect(newState.hasReadOnlyRole).toBe(true);
});

it("set ADMIN role shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_CURRENT_USER,
    user: {
      email: "currentUser@example.org",
      role: {
        label: "ADMIN"
      }
    }
  });
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.hasProductOwnerRole).toBe(false);
  expect(newState.hasAdminRole).toBe(true);
  expect(newState.hasReadOnlyRole).toBe(false);
});

it("set READ_ONLY_USER role shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_CURRENT_USER,
    user: {
      email: "currentUser@example.org",
      role: {
        label: "READ_ONLY_USER"
      }
    }
  });
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.hasProductOwnerRole).toBe(false);
  expect(newState.hasAdminRole).toBe(false);
  expect(newState.hasReadOnlyRole).toBe(true);
});

it("set currentUser unset role shortcut", () => {
  const newState = reducer(
    {
      hasProductOwnerRole: true,
      hasAdminRole: true,
      hasReadOnlyRole: true
    },
    {
      type: types.SET_CURRENT_USER,
      user: {
        email: "currentUser@example.org",
        role: {
          label: "READ_ONLY_USER"
        }
      }
    }
  );
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.hasProductOwnerRole).toBe(false);
  expect(newState.hasAdminRole).toBe(false);
  expect(newState.hasReadOnlyRole).toBe(true);
});

it("set currentUser SUPER_ADMIN shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_CURRENT_USER,
    user: {
      email: "currentUser@example.org",
      role: {
        label: "SUPER_ADMIN"
      }
    }
  });
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.isSuperAdmin).toBe(true);
  expect(newState.isReadOnly).toBe(false);
});

it("set currentUser READ_ONLY_USER shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_CURRENT_USER,
    user: {
      email: "currentUser@example.org",
      role: {
        label: "READ_ONLY_USER"
      }
    }
  });
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.isSuperAdmin).toBe(false);
  expect(newState.isReadOnly).toBe(true);
});

it("set currentUser USER shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_CURRENT_USER,
    user: {
      email: "currentUser@example.org",
      role: {
        label: "USER"
      }
    }
  });
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.isSuperAdmin).toBe(false);
  expect(newState.isReadOnly).toBe(false);
});

it("set currentUser keep role", () => {
  const newState = reducer(
    {
      email: "currentUser@example.org",
      role: {
        label: "USER"
      }
    },
    {
      type: types.SET_CURRENT_USER,
      user: {
        email: "newEmail@example.org"
      }
    }
  );
  expect(newState.email).toBe("newEmail@example.org");
  expect(newState.role.label).toBe("USER");
});

it("deleteCurrentUser", () => {
  const newState = reducer(
    {
      id: "u1"
    },
    {
      type: types.DELETE_CURRENT_USER
    }
  );
  expect(newState).toEqual({});
});

it("subscribe to a remoteci", () => {
  const newState = reducer(
    {
      remotecis: []
    },
    {
      type: types.SUBSCRIBED_TO_A_REMOTECI,
      remoteci: {
        id: "r1"
      }
    }
  );
  expect(newState.remotecis[0].id).toBe("r1");
});

it("subscribe to a remoteci in remotecis", () => {
  const newState = reducer(
    {
      remotecis: [{ id: "r2" }]
    },
    {
      type: types.SUBSCRIBED_TO_A_REMOTECI,
      remoteci: {
        id: "r1"
      }
    }
  );
  expect(newState.remotecis[0].id).toBe("r1");
});

it("unsubscribe from a remoteci", () => {
  const newState = reducer(
    {
      remotecis: [{ id: "r1" }, { id: "r2" }, { id: "r3" }]
    },
    {
      type: types.UNSUBSCRIBED_FROM_A_REMOTECI,
      remoteci: {
        id: "r2"
      }
    }
  );
  expect(newState.remotecis).toEqual([{ id: "r1" }, { id: "r3" }]);
});
