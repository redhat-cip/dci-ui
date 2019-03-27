import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { Page } from "layout";
import {
  Button,
  Card,
  CardBody,
  TextContent,
  Text
} from "@patternfly/react-core";
import topicsActions from "topics/topicsActions";
import { getTopics } from "topics/topicsSelectors";
import teamsActions from "teams/teamsActions";
import { getTeams } from "teams/teamsSelectors";
import { EmptyState, Filter } from "ui";
import TeamsTopicsListPermissions from "./TeamsTopicsListPermissions";
import { associateTopicToTeam } from "./teamsTopicsActions";

export class PermissionsPage extends Component {
  state = {
    topic: null,
    team: null
  };
  componentDidMount() {
    const { fetchTeamsAndTopics } = this.props;
    fetchTeamsAndTopics();
  }

  render() {
    const { isFetching, teams, topics, associateTopicToTeam } = this.props;
    const topicsNoExportControl = topics.filter(
      topic => topic.export_control === false
    );
    const { topic, team } = this.state;
    return (
      <Page
        title="Teams permissions"
        description="With Great Power Comes Great Responsibility. Make sure the team has the rights before giving it permission to download non export controlled components."
        loading={isFetching}
        empty={!isFetching && isEmpty(teams)}
        EmptyComponent={
          <EmptyState
            title="There is no teams. You cannot manage permissions"
            info="Contact DCI administrator"
          />
        }
      >
        <Card>
          <CardBody>
            <TextContent>
              <Text component="h2">New permission</Text>
            </TextContent>
            <div className="pf-u-mb-3xl">
              Allow{" "}
              <Filter
                placeholder={isEmpty(team) ? "..." : team.name}
                filter={team}
                filters={teams}
                onFilterValueSelected={team => this.setState({ team: team })}
              />{" "}
              to download every components from{" "}
              <Filter
                placeholder={isEmpty(topic) ? "..." : topic.name}
                filter={topic}
                filters={isEmpty(team) ? [] : topicsNoExportControl}
                onFilterValueSelected={topic => this.setState({ topic: topic })}
              />{" "}
              topic
              <Button
                variant="primary"
                className="pf-u-ml-xl"
                isDisabled={isEmpty(topic) || isEmpty(team)}
                onClick={() => {
                  associateTopicToTeam(topic, team);
                }}
              >
                Confirm
              </Button>
            </div>

            <TeamsTopicsListPermissions topics={topicsNoExportControl} />
          </CardBody>
        </Card>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    teams: getTeams(state),
    topics: getTopics(state),
    isFetching: state.teams.isFetching || state.topics.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTeamsAndTopics: () => {
      dispatch(topicsActions.all({ embed: "teams" }));
      dispatch(teamsActions.all());
    },
    associateTopicToTeam: (topic, team) =>
      dispatch(associateTopicToTeam(topic, team))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PermissionsPage);
