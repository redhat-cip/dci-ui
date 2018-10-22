import React, { Component } from "react";
import { connect } from "react-redux";
import TeamForm from "./TeamForm";
import actions from "./teamsActions";
import { EditAltIcon } from "@patternfly/react-icons";

export class EditTeamButton extends Component {
  render() {
    const { team, editTeam, ...props } = this.props;
    return (
      <TeamForm
        {...props}
        title="Edit team"
        team={team}
        showModalButton={<EditAltIcon />}
        okButton="Edit"
        submit={newTeam => {
          editTeam({
            id: team.id,
            ...newTeam
          });
        }}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    editTeam: team => dispatch(actions.update(team))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(EditTeamButton);
