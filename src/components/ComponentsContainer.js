import React, { Component } from "react";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { Page } from "../layout";
import componentsActions from "./componentsActions";
import { CopyButton, EmptyState, ConfirmDeleteButton } from "../ui";
import { getComponents } from "./componentSelectors";

export class ComponentsContainer extends Component {
  componentDidMount() {
    this.props.fetchComponents();
  }
  render() {
    const { components, isFetching, deleteComponent } = this.props;
    return (
      <Page
        title="Components"
        loading={isFetching && isEmpty(components)}
        empty={!isFetching && isEmpty(components)}
        EmptyComponent={
          <EmptyState
            title="There is no components"
            info="Components are created by the feeder automatically for you. Contact your administrator."
          />
        }
      >
        <table className="pf-c-table pf-m-compact pf-m-grid-md">
          <thead>
            <tr>
              <th className="pf-u-text-align-center">ID</th>
              <th>Name</th>
              <th>Product</th>
              <th>Topic</th>
              <th>Created</th>
              <th className="pf-u-text-align-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {components.map((component, i) => (
              <tr key={i}>
                <td className="pf-u-text-align-center">
                  <CopyButton text={component.id} />
                </td>
                <td>{component.name.substring(0, 42)}</td>
                <td>{component.product_name}</td>
                <td>{component.topic_name}</td>
                <td>{component.from_now}</td>
                <td className="pf-u-text-align-center">
                  <ConfirmDeleteButton
                    title={`Delete component ${component.name}`}
                    content={`Are you sure you want to delete ${
                      component.name
                    }?`}
                    whenConfirmed={() => deleteComponent(component)}
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
    components: getComponents(state),
    isFetching: state.components.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchComponents: () =>
      dispatch(componentsActions.all({ endpoint: "components/latest" })),
    deleteComponent: component => dispatch(componentsActions.delete(component))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ComponentsContainer);
