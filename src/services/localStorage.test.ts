import {
  setToken,
  getToken,
  removeToken,
  setJWT,
  setBasicToken,
} from "./localStorage";

test("localStorage getToken", () => {
  expect(getToken()).toBe(null);
});

test("localStorage setToken getToken removeToken", () => {
  const token = {
    type: "Bearer",
    value: "eyJhbGciOiJSUzI1NiIsInR5cC",
  };
  setToken(token);
  expect(getToken()).toEqual(token);
  removeToken();
  expect(getToken()).toBe(null);
});

test("localStorage setJWT", () => {
  setJWT("");
  expect(getToken().type).toBe("Bearer");
});

test("localStorage setBasicToken", () => {
  setBasicToken("");
  expect(getToken().type).toBe("Basic");
});
