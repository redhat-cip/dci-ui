import React, { Component } from "react";
import {
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Chip,
  ChipGroup,
  Pagination,
} from "@patternfly/react-core";
import TopicsFilter from "./TopicsFilter";
import StatusFilter from "./StatusFilter";
import RemoteciInTeamFilter from "./RemoteciInTeamFilter";
import { removeFilter } from "./filters";

export default class DCIToolbar extends Component {
  _removeFilterAndFilterJobs = (filter) => {
    const { filterJobs, activeFilters } = this.props;
    const newFilters = removeFilter(activeFilters, filter.key);
    filterJobs(newFilters);
  };

  render() {
    const { filterJobs, activeFilters, pagination, count, goTo } = this.props;
    return (
      <Toolbar>
        <ToolbarContent
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
              {count === 0 ? null : (
                <Pagination
                  perPage={pagination.perPage}
                  page={pagination.page}
                  itemCount={count}
                  onSetPage={(e, page) =>
                    goTo({
                      ...pagination,
                      page,
                    })
                  }
                  onPerPageSelect={(e, perPage) =>
                    goTo({
                      ...pagination,
                      perPage,
                    })
                  }
                />
              )}
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
        <ToolbarContent aria-label="jobs active filters">
          {activeFilters && activeFilters.length > 0 && (
            <ChipGroup>
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
            </ChipGroup>
          )}
        </ToolbarContent>
      </Toolbar>
    );
  }
}
