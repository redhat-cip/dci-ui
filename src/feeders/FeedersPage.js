import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { Page } from "layout";
import feedersActions from "./feedersActions";
import teamsActions from "teams/teamsActions";
import { CopyButton, EmptyState, ConfirmDeleteModal } from "ui";
import NewFeederButton from "./NewFeederButton";
import EditFeederButton from "./EditFeederButton";
import { getFeeders } from "./feedersSelectors";
import { getTeams } from "teams/teamsSelectors";
import { TrashIcon } from "@patternfly/react-icons";
import { Button } from "@patternfly/react-core";

export class FeedersPage extends Component {
  componentDidMount() {
    const { fetchFeeders } = this.props;
    fetchFeeders();
  }

  render() {
    const { feeders, isFetching, deleteFeeder } = this.props;
    return (
      <Page
        title="Feeders"
        loading={isFetching && isEmpty(feeders)}
        empty={!isFetching && isEmpty(feeders)}
        HeaderButton={<NewFeederButton />}
        EmptyComponent={
          <EmptyState
            title="There is no feeders"
            info="Do you want to create one?"
          />
        }
      >
        <table className="pf-c-table pf-m-compact pf-m-grid-md">
          <thead>
            <tr>
              <th className="pf-u-text-align-center">ID</th>
              <th>Name</th>
              <th>Team Owner</th>
              <th className="pf-u-text-align-center">Created</th>
              <th className="pf-u-text-align-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feeders.map(feeder => (
              <tr key={`${feeder.id}.${feeder.etag}`}>
                <td className="pf-u-text-align-center">
                  <CopyButton text={feeder.id} />
                </td>
                <td>{feeder.name}</td>
                <td>{feeder.team ? feeder.team.name.toUpperCase() : null}</td>
                <td className="pf-u-text-align-center">{feeder.from_now}</td>
                <td className="pf-u-text-align-center">
                  <EditFeederButton className="pf-u-mr-xs" feeder={feeder} />
                  <ConfirmDeleteModal
                    title={`Delete feeder ${feeder.name}`}
                    message={`Are you sure you want to delete ${feeder.name}?`}
                    onOk={() => deleteFeeder(feeder)}
                  >
                    {openModal => (
                      <Button variant="danger" onClick={openModal}>
                        <TrashIcon />
                      </Button>
                    )}
                  </ConfirmDeleteModal>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    feeders: getFeeders(state),
    teams: getTeams(state),
    isFetching: state.feeders.isFetching || state.teams.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchFeeders: () => {
      dispatch(feedersActions.all({ embed: "team" }));
      dispatch(teamsActions.all());
    },
    deleteFeeder: feeder => dispatch(feedersActions.delete(feeder))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedersPage);
