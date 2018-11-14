import React from "react";
import styled from "styled-components";
import { Colors } from "../../ui";

export const JobStates = styled.div`
  padding: 1em 0;
  background-color: ${Colors.black900};
`;

export const JobStateRow = styled.div`
  position: relative;
  margin: 0;
  min-height: 20px;
  padding-top: 1px;
`;

export const Label = styled.span`
  z-index: 10;
  display: block;
  right: 80px;
  position: absolute;
  top: 4px;
  padding: 1px 7px 2px;
  line-height: 0.8em;
  font-size: 0.8em;
  background-color: ${Colors.black600};
  border-radius: 6px;
  color: ${Colors.black300};
`;

export const SuccessLabel = styled(Label)`
  background-color: ${Colors.green400};
  color: ${Colors.white};
`;

export const FailureLabel = styled(Label)`
  background-color: ${Colors.red100};
  color: ${Colors.white};
`;

export const ErrorLabel = styled(Label)`
  background-color: ${Colors.red100};
  color: ${Colors.white};
`;

export const FileRow = styled(JobStateRow)`
  color: ${Colors.gold200};
  background-color: ${Colors.black800};
  margin-bottom: 1px;
  cursor: pointer;

  &:hover {
    background-color: ${Colors.black700};
  }
`;

export const FileName = styled.span`
  line-height: 1.2em;
  font-size: 0.9em;
  display: block;
  left: 3em;
  position: absolute;
`;
export const Arrow = styled.span`
  display: block;
  left: 1em;
  position: absolute;
`;

export const Pre = styled.pre`
  font-family: monospace;
  font-size: 0.9em;
  line-height: 1.2em;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding: 0 2em 0 3em;
  background-color: ${Colors.black800};
  color: ${Colors.black200};
  border: none;
  margin: 0;
  margin-bottom: 1px;
`;

export const LabelPositionedOnTheRight = styled(Label)`
  right: 1em;
`;

export function DurationLabel({ duration }) {
  if (duration === null) return null;
  return (
    <LabelPositionedOnTheRight>{`${duration}s`}</LabelPositionedOnTheRight>
  );
}
