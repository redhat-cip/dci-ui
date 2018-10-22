import React, { Component } from "react";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { getGlobalStatus } from "./globalStatusActions";
import styled from "styled-components";
import { SplitButton, MenuItem } from "patternfly-react";
import { Colors } from "../ui";
import { Page } from "../layout";
import { getUniqueProductsNames } from "./globalStatusGetters";
import StatDetails from "./StatDetails";

const GlobalStatusSummary = styled.div`
  display: grid;
  width: 100%;
  max-width: 100vw;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 100px;
  grid-column-gap: 10px;
  grid-row-gap: 10px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(8, 1fr);
  }
`;

const GlobalStatusItem = styled.div`
  text-align: center;
  background: ${props =>
    props.stat.percentageOfSuccess > 30 ? Colors.green400 : Colors.red100};
  box-shadow: 0 1px 1px rgba(3, 3, 3, 0.175);
  color: ${Colors.white};
  display: flex;
  justify-content: center;
  flex-direction: column;
  alignitems: center;
  cursor: pointer;
`;

const GlobalStatusItemTitle = styled.div`
  overflow: hidden;
  font-size: 2rem;
  font-weight: 500;
`;
const GlobalStatusItemBody = styled.div`
  font-size: 1.5rem;
`;

export class GlobalStatusContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "all",
      tabs: ["all"],
      seeDetails: false,
      stat: null
    };
  }

  componentDidMount() {
    this.props.getGlobalStatus();
  }

  seeStatDetails = stat =>
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

  render() {
    const { globalStatus: stats } = this.props;
    return (
      <Page loading={isEmpty(stats)}>
        <SplitButton
          variant="primary"
          title={this.state.tab}
          id="globalStatus__filter-btn"
          className="pf-u-mb-xl"
        >
          <MenuItem eventKey="1" onClick={() => this.setState({ tab: "all" })}>
            All
          </MenuItem>
          {getUniqueProductsNames(stats).map((productName, i) => (
            <MenuItem
              key={i}
              eventKey="4"
              onClick={() => this.setState({ tab: productName })}
            >
              {productName}
            </MenuItem>
          ))}
        </SplitButton>
        <GlobalStatusSummary>
          {stats
            .filter(stat => {
              if (this.state.tab === "all") return true;
              return stat.product_name === this.state.tab;
            })
            .map(stat => (
              <GlobalStatusItem
                key={stat.id}
                stat={stat}
                onClick={() => this.seeStatDetails(stat)}
              >
                <GlobalStatusItemTitle>{stat.topic_name}</GlobalStatusItemTitle>
                <GlobalStatusItemBody>
                  {stat.percentageOfSuccess}% success
                </GlobalStatusItemBody>
              </GlobalStatusItem>
            ))}
        </GlobalStatusSummary>
        {this.state.seeDetails ? (
          <div className="mt-1">
            <StatDetails stat={this.state.stat} />
          </div>
        ) : null}
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
