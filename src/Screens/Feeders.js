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
import objectValues from "object.values";
import Alert from "../Components/Alert";
import { MainContent } from "../Components/Layout";
import TableCard from "../Components/TableCard";
import actions from "../Components/Feeders/actions";
import CopyButton from "../Components/CopyButton";
import EmptyState from "../Components/EmptyState";

export class FeedersScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchFeeders();
  }

  render() {
    const { feeders, isFetching, errorMessage } = this.props;
    return (
      <MainContent>
        {errorMessage && !feeders.length ? (
          <Alert message={errorMessage} />
        ) : null}
        <TableCard
          loading={isFetching && !feeders.length}
          title="Feeders"
          headerButton={
            <a className="pull-right btn btn-primary" href="/feeders/create">
              Create a new feeder
            </a>
          }
        >
          {!errorMessage && !feeders.length ? (
            <EmptyState
              title="There is no feeder"
              info="Do you want to create one?"
              button={
                <a className="btn btn-primary" href="/feeders/create">
                  Create a new feeder
                </a>
              }
            />
          ) : (
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th>Feeder name</th>
                  <th>Label</th>
                  <th>Team Owner</th>
                  <th>Description</th>
                  <th>Created At</th>
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
                    <td>{feeder.created_at}</td>
                    <td className="text-center">
                      <a
                        className="btn btn-primary btn-sm btn-edit"
                        href={`/feeders/${feeder.id}`}
                      >
                        <i className="fa fa-pencil" />
                      </a>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        ng-click="$ctrl.deleteFeeder(feeder)"
                      >
                        <i className="fa fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TableCard>
      </MainContent>
    );
  }
}

FeedersScreen.propTypes = {
  feeders: PropTypes.array,
  isFetching: PropTypes.bool,
  errorMessage: PropTypes.string,
  fetchFeeders: PropTypes.func
};

function enhanceFeeders(state) {
  const feeders = objectValues(state.feeders2.byId);
  return feeders.map(feeder => {
    return {
      ...feeder,
      created_at: date.fromNow(feeder.created_at, state.currentUser.timezone)
    };
  });
}

function mapStateToProps(state) {
  const { isFetching, errorMessage } = state.feeders2;
  return {
    feeders: enhanceFeeders(state),
    isFetching,
    errorMessage
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchFeeders: () => {
      dispatch(actions.all({ embed: "team" }));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedersScreen);
