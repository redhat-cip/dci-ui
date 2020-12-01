import React, { useEffect, useState } from "react";
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
import { AppDispatch } from "store";
import { useDispatch } from "react-redux";

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
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [seeDetails, setSeeDetails] = useState(isSelected);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (seeDetails) {
      setIsLoading(true);
      dispatch(getFileContent(file))
        .then((response) => {
          setContent(response.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [seeDetails, file, dispatch]);

  return (
    <div id={id}>
      <FileRow
        onClick={() => {
          setSeeDetails(true);
        }}
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
