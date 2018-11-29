import React, { Component } from "react";
import { isEmpty, find, differenceWith } from "lodash";
import { Filter } from "../ui";

export function createTeamsFilter(teams) {
  const teamsWithRemotecis = teams.filter(team => !isEmpty(team.remotecis));
  return teamsWithRemotecis.map(team => ({
    id: team.id,
    key: "team_id",
    name: team.name,
    value: team.id,
    filterValues: team.remotecis.map(remoteci => ({
      key: "remoteci_id",
      name: remoteci.name,
      value: remoteci.id
    }))
  }));
}

export function getCurrentFilters(activeFilters, filters) {
  return activeFilters.reduce((acc, filter) => {
    const keyFilter = find(filters, { key: filter.key, value: filter.value });
    acc[filter.key] = keyFilter ? keyFilter : null;
    return acc;
  }, {});
}

export function removeFilters(filters, keys) {
  return differenceWith(filters, keys, (filter, key) => filter.key === key);
}

export class RemoteciInTeamFilter extends Component {
  _cleanFiltersAndFilterJobs = filters => {
    const { filterJobs, activeFilters } = this.props;
    const otherFilters = removeFilters(activeFilters, [
      "team_id",
      "remoteci_id"
    ]);
    filterJobs(otherFilters.concat(filters));
  };

  render() {
    const { teams, activeFilters } = this.props;
    const teamsFilter = createTeamsFilter(teams);
    const teamFilter = getCurrentFilters(activeFilters, teamsFilter).team_id;
    const remoteciFilter = isEmpty(teamFilter)
      ? null
      : getCurrentFilters(activeFilters, teamFilter.filterValues).remoteci_id;
    const remoteciFilters = isEmpty(teamFilter) ? [] : teamFilter.filterValues;
    return (
      <React.Fragment>
        <Filter
          placeholder="Filter by Team"
          filter={teamFilter}
          filters={teamsFilter}
          onFilterValueSelected={newTeamFilter =>
            this._cleanFiltersAndFilterJobs([newTeamFilter])
          }
          className="pf-u-mr-lg"
        />
        {isEmpty(remoteciFilters) ? null : (
          <Filter
            placeholder="Filter by Remoteci"
            filter={remoteciFilter}
            filters={remoteciFilters}
            onFilterValueSelected={newRemoteciFilter =>
              this._cleanFiltersAndFilterJobs([teamFilter, newRemoteciFilter])
            }
          />
        )}
      </React.Fragment>
    );
  }
}

export function removeFilter(filters, key) {
  return removeFilters(filters, [key]);
}

export class StatusFilter extends Component {
  _cleanFiltersAndFilterJobs = filters => {
    const { filterJobs, activeFilters } = this.props;
    const otherFilters = removeFilter(activeFilters, "status");
    filterJobs(otherFilters.concat(filters));
  };

  render() {
    const filters = [
      {
        name: "New",
        key: "status",
        value: "new"
      },
      {
        name: "Running",
        key: "status",
        value: "running"
      },
      {
        name: "Success",
        key: "status",
        value: "success"
      },
      {
        name: "Failure",
        key: "status",
        value: "failure"
      },
      {
        name: "Error",
        key: "status",
        value: "error"
      }
    ];
    const { activeFilters } = this.props;
    const { status: statusFilter } = getCurrentFilters(activeFilters, filters);
    return (
      <Filter
        placeholder="Filter by Status"
        filter={statusFilter}
        filters={filters}
        onFilterValueSelected={newStatusFilter =>
          this._cleanFiltersAndFilterJobs([newStatusFilter])
        }
        className="pf-u-mr-lg"
      />
    );
  }
}

export function createTopicsFilter(topics) {
  return topics.map(topic => ({
    id: topic.id,
    key: "topic_id",
    name: topic.name,
    value: topic.id
  }));
}

export class TopicsFilter extends Component {
  _cleanFiltersAndFilterJobs = filters => {
    const { filterJobs, activeFilters } = this.props;
    const otherFilters = removeFilter(activeFilters, "topic_id");
    filterJobs(otherFilters.concat(filters));
  };

  render() {
    const { topics, activeFilters } = this.props;
    const topicsFilter = createTopicsFilter(topics);
    const topicFilter = getCurrentFilters(activeFilters, topicsFilter).topic_id;
    return (
      <Filter
        placeholder="Filter by Topic"
        filter={topicFilter}
        filters={topicsFilter}
        onFilterValueSelected={newTopicFilter =>
          this._cleanFiltersAndFilterJobs([newTopicFilter])
        }
        className="pf-u-mr-lg"
      />
    );
  }
}
