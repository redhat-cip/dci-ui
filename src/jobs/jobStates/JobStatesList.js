import React, { Component } from "react";
import { isEmpty } from "lodash";
import styled from "styled-components";
import moment from "moment";

import JobStateFile from "./JobStateFile";
import { EmptyState, Colors } from "../../ui";

export function addDuration(files) {
  const { filesWithDuration } = files
    .sort((f1, f2) => moment(f1.created_at).diff(moment(f2.created_at)))
    .reduce(
      (acc, file) => {
        const fileDuration = acc.lastUpdate
          ? moment(file.created_at).diff(acc.lastUpdate, "seconds")
          : null;
        file.duration = fileDuration;
        acc.filesWithDuration.push(file);
        acc.lastUpdate = file.updated_at;
        return acc;
      },
      {
        filesWithDuration: [],
        lastUpdate: null
      }
    );
  return filesWithDuration;
}

const JobStates = styled.div`
  padding: 1em 0;
  background-color: ${Colors.black900};
`;

export default class JobStatesList extends Component {
  render() {
    const files = this.props.files.filter(file => file.jobstate_id);
    if (isEmpty(files))
      return (
        <EmptyState title="No logs" info="There is no logs for this job" />
      );
    return (
      <JobStates>
        {addDuration(files).map((file, i) => (
          <JobStateFile key={file.id} file={file} />
        ))}
      </JobStates>
    );
  }
}
