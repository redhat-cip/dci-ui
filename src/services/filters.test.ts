import { state } from "types";
import {
  parseFiltersFromSearch,
  createSearchFromFilters,
  offsetAndLimitToPage,
  pageAndLimitToOffset,
} from "./filters";

describe("parseFiltersFromSearch", () => {
  test("parse limit and offset from empty search", () => {
    const { limit, offset } = parseFiltersFromSearch("");
    expect(limit).toBe(20);
    expect(offset).toBe(0);
  });
  test("parse limit and offset from search", () => {
    const { limit, offset } = parseFiltersFromSearch("?limit=100&offset=100");
    expect(limit).toBe(100);
    expect(offset).toBe(100);
  });
  test("parse limit and not offset from search", () => {
    const { limit, offset } = parseFiltersFromSearch("?limit=100");
    expect(limit).toBe(100);
    expect(offset).toBe(0);
  });
  test("parse limit and offset from legacy search (page and perPage)", () => {
    const { limit, offset } = parseFiltersFromSearch("?page=2&perPage=40");
    expect(limit).toBe(40);
    expect(offset).toBe(40);
  });
  test("parse sort from empty search", () => {
    expect(parseFiltersFromSearch("").sort).toBe("-created_at");
  });
  test("parse sort from search", () => {
    expect(parseFiltersFromSearch("?sort=-released_at").sort).toBe(
      "-released_at",
    );
    expect(parseFiltersFromSearch("?sort=released_at").sort).toBe(
      "released_at",
    );
    expect(parseFiltersFromSearch("?sort=-created_at").sort).toBe(
      "-created_at",
    );
    expect(parseFiltersFromSearch("?sort=created_at").sort).toBe("created_at");
    expect(parseFiltersFromSearch("?sort=-updated_at").sort).toBe(
      "-updated_at",
    );
    expect(parseFiltersFromSearch("?sort=updated_at").sort).toBe("updated_at");
  });
  test("parse where from empty search", () => {
    expect(parseFiltersFromSearch("")).toEqual({
      limit: 20,
      offset: 0,
      sort: "-created_at",
      query: null,
      state: "active",
      name: null,
      display_name: null,
      sso_username: null,
      email: null,
      team_id: null,
      pipeline_id: null,
      remoteci_id: null,
      product_id: null,
      topic_id: null,
      tags: [],
      configuration: null,
      status: null,
      type: null,
    });
  });
  test("parse name from search", () => {
    const { name } = parseFiltersFromSearch("?where=name:RHEL-8*");
    expect(name).toBe("RHEL-8*");
  });
  test("parse state from search", () => {
    const { state } = parseFiltersFromSearch("?where=state:inactive");
    expect(state).toBe("inactive");
  });
  test("parse sso_username from search", () => {
    const { sso_username } = parseFiltersFromSearch(
      "?where=sso_username:my_username",
    );
    expect(sso_username).toBe("my_username");
  });
  test("parse tags from search", () => {
    const { tags } = parseFiltersFromSearch(
      "?where=tags:job:fake-cnf,tags:inventory:cluster6-post.yml",
    );
    expect(tags).toEqual(["job:fake-cnf", "inventory:cluster6-post.yml"]);
  });
  test("parse display_name from search", () => {
    const { display_name } = parseFiltersFromSearch(
      "?where=display_name:RHEL-8*",
    );
    expect(display_name).toBe("RHEL-8*");
  });
  test("parse email from search", () => {
    const { email } = parseFiltersFromSearch("?where=email:test@example.org");
    expect(email).toBe("test@example.org");
  });
  test("parse team_id from search", () => {
    const { team_id } = parseFiltersFromSearch(
      "?where=team_id:e5147a96-7c76-4415-b01e-edefba96a9c8",
    );
    expect(team_id).toBe("e5147a96-7c76-4415-b01e-edefba96a9c8");
  });
  test("parse pipeline_id from search", () => {
    const { pipeline_id } = parseFiltersFromSearch(
      "?where=pipeline_id:e5147a96-7c76-4415-b01e-edefba96a9c8",
    );
    expect(pipeline_id).toBe("e5147a96-7c76-4415-b01e-edefba96a9c8");
  });
  test("parse remoteci_id from search", () => {
    const { remoteci_id } = parseFiltersFromSearch(
      "?where=remoteci_id:4aa1a4bb-6bb1-4953-a5c7-a3eef7b7f4e3",
    );
    expect(remoteci_id).toBe("4aa1a4bb-6bb1-4953-a5c7-a3eef7b7f4e3");
  });
  test("parse product_id from search", () => {
    const { product_id } = parseFiltersFromSearch(
      "?where=product_id:a129df80-50ae-47bd-a3fe-fa783f894531",
    );
    expect(product_id).toBe("a129df80-50ae-47bd-a3fe-fa783f894531");
  });
  test("parse topic_id from search", () => {
    const { topic_id } = parseFiltersFromSearch(
      "?where=topic_id:6ec27949-ecdc-4d93-9056-425b4d9f2020",
    );
    expect(topic_id).toBe("6ec27949-ecdc-4d93-9056-425b4d9f2020");
  });
  test("parse configuration from search", () => {
    const { configuration } = parseFiltersFromSearch(
      "?where=configuration:config1",
    );
    expect(configuration).toBe("config1");
  });
  test("parse status from search", () => {
    const { status } = parseFiltersFromSearch("?where=status:success");
    expect(status).toBe("success");
  });
  test("parse multiple fields from search", () => {
    const {
      name,
      state,
      sso_username,
      tags,
      display_name,
      email,
      team_id,
      remoteci_id,
      product_id,
      topic_id,
      configuration,
      status,
    } = parseFiltersFromSearch(
      "?where=name:RHEL-8*,state:inactive,sso_username:sso_username1,tags:job:fake-cnf,tags:inventory:cluster6-post.yml",
    );
    expect(name).toBe("RHEL-8*");
    expect(state).toBe("inactive");
    expect(sso_username).toBe("sso_username1");
    expect(tags).toEqual(["job:fake-cnf", "inventory:cluster6-post.yml"]);
    expect(display_name).toBeNull();
    expect(email).toBeNull();
    expect(team_id).toBeNull();
    expect(remoteci_id).toBeNull();
    expect(product_id).toBeNull();
    expect(topic_id).toBeNull();
    expect(configuration).toBeNull();
    expect(status).toBeNull();
  });
  test("from search with query", () => {
    const search = "?page=2&perPage=40&query=eq(name,openshift)";
    const { limit, offset, query } = parseFiltersFromSearch(search);
    expect(limit).toBe(40);
    expect(offset).toBe(40);
    expect(query).toEqual("eq(name,openshift)");
  });
  test("nrt page and perPage are removed after parsing", () => {
    const search = "?page=2&perPage=40";
    // @ts-expect-error
    const { limit, offset, page, perPage } = parseFiltersFromSearch(search);
    expect(limit).toBe(40);
    expect(offset).toBe(40);
    expect(page).toBe(undefined);
    expect(perPage).toBe(undefined);
  });
  test("nrt parse where from search where name has multiple colon", () => {
    expect(parseFiltersFromSearch("?where=name:1.2.3:5*").name).toBe(
      "1.2.3:5*",
    );
  });
  test("parse search with default value", () => {
    const { limit, offset, sort } = parseFiltersFromSearch("", {
      limit: 100,
      offset: 100,
      sort: "released_at",
    });
    expect(limit).toBe(100);
    expect(offset).toBe(100);
    expect(sort).toBe("released_at");
  });
  test("parse search with default value use info from search string", () => {
    const { limit, offset, sort } = parseFiltersFromSearch(
      "?limit=20&offset=0&sort=-created_at",
      {
        limit: 100,
        offset: 100,
        sort: "released_at",
      },
    );
    expect(limit).toBe(20);
    expect(offset).toBe(0);
    expect(sort).toBe("-created_at");
  });
  test("Keep unknown keys", () => {
    const filters = parseFiltersFromSearch(
      "?query=%28name%3D%27example%27%29+and+%28status%3D%27success%27%29&range=last30Days&after=2025-05-14&before=2025-06-13",
    );
    expect(filters).toEqual({
      query: "(name='example') and (status='success')",
      range: "last30Days",
      after: "2025-05-14",
      before: "2025-06-13",
      configuration: null,
      display_name: null,
      email: null,
      limit: 20,
      name: null,
      offset: 0,
      pipeline_id: null,
      product_id: null,
      remoteci_id: null,
      sort: "-created_at",
      sso_username: null,
      state: "active",
      status: null,
      tags: [],
      team_id: null,
      topic_id: null,
      type: null,
    });
  });
});

