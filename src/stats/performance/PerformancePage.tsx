import { useCallback, useEffect, useState } from "react";
import queryString from "query-string";
import { useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import { calcPerformance } from "./performanceActions";
import { Page } from "layout";
import JobSelectorForm from "./JobSelectorForm";
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  PageSection,
} from "@patternfly/react-core";
import PerformanceCard from "./PerformanceCard";
import { useHistory, useLocation } from "react-router-dom";
import { AppDispatch } from "store";
import { IPerformance } from "types";
import { Breadcrumb } from "ui";

export default function PerformancePage() {
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const location = useLocation();
  const [isFetching, setIsFetching] = useState(false);
  const [jobsIds, setJobsIds] = useState<string[]>([]);
  const [performance, setPerformance] = useState<IPerformance>([]);

  const _calcPerformance = useCallback(
    (jobsIds) => {
      setIsFetching(true);
      setJobsIds(jobsIds);
      history.push(`/performance?jobsIds=${jobsIds.join(",")}`);
      dispatch(
        calcPerformance<{
          performance: IPerformance;
        }>(jobsIds)
      )
        .then((r) => {
          setPerformance(r.data.performance);
          setIsFetching(false);
        })
        .catch(() => setIsFetching(false));
    },
    [setIsFetching, setJobsIds, setPerformance, history, dispatch]
  );

  useEffect(() => {
    const { jobsIds } = queryString.parse(location.search);

    if (jobsIds !== null && typeof jobsIds === "string") {
      _calcPerformance(jobsIds.split(","));
    }
  });

  return (
    <Page
      title="Performance"
      description="Observe the evolution of the performance of your tests."
      loading={isFetching}
      breadcrumb={
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Performance" }]}
        />
      }
    >
      <PageSection>
        <Card>
          <CardBody>
            <Grid hasGutter>
              <GridItem span={6}>
                <JobSelectorForm
                  jobsIds={jobsIds}
                  onSubmit={_calcPerformance}
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
