import React, { Component } from "react";
import { isEmpty } from "lodash";
import { EmptyState } from "../../ui";
import File from "./File";

export default class FilesList extends Component {
  render() {
    const { files } = this.props;
    if (isEmpty(files))
      return (
        <EmptyState title="No files" info="There is no files for this job" />
      );
    return (
      <div className="table-responsive">
        <table className="pf-c-table pf-m-compact pf-m-grid-md">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Size</th>
              <th>mime-type</th>
              <th className="pf-u-text-align-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, i) => (
              <File key={i} file={file} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
