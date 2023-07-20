import { IFile, IFileStatus } from "types";

export function getFileStatus(file: IFile): IFileStatus {
  return file.name.startsWith("failed/") || file.name.startsWith("item_failed/")
    ? "failed"
    : file.name.startsWith("unreachable/")
    ? "unreachable"
    : file.name.startsWith("skipped/")
    ? "skipped"
    : file.name.startsWith("ignored/")
    ? "ignored"
    : file.name.startsWith("warn/")
    ? "withAWarning"
    : "success";
}

export function buildFileTitle(fileName: string) {
  let re = new RegExp("^((failed|unreachable|skipped|warn)/)?(PLAY|TASK)(.*)");
  let title;

  if (re.test(fileName)) {
    title = fileName.replace(re, "$3$4");
  } else {
    title = `TASK [${fileName}] `;
  }
  return title;
}

export function isFileEmpty(file: IFile) {
  let re = new RegExp("^((failed|unreachable|skipped)/)?(PLAY [\\[]|PLAYBOOK)");

  return re.test(file.name);
}
