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
import actions from "../Components/Feeders/actions";
import CopyButton from "../Components/CopyButton";
import EmptyState from "../Components/EmptyState";
import ConfirmDeleteButton from "../Components/ConfirmDeleteButton";
import _ from "lodash";

export class FeedersScreen extends React.Component {
  componentDidMount() {
    this.props.fetchFeeders();
  }

  render() {
    const { feeders, isFetching } = this.props;
    return (
      <MainContent>
        <TableCard
          title="Feeders"
          loading={isFetching && _.isEmpty(feeders)}
          empty={!isFetching && _.isEmpty(feeders)}
          HeaderButton={
            <a
              id="feeders__create-feeder-btn"
              className="pull-right btn btn-primary"
              href="/feeders/create"
            >
              Create a new feeder
            </a>
          }
          EmptyComponent={
            <EmptyState
              title="There is no feeder"
              info="Do you want to create one?"
              button={
                <a className="btn btn-primary" href="/feeders/create">
                  Create a new feeder
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
                <th>Label</th>
                <th>Team Owner</th>
                <th>Description</th>
                <th>Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feeders.map((feeder, i) => (
                <tr key={i}>
                  <td className="text-center">
                    <CopyButton text={feeder.id} />
                  </td>
                  <td>
                    <a href={`/feeders/${feeder.id}`}>{feeder.name}</a>
                  </td>
                  <td>{feeder.label}</td>
                  <td>{feeder.team.name}</td>
                  <td>{feeder.description}</td>
                  <td>{feeder.from_now}</td>
                  <td className="text-center">
                    <a
                      className="btn btn-primary btn-sm btn-edit"
                      href={`/feeders/${feeder.id}`}
                    >
                      <i className="fa fa-pencil" />
                    </a>
                    <ConfirmDeleteButton
                      title={`Delete feeder ${feeder.name}`}
                      body={`Are you you want to delete ${feeder.name}?`}
                      okButton={`Yes delete ${feeder.name}`}
                      cancelButton="oups no!"
                      whenConfirmed={() => this.props.deleteFeeder(feeder)}
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

FeedersScreen.propTypes = {
  feeders: PropTypes.array,
  isFetching: PropTypes.bool,
  fetchFeeders: PropTypes.func,
  deleteFeeder: PropTypes.func
};

function mapStateToProps(state) {
  return {
    feeders: date.transformObjectsDates(
      state.feeders2.byId,
      state.currentUser.timezone
    ),
    isFetching: state.feeders2.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchFeeders: () => dispatch(actions.all({ embed: "team" })),
    deleteFeeder: feeder => dispatch(actions.delete(feeder))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedersScreen);
