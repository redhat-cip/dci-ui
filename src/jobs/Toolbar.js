import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import teamsActions from "../teams/teamsActions";
import { getTeams } from "../teams/teamsSelectors";
import { Filter, Toolbar, Button } from "patternfly-react";
import styled from "styled-components";
import { RemoteciInTeamFilter, StatusFilter, removeFilter } from "./Filters";
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

  _removeFilterAndFilterJobs = filter => {
    const { filterJobs, activeFilters } = this.props;
    const newFilters = removeFilter(activeFilters, filter.key);
    filterJobs(newFilters);
  };

  render() {
    const {
      teams,
      filterJobs,
      clearFilters,
      activeFilters,
      pagination,
      count,
      goTo
    } = this.props;
    return (
      <UnboarderedToolbar>
        <StatusFilter activeFilters={activeFilters} filterJobs={filterJobs} />
        {isEmpty(teams) ? null : (
          <RemoteciInTeamFilter
            teams={teams}
            activeFilters={activeFilters}
            filterJobs={filterJobs}
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
                      onRemove={this._removeFilterAndFilterJobs}
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
