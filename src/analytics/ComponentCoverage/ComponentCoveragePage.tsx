import { createRef, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Content,
  PageSection,
  Skeleton,
  Form,
  Flex,
  FormGroup,
  FlexItem,
} from "@patternfly/react-core";

import { Breadcrumb } from "ui";
import type { IAnalyticsJob, IGenericAnalyticsData } from "types";
import { useNavigate, useSearchParams } from "react-router";
import { useLazyGetAnalyticJobsQuery } from "analytics/analyticsApi";
import AnalyticsToolbar from "analytics/toolbar/AnalyticsToolbar";
import ScreeshotNodeButton from "ui/ScreenshotNodeButton";
import TypeaheadSelect from "ui/form/TypeaheadSelect";
import { createHeatMap } from "./heatMap";
import HeatMapTable from "./HeatMapTable";

function getUniqueComponentTypes(jobs: IAnalyticsJob[]): string[] {
  const typeSet = new Set<string>();

  for (const job of jobs) {
    for (const component of job.components) {
      typeSet.add(component.type);
    }
  }

  return Array.from(typeSet).sort();
}

function ComponentCoverageCard({
  data,
}: {
  data: IGenericAnalyticsData<IAnalyticsJob>;
}) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const graphRef = createRef<HTMLTableElement>();
  const [componentTypeSource, setComponentTypeSource] = useState<string>(
    searchParams.get("componentTypeSource") || "",
  );
  const [search, setSearch] = useState<string>("");
  const [componentTypeTarget, setComponentTypeTarget] = useState<string>(
    searchParams.get("componentTypeTarget") || "",
  );
  const componentTypes = getUniqueComponentTypes(data.jobs);
  const heatMap = createHeatMap(
    data.jobs,
    componentTypeSource,
    componentTypeTarget,
  );

  useEffect(() => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set("componentTypeSource", componentTypeSource);
    updatedSearchParams.set("componentTypeTarget", componentTypeTarget);
    navigate(`?${updatedSearchParams.toString()}`, { replace: true });
  }, [componentTypeSource, componentTypeTarget]);

  return (
    <>
      <Card className="pf-v6-u-mt-md">
        <CardBody>
          <Form>
            <Flex
              columnGap={{ default: "columnGap2xl" }}
              direction={{ default: "column", lg: "row" }}
              justifyContent={{ default: "justifyContentSpaceBetween" }}
            >
              <Flex
                flex={{ default: "flex_1" }}
                columnGap={{ default: "columnGapXl" }}
              >
                <FormGroup
                  label="Component type source"
                  htmlFor="component-type-source"
                >
                  <TypeaheadSelect
                    id="component-type-source"
                    name="component-type-source"
                    isFetching={false}
                    items={componentTypes
                      .filter(
                        (c) =>
                          search.length === 0 ||
                          c.toLowerCase().includes(search.toLowerCase()),
                      )
                      .slice(0, 10)
                      .map((key) => ({
                        id: key,
                        name: key,
                      }))}
                    onSelect={(selection) => {
                      if (selection) {
                        setComponentTypeSource(selection.name);
                      }
                    }}
                    onSearch={setSearch}
                  />
                </FormGroup>
                <FormGroup
                  label="Component type target"
                  htmlFor="component-type-target"
                >
                  <TypeaheadSelect
                    id="component-type-target"
                    name="component-type-target"
                    isFetching={false}
                    items={componentTypes
                      .filter(
                        (c) =>
                          search.length === 0 ||
                          (c.toLowerCase().includes(search.toLowerCase()) &&
                            c !== componentTypeSource),
                      )
                      .slice(0, 10)
                      .map((key) => ({
                        id: key,
                        name: key,
                      }))}
                    onSelect={(selection) => {
                      if (selection) {
                        setComponentTypeTarget(selection.name);
                      }
                    }}
                    onSearch={setSearch}
                  />
                </FormGroup>
              </Flex>
              <Flex alignSelf={{ default: "alignSelfFlexEnd" }}>
                <FlexItem>
                  <ScreeshotNodeButton
                    node={graphRef}
                    filename="component-coverage.png"
                  />
                </FlexItem>
              </Flex>
            </Flex>
          </Form>
        </CardBody>
      </Card>
      <Card className="pf-v6-u-mt-md" ref={graphRef}>
        <CardBody>
          {componentTypeSource && componentTypeTarget && (
            <HeatMapTable {...heatMap} />
          )}
        </CardBody>
      </Card>
    </>
  );
}

function ComponentsCoverage({
  isLoading,
  data,
}: {
  isLoading: boolean;
  data: IGenericAnalyticsData<IAnalyticsJob> | undefined;
}) {
  if (isLoading) {
    return (
      <>
        <Card>
          <CardBody>
            <Skeleton
              screenreaderText="Loading components coverage form"
              style={{ height: 114 }}
            />
          </CardBody>
        </Card>
        <Card className="pf-v6-u-mt-md">
          <CardBody>
            <Skeleton
              screenreaderText="Loading components coverage heat map"
              style={{ height: 242 }}
            />
          </CardBody>
        </Card>
      </>
    );
  }

  if (data === undefined) {
    return null;
  }

  return <ComponentCoverageCard data={data} />;
}

export default function ComponentCoveragePage() {
  const [getAnalyticJobs, { data, isLoading, isFetching }] =
    useLazyGetAnalyticJobsQuery();
  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/analytics", title: "Analytics" },
          { title: "Component coverage" },
        ]}
      />
      <Content component="h1">Component coverage</Content>
      <Content component="p">
        The component coverage page gives you the coverage matrix between two
        component types. Select a source and target component type. And check
        how many jobs have been launched with these components.
      </Content>
      <AnalyticsToolbar
        onLoad={({ query, after, before }) => {
          if (query !== "" && after !== "" && before !== "") {
            getAnalyticJobs({ query, after, before });
          }
        }}
        onSearch={({ query, after, before }) => {
          getAnalyticJobs({ query, after, before });
        }}
        isLoading={isFetching}
        data={data}
      />
      <div className="pf-v6-u-mt-md">
        <ComponentsCoverage isLoading={isLoading} data={data} />
      </div>
    </PageSection>
  );
}
