import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  CaretDownIcon,
  CaretRightIcon,
  LinkIcon,
} from "@patternfly/react-icons";
import { getFileContent } from "jobs/files/filesActions";
import {
  FileRow,
  FileName,
  FileContent,
  CaretIcon,
  ShareLink,
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

  return (
    <div id={id} ref={divRef}>
      <FileRow
        status={getFileStatus(file)}
        onClick={() => {
          setSeeDetails(!seeDetails);
        }}
        className="pointer"
      >
        <ShareLink href={link} isSelected={isSelected}>
          <LinkIcon />
        </ShareLink>
        <CaretIcon>
          {seeDetails ? <CaretDownIcon /> : <CaretRightIcon />}
        </CaretIcon>
        <FileName>{`TASK [${file.name}] `.padEnd(80, "*")}</FileName>
        <LabelBox>
          <Label>{`${Math.round(file.duration)}s`}</Label>
        </LabelBox>
      </FileRow>
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
