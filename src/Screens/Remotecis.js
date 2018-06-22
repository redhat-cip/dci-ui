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
import { connect } from "../store";
import PropTypes from "prop-types";
import * as date from "../Components/Date";
import { MainContent } from "../Components/Layout";
import TableCard from "../Components/TableCard";
import actions from "../Components/Remotecis/actions";
import CopyButton from "../Components/CopyButton";
import EmptyState from "../Components/EmptyState";
import { Label, Button, Icon } from "patternfly-react";
import DCIRCFile from "../services/DCIRCFile";
import ConfirmDeleteButton from "../Components/ConfirmDeleteButton";
import _ from "lodash";

export class RemotecisScreen extends React.Component {
  componentDidMount() {
    this.props.fetchRemotecis();
  }

  render() {
    const { remotecis, isFetching } = this.props;
    return (
      <MainContent>
        <TableCard
          title="Remotecis"
          loading={isFetching && !remotecis.length}
          empty={!isFetching && !remotecis.length}
          HeaderButton={
            <a
              id="remotecis__create-remoteci-btn"
              className="pull-right btn btn-primary"
              href="/remotecis/create"
            >
              Create a new remoteci
            </a>
          }
          EmptyComponent={
            <EmptyState
              title="There is no remotecis"
              info="Do you want to create one?"
              button={
                <a className="btn btn-primary" href="/remotecis/create">
                  Create a new remoteci
                </a>
              }
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
              {_.sortBy(remotecis, [e => e.name.toLowerCase()]).map(
                (remoteci, i) => (
                  <tr key={i}>
                    <td className="text-center">
                      <CopyButton text={remoteci.id} />
                    </td>
                    <td>
                      <a href={`/remotecis/${remoteci.id}`}>{remoteci.name}</a>
                    </td>
                    <td className="text-center">
                      {remoteci.state === "active" ? (
                        <Label bsStyle="success">active</Label>
                      ) : (
                        <Label bsStyle="danger">inactive</Label>
                      )}
                    </td>
                    <td className="text-center">
                      <Button
                        onClick={() => DCIRCFile.download(remoteci, "remoteci")}
                      >
                        <Icon type="fa" name="download" /> remotecirc.sh
                      </Button>
                    </td>
                    <td className="text-center">
                      {remoteci.team.name.toUpperCase()}
                    </td>
                    <td>{remoteci.from_now}</td>
                    <td className="text-center">
                      <a
                        className="btn btn-primary btn-sm btn-edit"
                        href={`/remotecis/${remoteci.id}`}
                      >
                        <i className="fa fa-pencil" />
                      </a>
                      <ConfirmDeleteButton
                        title={`Delete remoteci ${remoteci.name}`}
                        body={`Are you you want to delete ${remoteci.name}?`}
                        okButton={`Yes delete ${remoteci.name}`}
                        cancelButton="oups no!"
                        whenConfirmed={() =>
                          this.props.deleteRemoteci(remoteci)
                        }
                      />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </TableCard>
      </MainContent>
    );
  }
}

RemotecisScreen.propTypes = {
  remotecis: PropTypes.array,
  isFetching: PropTypes.bool,
  fetchRemotecis: PropTypes.func,
  deleteRemoteci: PropTypes.func
};

function mapStateToProps(state) {
  return {
    remotecis: date.transformObjectsDates(
      state.remotecis2.byId,
      state.currentUser.timezone
    ),
    isFetching: state.remotecis2.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchRemotecis: () => dispatch(actions.all({ embed: "team" })),
    deleteRemoteci: remoteci => dispatch(actions.delete(remoteci))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemotecisScreen);
