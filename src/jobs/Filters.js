import React, { Component } from "react";
import { isEmpty, find, differenceWith } from "lodash";
import { Filter } from "patternfly-react";

export function createTeamsFilter(teams) {
  const teamsWithRemotecis = teams.filter(team => !isEmpty(team.remotecis));
  return teamsWithRemotecis.map(team => ({
    id: team.id,
    title: team.name,
    key: "team_id",
    value: team.id,
    filterValues: team.remotecis.map(remoteci => ({
      title: remoteci.name,
      key: "remoteci_id",
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
    return (
      <Filter style={{ borderRight: 0 }}>
        <Filter.CategorySelector
          filterCategories={teamsFilter}
          currentCategory={teamFilter}
          placeholder="Filter by team"
          onFilterCategorySelected={newTeamFilter =>
            this._cleanFiltersAndFilterJobs([newTeamFilter])
          }
        >
          <Filter.CategoryValueSelector
            categoryValues={teamFilter && teamFilter.filterValues}
            currentValue={remoteciFilter}
            placeholder="Filter by remoteci"
            onCategoryValueSelected={newRemoteciFilter =>
              this._cleanFiltersAndFilterJobs([teamFilter, newRemoteciFilter])
            }
          />
        </Filter.CategorySelector>
      </Filter>
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
        value: "new"
      },
      {
        title: "Running",
        key: "status",
        value: "running"
      },
      {
        title: "Success",
        key: "status",
        value: "success"
      },
      {
        title: "Failure",
        key: "status",
        value: "failure"
      },
      {
        title: "Error",
        key: "status",
        value: "error"
      }
    ];
    const { activeFilters } = this.props;
    const { status: statusFilter } = getCurrentFilters(activeFilters, filters);
    return (
      <Filter style={{ borderRight: 0 }}>
        <Filter.ValueSelector
          filterValues={filters}
          placeholder="Filter by Status"
          currentValue={statusFilter}
          onFilterValueSelected={newStatusFilter =>
            this._cleanFiltersAndFilterJobs([newStatusFilter])
          }
        />
      </Filter>
    );
  }
}
