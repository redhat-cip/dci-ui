import React, { Component } from "react";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { Page } from "../layout";

export default class StatDetails extends Component {
  render() {
    const { stat } = this.props;
    return (
      <Page className="pf-u-mt-xl" title={stat.topic_name}>
        <h3 className="global-status__component-name">
          component: {stat.name}
        </h3>
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
                    {job.rconfiguration_name
                      ? `(${job.rconfiguration_name})`
                      : null}
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
      </Page>
    );
  }
}
