import { isUUID } from "./utils";

test("isUUID empty string", () => {
  expect(isUUID("")).toBe(false);
});

test("isUUID valid uuid", () => {
  expect(isUUID("d1427c1b-4e13-4f63-8999-e7252825a249")).toBe(true);
});

test("isUUID invalid uuid", () => {
  expect(isUUID("I'm not an uuid")).toBe(false);
});
