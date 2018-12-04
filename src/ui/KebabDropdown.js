import React, { Component } from "react";
import { KebabToggle, Dropdown } from "@patternfly/react-core";

export default class KebabDropdown extends Component {
  state = {
    isOpen: false
  };

  onToggle = isOpen => {
    this.setState({
      isOpen
    });
  };

  onSelect = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  };

  render() {
    const { isOpen } = this.state;
    const { items, ...props } = this.props;
    return (
      <Dropdown
        onToggle={this.onToggle}
        onSelect={this.onSelect}
        toggle={<KebabToggle onToggle={this.onToggle} />}
        isOpen={isOpen}
        isPlain
        dropdownItems={items}
        {...props}
      />
    );
  }
}
