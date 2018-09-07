import React, { Component } from "react";
import { isEmpty } from "lodash";
import { Radio, Button, FormControl } from "patternfly-react";
import styled from "styled-components";
import { Colors } from "../ui";

const FilterPanel = styled.div``;

const FilterPanelCategory = styled.form`
  margin-top: 20px;

  &:first-of-type {
    margin-top: 0;
  }
`;

const FilterPanelCategoryItems = styled.fieldset`
  margin-top: 0;
  margin-bottom: 0;
`;

const FilterPanelCategoryTitle = styled.fieldset`
color: ${Colors.black500}
text-transform: uppercase;
`;

const FilterPanelCategoryItem = styled.div`
  font-weight: 400;
  margin-bottom: 0;
  margin-top: 5px;

  &:first-of-type {
    margin-top: 0;
  }
  .radio {
    margin: 0;
  }
`;

const FilterPanelCategoryIcon = styled.span`
  padding-right: 3px;
`;

const ResetFilterIcon = styled(Button)`
  padding-left: 3px;
`;

class TeamRemotecisList extends Component {
  render() {
    const { team, remoteciId, selectRemoteci } = this.props;
    if (isEmpty(team.remotecis)) return null;
    return (
      <FilterPanelCategoryItems>
        <FilterPanelCategoryTitle>{team.name}</FilterPanelCategoryTitle>
        {team.remotecis.map(remoteci => (
          <FilterPanelCategoryItem key={remoteci.etag}>
            <Radio
              name="filter-job-radio"
              onChange={() => selectRemoteci(remoteci.id)}
              checked={remoteci.id === remoteciId}
            >
              <FilterPanelCategoryIcon>
                <i className="fa fa-fw fa-server" />
              </FilterPanelCategoryIcon>
              {remoteci.name}
              {remoteci.id === remoteciId ? (
                <ResetFilterIcon
                  bsStyle="link"
                  onClick={() => selectRemoteci(null)}
                >
                  <i className="fa fa-fw fa-times-circle" />
                </ResetFilterIcon>
              ) : null}
            </Radio>
          </FilterPanelCategoryItem>
        ))}
      </FilterPanelCategoryItems>
    );
  }
}

export default class FilterJobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: ""
    };
  }
  render() {
    const { teams, remoteciId, selectRemoteci } = this.props;
    const { filter } = this.state;
    return (
      <FilterPanel>
        <FilterPanelCategory>
          <FormControl
            type="text"
            placeholder="Filter by team name"
            bsClass="form-control"
            onChange={event => this.setState({ filter: event.target.value })}
          />
        </FilterPanelCategory>
        <FilterPanelCategory>
          {teams
            .filter(team => team.name.toLowerCase().includes(filter.toLowerCase()))
            .map(team => (
              <TeamRemotecisList
                key={team.etag}
                remoteciId={remoteciId}
                selectRemoteci={selectRemoteci}
                team={team}
              />
            ))}
        </FilterPanelCategory>
      </FilterPanel>
    );
  }
}
