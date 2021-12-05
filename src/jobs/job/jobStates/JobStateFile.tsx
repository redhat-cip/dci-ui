import { useEffect, useState, useCallback, useRef } from "react";
import {
  CaretDownIcon,
  CaretRightIcon,
  LinkIcon,
} from "@patternfly/react-icons";
import { getFileContent } from "jobs/job/files/filesActions";
import {
  FileRow,
  FileName,
  FileContent,
  CaretIcon,
  ShareLink,
  ShareLinkBox,
  JobStatePre,
  Label,
  LabelBox,
} from "./JobStateComponents";
import { IFileWithDuration } from "types";
import { getFileStatus } from "./jobStates";

interface JobStateFileProps {
  id: string;
  link: string;
  file: IFileWithDuration;
  isSelected: boolean;
}

function buildTitle(fileName: string) {
  let re = new RegExp("^((failed|unreachable|skipped)/)?(PLAY|TASK)(.*)");
  let title;

  if (re.test(fileName)) {
    title = fileName.replace(re, "$3$4");
  } else {
    title = `TASK [${fileName}] `;
  }
  return `${title} `.padEnd(80, "*");
}

function isFileEmpty(fileName: string) {
  let re = new RegExp("^((failed|unreachable|skipped)/)?(PLAY [\\[]|PLAYBOOK)");

  return re.test(fileName);
}

export default function JobStateFile({
  id,
  link,
  file,
  isSelected,
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
    <div id={id} ref={divRef}>
      {isFileEmpty(file.name) ? (
        <FileRow status={getFileStatus(file)}>
          <ShareLinkBox />
          <CaretIcon />
          <FileName>{title}</FileName>
          <LabelBox>
            <Label>{fileDuration}</Label>
          </LabelBox>
        </FileRow>
      ) : (
        <FileRow
          status={getFileStatus(file)}
          onClick={() => {
            setSeeDetails(!seeDetails);
          }}
          className="pointer"
        >
          <ShareLinkBox>
            <ShareLink href={link} isSelected={isSelected}>
              <LinkIcon />
            </ShareLink>
          </ShareLinkBox>
          <CaretIcon>
            {seeDetails ? <CaretDownIcon /> : <CaretRightIcon />}
          </CaretIcon>
          <FileName>{title}</FileName>
          <LabelBox>
            <Label>{fileDuration}</Label>
          </LabelBox>
        </FileRow>
      )}
      {seeDetails ? (
        <FileContent>
          <JobStatePre>
            {isLoading
              ? "loading"
              : content === ""
              ? `no log for "${file.name}"`
              : content}
          </JobStatePre>
        </FileContent>
      ) : null}
    </div>
  );
}
