import {
  setToken,
  getToken,
  removeToken,
  setJWT,
  setBasicToken,
} from "./localStorage";

it("localStorage getToken", () => {
  expect(getToken()).toBe(null);
});

it("localStorage setToken getToken removeToken", () => {
  const token = {
    type: "Bearer",
    value: "eyJhbGciOiJSUzI1NiIsInR5cC",
  };
  setToken(token);
  expect(getToken()).toEqual(token);
  removeToken();
  expect(getToken()).toBe(null);
});

it("localStorage setJWT", () => {
  setJWT("");
  expect(getToken().type).toBe("Bearer");
});

it("localStorage setBasicToken", () => {
  setBasicToken("");
  expect(getToken().type).toBe("Basic");
});
