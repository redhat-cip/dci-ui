import { useEffect, useState, useCallback, useRef, Fragment } from "react";
import { CaretDownIcon, CaretRightIcon } from "@patternfly/react-icons";
import { getFileContent } from "jobs/job/files/filesActions";
import {
  FileRow,
  FileName,
  FileContent,
  IconContainer,
  JobStatePre,
  Label,
  LabelBox,
} from "./JobStateComponents";
import { IFile, IFileWithDuration } from "types";
import { getFileStatus } from "./jobStates";

interface JobStateFileProps {
  file: IFileWithDuration;
  isSelected: boolean;
  onClick: (seeDetails: boolean) => void;
}

function buildTitle(fileName: string) {
  let re = new RegExp("^((failed|unreachable|skipped)/)?(PLAY|TASK)(.*)");
  let title;

  if (re.test(fileName)) {
    title = fileName.replace(re, "$3$4");
  } else {
    title = `TASK [${fileName}] `;
  }
  return `${title} `.padEnd(100, "*");
}

function isFileEmpty(file: IFile) {
  let re = new RegExp("^((failed|unreachable|skipped)/)?(PLAY [\\[]|PLAYBOOK)");

  return re.test(file.name);
}

export default function JobStateFile({
  file,
  isSelected,
  onClick,
}: JobStateFileProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [seeDetails, setSeeDetails] = useState(false);

  const loadFileContentCallback = useCallback(() => {
    setIsLoading(true);
    getFileContent(file)
      .then((content) => {
        setContent(content);
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, [file]);

  useEffect(() => {
    if (seeDetails) {
      loadFileContentCallback();
    }
  }, [seeDetails, loadFileContentCallback]);

  useEffect(() => {
    if (isSelected) {
      setSeeDetails(true);
      divRef.current?.scrollIntoView();
    }
  }, [isSelected, setSeeDetails, divRef]);

  const title = buildTitle(file.name);
  const fileDuration = `${Math.round(file.duration)}s`;
  return (
    <div id={file.id} ref={divRef}>
      <FileRow
        status={getFileStatus(file)}
        onClick={() => {
          if (!isFileEmpty(file)) {
            setSeeDetails(!seeDetails);
            onClick(!seeDetails);
          }
        }}
        className={isFileEmpty(file) ? "" : "pointer"}
      >
        <IconContainer>
          {isFileEmpty(file) ? null : seeDetails ? (
            <CaretDownIcon />
          ) : (
            <CaretRightIcon />
          )}
        </IconContainer>
        <FileName>{title}</FileName>
        <LabelBox className="mr-md">
          <Label>{fileDuration}</Label>
        </LabelBox>
      </FileRow>
      {seeDetails ? (
        <FileContent>
          <JobStatePre>
            {isLoading
              ? "loading"
              : content === ""
              ? `no log for "${file.name}"`
              : content.split("\\n").map((line, i) => (
                  <Fragment key={i}>
                    {line}
                    <br />
                  </Fragment>
                ))}
          </JobStatePre>
        </FileContent>
      ) : null}
    </div>
  );
}
