import React, { Component } from "react";
import { isEmpty, find, differenceWith } from "lodash";
import Filter from "./Filter";

export function createTeamsFilter(teams) {
  const teamsWithRemotecis = teams.filter(team => !isEmpty(team.remotecis));
  return teamsWithRemotecis.map(team => ({
    id: team.id,
    title: team.name,
    key: "team_id",
    placeholder: team.name,
    value: team.id,
    filterValues: team.remotecis.map(remoteci => ({
      title: remoteci.name,
      key: "remoteci_id",
      placeholder: remoteci.name,
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
        title: "New",
        key: "status",
        placeholder: "new",
        value: "new"
      },
      {
        title: "Running",
        key: "status",
        placeholder: "running",
        value: "running"
      },
      {
        title: "Success",
        key: "status",
        placeholder: "success",
        value: "success"
      },
      {
        title: "Failure",
        key: "status",
        placeholder: "failure",
        value: "failure"
      },
      {
        title: "Error",
        key: "status",
        placeholder: "error",
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
