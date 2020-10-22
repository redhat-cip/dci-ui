import { createActionsTypes } from "./apiActionsTypes";

it("fetch all actions types", () => {
  expect(createActionsTypes("user").FETCH_ALL_REQUEST).toBe(
    "FETCH_USERS_REQUEST"
  );
  expect(createActionsTypes("user").FETCH_ALL_SUCCESS).toBe(
    "FETCH_USERS_SUCCESS"
  );
  expect(createActionsTypes("user").FETCH_ALL_FAILURE).toBe(
    "FETCH_USERS_FAILURE"
  );
  expect(createActionsTypes("user").SET_COUNT).toBe("SET_USERS_COUNT");
});

it("clear user cache", () => {
  expect(createActionsTypes("user").CLEAR_CACHE).toBe("CLEAR_USER_CACHE");
});

it("fetch one actions types", () => {
  expect(createActionsTypes("user").FETCH_REQUEST).toBe("FETCH_USER_REQUEST");
  expect(createActionsTypes("user").FETCH_SUCCESS).toBe("FETCH_USER_SUCCESS");
  expect(createActionsTypes("user").FETCH_FAILURE).toBe("FETCH_USER_FAILURE");
});

it("create actions types", () => {
  expect(createActionsTypes("user").CREATE_REQUEST).toBe("CREATE_USER_REQUEST");
  expect(createActionsTypes("user").CREATE_SUCCESS).toBe("CREATE_USER_SUCCESS");
  expect(createActionsTypes("user").CREATE_FAILURE).toBe("CREATE_USER_FAILURE");
});

it("update actions types", () => {
  expect(createActionsTypes("user").UPDATE_REQUEST).toBe("UPDATE_USER_REQUEST");
  expect(createActionsTypes("user").UPDATE_SUCCESS).toBe("UPDATE_USER_SUCCESS");
  expect(createActionsTypes("user").UPDATE_FAILURE).toBe("UPDATE_USER_FAILURE");
});

it("delete actions types", () => {
  expect(createActionsTypes("user").DELETE_REQUEST).toBe("DELETE_USER_REQUEST");
  expect(createActionsTypes("user").DELETE_SUCCESS).toBe("DELETE_USER_SUCCESS");
  expect(createActionsTypes("user").DELETE_FAILURE).toBe("DELETE_USER_FAILURE");
});
