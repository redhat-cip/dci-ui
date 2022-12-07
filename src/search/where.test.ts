import { buildWhereFromSearch, parseWhereFromSearch } from "./where";

test("buildWhereFromSearch", () => {
  expect(
    buildWhereFromSearch({
      canonical_project_name: null,
      tags: [],
      type: null,
      state: "active",
    })
  ).toBe("?where=state:active");
  expect(
    buildWhereFromSearch({
      canonical_project_name: "foo",
      tags: [],
      type: null,
      state: "active",
    })
  ).toBe("?where=state:active,canonical_project_name:foo*");
  expect(
    buildWhereFromSearch({
      canonical_project_name: "foo*",
      tags: [],
      type: null,
      state: "active",
    })
  ).toBe("?where=state:active,canonical_project_name:foo*");
  expect(
    buildWhereFromSearch({
      canonical_project_name: null,
      tags: [],
      type: "compose",
      state: "active",
    })
  ).toBe("?where=state:active,type:compose");
  expect(
    buildWhereFromSearch({
      canonical_project_name: null,
      tags: ["build:candidate"],
      type: null,
      state: "active",
    })
  ).toBe("?where=state:active,tags:build:candidate");
  expect(
    buildWhereFromSearch({
      canonical_project_name: null,
      tags: [],
      type: "Compose",
      state: "active",
    })
  ).toBe("?where=state:active,type:compose");
  expect(
    buildWhereFromSearch({
      canonical_project_name: "foo",
      tags: [],
      type: null,
      state: "inactive",
    })
  ).toBe("?where=state:inactive,canonical_project_name:foo*");
});

test("parseWhereFromSearch", () => {
  expect(parseWhereFromSearch("")).toEqual({
    canonical_project_name: null,
    tags: [],
    type: null,
    state: "active",
  });
  expect(parseWhereFromSearch("?where=state:inactive")).toEqual({
    canonical_project_name: null,
    tags: [],
    type: null,
    state: "inactive",
  });
  expect(
    parseWhereFromSearch(
      "?where=canonical_project_name:toto,state:inactive,tags:test:1,tags:test:2,type:compose"
    )
  ).toEqual({
    canonical_project_name: "toto",
    tags: ["test:1", "test:2"],
    type: "compose",
    state: "inactive",
  });
});
