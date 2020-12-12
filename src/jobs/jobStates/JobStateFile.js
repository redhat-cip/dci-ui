import React, { Component } from "react";
import { connect } from "react-redux";
import {
  CaretDownIcon,
  CaretRightIcon,
  LinkIcon,
} from "@patternfly/react-icons";
import {
  global_palette_gold_300,
  global_palette_red_300,
  global_palette_blue_300,
} from "@patternfly/react-tokens";
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

export class JobStateFile extends Component {
  state = {
    file: this.props.file,
    seeDetails: false,
    loading: true,
  };

  componentDidUpdate(prevProps) {
    const { id, isSelected } = this.props;
    if (isSelected && isSelected !== prevProps.isSelected) {
      this.loadFileContent();
      this.setState({ seeDetails: true });
      document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    }
  }

  loadFileContent = () => {
    if (!this.state.file.content) this.setState({ loading: true });
    this.props
      .getFileContent(this.state.file)
      .then((response) => {
        this.setState((prevState) => {
          return {
            file: {
              ...prevState.file,
              content: response.data,
            },
          };
        });
        return response;
      })
      .catch(console.log)
      .then(() => this.setState({ loading: false }));
  };

  render() {
    const { seeDetails, file, loading } = this.state;
    const { id, link, isSelected } = this.props;
    return (
      <div id={id}>
        <FileRow
          onClick={() => {
            this.loadFileContent();
            this.setState((prevState) => ({
              seeDetails: !prevState.seeDetails,
            }));
          }}
          style={{ color: (file.name.startsWith('failed/') || file.name.startsWith('unreachable/')) ?
                   global_palette_red_300.value :
                   (file.name.startsWith('skipped/') ? global_palette_blue_300.value :
                    global_palette_gold_300.value) }}
        >
          <ShareLink href={link} isSelected={isSelected}>
            <LinkIcon />
          </ShareLink>
          <CaretIcon>
            {seeDetails ? <CaretDownIcon /> : <CaretRightIcon />}
          </CaretIcon>
          <FileName>{`TASK [${file.name}] `.padEnd(80, '*')}</FileName>
          <LabelBox>
            <Label>{`${Math.round(file.duration)}s`}</Label>
          </LabelBox>
        </FileRow>
        {seeDetails ? (
          <FileContent>
            <JobStatePre>
              {loading
                ? "loading"
                : file.content
                ? file.content
                : `no log for "${file.name}"`}
            </JobStatePre>
          </FileContent>
        ) : null}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getFileContent: (file) => dispatch(getFileContent(file)),
  };
}

export default connect(null, mapDispatchToProps)(JobStateFile);
