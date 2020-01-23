import React, { Component } from "react";
import {
  Toolbar,
  ToolbarSection,
  ToolbarGroup,
  ToolbarItem,
  Chip,
  ChipGroup,
  ChipGroupToolbarItem
} from "@patternfly/react-core";
import TopicsFilter from "./TopicsFilter";
import StatusFilter from "./StatusFilter";
import RemoteciInTeamFilter from "./RemoteciInTeamFilter";
import { removeFilter } from "./filters";
import { Pagination } from "ui";

export default class DCIToolbar extends Component {
  _removeFilterAndFilterJobs = filter => {
    const { filterJobs, activeFilters } = this.props;
    const newFilters = removeFilter(activeFilters, filter.key);
    filterJobs(newFilters);
  };

  render() {
    const {
      filterJobs,
      activeFilters,
      pagination,
      count,
      goTo
    } = this.props;
    return (
      <Toolbar>
        <ToolbarSection
          className="pf-u-justify-content-space-between"
          aria-label="jobs filters"
        >
          <ToolbarGroup>
            <ToolbarItem>
              <RemoteciInTeamFilter
                activeFilters={activeFilters}
                filterJobs={filterJobs}
              />
            </ToolbarItem>
            <ToolbarItem>
              <TopicsFilter
                activeFilters={activeFilters}
                filterJobs={filterJobs}
              />
            </ToolbarItem>
            <ToolbarItem>
              <StatusFilter
                activeFilters={activeFilters}
                filterJobs={filterJobs}
              />
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem>
              <Pagination
                pagination={pagination}
                count={count}
                goTo={goTo}
                items="jobs"
                aria-label="Jobs pagination"
              />
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarSection>
        <ToolbarSection aria-label="jobs active filters">
          {activeFilters && activeFilters.length > 0 && (
            <ChipGroup withToolbar>
              <ChipGroupToolbarItem categoryName="Active Filters">
                {activeFilters.map((filter, i) => {
                  return (
                    <Chip
                      key={i}
                      onClick={() => this._removeFilterAndFilterJobs(filter)}
                    >
                      {`${filter.key} ${filter.value}`}
                    </Chip>
                  );
                })}
              </ChipGroupToolbarItem>
            </ChipGroup>
          )}
        </ToolbarSection>
      </Toolbar>
    );
  }
}
