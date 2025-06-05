import { deleteListItem } from "./ListToolbarFilter";

describe("deleteListItem helper", () => {
  const baseline = ["one", "two", "three"];

  test("removes the first item", () => {
    expect(deleteListItem(baseline, "one")).toEqual(["two", "three"]);
  });

  test("removes a middle item", () => {
    expect(deleteListItem(baseline, "two")).toEqual(["one", "three"]);
  });

  test("removes the last item", () => {
    expect(deleteListItem(baseline, "three")).toEqual(["one", "two"]);
  });

  test("deduplicates items before removal", () => {
    const dupes = ["one", "one", "two", "three"];
    expect(deleteListItem(dupes, "one")).toEqual(["two", "three"]);
  });
});
