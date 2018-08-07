import React, { Component } from "react";
import { connect } from "react-redux";
import TeamForm from "./TeamForm";
import actions from "./teamsActions";

export class EditTeamButton extends Component {
  render() {
    const { team, editTeam, ...props } = this.props;
    return (
      <TeamForm
        {...props}
        title="Edit team"
        team={team}
        showModalButton={<i className="fa fa-pencil" />}
        okButton="Edit"
        submit={team => {
          const newTeam = {
            id: team.id,
            ...team
          };
          editTeam(newTeam);
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
