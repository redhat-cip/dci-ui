import React, { Component } from "react";
import { isEmpty } from "lodash";
import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator
} from "@patternfly/react-core";

export default class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  onToggle = isOpen => {
    this.setState({
      isOpen
    });
  };

  onSelect = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  render() {
    const { isOpen } = this.state;
    const {
      placeholder,
      filter,
      filters,
      onFilterValueSelected,
      ...props
    } = this.props;
    return (
      <Dropdown
        onToggle={this.onToggle}
        onSelect={this.onSelect}
        toggle={
          <DropdownToggle onToggle={this.onToggle}>
            {isEmpty(filter) ? placeholder : filter.placeholder}
          </DropdownToggle>
        }
        isOpen={isOpen}
        {...props}
      >
        {filters.map((f, i) => (
          <DropdownItem
            component="button"
            key={i}
            onClick={() => onFilterValueSelected(f)}
          >
            {f.placeholder}
          </DropdownItem>
        ))}
      </Dropdown>
    );
  }
}
