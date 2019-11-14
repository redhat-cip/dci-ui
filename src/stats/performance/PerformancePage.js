import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import queryString from "query-string";
import { calcPerformance } from "./performanceActions";
import { Page } from "layout";
import JobSelectorForm from "./JobSelectorForm";
import { Card, CardBody, PageSection } from "@patternfly/react-core";
import PerformanceCard from "./PerformanceCard";

export class PerformancePage extends Component {
  state = {
    performance: [],
    isFetching: false,
    base_job_id: null,
    job_id: null
  };

  componentDidMount() {
    const { location } = this.props;
    const { base_job_id, job_id } = queryString.parse(location.search);
    if (!(isEmpty(base_job_id) || isEmpty(job_id))) {
      this._calcPerformance(base_job_id, job_id);
    }
  }

  _calcPerformance = (base_job_id, job_id) => {
    const { calcPerformance, history } = this.props;
    this.setState({ isFetching: true, base_job_id, job_id });
    history.push(`/performance?base_job_id=${base_job_id}&job_id=${job_id}`);
    calcPerformance(base_job_id, job_id)
      .then(r =>
        this.setState({ performance: r.data.performance, isFetching: false })
      )
      .catch(() => this.setState({ isFetching: false }));
  };

  render() {
    const { performance, isFetching, base_job_id, job_id } = this.state;
    return (
      <Page
        title="Performance"
        description="Compare two jobs to find out which tests have a performance problem"
        loading={isFetching}
      >
        <PageSection>
          <Card>
            <CardBody>
              <JobSelectorForm
                initialData={{
                  base_job_id,
                  job_id
                }}
                submit={v => this._calcPerformance(v.base_job_id, v.job_id)}
              />
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
    calcPerformance: (base_job_id, job_id) =>
      dispatch(calcPerformance(base_job_id, job_id))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(PerformancePage);
