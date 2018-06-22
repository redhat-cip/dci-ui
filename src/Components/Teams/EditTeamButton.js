// Copyright 2017 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.
import React from "react";
import { connect } from "../../store";
import TeamForm from "./TeamForm";
import actions from "./actions";

export class EditTeamForm extends React.Component {
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
)(EditTeamForm);
