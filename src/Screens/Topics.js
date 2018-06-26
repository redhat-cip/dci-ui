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
import { MainContent } from "../Components/Layout";
import TableCard from "../Components/TableCard";
import productsActions from "../Components/Products/actions";
import topicsActions from "../Components/Topics/actions";
import CopyButton from "../Components/CopyButton";
import EmptyState from "../Components/EmptyState";
import NewTopicButton from "../Components/Topics/NewTopicButton";
import EditTopicButton from "../Components/Topics/EditTopicButton";
import ConfirmDeleteButton from "../Components/ConfirmDeleteButton";
import { getTopics } from "../Components/Topics/selectors";
import _ from "lodash";

export class TopicsScreen extends React.Component {
  componentDidMount() {
    this.props.fetchTopics();
  }
  render() {
    const { topics, isFetching } = this.props;
    return (
      <MainContent>
        <TableCard
          title="Topics"
          loading={isFetching && _.isEmpty(topics)}
          empty={!isFetching && _.isEmpty(topics)}
          HeaderButton={<NewTopicButton className="pull-right" />}
          EmptyComponent={
            <EmptyState
              title="There is no topics"
              info="Do you want to create one?"
              button={<NewTopicButton />}
            />
          }
        >
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th className="text-center">ID</th>
                <th>Name</th>
                <th>Next Topic</th>
                <th>Product</th>
                <th>Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic, i) => (
                <tr key={i}>
                  <td className="text-center">
                    <CopyButton text={topic.id} />
                  </td>
                  <td>
                    <a href={`/topics/details/${topic.id}`}>{topic.name}</a>
                  </td>
                  <td>
                    {topic.next_topic ? (
                      <a href={`/topics/details/${topic.next_topic.id}`}>
                        {topic.next_topic.name}
                      </a>
                    ) : null}
                  </td>
                  <td>{topic.product ? topic.product.name : null}</td>
                  <td>{topic.from_now}</td>
                  <td className="text-center">
                    <a
                      className="btn btn-primary btn-sm btn-edit"
                      href={`/topics/details/${topic.id}`}
                    >
                      <i className="fa fa-eye" />
                    </a>
                    <EditTopicButton topic={topic} />
                    <ConfirmDeleteButton
                      name="topic"
                      resource={topic}
                      whenConfirmed={topic => this.props.deleteTopic(topic)}
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

TopicsScreen.propTypes = {
  topics: PropTypes.array,
  isFetching: PropTypes.bool,
  fetchTopics: PropTypes.func,
  deleteTopic: PropTypes.func
};

function mapStateToProps(state) {
  return {
    topics: getTopics(state),
    isFetching: state.topics2.isFetching || state.products2.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTopics: () => {
      dispatch(productsActions.all());
      dispatch(topicsActions.all());
    },
    deleteTopic: topic => dispatch(topicsActions.delete(topic))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicsScreen);
