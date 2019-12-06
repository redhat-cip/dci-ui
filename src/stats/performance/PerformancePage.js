import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import queryString from "query-string";
import { calcPerformance } from "./performanceActions";
import { Page } from "layout";
import JobSelectorForm from "./JobSelectorForm";
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  PageSection
} from "@patternfly/react-core";
import PerformanceCard from "./PerformanceCard";

export class PerformancePage extends Component {
  state = {
    performance: [],
    isFetching: false,
    jobs_ids: []
  };

  componentDidMount() {
    const { location } = this.props;
    const { jobs_ids } = queryString.parse(location.search);
    if (!isEmpty(jobs_ids)) {
      this._calcPerformance(jobs_ids.split(","));
    }
  }

  _calcPerformance = jobs_ids => {
    const { calcPerformance, history } = this.props;
    this.setState({ isFetching: true, jobs_ids });
    history.push(`/performance?jobs_ids=${jobs_ids.join(",")}`);
    calcPerformance(jobs_ids)
      .then(r =>
        this.setState({ performance: r.data.performance, isFetching: false })
      )
      .catch(() => this.setState({ isFetching: false }));
  };

  render() {
    const { performance, isFetching, jobs_ids } = this.state;
    return (
      <Page
        title="Performance"
        description="Observe the evolution of the performance of your tests."
        loading={isFetching}
      >
        <PageSection>
          <Card>
            <CardBody>
              <Grid gutter="md">
                <GridItem span={6}>
                  <JobSelectorForm
                    initialData={{
                      jobs_ids
                    }}
                    submit={v => this._calcPerformance(v.jobs_ids)}
                  />
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
          {isEmpty(performance)
            ? null
            : performance.map((p, i) => (
                <PerformanceCard key={i} performance={p}></PerformanceCard>
              ))}
        </PageSection>
      </Page>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    calcPerformance: jobs_ids => dispatch(calcPerformance(jobs_ids))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(PerformancePage);
