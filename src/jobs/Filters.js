import React, { Component } from "react";
import { isEmpty } from "lodash";
import { Filter } from "patternfly-react";

export class RemoteciInTeamFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterCategories: this._getFilterCategories(props.teams),
      currentCategory: null,
      currentFilter: null
    };
  }
  _getFilterCategories = teams => {
    const teamsWithRemotecis = teams.filter(team => !isEmpty(team.remotecis));
    return teamsWithRemotecis.map(team => ({
      id: team.id,
      title: team.name,
      filterValues: team.remotecis.map(remoteci => ({
        title: remoteci.name,
        key: "remoteci_id",
        value: remoteci.id
      }))
    }));
  };
  render() {
    const { filterCategories, currentCategory, currentFilter } = this.state;
    const { addFilter } = this.props;
    return (
      <Filter style={{ borderRight: 0 }}>
        <Filter.CategorySelector
          filterCategories={filterCategories}
          currentCategory={currentCategory}
          placeholder="Filter by team"
          onFilterCategorySelected={category =>
            this.setState({ currentCategory: category, currentFilter: null })
          }
        >
          <Filter.CategoryValueSelector
            categoryValues={currentCategory && currentCategory.filterValues}
            currentValue={currentFilter}
            placeholder="Filter by remoteci"
            onCategoryValueSelected={filter =>
              this.setState({ currentFilter: filter }, () => addFilter(filter))
            }
          />
        </Filter.CategorySelector>
      </Filter>
    );
  }
}

export class StatusFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFilter: null
    };
  }
  render() {
    const { addFilter } = this.props;
    const { currentFilter } = this.state;
    return (
      <Filter style={{ borderRight: 0 }}>
        <Filter.ValueSelector
          filterValues={[
            {
              title: "New",
              key: "status",
              value: "new"
            },
            {
              title: "Running",
              key: "status",
              value: "running"
            },
            {
              title: "Success",
              key: "status",
              value: "success"
            },
            {
              title: "Failure",
              key: "status",
              value: "failure"
            },
            {
              title: "Error",
              key: "status",
              value: "error"
            }
          ]}
          placeholder="Filter by Status"
          currentValue={currentFilter}
          onFilterValueSelected={filter =>
            this.setState({ currentFilter: filter }, () => addFilter(filter))
          }
        />
      </Filter>
    );
  }
}
