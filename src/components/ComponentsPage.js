import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { Page } from "layout";
import productsActions from "products/producstActions";
import topicsActions from "../topics/topicsActions";
import { EmptyState } from "ui";
import { getTopics } from "../topics/topicsSelectors";
import ComponentsPerTopic from "./ComponentsPerTopic";

export class ComponentsPage extends Component {
  componentDidMount() {
    const { fetchTopics } = this.props;
    fetchTopics();
  }
  render() {
    const { topics, isFetching } = this.props;
    return (
      <Page
        title="Components"
        loading={isFetching && isEmpty(topics)}
        empty={!isFetching && isEmpty(topics)}
        EmptyComponent={
          <EmptyState title="There is no topics" info="See documentation" />
        }
      >
        <table className="pf-c-table pf-m-expandable pf-m-compact pf-m-grid-md">
          <thead>
            <tr>
              <th />
              <th className="pf-u-text-align-center">ID</th>
              <th>Topic</th>
              <th>Product</th>
              <th>Created</th>
            </tr>
          </thead>
          {topics.map(topic => (
            <ComponentsPerTopic key={topic.id} topic={topic} />
          ))}
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
      dispatch(topicsActions.all({ embed: "product" }));
      dispatch(productsActions.all());
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ComponentsPage);
