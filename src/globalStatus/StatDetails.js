import React, { Component } from "react";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { TextContent, Text, TextVariants } from "@patternfly/react-core";

export default class StatDetails extends Component {
  render() {
    const { stat } = this.props;
    return (
      <div>
        <TextContent className="global-status__component-name">
          <Text component={TextVariants.h2}> component: {stat.name}</Text>
        </TextContent>
        {isEmpty(stat.jobs) ? (
          "There are no job for this component"
        ) : (
          <table className="pf-c-table pf-m-compact pf-m-grid-md">
            <thead>
              <tr>
                <th>Team</th>
                <th>Remote CI (Configuration)</th>
                <th className="pf-u-text-align-center">Status</th>
                <th className="pf-u-text-align-right">Last run</th>
              </tr>
            </thead>
            <tbody>
              {stat.jobs.map((job, i) => (
                <tr key={i}>
                  <td>{job.team_name}</td>
                  <td>
                    {job.remoteci_name}
                  </td>
                  <td className="pf-u-text-align-center">
                    <Link to={`/jobs/${job.id}/jobStates`}>{job.status}</Link>
                  </td>
                  <td className="pf-u-text-align-right">{job.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}
