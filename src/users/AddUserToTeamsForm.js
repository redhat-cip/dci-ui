import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import teamsActions from "teams/teamsActions";
import { getTeams } from "teams/teamsSelectors";
import { Button, Flex, FlexItem } from "@patternfly/react-core";
import { SelectWithSearch } from "ui";

export class AddUserToTeamForm extends Component {
  state = {
    canSubmit: false,
    team: null,
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
        <Flex>
          <FlexItem>Add user in</FlexItem>
          <FlexItem>
            <SelectWithSearch
              placeholder={isEmpty(team) ? "..." : team.name}
              option={team}
              options={teams}
              onClear={() => {
                this.setState({ team: null })
              }}
              onSelect={(team) => this.setState({ team: team })}
            />
          </FlexItem>
          <FlexItem>team</FlexItem>
          <FlexItem>
            <Button
              variant="primary"
              isDisabled={isEmpty(team)}
              onClick={() => onSubmit(team)}
            >
              Add
            </Button>
          </FlexItem>
        </Flex>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    teams: getTeams(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTeams: () => dispatch(teamsActions.all()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUserToTeamForm);
