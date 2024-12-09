import {
  Bullseye,
  Card,
  CardBody,
  Content,
  Grid,
  GridItem,
  PageSection,
} from "@patternfly/react-core";
import { BlinkLogo, Breadcrumb } from "ui";
import { useState } from "react";
import { useLazyGetJunitAnalyticsQuery } from "./junitComparisonApi";
import { TrendChart } from "./TrendChart";
import { TestListDetails } from "./TestListDetails";
import { JunitComparisonForm } from "./JunitComparisonForm";
import { JunitBarChart } from "./JunitBarChart";

export default function JunitComparisonPage() {
  const [testLowerBoundary, setTestLowerBoundary] = useState<number | null>(
    null,
  );
  const [testUpperBoundary, setTestUpperBoundary] = useState<number | null>(
    null,
  );
  const [getJunitComparison, { data, isLoading }] =
    useLazyGetJunitAnalyticsQuery();

  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/analytics", title: "Analytics" },
          { title: "Junit comparison" },
        ]}
      />
      <Content component="h1">Junit comparison</Content>
      <Card>
        <CardBody>
          <JunitComparisonForm
            isLoading={isLoading}
            onSubmit={(values) => {
              getJunitComparison(values);
            }}
          />
        </CardBody>
      </Card>

      {isLoading && (
        <div className="pf-v6-u-mt-md">
          <Card>
            <CardBody>
              <Bullseye>
                <BlinkLogo />
              </Bullseye>
            </CardBody>
          </Card>
        </div>
      )}

      {data && (
        <>
          <div className="pf-v6-u-mt-md">
            <Grid hasGutter>
              <GridItem span={6}>
                <JunitBarChart
                  data={data.bar_chart}
                  rangeSelected={(lowerBoundary, upperBoundary) => {
                    setTestLowerBoundary(lowerBoundary);
                    setTestUpperBoundary(upperBoundary);
                  }}
                />
              </GridItem>
              <GridItem span={6}>
                <TrendChart data={data.trend_percentage} />
              </GridItem>
            </Grid>
          </div>
          <div className="pf-v6-u-mt-md">
            <TestListDetails
              data={data.bar_chart}
              lowerBoundary={testLowerBoundary}
              upperBoundary={testUpperBoundary}
              resetRange={() => {
                setTestLowerBoundary(null);
                setTestUpperBoundary(null);
              }}
            />
          </div>
        </>
      )}
    </PageSection>
  );
}
