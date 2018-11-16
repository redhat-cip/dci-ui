import React, { Component } from "react";
import { connect } from "react-redux";
import { TextContent, Text } from "@patternfly/react-core";
import ConfirmDeleteButton from "../ConfirmDeleteButton";
import { removeTopicFromTeam } from "./teamsTopicsActions";

export class TeamsTopicsListPermissions extends Component {
  render() {
    const { topics, removeTopicFromTeam } = this.props;

    return (
      <React.Fragment>
        <TextContent>
          <Text component="h2">Current permissions</Text>
        </TextContent>

        <table className="pf-c-table pf-m-compact pf-m-grid-md">
          <thead>
            <tr>
              <th>Topic Name</th>
              <th>Team Name</th>
              <th className="pf-u-text-align-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {topics.map(topic =>
              topic.teams.map(team => (
                <tr key={`${topic.id}:${team.id}`}>
                  <td>{topic.name}</td>
                  <td>{team.name}</td>
                  <td className="pf-u-text-align-center">
                    <ConfirmDeleteButton
                      title="Delete permission"
                      content={`Are you sure you want to remove the permissions on ${
                        topic.name
                      } for ${team.name}?`}
                      whenConfirmed={() => removeTopicFromTeam(topic, team)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    removeTopicFromTeam: (topic, team) => {
      dispatch(removeTopicFromTeam(topic, team));
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(TeamsTopicsListPermissions);
