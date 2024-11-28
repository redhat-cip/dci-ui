import { useEffect, useState, useCallback, useRef } from "react";
import { CaretDownIcon, CaretRightIcon } from "@patternfly/react-icons";
import { getFileContent } from "jobs/job/files/filesActions";
import { IFileStatus, IFileWithDuration } from "types";
import { buildFileTitle, getFileStatus, isFileEmpty } from "./jobStates";
import { Label } from "@patternfly/react-core";
import styled from "styled-components";
import {
  t_global_color_nonstatus_gray_default,
  t_global_color_nonstatus_gray_hover,
  t_global_color_nonstatus_green_default,
  t_global_color_nonstatus_orange_default,
  t_global_color_nonstatus_purple_default,
  t_global_color_nonstatus_red_default,
  t_global_color_nonstatus_blue_default,
  t_global_text_color_nonstatus_on_blue_default,
  t_global_text_color_nonstatus_on_purple_default,
  t_global_text_color_nonstatus_on_green_default,
  t_global_text_color_nonstatus_on_orange_default,
  t_global_text_color_nonstatus_on_red_default,
} from "@patternfly/react-tokens";

const TaskButton = styled.span`
  display: flex;
  justify-content: space-between;
  padding: 0;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  &:hover {
    background-color: ${t_global_color_nonstatus_gray_hover.var};
  }
`;

const backgroundTaskColors: Record<IFileStatus, string> = {
  failed: t_global_color_nonstatus_red_default.var,
  unreachable: t_global_color_nonstatus_orange_default.var,
  skipped: t_global_color_nonstatus_blue_default.var,
  ignored: t_global_color_nonstatus_blue_default.var,
  success: t_global_color_nonstatus_green_default.var,
  withAWarning: t_global_color_nonstatus_purple_default.var,
};

const textTaskColors: Record<IFileStatus, string> = {
  failed: t_global_text_color_nonstatus_on_red_default.var,
  unreachable: t_global_text_color_nonstatus_on_orange_default.var,
  skipped: t_global_text_color_nonstatus_on_blue_default.var,
  ignored: t_global_text_color_nonstatus_on_blue_default.var,
  success: t_global_text_color_nonstatus_on_green_default.var,
  withAWarning: t_global_text_color_nonstatus_on_purple_default.var,
};

interface JobStateRowProps {
  file: IFileWithDuration;
  isSelected: boolean;
  onClick: (seeDetails: boolean) => void;
}

export default function JobStateRow({
  file,
  isSelected,
  onClick,
}: JobStateRowProps) {
  const liRef = useRef<HTMLLIElement>(null);
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
      liRef.current?.scrollIntoView();
    }
  }, [isSelected, setSeeDetails, liRef]);

  const title = buildFileTitle(file.name);
  const fileDuration = `${Math.round(file.duration)}s`;
  const fileIsEmpty = isFileEmpty(file);
  const fileStatus = getFileStatus(file);
  return (
    <li id={file.id} ref={liRef}>
      <TaskButton
        onClick={() => {
          if (!fileIsEmpty) {
            setSeeDetails(!seeDetails);
            onClick(!seeDetails);
          }
        }}
      >
        <div
          style={{
            color: textTaskColors[fileStatus],
            backgroundColor: backgroundTaskColors[fileStatus],
          }}
        >
          <span>
            {seeDetails ? (
              <CaretDownIcon className="pf-v6-u-mr-xs" />
            ) : (
              <CaretRightIcon className="pf-v6-u-mr-xs" />
            )}
          </span>
          {title}
        </div>
        <div>
          <Label isCompact>{file.created_at}</Label>
          <Label isCompact className="pf-v6-u-ml-xs">
            {fileDuration}
          </Label>
        </div>
      </TaskButton>
      {seeDetails ? (
        <div
          style={{
            marginBottom: ".5em",
            padding: ".5em 1em 0.5em 1.5em",
            backgroundColor: t_global_color_nonstatus_gray_default.var,
          }}
        >
          {isLoading
            ? "loading"
            : content === ""
              ? `no log for "${file.name}"`
              : content
                  .split("\\n")
                  .map((line, i) => <div key={i}>{line}</div>)}
        </div>
      ) : null}
    </li>
  );
}