describe("createSearchFromFilters", () => {
  test("create search from default filters", () => {
    expect(
      createSearchFromFilters({
        limit: 100,
        offset: 0,
        sort: "-created_at",
        name: null,
        display_name: null,
        sso_username: null,
        email: null,
        team_id: null,
        pipeline_id: null,
        state: "active",
      }),
    ).toBe("?limit=100&offset=0&sort=-created_at&where=state:active");
  });
  test("create search from partial filters", () => {
    expect(
      createSearchFromFilters({
        name: "name1",
      }),
    ).toBe("?limit=20&offset=0&sort=-created_at&where=name:name1,state:active");
  });
  test("with query", () => {
    expect(
      createSearchFromFilters({
        limit: 100,
        offset: 0,
        query: "eq(name,openshift)",
      }),
    ).toBe("?limit=100&offset=0&sort=-created_at&query=eq(name,openshift)");
  });
  test("create search from complex filters", () => {
    expect(
      createSearchFromFilters({
        limit: 200,
        offset: 20,
        sort: "-released_at",
        name: "name1",
        display_name: "display_name2",
        sso_username: "sso_username1",
        team_id: "e5147a96-7c76-4415-b01e-edefba96a9c8",
        state: "active",
        remoteci_id: "4aa1a4bb-6bb1-4953-a5c7-a3eef7b7f4e3",
        product_id: "a129df80-50ae-47bd-a3fe-fa783f894531",
        topic_id: "6ec27949-ecdc-4d93-9056-425b4d9f2020",
        pipeline_id: "95491621-dd38-4ffe-8c90-88151883f559",
        tags: ["tag1", "tag2"],
        configuration: "config1",
        status: "success" as state,
        email: "test@example.org",
      }),
    ).toEqual(
      "?limit=200&offset=20&sort=-released_at&where=name:name1,display_name:display_name2,sso_username:sso_username1,team_id:e5147a96-7c76-4415-b01e-edefba96a9c8,pipeline_id:95491621-dd38-4ffe-8c90-88151883f559,email:test@example.org,remoteci_id:4aa1a4bb-6bb1-4953-a5c7-a3eef7b7f4e3,product_id:a129df80-50ae-47bd-a3fe-fa783f894531,topic_id:6ec27949-ecdc-4d93-9056-425b4d9f2020,tags:tag1|tag2,configuration:config1,status:success,state:active",
    );
  });
  test("keep extra fields", () => {
    expect(
      createSearchFromFilters({
        limit: 200,
        offset: 20,
        query: "(name='example') and (status='success')",
        range: "last30Days",
        after: "2025-05-14",
        before: "2025-06-13",
      }),
    ).toEqual(
      "?limit=200&offset=20&sort=-created_at&query=(name='example') and (status='success')&range=last30Days&after=2025-05-14&before=2025-06-13",
    );
  });
});

describe("offset limit", () => {
  test("offsetAndLimitToPage", () => {
    expect(offsetAndLimitToPage(0, 100)).toBe(1);
    expect(offsetAndLimitToPage(100, 100)).toBe(2);
    expect(offsetAndLimitToPage(10, 100)).toBe(1);
    expect(offsetAndLimitToPage(20, 20)).toBe(2);
    expect(offsetAndLimitToPage(40, 20)).toBe(3);
  });

  test("pageAndLimitToOffset", () => {
    expect(pageAndLimitToOffset(1, 100)).toBe(0);
    expect(pageAndLimitToOffset(2, 100)).toBe(100);
    expect(pageAndLimitToOffset(0, 100)).toBe(0);
  });
});
