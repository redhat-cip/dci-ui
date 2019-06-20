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
    team: null
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
    const { team } = this.state;
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
        team{" "}
        <Button
          variant="primary"
          className="pf-u-ml-xl"
          isDisabled={isEmpty(team)}
          onClick={() => onSubmit(team)}
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
