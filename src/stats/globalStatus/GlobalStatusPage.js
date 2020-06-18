import React, { Component } from "react";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { getGlobalStatus } from "./globalStatusActions";
import styled from "styled-components";
import {
  global_palette_red_100,
  global_palette_green_400,
  global_palette_black_500,
  global_palette_white,
} from "@patternfly/react-tokens";
import { Page } from "layout";
import {
  PageSection,
  Gallery,
  Card,
  GalleryItem,
  CardTitle,
  CardBody,
} from "@patternfly/react-core";
import { Link } from "react-router-dom";

const GlobalStatusItem = styled.div`
  text-align: center;
  background: ${(props) =>
    isEmpty(props.stat.jobs)
      ? global_palette_black_500.value
      : props.stat.percentageOfSuccess > 30
      ? global_palette_green_400.value
      : global_palette_red_100.value};
  color: ${global_palette_white.value};
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

export class GlobalStatusPage extends Component {
  state = {
    seeDetails: false,
    stat: null,
  };

  componentDidMount() {
    const { getGlobalStatus } = this.props;
    getGlobalStatus();
  }

  seeStatDetails = (stat) => {
    this.setState((prevState) => {
      if (prevState.stat && prevState.stat.id === stat.id) {
        return {
          seeDetails: false,
          stat: null,
        };
      }
      return {
        stat,
      };
    });
  };

  render() {
    const { globalStatus: stats } = this.props;
    const { stat } = this.state;

    return (
      <Page
        title="Global Status"
        description="The percentage of jobs in success for all partners using DCI. Click on a topic to see more details"
        loading={isEmpty(stats)}
      >
        <PageSection>
          {isEmpty(stat) ? (
            <Gallery hasGutter>
              {stats.map((stat) => (
                <GalleryItem key={stat.id}>
                  <Card
                    onClick={() => this.setState({ stat })}
                    title="Click to enlarge"
                    style={{ cursor: "pointer" }}
                  >
                    <CardBody>
                      <div>
                        <GlobalStatusItem stat={stat}>
                          <GlobalStatusItemTitle>
                            {stat.topic_name}
                          </GlobalStatusItemTitle>
                          <GlobalStatusItemBody>
                            {stat.percentageOfSuccess}% success
                          </GlobalStatusItemBody>
                        </GlobalStatusItem>
                      </div>
                    </CardBody>
                  </Card>
                </GalleryItem>
              ))}
            </Gallery>
          ) : (
            <Card
              onClick={() => this.setState({ stat: null })}
              title="Click to hide"
              style={{ cursor: "pointer" }}
            >
              <CardTitle>Stat details for {stat.name}</CardTitle>
              <CardBody>
                {isEmpty(stat.jobs) ? (
                  "There are no job for this component"
                ) : (
                  <table className="pf-c-table pf-m-compact pf-m-grid-md">
                    <thead>
                      <tr>
                        <th>Team</th>
                        <th>Remote CI (Configuration)</th>
                        <th className="text-center">Status</th>
                        <th className="text-right">Last run</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stat.jobs.map((job, i) => (
                        <tr key={i}>
                          <td>{job.team_name}</td>
                          <td>{job.remoteci_name}</td>
                          <td className="text-center">
                            <Link to={`/jobs/${job.id}/jobStates`}>
                              {job.status}
                            </Link>
                          </td>
                          <td className="text-right">{job.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardBody>
            </Card>
          )}
        </PageSection>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    globalStatus: state.globalStatus,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getGlobalStatus: () => dispatch(getGlobalStatus()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalStatusPage);
