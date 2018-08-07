import React, { Component } from "react";
import { isEmpty } from "lodash";
import { TreeView } from "patternfly-react";

export default class FiltersContainer extends Component {
  selectNode = selectedNode => {
    if (selectedNode.selected) {
      this.props.history.push(`/jobs`);
    } else {
      this.props.history.push(`/jobs?remoteci_id=${selectedNode.id}`);
    }
    window.location.reload();
  };

  render() {
    const { teams, remoteci_id } = this.props;
    const data = teams.reduce((accumulator, team) => {
      let teamSelected = false;
      const nodes = team.remotecis.reduce((acc, remoteci) => {
        if (remoteci_id === remoteci.id) {
          teamSelected = true;
        }
        acc.push({
          id: remoteci.id,
          text: remoteci.name,
          icon: "fa fa-server",
          selectable: true,
          selected: remoteci_id === remoteci.id
        });
        return acc;
      }, []);
      if (!isEmpty(nodes)) {
        accumulator.push({
          id: team.id,
          text: team.name,
          selectable: false,
          selected: false,
          icon: "fa fa-users",
          nodes,
          state: {
            expanded: teamSelected
          }
        });
      }
      return accumulator;
    }, []);
    return (
      <div>
        <h4>Filter by remoteci</h4>
        <TreeView
          nodes={data}
          selectNode={this.selectNode}
          highlightOnHover
          highlightOnSelect
        />
      </div>
    );
  }
}
