import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { MainContent } from "../layout";
import DCICard from "../DCICard";
import productsActions from "../products/producstActions";
import topicsActions from "./topicsActions";
import {CopyButton} from "../ui";
import {EmptyState} from "../ui";
import NewTopicButton from "./NewTopicButton";
import EditTopicButton from "./EditTopicButton";
import ConfirmDeleteButton from "../ConfirmDeleteButton";
import { getTopics } from "./topicsSelectors";

export class TopicsContainer extends Component {
  componentDidMount() {
    this.props.fetchTopics();
  }
  render() {
    const { topics, isFetching } = this.props;
    return (
      <MainContent>
        <DCICard
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
                  <td>{topic.name}</td>
                  <td>{topic.next_topic ? topic.next_topic.name : null}</td>
                  <td>{topic.product ? topic.product.name : null}</td>
                  <td>{topic.from_now}</td>
                  <td className="text-center">
                    <EditTopicButton key={topic.etag} topic={topic} />
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
        </DCICard>
      </MainContent>
    );
  }
}

function mapStateToProps(state) {
  return {
    topics: getTopics(state),
    isFetching: state.topics.isFetching || state.products.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTopics: () => {
      dispatch(topicsActions.all({ embed: "next_topic" }));
      dispatch(productsActions.all());
    },
    deleteTopic: topic => dispatch(topicsActions.delete(topic))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicsContainer);
