import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { Row, Col, SplitButton, MenuItem } from "patternfly-react";
import moment from "moment";
import topicsActions from "../topics/topicsActions";
import { getTopics } from "../topics/topicsSelectors";
import { getTrends } from "./trendsActions";
import { MainContentWithLoader } from "../layout";
import TrendGraph from "./TrendGraph";

export class TrendsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: 30
    };
  }

  filterData = (data, days) => {
    return data.filter(d => {
      const xDaysAgo = moment().subtract(days, "days");
      return moment.unix(d[0]).isAfter(xDaysAgo);
    });
  };

  componentDidMount() {
    this.props.fetchTrends();
  }

  render() {
    const { topics, trends } = this.props;
    return (
      <MainContentWithLoader loading={isEmpty(trends) || isEmpty(topics)}>
        <Row>
          <Col xs={12}>
            <SplitButton
              bsStyle="default"
              title={`last ${this.state.days} days`}
              id="trends__filter-btn"
              className="mb-3"
            >
              <MenuItem
                eventKey="1"
                onClick={() => this.setState({ days: 30 })}
              >
                last 30 days
              </MenuItem>
              <MenuItem
                eventKey="2"
                onClick={() => this.setState({ days: 90 })}
              >
                last 90 days
              </MenuItem>
              <MenuItem
                eventKey="3"
                onClick={() => this.setState({ days: 365 })}
              >
                last 365 days
              </MenuItem>
            </SplitButton>
          </Col>
        </Row>
        <Row>
          {topics.map(topic => {
            const trend = trends[topic.id] || [];
            const filteredTrend = this.filterData(trend, this.state.days);
            if (filteredTrend.length < 10) return null;
            return (
              <Col xs={12} md={4} key={topic.id}>
                <TrendGraph
                  color="#3f9c35"
                  trend={filteredTrend}
                  topic={topic}
                />
              </Col>
            );
          })}
        </Row>
      </MainContentWithLoader>
    );
  }
}

function mapStateToProps(state) {
  return {
    topics: getTopics(state),
    trends: state.trends
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTrends: () => {
      dispatch(topicsActions.all());
      dispatch(getTrends());
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrendsContainer);
