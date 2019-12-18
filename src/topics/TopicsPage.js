import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { Page } from "layout";
import productsActions from "products/productsActions";
import topicsActions from "./topicsActions";
import { CopyButton, EmptyState, Labels, ConfirmDeleteButton } from "ui";
import NewTopicButton from "./NewTopicButton";
import EditTopicButton from "./EditTopicButton";
import { getTopics } from "./topicsSelectors";

export class TopicsPage extends Component {
  componentDidMount() {
    const { fetchTopics } = this.props;
    fetchTopics();
  }
  render() {
    const { currentUser, topics, isFetching, deleteTopic } = this.props;
    return (
      <Page
        title="Topics"
        loading={isFetching && isEmpty(topics)}
        empty={!isFetching && isEmpty(topics)}
        HeaderButton={currentUser.isSuperAdmin ? <NewTopicButton /> : null}
        EmptyComponent={
          <EmptyState
            title="There is no topics"
            info="Do you want to create one?"
          />
        }
      >
        <table className="pf-c-table pf-m-compact pf-m-grid-md">
          <thead>
            <tr>
              <th className="pf-u-text-align-center">ID</th>
              <th
                className="pf-u-text-align-center"
                title="This column indicates whether export control was performed on the topic"
              >
                Export control
              </th>
              <th>Name</th>
              <th>Next Topic</th>
              <th>Product</th>
              <th>Created</th>
              {currentUser.isSuperAdmin && (
                <th className="pf-u-text-align-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {topics.map(topic => (
              <tr key={`${topic.id}.${topic.etag}`}>
                <td className="pf-u-text-align-center">
                  <CopyButton text={topic.id} />
                </td>
                <th className="pf-u-text-align-center">
                  {topic.export_control ? (
                    <Labels.Success>yes</Labels.Success>
                  ) : (
                    <Labels.Warning>no</Labels.Warning>
                  )}
                </th>
                <td>{topic.name}</td>
                <td>{topic.next_topic ? topic.next_topic.name : null}</td>
                <td>{topic.product ? topic.product.name : null}</td>
                <td>{topic.from_now}</td>
                {currentUser.isSuperAdmin && (
                  <td className="pf-u-text-align-center">
                    <EditTopicButton className="pf-u-mr-xl" topic={topic} />
                    <ConfirmDeleteButton
                      title={`Delete topic ${topic.name}`}
                      onOk={() => deleteTopic(topic)}
                    >
                      {`Are you sure you want to delete ${topic.name}?`}
                    </ConfirmDeleteButton>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    topics: getTopics(state),
    isFetching: state.topics.isFetching || state.products.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTopics: () => {
      dispatch(topicsActions.all({ embed: "next_topic,product" }));
      dispatch(productsActions.all());
    },
    deleteTopic: topic => dispatch(topicsActions.delete(topic))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicsPage);
