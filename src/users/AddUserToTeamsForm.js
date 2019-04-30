import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import teamsActions from "teams/teamsActions";
import { getTeams } from "teams/teamsSelectors";
import { Button } from "@patternfly/react-core";
import { Filter } from "ui";

export class AddUserToTeamForm extends Component {
  state = {
    canSubmit: false,
    team: null,
    role: null
  };

  componentDidMount() {
    const { fetchTeams } = this.props;
    fetchTeams();
  }

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    const { teams, onSubmit } = this.props;
    const { team, role } = this.state;
    if (isEmpty(teams)) return null;
    return (
      <div>
        Add user in{" "}
        <Filter
          placeholder={isEmpty(team) ? "..." : team.name}
          filter={team}
          filters={teams}
          onFilterValueSelected={team => this.setState({ team: team })}
        />{" "}
        team with role{" "}
        <Filter
          placeholder={isEmpty(role) ? "..." : role}
          filter={role}
          filters={[{ name: "READ_ONLY_USER" }, { name: "USER" }]}
          onFilterValueSelected={role => this.setState({ role: role })}
        />{" "}
        <Button
          variant="primary"
          className="pf-u-ml-xl"
          isDisabled={isEmpty(role) || isEmpty(team)}
          onClick={() => onSubmit(team, role)}
        >
          Add
        </Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    teams: getTeams(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTeams: () => dispatch(teamsActions.all())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddUserToTeamForm);
