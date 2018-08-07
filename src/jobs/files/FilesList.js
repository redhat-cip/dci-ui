import React, { Component } from "react";
import _ from "lodash";
import { EmptyState } from "../../ui";
import File from "./File";

export default class FilesList extends Component {
  render() {
    const { files } = this.props;
    if (_.isEmpty(files))
      return <EmptyState title="No files" info="There is no files for this job" />;
    return (
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Size</th>
              <th>mime-type</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>{files.map((file, i) => <File key={i} file={file} />)}</tbody>
        </table>
      </div>
    );
  }
}
