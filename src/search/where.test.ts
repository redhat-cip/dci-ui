import { buildWhereFromSearch, parseWhereFromSearch } from "./where";

test("buildWhereFromSearch", () => {
  expect(
    buildWhereFromSearch({
      display_name: null,
      tags: [],
      type: null,
      state: "active",
    })
  ).toBe("?where=state:active");
  expect(
    buildWhereFromSearch({
      display_name: "foo",
      tags: [],
      type: null,
      state: "active",
    })
  ).toBe("?where=state:active,display_name:foo*");
  expect(
    buildWhereFromSearch({
      display_name: "foo*",
      tags: [],
      type: null,
      state: "active",
    })
  ).toBe("?where=state:active,display_name:foo*");
  expect(
    buildWhereFromSearch({
      display_name: null,
      tags: [],
      type: "compose",
      state: "active",
    })
  ).toBe("?where=state:active,type:compose");
  expect(
    buildWhereFromSearch({
      display_name: null,
      tags: ["build:candidate"],
      type: null,
      state: "active",
    })
  ).toBe("?where=state:active,tags:build:candidate");
  expect(
    buildWhereFromSearch({
      display_name: null,
      tags: [],
      type: "Compose",
      state: "active",
    })
  ).toBe("?where=state:active,type:compose");
  expect(
    buildWhereFromSearch({
      display_name: "foo",
      tags: [],
      type: null,
      state: "inactive",
    })
  ).toBe("?where=state:inactive,display_name:foo*");
});

test("parseWhereFromSearch", () => {
  expect(parseWhereFromSearch("")).toEqual({
    display_name: null,
    tags: [],
    type: null,
    state: "active",
  });
  expect(parseWhereFromSearch("?where=state:inactive")).toEqual({
    display_name: null,
    tags: [],
    type: null,
    state: "inactive",
  });
  expect(
    parseWhereFromSearch(
      "?where=display_name:toto,state:inactive,tags:test:1,tags:test:2,type:compose"
    )
  ).toEqual({
    display_name: "toto",
    tags: ["test:1", "test:2"],
    type: "compose",
    state: "inactive",
  });
});
