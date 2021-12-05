import { humanFileSize } from "./filesGetters";
import { IFile } from "types";
import { isATextFile } from "./filesGetters";

test("humanFileSize", () => {
  expect(humanFileSize(0)).toEqual("0 B");
  expect(humanFileSize(1000)).toEqual("1000 B");
  expect(humanFileSize(6124000)).toEqual("5.84 MB");
});

test("isATextFile", () => {
  expect(isATextFile({ mime: "text/plain" } as IFile)).toBe(true);
  expect(isATextFile({ mime: "application/junit" } as IFile)).toBe(true);
  expect(isATextFile({ mime: "text/css" } as IFile)).toBe(true);
  expect(isATextFile({ mime: "text/csv" } as IFile)).toBe(true);
  expect(isATextFile({ mime: "text/html" } as IFile)).toBe(true);
  expect(isATextFile({ mime: "text/calendar" } as IFile)).toBe(true);
  expect(isATextFile({ mime: "application/json" } as IFile)).toBe(true);
  expect(isATextFile({ mime: "text/javascript" } as IFile)).toBe(true);
  expect(isATextFile({ mime: "image/svg+xml" } as IFile)).toBe(true);
  expect(isATextFile({ mime: "application/xhtml+xml" } as IFile)).toBe(true);
  expect(isATextFile({ mime: "application/xml" } as IFile)).toBe(true);
  expect(isATextFile({ mime: "text/unknown" } as IFile)).toBe(true);

  expect(isATextFile({ mime: "application/x-gzip" } as IFile)).toBe(false);
  expect(isATextFile({ mime: "application/zip" } as IFile)).toBe(false);
  expect(isATextFile({ mime: "application/zlib" } as IFile)).toBe(false);
  expect(isATextFile({ mime: "audio/aac" } as IFile)).toBe(false);
  expect(isATextFile({ mime: "font/woff" } as IFile)).toBe(false);
  expect(isATextFile({ mime: null } as IFile)).toBe(false);
});
