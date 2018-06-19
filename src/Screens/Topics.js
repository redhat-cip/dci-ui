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
import Alert from "../Components/Alert";
import { MainContent } from "../Components/Layout";
import TableCard from "../Components/TableCard";
import actions from "../Components/Topics/actions";
import CopyButton from "../Components/CopyButton";
import EmptyState from "../Components/EmptyState";
import { Label, Button, Icon } from "patternfly-react";
import DCIRCFile from "../services/DCIRCFile";

export class TopicsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchTopics();
  }

  render() {
    const { topics, isFetching, errorMessage } = this.props;
    return (
      <MainContent>
        {errorMessage && !topics.length ? (
          <Alert message={errorMessage} />
        ) : null}
        <TableCard
          loading={isFetching && !topics.length}
          title="Topics"
          headerButton={
            <a className="pull-right btn btn-primary" href="/topics/create">
              Create a new topic
            </a>
          }
        >
          {!errorMessage && !topics.length ? (
            <EmptyState
              title="There is no topics"
              info="Do you want to create one?"
              button={
                <a className="btn btn-primary" href="/topics/create">
                  Create a new topic
                </a>
              }
            />
          ) : (
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th>Name</th>
                  <th>Next Topic</th>
                  <th>Product</th>
                  <th>Created At</th>
                  <th
                    className="text-center"
                    ng-if="$ctrl.currentUser.hasProductOwnerRole"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {topics.map((topic, i) => (
                  <tr key={i}>
                    <td className="text-center">
                      <CopyButton text={topic.id} />
                    </td>
                    <td>
                      <a href={`/topics/${topic.id}`}>{topic.name}</a>
                    </td>
                    <td>
                      <a href={`/topics/${topic.nexttopic.id}`}>
                        {topic.nexttopic.name}
                      </a>
                    </td>

                    <td>{topic.product.name}</td>
                    <td>{topic.created_at}</td>
                    <td className="text-center">
                      <a
                        className="btn btn-primary btn-sm btn-edit"
                        href={`/topics/${topic.id}`}
                      >
                        <i className="fa fa-pencil" />
                      </a>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        ng-click="$ctrl.deleteTopic(topic)"
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

TopicsScreen.propTypes = {
  topics: PropTypes.array,
  isFetching: PropTypes.bool,
  errorMessage: PropTypes.string,
  fetchTopics: PropTypes.func,
  updateTopics: PropTypes.func
};

function mapStateToProps(state) {
  const { isFetching, errorMessage } = state.topics2;
  return {
    topics: date.transformObjectsDates(
      state.topics2.byId,
      state.currentUser.timezone
    ),
    isFetching,
    errorMessage
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTopics: () => {
      dispatch(actions.all({ embed: "product,nexttopic" }));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicsScreen);
