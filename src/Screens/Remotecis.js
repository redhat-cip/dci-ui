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
import Alert from "../Components/Alert";
import { MainContent } from "../Components/Layout";
import TableCard from "../Components/TableCard";
import actions from "../Components/Remotecis/actions";
import CopyButton from "../Components/CopyButton";
import EmptyState from "../Components/EmptyState";
import { Label, Button, Icon } from "patternfly-react";
import DCIRCFile from "../services/DCIRCFile";

export class RemotecisScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchRemotecis();
  }

  render() {
    const { remotecis, isFetching, errorMessage } = this.props;
    return (
      <MainContent>
        {errorMessage && !remotecis.length ? (
          <Alert message={errorMessage} />
        ) : null}
        <TableCard
          loading={isFetching && !remotecis.length}
          title="Remotecis"
          headerButton={
            <a className="pull-right btn btn-primary" href="/remotecis/create">
              Create a new remoteci
            </a>
          }
        >
          {!errorMessage && !remotecis.length ? (
            <EmptyState
              title="There is no remotecis"
              info="Do you want to create one?"
              button={
                <a className="btn btn-primary" href="/remotecis/create">
                  Create a new remoteci
                </a>
              }
            />
          ) : (
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th>Name</th>
                  <th className="text-center">Status</th>
                  <th
                    className="text-center"
                    title="Download run commands file"
                  >
                    Download rc file
                  </th>
                  <th className="text-center">Team</th>
                  <th>Created</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {remotecis.map((remoteci, i) => (
                  <tr key={i}>
                    <td className="text-center">
                      <CopyButton text={remoteci.id} />
                    </td>
                    <td>
                      <a href={`/remotecis/details/${remoteci.id}`}>
                        {remoteci.name}
                      </a>
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
                    <td className="text-center">{remoteci.team.name}</td>
                    <td>{remoteci.created_at}</td>
                    <td className="text-center">
                      <a
                        className="btn btn-primary btn-sm btn-edit"
                        href={`/remotecis/details/${remoteci.id}`}
                      >
                        <i className="fa fa-pencil" />
                      </a>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        ng-click="$ctrl.deleteRemoteci(remoteci)"
                      >
                        <i className="fa fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TableCard>
      </MainContent>
    );
  }
}

RemotecisScreen.propTypes = {
  remotecis: PropTypes.array,
  isFetching: PropTypes.bool,
  errorMessage: PropTypes.string,
  fetchRemotecis: PropTypes.func,
  updateRemotecis: PropTypes.func
};

function mapStateToProps(state) {
  const { isFetching, errorMessage } = state.remotecis2;
  return {
    remotecis: date.transformObjectsDates(
      state.remotecis2.byId,
      state.currentUser.timezone
    ),
    isFetching,
    errorMessage
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchRemotecis: () => {
      dispatch(actions.all({ embed: "team" }));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemotecisScreen);
