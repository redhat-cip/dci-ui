import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import topicsActions from "../../topics/topicsActions";
import { getTopics } from "../../topics/topicsSelectors";
import { Filter, LoadingFilter } from "../../ui";
import { createTopicsFilter, getCurrentFilters, removeFilter } from "./filters";

export class TopicsFilter extends Component {
  componentDidMount() {
    this.props.fetchTopics();
  }

  _cleanFiltersAndFilterJobs = filters => {
    const { filterJobs, activeFilters } = this.props;
    const otherFilters = removeFilter(activeFilters, "topic_id");
    filterJobs(otherFilters.concat(filters));
  };

  render() {
    const { topics, isFetching, activeFilters } = this.props;
    if (isFetching && isEmpty(topics)) {
      return (
        <LoadingFilter placeholder="Filter by Topic" className="pf-u-mr-lg" />
      );
    }
    const topicsFilter = createTopicsFilter(topics);
    const topicFilter = getCurrentFilters(activeFilters, topicsFilter).topic_id;
    return (
      <Filter
        placeholder="Filter by Topic"
        filter={topicFilter}
        filters={topicsFilter}
        onFilterValueSelected={newTopicFilter =>
          this._cleanFiltersAndFilterJobs([newTopicFilter])
        }
        className="pf-u-mr-lg"
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    topics: getTopics(state),
    isFetching: state.topics.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTopics: () => dispatch(topicsActions.all())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicsFilter);
