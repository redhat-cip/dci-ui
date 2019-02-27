import React, { Component } from "react";
import { isEmpty } from "lodash";
import { EmptyState } from "ui";
import File from "./File";
import { FileArchiveIcon } from "@patternfly/react-icons";

export default class FilesList extends Component {
  render() {
    const { files } = this.props;
    const filesNotAssociatedWithJobState = files.filter(
      f => f.jobstate_id === null
    );
    if (isEmpty(filesNotAssociatedWithJobState)) {
      return (
        <EmptyState
          icon={<FileArchiveIcon size="lg" />}
          title="No files"
          info="There are no files attached to this job"
        />
      );
    }
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
            {filesNotAssociatedWithJobState.map(file => (
              <File key={file.id} file={file} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
