import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getFileContent } from "../files/filesActions";
import { Colors } from "../../ui";

const JobStateRow = styled.div`
  position: relative;
  margin: 0;
  min-height: 20px;
  padding-top: 1px;
`;

const Label = styled.span`
  z-index: 10;
  display: block;
  right: 80px;
  position: absolute;
  top: 4px;
  padding: 1px 7px 2px;
  line-height: 10px;
  font-size: 10px;
  background-color: ${Colors.black600};
  border-radius: 6px;
  color: ${Colors.black300};
`;

const SuccessLabel = styled(Label)`
  background-color: ${Colors.green400};
  color: ${Colors.white};
`;

const FailureLabel = styled(Label)`
  background-color: ${Colors.red100};
  color: ${Colors.white};
`;

const ErrorLabel = styled(Label)`
  background-color: ${Colors.red100};
  color: ${Colors.white};
`;

const FileRow = styled(JobStateRow)`
  color: ${Colors.gold200};
  background-color: ${Colors.black800};
  margin-bottom: 1px;
  cursor: pointer;

  &:hover {
    background-color: ${Colors.black700};
  }
`;

const FileName = styled.span`
  line-height: 19px;
  font-size: 12px;
  display: block;
  left: 3em;
  position: absolute;
`;
const Arrow = styled.span`
  display: block;
  left: 1em;
  position: absolute;
`;

const Pre = styled.pre`
  font-family: monospace;
  font-size: 12px;
  line-height: 18px;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding: 0 2em 0 3em;
  background-color: ${Colors.black800};
  color: ${Colors.black200};
  border: none;
  margin: 0;
  margin-bottom: 1px;
`;

const LabelPositionedOnTheRight = styled(Label)`
  right: 1em;
`;

function DurationLabel({ duration }) {
  if (duration === null) return null;
  return (
    <LabelPositionedOnTheRight>{`${duration}s`}</LabelPositionedOnTheRight>
  );
}

export class JobStateFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: this.props.file,
      seeDetails: false,
      loading: false
    };
  }

  getLabel = jobstate => {
    switch (jobstate.status) {
      case "success":
        return <SuccessLabel>{jobstate.status}</SuccessLabel>;
      case "failure":
        return <FailureLabel>{jobstate.status}</FailureLabel>;
      case "error":
        return <ErrorLabel>{jobstate.status}</ErrorLabel>;
      default:
        return <Label>{jobstate.status}</Label>;
    }
  };

  loadFileContent = () => {
    if (!this.state.file.content) this.setState({ loading: true });
    this.props
      .getFileContent(this.state.file)
      .then(response => {
        this.setState(prevState => {
          return {
            file: {
              ...prevState.file,
              content: response.data
            }
          };
        });
        return response;
      })
      .catch(error => console.log(error))
      .then(() => this.setState({ loading: false }));
  };

  render() {
    const { seeDetails, file, loading } = this.state;
    return (
      <React.Fragment>
        <FileRow
          onClick={() => {
            this.loadFileContent();
            this.setState(prevState => ({ seeDetails: !prevState.seeDetails }));
          }}
        >
          <Arrow>
            {seeDetails ? (
              <span className="fa fa-caret-down code__icon" />
            ) : (
              <span className="fa fa-caret-right code__icon" />
            )}
          </Arrow>
          <FileName>{file.name}</FileName>
          {this.getLabel(file.jobstate)}
          <DurationLabel duration={file.duration} />
        </FileRow>
        {seeDetails ? (
          <Pre>
            {loading
              ? "loading"
              : file.content
                ? file.content
                : `"${file.name}" file is empty`}
          </Pre>
        ) : null}
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getFileContent: file => dispatch(getFileContent(file))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(JobStateFile);
