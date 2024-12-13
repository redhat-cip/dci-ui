import { createAnalyticsSearchParams } from "./analyticsApi";

test("transform data", () => {
  expect(
    createAnalyticsSearchParams({
      query: "((tag in [daily]) and (team.name=DCI))",
      offset: 0,
      limit: 200,
      removeMe: null,
      sort: "-created_at",
      includes:
        "id,name,created_at,keys_values,status,status_reason,comment,duration,pipeline.id,pipeline.created_at,pipeline.name,components.id,components.topic_id,components.display_name,results.errors,results.failures,results.success,results.failures,results.skips,results.total,team.id,team.name",
      from: "2024-12-10",
      to: "2024-12-16",
    }),
  ).toBe(
    "query=%28%28tag+in+%5Bdaily%5D%29+and+%28team.name%3DDCI%29%29&offset=0&limit=200&sort=-created_at&includes=id%2Cname%2Ccreated_at%2Ckeys_values%2Cstatus%2Cstatus_reason%2Ccomment%2Cduration%2Cpipeline.id%2Cpipeline.created_at%2Cpipeline.name%2Ccomponents.id%2Ccomponents.topic_id%2Ccomponents.display_name%2Cresults.errors%2Cresults.failures%2Cresults.success%2Cresults.failures%2Cresults.skips%2Cresults.total%2Cteam.id%2Cteam.name&from=2024-12-10&to=2024-12-16",
  );
});
