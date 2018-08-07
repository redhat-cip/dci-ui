import React, { Component } from "react";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import DCICard from "../DCICard";

export default class StatDetails extends Component {
  render() {
    const { stat } = this.props;
    return (
      <DCICard className="mt-3" title={stat.topic_name}>
        <h3 className="global-status__component-name">
          component: {stat.name}
        </h3>
        {isEmpty(stat.jobs) ? (
          "There are no job for this component"
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Team</th>
                <th>Remote CI (Configuration)</th>
                <th className="text-center">Status</th>
                <th className="text-right">Last run</th>
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
                  <td className="text-center">
                    <Link to={`/jobs/${job.id}/jobStates`}>{job.status}</Link>
                  </td>
                  <td className="text-right">{job.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DCICard>
    );
  }
}
