import { humanFileSize } from "./filesGetters";

it("humanFileSize", () => {
  expect(humanFileSize(0)).toEqual("0 B");
  expect(humanFileSize(1000)).toEqual("1000 B");
  expect(humanFileSize(6124000)).toEqual("5.84 MB");
});
