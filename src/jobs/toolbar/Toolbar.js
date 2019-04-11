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
            <React.Fragment>
              <div className="pf-c-chip-group pf-m-toolbar">
                <h4 className="pf-c-chip-group__label">Active Filters</h4>
                {activeFilters.map((filter, i) => {
                  return (
                    <div className="pf-c-chip" key={i}>
                      <span className="pf-c-chip__text">
                        {`${filter.key} ${filter.value}`}
                      </span>
                      <Button
                        variant="plain"
                        onClick={() => this._removeFilterAndFilterJobs(filter)}
                      >
                        <TimesIcon />
                      </Button>
                    </div>
                  );
                })}
              </div>
              <div className="pf-c-chip pf-m-overflow pf-u-ml-xs">
                <Button variant="plain" onClick={() => clearFilters()}>
                  <span className="pf-c-chip__text">Clear All Filters</span>
                </Button>
              </div>
            </React.Fragment>
          )}
        </ToolbarSection>
      </Toolbar>
    );
  }
}
