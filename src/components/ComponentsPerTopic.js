import React, { Component } from "react";
import { connect } from "react-redux";
import { CopyButton } from "ui";
import { AngleDownIcon } from "@patternfly/react-icons";
import { fetchLatestComponents } from "./componentsActions";

export class ComponentsPerTopic extends Component {
  state = {
    isOpen: false,
    loading: true,
    components: []
  };
  toggleRow = () => {
    const { fetchLatestComponents, topic } = this.props;
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    fetchLatestComponents(topic)
      .then(response => {
        this.setState({ components: response.data.components });
        return response;
      })
      .catch(() => undefined)
      .then(() => this.setState({ loading: false }));
  };
  render() {
    const { isOpen, loading, components } = this.state;
    const { topic } = this.props;
    return (
      <tbody className={isOpen ? "pf-m-expanded" : ""}>
        <tr key={`${topic.id}.${topic.etag}`} onClick={() => this.toggleRow()}>
          <td className="pf-c-table__toggle">
            <button
              className={`pf-c-button pf-m-plain ${
                isOpen ? "pf-m-expanded" : ""
              }`}
            >
              <AngleDownIcon />
            </button>
          </td>
          <td className="pf-u-text-align-center">
            <CopyButton text={topic.id} />
          </td>
          <td>{topic.name}</td>
          <td>{topic.product ? topic.product.name : null}</td>
          <td>{topic.from_now}</td>
        </tr>
        <tr
          className={`pf-c-table__expandable-row ${
            isOpen ? "pf-m-expanded" : ""
          }`}
        >
          {loading ? (
            <td
              colSpan="5"
              className="pf-c-table__expandable-row-content pf-u-py-xl"
            >
              loading
            </td>
          ) : (
            <td
              colSpan="5"
              className="pf-c-table__expandable-row-content pf-m-no-padding pf-u-py-xl"
            >
              <table className="pf-c-table pf-m-compact pf-m-no-border-rows">
                <caption>Latest components for {topic.name}</caption>
                <thead>
                  <tr>
                    <th className="pf-u-text-align-center">ID</th>
                    <th>Component</th>
                    <th>Type</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {components.map(component => (
                    <tr>
                      <td className="pf-u-text-align-center">
                        <CopyButton text={component.id} />
                      </td>
                      <th data-label="Component Name">{component.name}</th>
                      <th data-label="Component Type">{component.type}</th>
                      <th data-label="Created At">{component.created_at}</th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          )}
        </tr>
      </tbody>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchLatestComponents: topic => dispatch(fetchLatestComponents(topic))
  };
}

export default connect(null, mapDispatchToProps)(ComponentsPerTopic);
