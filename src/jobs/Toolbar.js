import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import teamsActions from "../teams/teamsActions";
import { getTeams } from "../teams/teamsSelectors";
import topicsActions from "../topics/topicsActions";
import { getTopics } from "../topics/topicsSelectors";
import { RemoteciInTeamFilter, TopicsFilter, StatusFilter, removeFilter } from "./Filters";
import Pagination from "./Pagination";
import {
  Toolbar,
  ToolbarSection,
  ToolbarGroup,
  ToolbarItem,
  Button
} from "@patternfly/react-core";
import { TimesIcon } from "@patternfly/react-icons";

export class DCIToolbar extends Component {
  componentDidMount() {
    this.props.fetchTeams();
  }

  _removeFilterAndFilterJobs = filter => {
    const { filterJobs, activeFilters } = this.props;
    const newFilters = removeFilter(activeFilters, filter.key);
    filterJobs(newFilters);
  };

  render() {
    const {
      teams,
      topics,
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
              <StatusFilter
                activeFilters={activeFilters}
                filterJobs={filterJobs}
              />
            </ToolbarItem>
            {isEmpty(topics) ? null : (
              <ToolbarItem>
                <TopicsFilter
                  topics={topics}
                  activeFilters={activeFilters}
                  filterJobs={filterJobs}
                />
              </ToolbarItem>
            )}
            {isEmpty(teams) ? null : (
              <ToolbarItem>
                <RemoteciInTeamFilter
                  teams={teams}
                  activeFilters={activeFilters}
                  filterJobs={filterJobs}
                />
              </ToolbarItem>
            )}
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

function mapStateToProps(state) {
  return {
    teams: getTeams(state),
    topics: getTopics(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTeams: () => dispatch(teamsActions.all({ embed: "remotecis" })),
    fetchTopics: () => dispatch(topicsActions.all())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DCIToolbar);
