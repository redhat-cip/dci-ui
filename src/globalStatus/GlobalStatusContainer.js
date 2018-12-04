import React, { Component } from "react";
import { isNull, isEmpty } from "lodash";
import { connect } from "react-redux";
import { getGlobalStatus } from "./globalStatusActions";
import styled from "styled-components";
import { Colors, Filter } from "../ui";
import { Page } from "../layout";
import { getGlobalStatusFilters } from "./globalStatusGetters";
import StatDetails from "./StatDetails";
import { Grid, GridItem, Button } from "@patternfly/react-core";

import { LongArrowAltLeftIcon } from "@patternfly/react-icons";

const GlobalStatusItem = styled.div`
  text-align: center;
  background: ${props =>
    isEmpty(props.stat.jobs)
      ? Colors.black500
      : props.stat.percentageOfSuccess > 30
      ? Colors.green400
      : Colors.red100};
  color: ${Colors.white};
  display: flex;
  justify-content: center;
  flex-direction: column;
  alignitems: center;
  cursor: pointer;
  height: 170px;
`;

const GlobalStatusItemTitle = styled.div`
  overflow: hidden;
  font-size: 1.8em;
  font-weight: 500;
`;
const GlobalStatusItemBody = styled.div`
  font-size: 1.3em;
`;

export class GlobalStatusContainer extends Component {
  state = {
    filter: null,
    seeDetails: false,
    stat: null
  };

  componentDidMount() {
    this.props.getGlobalStatus();
  }

  seeStatDetails = stat => {
    this.setState(prevState => {
      if (prevState.stat && prevState.stat.id === stat.id) {
        return {
          seeDetails: false,
          stat: null
        };
      }
      return {
        seeDetails: true,
        stat
      };
    });
  };

  render() {
    const { globalStatus: stats } = this.props;
    const { filter, seeDetails, stat } = this.state;
    const filters = getGlobalStatusFilters(stats);
    const defaultFilter = { name: "All" };
    return (
      <Page
        title="Global Status"
        loading={isEmpty(stats)}
        Toolbar={
          <Filter
            placeholder={isNull(filter) ? defaultFilter.name : filter.name}
            filter={filter || defaultFilter}
            filters={[defaultFilter, ...filters]}
            onFilterValueSelected={newFilter =>
              this.setState({ filter: newFilter })
            }
          />
        }
      >
        {seeDetails ? (
          <Grid gutter="xl">
            <GridItem>
              <Button
                variant="plain"
                aria-label="Back button hide details"
                onClick={() =>
                  this.setState(prevState => ({
                    seeDetails: !prevState.seeDetails
                  }))
                }
              >
                <LongArrowAltLeftIcon size="lg" />
              </Button>
              <StatDetails stat={stat} />
            </GridItem>
          </Grid>
        ) : (
          <Grid gutter="xl" sm={3} md={2}>
            {stats
              .filter(stat => {
                if (isNull(filter) || filter.name === "All") return true;
                return stat.product_name === filter.name;
              })
              .map(stat => (
                <GridItem
                  key={stat.id}
                  onClick={() => this.seeStatDetails(stat)}
                >
                  <GlobalStatusItem stat={stat}>
                    <GlobalStatusItemTitle>
                      {stat.topic_name}
                    </GlobalStatusItemTitle>
                    <GlobalStatusItemBody>
                      {stat.percentageOfSuccess}% success
                    </GlobalStatusItemBody>
                  </GlobalStatusItem>
                </GridItem>
              ))}
          </Grid>
        )}
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    globalStatus: state.globalStatus
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getGlobalStatus: () => dispatch(getGlobalStatus())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalStatusContainer);
