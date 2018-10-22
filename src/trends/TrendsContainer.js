import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { Bullseye } from "@patternfly/react-core";
import topicsActions from "../topics/topicsActions";
import { getTopics } from "../topics/topicsSelectors";
import { getTrends } from "./trendsActions";
import { Page } from "../layout";
import TrendGraph from "./TrendGraph";
import { EmptyState } from "../ui";
import { Filter } from "../ui";
import { MessagesIcon } from "@patternfly/react-icons";

export class TrendsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: null
    };
  }

  componentDidMount() {
    this.props.fetchTrends();
  }

  render() {
    const { topics, trends, isFetching } = this.props;
    const { topic } = this.state;
    return (
      <Page
        title="Trends"
        loading={isFetching && isEmpty(topics) && isEmpty(trends)}
        empty={!isFetching && isEmpty(topics) && isEmpty(trends)}
        EmptyComponent={
          <EmptyState
            title="There is no trends"
            info="Add some jobs to see trends"
          />
        }
        Toolbar={
          <Filter
            placeholder={isEmpty(topic) ? "Select a topic" : topic.name}
            filter={topic}
            filters={topics}
            onFilterValueSelected={topic => this.setState({ topic: topic })}
          />
        }
      >
        <Bullseye>
          {isEmpty(topic) ? (
            <EmptyState
              icon={<MessagesIcon size="lg" />}
              title="Select a topic"
              info="Select a topic in the top left corner to see its trend."
            />
          ) : (
            <TrendGraph trend={trends[topic.id]} topic={topic} />
          )}
        </Bullseye>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    topics: getTopics(state),
    trends: state.trends,
    isFetching: state.topics.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTrends: () => {
      dispatch(topicsActions.all());
      dispatch(getTrends());
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrendsContainer);
