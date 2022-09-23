import styled, { css } from "styled-components";
import {
  global_warning_color_100,
  global_info_color_100,
  global_BackgroundColor_dark_200,
  global_BackgroundColor_dark_400,
  global_danger_color_100,
  global_palette_black_200,
  global_palette_black_300,
  global_palette_black_500,
  global_palette_black_600,
  global_palette_black_800,
} from "@patternfly/react-tokens";
import { Button, Dropdown } from "@patternfly/react-core";
import { IFileStatus } from "types";

export const JobStates = styled.div`
  padding: 1rem 0;
  background-color: ${global_BackgroundColor_dark_200.value};
`;

export const RawLogRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
`;

export const RawLogButton = styled(Button)`
  color: ${global_palette_black_200.value} !important;
  &:after {
    border-color: ${global_palette_black_200.value} !important;
  }
`;

export const JobStateRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem 0 1rem;
  min-height: 25px;
  border-bottom: 1px solid ${global_BackgroundColor_dark_400.value};
`;

export const JobStateName = styled.div`
  color: ${global_palette_black_500.value};
  font-size: 14px;
  font-family: monospace;
  flex: 1;
`;

export const LabelBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const Label = styled.span`
  z-index: 10;
  padding: 2px 5px;
  line-height: 12px;
  font-size: 12px;
  background-color: ${global_palette_black_600.value};
  border-radius: 6px;
  color: ${global_palette_black_300.value};
`;

interface FileRowProps {
  status: IFileStatus;
}

export const FileRow = styled.div<FileRowProps>`
  display: flex;
  align-items: center;
  min-height: 25px;
  border-bottom: 1px solid ${global_BackgroundColor_dark_400.value};
  ${(props) =>
    props.status === "failed" || props.status === "unreachable"
      ? css`
          color: ${global_danger_color_100.value};
        `
      : props.status === "skipped" || props.status === "ignored"
      ? css`
          color: ${global_info_color_100.value};
        `
      : css`
          color: ${global_warning_color_100.value};
        `};
  background-color: ${global_BackgroundColor_dark_200.value};
  &:hover {
    background-color: ${global_BackgroundColor_dark_400.value};
  }
`;

export const IconContainer = styled.div`
  width: 2rem;
  min-height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: ${global_palette_black_500.value};
  &:hover {
    color: ${global_palette_black_200.value};
  }
`;

export const FileName = styled.div`
  font-size: 14px;
  font-family: monospace;
  flex: 1;
`;

export const FileContent = styled.div`
  background-color: ${global_palette_black_800.value};
  padding: 1em 0;
  font-family: monospace;
`;

export const Pre = styled.pre`
  font-family: monospace;
  font-size: 11px;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding: 0;
  margin: 0;
  border: none;
`;

export const JobStatePre = styled(Pre)`
  color: ${global_palette_black_200.value};
  padding: 0 20px 0 35px;
  margin-bottom: 1px;
`;
