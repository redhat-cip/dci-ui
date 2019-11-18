import React, { Component } from "react";
import { isEmpty } from "lodash";
import { Card, CardBody, CardHeader } from "@patternfly/react-core";
import HeatMap from "./HeatMap";
import styled from "styled-components";

const PerformanceBox = styled.div`
  display: flex;
`;
const HeatMapBox = styled.div`
  flex: 0 0 50%;
`;

const TestCasesTableBox = styled.div`
  flex: 0 0 50%;
`;

export default class PerformanceCard extends Component {
  state = {
    testcase: null,
    seeMore: false
  };

  render() {
    const { performance } = this.props;
    const { testcase, seeMore } = this.state;
    if (isEmpty(performance)) return null;
    const [testName, data] = Object.entries(performance)[0];
    const firstJob = data[0];
    const secondJob = data[1];
    const numberTestcasesToShow = 6;
    const orderedTestscases = secondJob.testscases
      .slice()
      .sort((t1, t2) => t1.delta < t2.delta);
    const displayedTestscases = seeMore
      ? orderedTestscases
      : orderedTestscases.slice(0, numberTestcasesToShow);
    return (
      <Card className="pf-u-mt-md">
        <CardHeader>
          {testName}
          <br />
          {`Compare job ${firstJob.job_id} with ${secondJob.job_id}`}
        </CardHeader>
        <CardBody>
          <PerformanceBox>
            <HeatMapBox>
              <HeatMap
                data={secondJob.testscases}
                testCaseSelected={testcase => this.setState({ testcase })}
              />
            </HeatMapBox>
            <TestCasesTableBox>
              {isEmpty(testcase) ? null : (
                <div>
                  Class name: {testcase.classname}
                  <br />
                  Name: {testcase.name}
                  <br />
                  Time: {testcase.time}
                  <br />
                  Delta: {testcase.delta}
                </div>
              )}
            </TestCasesTableBox>
          </PerformanceBox>
          <div>
            <table className="pf-c-table pf-m-compact pf-m-grid-md">
              <thead>
                <tr>
                  <th>class</th>
                  <th>name</th>
                  <th>time</th>
                  <th>delta</th>
                </tr>
              </thead>
              <tbody>
                {displayedTestscases.map((tc, i) => (
                  <tr key={i}>
                    <td>{tc.classname}</td>
                    <td>{tc.name}</td>
                    <td>{tc.time}</td>
                    <td>{tc.delta}</td>
                  </tr>
                ))}
                {!seeMore &&
                  displayedTestscases.length === numberTestcasesToShow && (
                    <tr>
                      <td
                        colSpan={4}
                        onClick={() => this.setState({ seeMore: true })}
                      >
                        ...see more
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    );
  }
}
