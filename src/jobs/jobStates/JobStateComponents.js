import styled, { css } from "styled-components";
import { Colors } from "ui";

export const JobStates = styled.div`
  padding: 1em 0;
  background-color: ${Colors.black900};
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
  display: flex;
  align-items: center;
  &:hover {
    background-color: ${Colors.black700};
  }
`;

export const ShareLink = styled.a`
  margin-left: 10px;
  font-size: 11px;
  color: ${Colors.black600};
  &:hover {
    color: ${Colors.black200};
  }
  ${props =>
    props.isSelected &&
    css`
      color: ${Colors.black200};
    `};
`;

export const CaretIcon = styled.div`
  margin-left: 10px;
  font-size: 13px;
  color: ${Colors.black600};
`;

export const FileName = styled.div`
  margin-left: 10px;
  font-size: 14px;
  flex: 1;
`;

export const FileContent = styled.div`
  background-color: ${Colors.black800};
  padding: 1em 0;
`;

export const Pre = styled.pre`
  font-family: monospace;
  font-size: 11px;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding: 0 20px 0 35px;
  color: ${Colors.black600};
  border: none;
  margin: 0;
  margin-bottom: 1px;
`;
