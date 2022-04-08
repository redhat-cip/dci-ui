import { buildWhereFromSearch } from "./where";

test("buildWhereFromSearch", () => {
  expect(buildWhereFromSearch("")).toBe("state:active");
  expect(buildWhereFromSearch("foo")).toBe("state:active,name:foo*");
  expect(buildWhereFromSearch("foo*")).toBe("state:active,name:foo*");
  expect(buildWhereFromSearch("type:compose")).toBe(
    "state:active,type:compose"
  );
  expect(buildWhereFromSearch("tags:build:candidate")).toBe(
    "state:active,tags:build:candidate"
  );
  expect(buildWhereFromSearch("type:Compose")).toBe(
    "state:active,type:compose"
  );
  expect(buildWhereFromSearch("state:inactive,name:foo")).toBe(
    "state:inactive,name:foo"
  );
});

test("buildWhereFromSearch with different default key", () => {
  expect(buildWhereFromSearch("foo")).toBe("state:active,name:foo*");
  expect(buildWhereFromSearch("foo", "canonical_project_name")).toBe(
    "state:active,canonical_project_name:foo*"
  );
});
