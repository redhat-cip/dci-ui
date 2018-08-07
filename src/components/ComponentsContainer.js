import React, { Component } from "react";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import DCICard from "../DCICard";
import componentsActions from "./componentsActions";
import { CopyButton, EmptyState } from "../ui";
import ConfirmDeleteButton from "../ConfirmDeleteButton";
import { getComponents } from "./componentSelectors";
import { MainContent } from "../layout";

export class ComponentsContainer extends Component {
  componentDidMount() {
    this.props.fetchComponents();
  }
  render() {
    const { components, isFetching } = this.props;
    return (
      <MainContent>
        <DCICard
          title="Components"
          loading={isFetching && isEmpty(components)}
          empty={!isFetching && isEmpty(components)}
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
                    <ConfirmDeleteButton
                      name="component"
                      resource={component}
                      whenConfirmed={component =>
                        this.props.deleteComponent(component)
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
