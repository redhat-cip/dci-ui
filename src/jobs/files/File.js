import React, { Component } from "react";
import { connect } from "react-redux";
import FileSaver from "file-saver";
import { Button } from "@patternfly/react-core";
import { getFileContent } from "./filesActions";
import { humanFileSize } from "./filesGetters";
import { FileDownloadIcon } from "@patternfly/react-icons";
import { RotatingSpinnerIcon } from "ui";

export class File extends Component {
  state = {
    downloading: false,
  };

  downloadFile = (file) => {
    this.setState({ downloading: true });
    this.props
      .getFileContent(file, { responseType: "blob" })
      .then((response) => {
        const blob = new Blob([response.data], { type: file.mime });
        FileSaver.saveAs(blob, `${file.name}`);
        return response;
      })
      .catch((error) => console.log(error))
      .then(() => this.setState({ downloading: false }));
  };

  render() {
    const { file } = this.props;
    const { downloading } = this.state;
    return (
      <tr>
        <td>{file.name}</td>
        <td>{humanFileSize(file.size)}</td>
        <td>{file.mime}</td>
        <td className="text-center">
          <Button
            variant="primary"
            onClick={() => this.downloadFile(file)}
            isDisabled={downloading}
          >
            {downloading ? <RotatingSpinnerIcon /> : <FileDownloadIcon />}
            download
          </Button>
        </td>
      </tr>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getFileContent: (file, params) => dispatch(getFileContent(file, params)),
  };
}

export default connect(null, mapDispatchToProps)(File);
