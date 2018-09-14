import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import teamsActions from "../teams/teamsActions";
import { getTeams } from "../teams/teamsSelectors";
import { Filter, Toolbar, Button } from "patternfly-react";
import styled from "styled-components";
import { RemoteciInTeamFilter, StatusFilter } from "./Filters";
import Pagination from "./Pagination";

const UnboarderedToolbar = styled(Toolbar)`
  & > .toolbar-pf {
    border: none;
    box-shadow: none;
  }
`;

export class DCIToolbar extends Component {
  componentDidMount() {
    this.props.fetchTeams();
  }

  _removeFilter = (filters, filter) => {
    return [...filters.filter(f => f.key !== filter.key)];
  };

  _addFilter = (filters, filter) => {
    const newFilters = this._removeFilter(filters, filter);
    newFilters.push(filter);
    return newFilters;
  };

  _addFilterAndFilterJobs = filter => {
    const { filterJobs, activeFilters } = this.props;
    const newFilters = this._addFilter(activeFilters, filter);
    filterJobs(newFilters);
  };

  render() {
    const {
      teams,
      activeFilters,
      filterJobs,
      clearFilters,
      pagination,
      count,
      goTo
    } = this.props;
    return (
      <UnboarderedToolbar>
        <StatusFilter addFilter={this._addFilterAndFilterJobs} />
        {isEmpty(teams) ? null : (
          <RemoteciInTeamFilter
            teams={teams}
            addFilter={this._addFilterAndFilterJobs}
          />
        )}
        <Toolbar.RightContent>
          <Pagination pagination={pagination} count={count} goTo={goTo} />
        </Toolbar.RightContent>
        {activeFilters &&
          activeFilters.length > 0 && (
            <Toolbar.Results>
              <Filter.ActiveLabel>{"Active Filters:"}</Filter.ActiveLabel>
              <Filter.List>
                {activeFilters.map((filter, i) => {
                  return (
                    <Filter.Item
                      key={i}
                      onRemove={filter => {
                        const newFilters = this._removeFilter(
                          activeFilters,
                          filter
                        );
                        filterJobs(newFilters);
                      }}
                      filterData={filter}
                    >
                      {`${filter.key} ${filter.value}`}
                    </Filter.Item>
                  );
                })}
              </Filter.List>
              <Button bsStyle="link" onClick={() => clearFilters()}>
                Clear All Filters
              </Button>
            </Toolbar.Results>
          )}
      </UnboarderedToolbar>
    );
  }
}

function mapStateToProps(state) {
  return {
    teams: getTeams(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTeams: () => dispatch(teamsActions.all({ embed: "remotecis" }))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DCIToolbar);
