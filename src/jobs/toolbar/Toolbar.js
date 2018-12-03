import React, { Component } from "react";
import { TimesIcon } from "@patternfly/react-icons";
import {
  Toolbar,
  ToolbarSection,
  ToolbarGroup,
  ToolbarItem,
  Button
} from "@patternfly/react-core";
import TopicsFilter from "./TopicsFilter";
import StatusFilter from "./StatusFilter";
import RemoteciInTeamFilter from "./RemoteciInTeamFilter";
import { removeFilter } from "./filters";
import Pagination from "./Pagination";

export default class DCIToolbar extends Component {
  _removeFilterAndFilterJobs = filter => {
    const { filterJobs, activeFilters } = this.props;
    const newFilters = removeFilter(activeFilters, filter.key);
    filterJobs(newFilters);
  };

  render() {
    const {
      filterJobs,
      clearFilters,
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
              <Pagination pagination={pagination} count={count} goTo={goTo} />
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarSection>
        <ToolbarSection aria-label="jobs active filters">
          {activeFilters && activeFilters.length > 0 && (
            <ToolbarGroup>
              <span>Active Filters:</span>
              {activeFilters.map((filter, i) => {
                return (
                  <Button
                    key={i}
                    variant="secondary"
                    onClick={() => this._removeFilterAndFilterJobs(filter)}
                  >
                    {`${filter.key} ${filter.value}`} <TimesIcon />
                  </Button>
                );
              })}
              <Button variant="link" onClick={() => clearFilters()}>
                Clear All Filters
              </Button>
            </ToolbarGroup>
          )}
        </ToolbarSection>
      </Toolbar>
    );
  }
}
