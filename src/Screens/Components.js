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
import actions from "../Components/Components/actions";
import CopyButton from "../Components/CopyButton";
import EmptyState from "../Components/EmptyState";
import ConfirmDeleteButton from "../Components/ConfirmDeleteButton";
import _ from "lodash";

export class ComponentsScreen extends React.Component {
  componentDidMount() {
    this.props.fetchComponents();
  }
  render() {
    const { components, isFetching } = this.props;
    return (
      <MainContent>
        <TableCard
          title="Components"
          loading={isFetching && !components.length}
          empty={!isFetching && !components.length}
          HeaderButton={
            <a
              id="components__create-component-btn"
              className="pull-right btn btn-primary"
              href="/components/create"
            >
              Create a new component
            </a>
          }
          EmptyComponent={
            <EmptyState
              title="There is no components"
              info="Do you want to create one?"
              button={
                <a className="btn btn-primary" href="/components/create">
                  Create a new component
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
                <th>Product</th>
                <th>Topic</th>
                <th>Created</th>
                <th
                  className="text-center"
                  ng-if="$ctrl.currentUser.hasProductOwnerRole"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {_.sortBy(components, [e => e.name.toLowerCase()]).map(
                (component, i) => (
                  <tr key={i}>
                    <td className="text-center">
                      <CopyButton text={component.id} />
                    </td>
                    <td>{component.name.substring(0, 42)}</td>
                    <td>
                      <a href={`/products/details/${component.product_id}`}>
                        {component.product_name}
                      </a>
                    </td>
                    <td>
                      <a href={`/topics/details/${component.topic_id}`}>
                        {component.topic_name}
                      </a>
                    </td>
                    <td>{component.created_at}</td>
                    <td className="text-center">
                      <a
                        className="btn btn-primary btn-sm btn-edit"
                        href={`/components/details/${component.id}`}
                      >
                        <i className="fa fa-pencil" />
                      </a>
                      <ConfirmDeleteButton
                        title={`Delete component ${component.name}`}
                        body={`Are you you want to delete ${component.name}?`}
                        okButton={`Yes delete ${component.name}`}
                        cancelButton="oups no!"
                        whenConfirmed={() =>
                          this.props.deleteComponent(component)
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

ComponentsScreen.propTypes = {
  components: PropTypes.array,
  isFetching: PropTypes.bool,
  errorMessage: PropTypes.string,
  fetchComponents: PropTypes.func,
  updateComponents: PropTypes.func
};

function mapStateToProps(state) {
  const { isFetching, errorMessage } = state.components2;
  return {
    components: date.transformObjectsDates(
      state.components2.byId,
      state.currentUser.timezone
    ),
    isFetching,
    errorMessage
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchComponents: () =>
      dispatch(actions.all({ endpoint: "components/latest" })),
    deleteComponent: component => dispatch(actions.delete(component))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ComponentsScreen);
