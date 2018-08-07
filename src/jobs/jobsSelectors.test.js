import { paginate } from "./jobsSelectors";

it("getJobsPaginate", () => {
  const jobs = [
    { id: "j1" },
    { id: "j2" },
    { id: "j3" },
    { id: "j4" },
    { id: "j5" }
  ];
  expect(
    paginate(jobs, {
      page: 1,
      perPage: 1
    })
  ).toEqual([{ id: "j1" }]);
  expect(
    paginate(jobs, {
      page: 1,
      perPage: 2
    })
  ).toEqual([{ id: "j1" }, { id: "j2" }]);
  expect(
    paginate(jobs, {
      page: 2,
      perPage: 2
    })
  ).toEqual([{ id: "j3" }, { id: "j4" }]);
  expect(
    paginate(jobs, {
      page: 3,
      perPage: 2
    })
  ).toEqual([{ id: "j5" }]);
});
