import React, { Component } from "react";
import { connect } from "react-redux";
import FileSaver from "file-saver";
import { Button } from "patternfly-react";
import { getFileContent } from "./filesActions";
import { humanFileSize } from "./filesGetters";

export class File extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloading: false
    };
  }

  downloadFile = file => {
    this.setState({ downloading: true });
    this.props
      .getFileContent(file, { responseType: "blob" })
      .then(response => {
        const blob = new Blob([response.data], { type: file.mime });
        FileSaver.saveAs(blob, `${file.name}`);
        return response;
      })
      .catch(error => console.log(error))
      .then(() => this.setState({ downloading: false }));
  };

  render() {
    const { file } = this.props;
    const { downloading } = this.state;
    if (file.jobstate_id) return null;
    return (
      <tr>
        <td>{file.name}</td>
        <td>{humanFileSize(file.size)}</td>
        <td>{file.mime}</td>
        <td className="text-center">
          <Button
            bsStyle="primary"
            onClick={() => this.downloadFile(file)}
            disabled={downloading}
          >
            {downloading ? (
              <i className="fa fa-spinner fa-pulse fa-fw" />
            ) : (
              <i className="fa fa-file-o fa-fw" />
            )}
            download
          </Button>
        </td>
      </tr>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getFileContent: (file, params) => dispatch(getFileContent(file, params))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(File);
