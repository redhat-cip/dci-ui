import { sortByName } from "./sort";

it("sortByName", () => {
  expect(
    sortByName([
      {
        id: "1",
        name: "b"
      },
      {
        id: "2",
        name: "A"
      }
    ])
  ).toEqual([
    {
      id: "2",
      name: "A"
    },
    {
      id: "1",
      name: "b"
    }
  ]);
});
