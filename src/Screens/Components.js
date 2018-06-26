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
import _ from "lodash";
import PropTypes from "prop-types";
import { connect } from "../store";
import { MainContent } from "../Components/Layout";
import TableCard from "../Components/TableCard";
import actions from "../Components/Components/actions";
import CopyButton from "../Components/CopyButton";
import EmptyState from "../Components/EmptyState";
import DeleteComponentButton from "../Components/Components/DeleteComponentButton";
import { getComponents } from "../Components/Components/selectors";

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
          loading={isFetching && _.isEmpty(components)}
          empty={!isFetching && _.isEmpty(components)}
          EmptyComponent={
            <EmptyState
              title="There is no components"
              info="The components are created by the feeder. See documentation"
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
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {components.map((component, i) => (
                <tr key={i}>
                  <td className="text-center">
                    <CopyButton text={component.id} />
                  </td>
                  <td>{component.name.substring(0, 42)}</td>
                  <td>{component.product_name}</td>
                  <td>{component.topic_name}</td>
                  <td>{component.from_now}</td>
                  <td className="text-center">
                    <DeleteComponentButton component={component} />
                  </td>
                </tr>
              ))}
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
  fetchComponents: PropTypes.func,
  deleteComponent: PropTypes.func
};

function mapStateToProps(state) {
  return {
    components: getComponents(state),
    isFetching: state.components2.isFetching
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
