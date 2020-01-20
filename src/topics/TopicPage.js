import React, { Component } from "react";
import { connect } from "react-redux";
import topicsActions, { fetchLatestComponents } from "./topicsActions";
import { isEmpty } from "lodash";
import { Page } from "layout";
import {
  PageSection,
  Card,
  CardHeader,
  Grid,
  GridItem
} from "@patternfly/react-core";
import { EmptyState } from "ui";

export class TopicPage extends Component {
  state = {
    isFetching: true,
    components: [],
    topic: null
  };
  componentDidMount() {
    const { match, fetchTopic, fetchLatestComponents } = this.props;
    const { id } = match.params;
    fetchTopic(id)
      .then(response => response.data.topic)
      .then(topic => {
        return fetchLatestComponents(topic).then(response => {
          this.setState({
            topic,
            components: response.data.components
          });
        });
      })
      .catch(error => console.log(error))
      .then(() => this.setState({ isFetching: false }));
  }
  render() {
    const { isFetching, topic, components } = this.state;
    return (
      <Page
        title={`Components for topic ${topic ? topic.name : ""}`}
        loading={isFetching && isEmpty(components)}
        empty={!isFetching && isEmpty(components)}
        EmptyComponent={
          <EmptyState
            title="There is no component for this topic"
            info="We are certainly in the process of uploading components for this topic. Come back in a few hours."
          />
        }
      >
        <PageSection>
          <Grid gutter="md">
            {components.map(component => (
              <GridItem span={4}>
                <Card>
                  <CardHeader>{component.name}</CardHeader>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </PageSection>
      </Page>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTopic: id => dispatch(topicsActions.one({ id })),
    fetchLatestComponents: topic => dispatch(fetchLatestComponents(topic))
  };
}

export default connect(null, mapDispatchToProps)(TopicPage);
