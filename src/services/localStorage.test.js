import test from "ava";
import {
  setToken,
  getToken,
  removeToken,
  setJWT,
  setBasicToken
} from "./localStorage";

test("localStorage getToken", t => {
  t.is(getToken(), null);
});

test("localStorage setToken getToken removeToken", t => {
  const token = {
    type: "Bearer",
    value: "eyJhbGciOiJSUzI1NiIsInR5cC"
  };
  setToken(token);
  t.deepEqual(getToken(), token);
  removeToken();
  t.is(getToken(), null);
});

test("localStorage setJWT", t => {
  setJWT("");
  t.is(getToken().type, "Bearer");
});

test("localStorage setBasicToken", t => {
  setBasicToken("");
  t.is(getToken().type, "Basic");
});
