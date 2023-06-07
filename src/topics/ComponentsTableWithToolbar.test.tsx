import { findChannelInTags } from "./ComponentsTableWithToolbar";

test("findChannelInTags", () => {
  expect(findChannelInTags([])).toBe(null);
  expect(
    findChannelInTags([
      "kernel:4.18.0-477.10.1.el8_8",
      "nightly",
      "candidate",
      "milestone",
    ])
  ).toBe("milestone");
  expect(
    findChannelInTags(["kernel:4.18.0-477.10.1.el8_8", "candidate", "nightly"])
  ).toBe("candidate");
  expect(findChannelInTags(["candidate", "nightly"])).toBe("candidate");
  expect(findChannelInTags(["kernel:4.18.0-477.10.1.el8_8", "nightly"])).toBe(
    "nightly"
  );
  expect(findChannelInTags(["kernel:4.18.0-477.10.1.el8_8"])).toBe(null);
});
