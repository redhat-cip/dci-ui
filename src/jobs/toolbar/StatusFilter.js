import React, { Component } from "react";
import { FilterWithSearch } from "ui";
import { getCurrentFilters, removeFilter } from "./filters";

export default class StatusFilter extends Component {
  _cleanFiltersAndFilterJobs = filters => {
    const { filterJobs, activeFilters } = this.props;
    const otherFilters = removeFilter(activeFilters, "status");
    filterJobs(otherFilters.concat(filters));
  };

  render() {
    const filters = [
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
      },
      {
        name: "Killed",
        key: "status",
        value: "killed"
      },
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
        name: "Pre run",
        key: "status",
        value: "pre-run"
      },
      {
        name: "Post run",
        key: "status",
        value: "post-run"
      }
    ];
    const { activeFilters } = this.props;
    const { status: statusFilter } = getCurrentFilters(activeFilters, filters);
    return (
      <FilterWithSearch
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
