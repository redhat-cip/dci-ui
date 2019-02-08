import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import teamsActions from "../../teams/teamsActions";
import { getTeams } from "../../teams/teamsSelectors";
import { Filter, LoadingFilter } from "../../ui";
import { createTeamsFilter, getCurrentFilters, removeFilters } from "./filters";

export class RemoteciInTeamFilter extends Component {
  componentDidMount() {
    const { fetchTeams } = this.props;
    fetchTeams();
  }

  _cleanFiltersAndFilterJobs = filters => {
    const { filterJobs, activeFilters } = this.props;
    const otherFilters = removeFilters(activeFilters, [
      "team_id",
      "remoteci_id"
    ]);
    filterJobs(otherFilters.concat(filters));
  };

  render() {
    const { teams, isFetching, activeFilters } = this.props;
    if (isFetching && isEmpty(teams)) {
      return (
        <LoadingFilter placeholder="Filter by Team" className="pf-u-mr-lg" />
      );
    }
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
            className="pf-u-mr-lg"
          />
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    teams: getTeams(state),
    isFetching: state.teams.isFetching
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
)(RemoteciInTeamFilter);
