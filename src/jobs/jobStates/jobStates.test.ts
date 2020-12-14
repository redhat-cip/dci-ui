import { getFileStatus } from "./jobStates";
import { IFile } from "types";

it("getFileStatus", () => {
  expect(
    getFileStatus({
      name: "failed/installer : xxxxxxxxxxxx",
    } as IFile)
  ).toEqual("failed");
  expect(
    getFileStatus({
      name: "item_failed/xxxxxxxxxxxx",
    } as IFile)
  ).toEqual("failed");
  expect(
    getFileStatus({
      name: "failed/installer : xxxxxxxxxxxx",
    } as IFile)
  ).toEqual("failed");
  expect(
    getFileStatus({
      name: "unreachable/xxxxxxxxxxxx",
    } as IFile)
  ).toEqual("unreachable");
  expect(
    getFileStatus({
      name: "xxxxxxxxxxxx",
    } as IFile)
  ).toEqual("success");
  expect(
    getFileStatus({
      name: "skipped/node-prep : Check ansible version",
    } as IFile)
  ).toEqual("skipped");
});
