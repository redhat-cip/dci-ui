import React, { Component } from "react";
import { Label } from "patternfly-react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { Page } from "../layout";
import productsActions from "../products/producstActions";
import topicsActions from "./topicsActions";
import { CopyButton } from "../ui";
import { EmptyState } from "../ui";
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
        <Page
          title="Topics"
          loading={isFetching && isEmpty(topics)}
          empty={!isFetching && isEmpty(topics)}
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
                <th
                  className="text-center"
                  title="This column indicates whether export control was performed on the topic"
                >
                  Export control
                </th>
                <th>Name</th>
                <th>Next Topic</th>
                <th>Product</th>
                <th>Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.map(topic => (
                <tr key={`${topic.id}.${topic.etag}`}>
                  <td className="text-center">
                    <CopyButton text={topic.id} />
                  </td>
                  <th className="text-center">
                    <Label
                      bsStyle={topic.export_control ? "success" : "default"}
                    >
                      {topic.export_control ? "yes" : "no"}
                    </Label>
                  </th>
                  <td>{topic.name}</td>
                  <td>{topic.next_topic ? topic.next_topic.name : null}</td>
                  <td>{topic.product ? topic.product.name : null}</td>
                  <td>{topic.from_now}</td>
                  <td className="text-center">
                    <EditTopicButton className="mr-1" topic={topic} />
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
        </Page>
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
      dispatch(topicsActions.all({ embed: "next_topic,product" }));
      dispatch(productsActions.all());
    },
    deleteTopic: topic => dispatch(topicsActions.delete(topic))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicsContainer);
