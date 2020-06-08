import styled, { css } from "styled-components";
import {
  global_palette_gold_300,
  global_palette_red_100,
  global_palette_green_400,
  global_palette_black_200,
  global_palette_black_300,
  global_palette_black_600,
  global_palette_black_700,
  global_palette_black_800,
  global_palette_white,
} from "@patternfly/react-tokens";

export const JobStates = styled.div`
  padding: 1em 0;
  background-color: ${global_palette_black_800.value};
`;

export const JobStateRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0;
  min-height: 20px;
  padding-top: 1px;
`;

export const LabelBox = styled.div`
  min-width: 60px;
  align-self: right;
  margin: 0 1em;
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

export const SuccessLabel = styled(Label)`
  background-color: ${global_palette_green_400.value};
  color: ${global_palette_white.value};
`;

export const FailureLabel = styled(Label)`
  background-color: ${global_palette_red_100.value};
  color: ${global_palette_white.value};
`;

export const ErrorLabel = styled(Label)`
  background-color: ${global_palette_red_100.value};
  color: ${global_palette_white.value};
`;

export const FileRow = styled(JobStateRow)`
  color: ${global_palette_gold_300.value};
  background-color: ${global_palette_black_700.value};
  margin-bottom: 1px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background-color: ${global_palette_black_600.value};
  }
`;

export const ShareLink = styled.a`
  margin-left: 10px;
  font-size: 11px;
  color: ${global_palette_black_600.value};
  &:hover {
    color: ${global_palette_black_200.value};
  }
  ${(props) =>
    props.isSelected &&
    css`
      color: ${global_palette_black_200.value};
    `};
`;

export const CaretIcon = styled.div`
  margin-left: 10px;
  font-size: 13px;
  color: ${global_palette_black_600.value};
`;

export const FileName = styled.div`
  margin-left: 10px;
  font-size: 14px;
  flex: 1;
`;

export const FileContent = styled.div`
  background-color: ${global_palette_black_800.value};
  padding: 1em 0;
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
