import React, { Component } from "react";
import { connect } from "react-redux";
import { getFileContent } from "jobs/files/filesActions";
import {
  FileRow,
  FileName,
  Arrow,
  Pre,
  DurationLabel
} from "./JobStateComponents";
import { CaretDownIcon, CaretRightIcon } from "@patternfly/react-icons";

export class JobStateFile extends Component {
  state = {
    file: this.props.file,
    seeDetails: false,
    loading: false
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
    return (
      <React.Fragment>
        <FileRow
          onClick={() => {
            this.loadFileContent();
            this.setState(prevState => ({ seeDetails: !prevState.seeDetails }));
          }}
        >
          <Arrow>
            {this.state.seeDetails ? <CaretDownIcon /> : <CaretRightIcon />}
          </Arrow>
          <FileName>{this.state.file.name}</FileName>
          <DurationLabel duration={this.state.file.duration} />
        </FileRow>
        {this.state.seeDetails ? (
          <Pre>
            {this.state.loading
              ? "loading"
              : this.state.file.content
              ? this.state.file.content
              : `"${this.state.file.name}" file is empty`}
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
