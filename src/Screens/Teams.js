// Copyright 2017 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React from "react";
import { connect } from "../store";
import PropTypes from "prop-types";
import * as date from "../Components/Date";
import { MainContent } from "../Components/Layout";
import TableCard from "../Components/TableCard";
import actions from "../Components/Teams/actions";
import CopyButton from "../Components/CopyButton";
import EmptyState from "../Components/EmptyState";
import ConfirmDeleteButton from "../Components/ConfirmDeleteButton";
import _ from "lodash";

export class TeamsScreen extends React.Component {
  componentDidMount() {
    this.props.fetchTeams();
  }
  render() {
    const { teams, isFetching, teamsById } = this.props;
    return (
      <MainContent>
        <TableCard
          title="Teams"
          loading={isFetching && !teams.length}
          empty={!isFetching && !teams.length}
          HeaderButton={
            <a
              id="teams__create-team-btn"
              className="pull-right btn btn-primary"
              href="/teams/create"
            >
              Create a new team
            </a>
          }
          EmptyComponent={
            <EmptyState
              title="There is no teams"
              info="Do you want to create one?"
              button={
                <a className="btn btn-primary" href="/teams/create">
                  Create a new team
                </a>
              }
            />
          }
        >
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th className="text-center">ID</th>
                <th>Name</th>
                <th>Parent Team</th>
                <th>Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {_.sortBy(teams, [e => e.name.toLowerCase()]).map((team, i) => (
                <tr key={i}>
                  <td className="text-center">
                    <CopyButton text={team.id} />
                  </td>
                  <td>
                    <a href={`/teams/${team.id}`}>{team.name.toUpperCase()}</a>
                  </td>
                  <td>
                    <a href={`/teams/${team.parent_id}`}>
                      {teamsById[team.parent_id]
                        ? teamsById[team.parent_id].name.toUpperCase()
                        : ""}
                    </a>
                  </td>
                  <td>{team.from_now}</td>
                  <td className="text-center">
                    <a
                      className="btn btn-primary btn-sm btn-edit"
                      href={`/teams/${team.id}`}
                    >
                      <i className="fa fa-pencil" />
                    </a>

                    <ConfirmDeleteButton
                      title={`Delete team ${team.name}`}
                      body={`Are you you want to delete ${team.name}?`}
                      okButton={`Yes delete ${team.name}`}
                      cancelButton="oups no!"
                      whenConfirmed={() => this.props.deleteTeam(team)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </MainContent>
    );
  }
}

TeamsScreen.propTypes = {
  teams: PropTypes.array,
  teamsById: PropTypes.object,
  isFetching: PropTypes.bool,
  fetchTeams: PropTypes.func,
  deleteTeam: PropTypes.func
};

function mapStateToProps(state) {
  return {
    teams: date.transformObjectsDates(
      state.teams2.byId,
      state.currentUser.timezone
    ),
    teamsById: state.teams2.byId,
    isFetching: state.teams2.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTeams: () => dispatch(actions.all()),
    deleteTeam: team => dispatch(actions.delete(team))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamsScreen);
