import reducer from "./currentUserReducer";
import * as types from "./currentUserActionsTypes";

it("SET_CURRENT_USER", () => {
  const newState = reducer(undefined, {
    type: types.SET_CURRENT_USER,
    currentUser: {
      email: "currentUser@example.org",
      role: {
        label: "USER"
      }
    }
  });
  expect(newState).toEqual({
    email: "currentUser@example.org",
    hasAdminRole: false,
    hasProductOwnerRole: false,
    hasReadOnlyRole: false,
    isReadOnly: false,
    isSuperAdmin: false,
    role: {
      label: "USER"
    }
  });
});

it("set SUPER_ADMIN role shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_CURRENT_USER,
    currentUser: {
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
    currentUser: {
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
    currentUser: {
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
    currentUser: {
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

it("SET_CURRENT_USER unset role shortcut", () => {
  const newState = reducer(
    {
      hasProductOwnerRole: true,
      hasAdminRole: true,
      hasReadOnlyRole: true
    },
    {
      type: types.SET_CURRENT_USER,
      currentUser: {
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

it("SET_CURRENT_USER SUPER_ADMIN shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_CURRENT_USER,
    currentUser: {
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

it("SET_CURRENT_USER READ_ONLY_USER shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_CURRENT_USER,
    currentUser: {
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

it("SET_CURRENT_USER USER shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_CURRENT_USER,
    currentUser: {
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

it("UPDATE_CURRENT_USER keep role", () => {
  const newState = reducer(
    {
      email: "currentUser@example.org",
      role: {
        label: "SUPER_ADMIN"
      }
    },
    {
      type: types.UPDATE_CURRENT_USER,
      currentUser: {
        email: "newEmail@example.org"
      }
    }
  );
  expect(newState).toEqual({
    email: "newEmail@example.org",
    role: {
      label: "SUPER_ADMIN"
    }
  });
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
