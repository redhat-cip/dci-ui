import React, { Component } from "react";
import { isEmpty } from "lodash";
import { ContextSelector, ContextSelectorItem } from "@patternfly/react-core";

export default class FilterWithSearch extends Component {
  state = {
    isOpen: false,
    searchValue: "",
    filteredItems: this.props.filters
  };

  onToggle = (event, isOpen) => {
    this.setState({
      isOpen
    });
  };

  onSelect = (event, value) => {
    const { onFilterValueSelected, filters } = this.props;
    const selectedItem = filters.find(f => f.name === value);
    this.setState(
      prevState => ({ isOpen: !prevState.isOpen }),
      () => onFilterValueSelected(selectedItem)
    );
  };

  onSearchInputChange = value => {
    this.setState({ searchValue: value });
  };

  onSearchButtonClick = event => {
    const { searchValue } = this.state;
    const { filters } = this.props;
    const filteredItems =
      searchValue === ""
        ? filters
        : filters.filter(
            f => f.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
          );

    this.setState({ filteredItems: filteredItems || [] });
  };

  render() {
    const { isOpen, searchValue, filteredItems } = this.state;
    const { placeholder, filter, className } = this.props;
    return (
      <ContextSelector
        toggleText={isEmpty(filter) ? placeholder : filter.name}
        onSearchInputChange={this.onSearchInputChange}
        isOpen={isOpen}
        searchInputValue={searchValue}
        onToggle={this.onToggle}
        onSelect={this.onSelect}
        onSearchButtonClick={this.onSearchButtonClick}
        screenReaderLabel={placeholder}
        className={className}
      >
        {filteredItems.map((item, i) => (
          <ContextSelectorItem key={i}>{item.name}</ContextSelectorItem>
        ))}
      </ContextSelector>
    );
  }
}
