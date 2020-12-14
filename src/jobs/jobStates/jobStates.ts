import { IFile, IFileStatus } from "types";

export function getFileStatus(file: IFile): IFileStatus {
  return file.name.startsWith("failed/") || file.name.startsWith("item_failed/")
    ? "failed"
    : file.name.startsWith("unreachable/")
    ? "unreachable"
    : file.name.startsWith("skipped/")
    ? "skipped"
    : "success";
}
