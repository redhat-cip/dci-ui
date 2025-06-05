import { createRef, useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Content,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  Label,
  LabelGroup,
  PageSection,
  Skeleton,
} from "@patternfly/react-core";
import {
  t_global_color_nonstatus_red_200,
  chart_color_green_300,
  chart_color_red_orange_300,
} from "@patternfly/react-tokens";
import { Breadcrumb } from "ui";
import {
  IAnalyticsJob,
  IComponentCoverage,
  IGenericAnalyticsData,
} from "types";
import { buildComponentCoverage } from "./componentCoverage";
import { FilterIcon, WarningTriangleIcon } from "@patternfly/react-icons";
import { Link } from "react-router";
import { sortByNewestFirst } from "services/sort";
import { formatDate } from "services/date";
import { JobStatusLabel } from "jobs/components";
import LastComponentsJobsBarChart from "./LastComponentsJobsBarChart";
import {
  Table,
  Caption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@patternfly/react-table";
import { useLazyGetAnalyticJobsQuery } from "analytics/analyticsApi";
import AnalyticsToolbar from "analytics/toolbar/AnalyticsToolbar";
import ScreeshotNodeButton from "ui/ScreenshotNodeButton";

function ComponentsCoverage({
  isLoading,
  data,
  ...props
}: {
  isLoading: boolean;
  data: IGenericAnalyticsData<IAnalyticsJob> | undefined;
  [key: string]: any;
}) {
  const graphRef = createRef<HTMLTableElement>();

  const [componentDetails, setComponentDetails] =
    useState<IComponentCoverage | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerIsExpanded = componentDetails !== null;

  if (isLoading) {
    return (
      <Card {...props}>
        <CardBody>
          <Skeleton
            screenreaderText="Loading components coverage data"
            style={{ height: 80 }}
          />
        </CardBody>
      </Card>
    );
  }

  if (data === undefined) {
    return null;
  }

  const components = buildComponentCoverage(data.jobs);

  if (components.length === 0) {
    return (
      <Card {...props}>
        <CardBody>
          <EmptyState
            variant={EmptyStateVariant.xs}
            icon={FilterIcon}
            titleText="No job"
            headingLevel="h4"
          >
            <EmptyStateBody>
              We did not find any jobs matching this search. Please modify your
              search.
            </EmptyStateBody>
          </EmptyState>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="pf-v6-u-mt-md">
      <CardBody>
        <Drawer
          isExpanded={drawerIsExpanded}
          onExpand={() => {
            drawerRef.current && drawerRef.current.focus();
          }}
        >
          <DrawerContent
            panelContent={
              <DrawerPanelContent widths={{ default: "width_66" }}>
                <DrawerHead>
                  <div ref={drawerRef}>
                    <Table aria-label="jobs list">
                      <Caption>
                        {componentDetails && (
                          <span>
                            Jobs for component{" "}
                            <Link
                              to={`/topics/${componentDetails.topic_id}/components/${componentDetails.id}`}
                            >
                              {componentDetails.display_name}
                            </Link>
                          </span>
                        )}
                      </Caption>
                      <Thead>
                        <Tr>
                          <Th role="columnheader" scope="col">
                            Name
                          </Th>
                          <Th role="columnheader" scope="col">
                            Status
                          </Th>
                          <Th role="columnheader" scope="col">
                            Created at
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {componentDetails &&
                          sortByNewestFirst(componentDetails.jobs).map(
                            (job, i) => (
                              <Tr key={i}>
                                <Td role="cell" data-label="Component name">
                                  <Link to={`/jobs/${job.id}`}>{job.name}</Link>
                                </Td>
                                <Td role="cell" data-label="Warning">
                                  <JobStatusLabel status={job.status} />
                                </Td>
                                <Td role="cell" data-label="Warning">
                                  {formatDate(job.created_at)}
                                </Td>
                              </Tr>
                            ),
                          )}
                      </Tbody>
                    </Table>
                  </div>
                  <DrawerActions>
                    <DrawerCloseButton
                      onClick={() => setComponentDetails(null)}
                    />
                  </DrawerActions>
                </DrawerHead>
              </DrawerPanelContent>
            }
          >
            <DrawerContentBody>
              <div className="flex items-center justify-end">
                <ScreeshotNodeButton
                  node={graphRef}
                  filename="component-coverage-charts.png"
                />
              </div>
              <Table ref={graphRef} aria-label="component coverage">
                <Thead>
                  <Tr>
                    <Th role="columnheader" scope="col">
                      Component name
                    </Th>
                    <Th role="columnheader" scope="col">
                      Tags
                    </Th>
                    <Th role="columnheader" scope="col"></Th>
                    <Th role="columnheader" scope="col">
                      Percentage of successful jobs
                    </Th>
                    <Th role="columnheader" scope="col">
                      Nb success/failed jobs
                      <br />
                      over the last 5 weeks
                    </Th>
                    <Th role="columnheader" scope="col" className="text-center">
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {components.map((component, i) => {
                    const percentageSuccess =
                      component.nbOfJobs === 0
                        ? 0
                        : Math.round(
                            (component.nbOfSuccessfulJobs * 100) /
                              component.nbOfJobs,
                          );
                    return (
                      <Tr key={i}>
                        <Td role="cell" data-label="Component name">
                          <Link
                            to={`/topics/${component.topic_id}/components/${component.id}`}
                          >
                            {component.display_name}
                          </Link>
                        </Td>
                        <Td role="cell" data-label="Tags">
                          <LabelGroup numLabels={3} isCompact>
                            {component.tags.map((tag, index) => (
                              <Label key={index} color="blue" isCompact>
                                {tag}
                              </Label>
                            ))}
                          </LabelGroup>
                        </Td>
                        <Td role="cell" data-label="Warning">
                          {component.nbOfJobs === 0 && (
                            <span
                              style={{
                                color: chart_color_red_orange_300.var,
                              }}
                            >
                              <WarningTriangleIcon className="pf-v6-u-mr-xs" />
                              not tested
                            </span>
                          )}
                        </Td>
                        <Td role="cell" data-label="% success failures jobs">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                backgroundColor:
                                  percentageSuccess === 0
                                    ? chart_color_red_orange_300.var
                                    : chart_color_green_300.var,
                                width: "200px",
                                display: "block",
                              }}
                              className="pf-v6-u-mr-md"
                            >
                              <div
                                style={{
                                  height: "16px",
                                  width: `${percentageSuccess}%`,
                                  backgroundColor: chart_color_green_300.var,
                                }}
                              ></div>
                            </div>
                            <span
                              style={{
                                color:
                                  percentageSuccess === 0
                                    ? t_global_color_nonstatus_red_200.var
                                    : chart_color_green_300.var,
                                width: "35px",
                                textAlign: "right",
                              }}
                              className="pf-v6-u-mr-md"
                            >
                              {percentageSuccess}%
                            </span>
                            <span
                              style={{
                                color:
                                  percentageSuccess === 0
                                    ? t_global_color_nonstatus_red_200.var
                                    : chart_color_green_300.var,
                                fontWeight: "bold",
                                minWidth: "42px",
                                textAlign: "right",
                              }}
                            >
                              {component.nbOfJobs}{" "}
                              {component.nbOfJobs > 1 ? "jobs" : "job"}
                            </span>
                          </div>
                        </Td>
                        <Td
                          role="cell"
                          data-label="number of successful/failed jobs over the last 5 weeks."
                          style={{
                            padding: 0,
                            verticalAlign: "inherit",
                          }}
                        >
                          <LastComponentsJobsBarChart component={component} />
                        </Td>
                        <Td
                          role="cell"
                          data-label="actions"
                          className="text-center"
                        >
                          <Button
                            variant="link"
                            onClick={() => {
                              setComponentDetails(component);
                            }}
                          >
                            see jobs
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </CardBody>
    </Card>
  );
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
        See which components has been tested. Table of components and associated
        jobs.
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
      <ComponentsCoverage
        isLoading={isLoading}
        data={data}
        className="pf-v6-u-mt-md"
      />
    </PageSection>
  );
}
