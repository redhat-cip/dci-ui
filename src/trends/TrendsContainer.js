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
  state = {
    topic: null,
    isFetching: false
  };

  componentDidMount() {
    this.setState({ isFetching: true });
    this.props.fetchTrends().then(() => this.setState({ isFetching: false }));
  }

  render() {
    const { topics, trends } = this.props;
    const { topic, isFetching } = this.state;
    return (
      <Page
        title="Trends"
        loading={isFetching && isEmpty(trends)}
        empty={!isFetching && isEmpty(trends)}
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
        {isEmpty(topic) ? (
          <EmptyState
            icon={<MessagesIcon size="lg" />}
            title="Select a topic"
            info="Select a topic in the top left corner to see its trend."
          />
        ) : (
          <TrendGraph trend={trends[topic.id]} topic={topic} />
        )}
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    topics: getTopics(state),
    trends: state.trends
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTrends: () => {
      dispatch(topicsActions.all());
      return dispatch(getTrends());
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrendsContainer);
