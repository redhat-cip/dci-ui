import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "@patternfly/react-core";
import { isEmpty } from "lodash";
import { Page } from "layout";
import remotecisActions from "./remotecisActions";
import teamsActions from "teams/teamsActions";
import { CopyButton, Labels, EmptyState, ConfirmDeleteButton } from "ui";
import NewRemoteciButton from "./NewRemoteciButton";
import EditRemoteciButton from "./EditRemoteciButton";
import { getRemotecis } from "./remotecisSelectors";
import { getTeams } from "teams/teamsSelectors";
import { downloadRCFile } from "services/runcom";
import { DownloadIcon } from "@patternfly/react-icons";

export class RemotecisContainer extends Component {
  componentDidMount() {
    const { fetchRemotecis } = this.props;
    fetchRemotecis();
  }

  render() {
    const { remotecis, teams, isFetching, deleteRemoteci } = this.props;
    return (
      <Page
        title="Remotecis"
        loading={isFetching && isEmpty(remotecis)}
        empty={!isFetching && isEmpty(remotecis)}
        HeaderButton={<NewRemoteciButton teams={teams} />}
        EmptyComponent={
          <EmptyState
            title="There is no remotecis"
            info="Do you want to create one?"
            button={<NewRemoteciButton teams={teams} />}
          />
        }
      >
        <table className="pf-c-table pf-m-compact pf-m-grid-md">
          <thead>
            <tr>
              <th className="pf-u-text-align-center">ID</th>
              <th>Name</th>
              <th className="pf-u-text-align-center">Status</th>
              <th
                className="pf-u-text-align-center"
                title="Download run commands file"
              >
                Download rc file
              </th>
              <th className="pf-u-text-align-center">Team</th>
              <th>Created</th>
              <th className="pf-u-text-align-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {remotecis.map(remoteci => (
              <tr key={`${remoteci.id}.${remoteci.etag}`}>
                <td className="pf-u-text-align-center">
                  <CopyButton text={remoteci.id} />
                </td>
                <td>{remoteci.name}</td>
                <td className="pf-u-text-align-center">
                  {remoteci.state === "active" ? (
                    <Labels.Success>active</Labels.Success>
                  ) : (
                    <Labels.Error>inactive</Labels.Error>
                  )}
                </td>
                <td className="pf-u-text-align-center">
                  <Button onClick={() => downloadRCFile(remoteci, "remoteci")}>
                    <DownloadIcon /> remotecirc.sh
                  </Button>
                </td>
                <td className="pf-u-text-align-center">
                  {remoteci.team ? remoteci.team.name.toUpperCase() : null}
                </td>
                <td>{remoteci.from_now}</td>
                <td className="pf-u-text-align-center">
                  <EditRemoteciButton
                    className="pf-u-mr-xl"
                    remoteci={remoteci}
                    teams={teams}
                  />
                  <ConfirmDeleteButton
                    title={`Delete remoteci ${remoteci.name} ?`}
                    whenConfirmed={() => deleteRemoteci(remoteci)}
                  />
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
    remotecis: getRemotecis(state),
    teams: getTeams(state),
    isFetching: state.remotecis.isFetching || state.teams.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchRemotecis: () => {
      dispatch(remotecisActions.all({ embed: "team" }));
      dispatch(teamsActions.all());
    },
    deleteRemoteci: remoteci => dispatch(remotecisActions.delete(remoteci))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemotecisContainer);
