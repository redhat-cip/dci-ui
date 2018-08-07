import React, {Component} from "react";
import { connect } from "react-redux";
import TeamForm from "./TeamForm";
import actions from "./teamsActions";

export class EditTeamButton extends Component {
  render() {
    return (
      <TeamForm
        title="Edit team"
        team={this.props.team}
        showModalButton={<i className="fa fa-pencil" />}
        okButton="Edit"
        submit={team => {
          const newTeam = {
            id: this.props.team.id,
            ...team
          };
          this.props.editTeam(newTeam);
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
