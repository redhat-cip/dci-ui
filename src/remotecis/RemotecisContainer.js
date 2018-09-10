import React, { Component } from "react";
import { connect } from "react-redux";
import { Label, Button, Icon } from "patternfly-react";
import { isEmpty } from "lodash";
import DCICard from "../DCICard";
import remotecisActions from "./remotecisActions";
import teamsActions from "../teams/teamsActions";
import { CopyButton } from "../ui";
import { EmptyState } from "../ui";
import NewRemoteciButton from "./NewRemoteciButton";
import EditRemoteciButton from "./EditRemoteciButton";
import ConfirmDeleteButton from "../ConfirmDeleteButton";
import { getRemotecis } from "./remotecisSelectors";
import { getTeams } from "../teams/teamsSelectors";
import { MainContent } from "../layout";
import { downloadRCFile } from "../services/runcom";

export class RemotecisContainer extends Component {
  componentDidMount() {
    this.props.fetchRemotecis();
  }

  render() {
    const { remotecis, teams, isFetching } = this.props;
    return (
      <MainContent>
        <DCICard
          title="Remotecis"
          loading={isFetching && isEmpty(remotecis)}
          empty={!isFetching && isEmpty(remotecis)}
          HeaderButton={
            <NewRemoteciButton teams={teams} className="pull-right" />
          }
          EmptyComponent={
            <EmptyState
              title="There is no remotecis"
              info="Do you want to create one?"
              button={<NewRemoteciButton teams={teams} />}
            />
          }
        >
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th className="text-center">ID</th>
                <th>Name</th>
                <th className="text-center">Status</th>
                <th className="text-center" title="Download run commands file">
                  Download rc file
                </th>
                <th className="text-center">Team</th>
                <th>Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {remotecis.map(remoteci => (
                <tr key={`${remoteci.id}.${remoteci.etag}`}>
                  <td className="text-center">
                    <CopyButton text={remoteci.id} />
                  </td>
                  <td>{remoteci.name}</td>
                  <td className="text-center">
                    {remoteci.state === "active" ? (
                      <Label bsStyle="success">active</Label>
                    ) : (
                      <Label bsStyle="danger">inactive</Label>
                    )}
                  </td>
                  <td className="text-center">
                    <Button
                      onClick={() => downloadRCFile(remoteci, "remoteci")}
                    >
                      <Icon type="fa" name="download" /> remotecirc.sh
                    </Button>
                  </td>
                  <td className="text-center">
                    {remoteci.team ? remoteci.team.name.toUpperCase() : null}
                  </td>
                  <td>{remoteci.from_now}</td>
                  <td className="text-center">
                    <EditRemoteciButton
                      className="mr-1"
                      remoteci={remoteci}
                      teams={teams}
                    />
                    <ConfirmDeleteButton
                      name="remoteci"
                      resource={remoteci}
                      whenConfirmed={remoteci =>
                        this.props.deleteRemoteci(remoteci)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DCICard>
      </MainContent>
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
