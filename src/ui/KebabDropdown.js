import React, { Component } from "react";
import { KebabToggle, Dropdown } from "@patternfly/react-core";

export default class KebabDropdown extends Component {
  state = {
    isOpen: false,
  };

  onToggle = (isOpen) => {
    this.setState({
      isOpen,
    });
  };

  render() {
    const { isOpen } = this.state;
    const { items, ...props } = this.props;
    return (
      <Dropdown
        onToggle={this.onToggle}
        toggle={<KebabToggle onToggle={this.onToggle} />}
        isOpen={isOpen}
        isPlain
        dropdownItems={items}
        {...props}
      />
    );
  }
}
