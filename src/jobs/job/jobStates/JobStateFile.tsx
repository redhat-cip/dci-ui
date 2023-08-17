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
import { IFileWithDuration } from "types";
import { buildFileTitle, getFileStatus, isFileEmpty } from "./jobStates";
import { useTheme } from "ui/Theme/themeContext";

interface JobStateFileProps {
  file: IFileWithDuration;
  isSelected: boolean;
  onClick: (seeDetails: boolean) => void;
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
  const { isDark } = useTheme();
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

  const title = buildFileTitle(file.name);
  const fileDuration = `${Math.round(file.duration)}s`;
  const fileIsEmpty = isFileEmpty(file);
  return (
    <div id={file.id} ref={divRef}>
      <FileRow
        isDark={isDark}
        status={getFileStatus(file)}
        onClick={() => {
          if (!fileIsEmpty) {
            setSeeDetails(!seeDetails);
            onClick(!seeDetails);
          }
        }}
        className={fileIsEmpty ? "" : "pointer"}
      >
        <IconContainer>
          {fileIsEmpty ? null : seeDetails ? (
            <CaretDownIcon />
          ) : (
            <CaretRightIcon />
          )}
        </IconContainer>
        <FileName>{title}</FileName>
        <LabelBox className="pf-v5-u-mr-md">
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
