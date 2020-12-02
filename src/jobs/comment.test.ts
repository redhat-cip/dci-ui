import { convertLinksToHtml } from "./comment";

test("convertLinksToHtml", () => {
  expect(
    convertLinksToHtml("https://softwarefactory-project.io/r/#/dashboard/self")
  ).toBe(
    '<a href="https://softwarefactory-project.io/r/#/dashboard/self">https://softwarefactory-project.io/r/#/dashboard/self</a>'
  );
  expect(
    convertLinksToHtml(
      "See https://softwarefactory-project.io/r/#/dashboard/self"
    )
  ).toBe(
    'See <a href="https://softwarefactory-project.io/r/#/dashboard/self">https://softwarefactory-project.io/r/#/dashboard/self</a>'
  );
  expect(
    convertLinksToHtml(`Built by example.org
with an amazing CI tool https://distributed-ci.io`)
  ).toBe(`Built by example.org
with an amazing CI tool <a href="https://distributed-ci.io">https://distributed-ci.io</a>`);
  expect(convertLinksToHtml("Send email at contact@example.org")).toBe(
    "Send email at contact@example.org"
  );
  expect(convertLinksToHtml(undefined)).toBe("");
  expect(convertLinksToHtml(null)).toBe("");
  expect(convertLinksToHtml("")).toBe("");
});
