import { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Content,
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
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  t_global_color_nonstatus_red_200,
  chart_color_green_300,
  chart_color_red_orange_300,
} from "@patternfly/react-tokens";
import { Breadcrumb, EmptyState } from "ui";
import { IComponentCoverage } from "types";
import { buildComponentCoverage } from "./componentCoverage";
import TopicToolbarFilter from "jobs/toolbar/TopicToolbarFilter";
import {
  InfoCircleIcon,
  SearchIcon,
  WarningTriangleIcon,
} from "@patternfly/react-icons";
import { Link, useSearchParams } from "react-router-dom";
import { sortByNewestFirst } from "services/sort";
import { formatDate } from "services/date";
import { JobStatusLabel } from "jobs/components";
import TypesFilter from "./TypesFilter";
import qs from "qs";
import TeamToolbarFilter from "jobs/toolbar/TeamToolbarFilter";
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
import {
  useLazyGetAllComponentTypesQuery,
  useLazyGetTasksComponentsCoverageQuery,
} from "./componentCoverageApi";

interface ICoverageFilters {
  topic_id: string | null;
  types: string[];
  team_id: string | null;
}

export function createCoverageSearchFromFilters(filters: ICoverageFilters) {
  return qs.stringify(
    {
      ...filters,
      types: [...new Set(filters.types)],
    },
    {
      addQueryPrefix: true,
      encode: false,
      arrayFormat: "repeat",
      skipNulls: true,
    },
  );
}

function ComponentCoverage({
  topicId,
  teamId,
  selectedTypes,
}: {
  topicId: string;
  teamId: string;
  selectedTypes: string[];
}) {
  const [componentDetails, setComponentDetails] =
    useState<IComponentCoverage | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerIsExpanded = componentDetails !== null;
  const [getTasksComponentsCoverage, { data, isLoading }] =
    useLazyGetTasksComponentsCoverageQuery();

  useEffect(() => {
    getTasksComponentsCoverage({ topicId, teamId, selectedTypes });
  }, [topicId, teamId, selectedTypes, getTasksComponentsCoverage]);

  if (isLoading) {
    return <Skeleton screenreaderText="Loading get tasks duration cumulated" />;
  }

  if (!data) {
    return (
      <EmptyState
        title="No results found"
        info="No results match the filter criteria. Clear all filters and try again."
        icon={SearchIcon}
      />
    );
  }

  const components = buildComponentCoverage(data);

  if (components.length === 0) {
    return (
      <EmptyState
        title="No components"
        info="There is no components for this topic and/or this team"
        icon={InfoCircleIcon}
      />
    );
  }

  return (
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
                      sortByNewestFirst(componentDetails.jobs).map((job, i) => (
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
                      ))}
                  </Tbody>
                </Table>
              </div>
              <DrawerActions>
                <DrawerCloseButton onClick={() => setComponentDetails(null)} />
              </DrawerActions>
            </DrawerHead>
          </DrawerPanelContent>
        }
      >
        <DrawerContentBody>
          <Table aria-label="component coverage">
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
  );
}

export default function ComponentCoveragePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [topicId, setTopicId] = useState<string | null>(
    searchParams.get("topic_id"),
  );
  const [teamId, setTeamId] = useState<string | null>(
    searchParams.get("team_id"),
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get("types")?.split(",") || [],
  );
  const [getAllComponentTypes, { data: types }] =
    useLazyGetAllComponentTypesQuery();

  useEffect(() => {
    if (topicId) {
      searchParams.set("topic_id", topicId);
    } else {
      searchParams.delete("topic_id");
    }
    setSearchParams(searchParams);
  }, [topicId, searchParams, setSearchParams]);

  useEffect(() => {
    if (teamId) {
      searchParams.set("team_id", teamId);
    } else {
      searchParams.delete("team_id");
    }
    setSearchParams(searchParams);
  }, [teamId, searchParams, setSearchParams]);

  useEffect(() => {
    if (selectedTypes.length > 0) {
      searchParams.set("types", selectedTypes.join(","));
    } else {
      searchParams.delete("types");
    }
    setSearchParams(searchParams);
  }, [selectedTypes, searchParams, setSearchParams]);

  const clearAllFilters = () => {
    setTopicId(null);
    setTeamId(null);
    setSelectedTypes([]);
  };

  useEffect(() => {
    if (topicId) {
      getAllComponentTypes(topicId);
    }
  }, [topicId, getAllComponentTypes]);

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
      <Card>
        <CardBody>
          <Toolbar
            id="toolbar-select-jobs"
            clearAllFilters={clearAllFilters}
            collapseListedFiltersBreakpoint="xl"
          >
            <ToolbarContent>
              <ToolbarGroup>
                <ToolbarItem variant="label">Choose a topic</ToolbarItem>
                <ToolbarItem>
                  <TopicToolbarFilter
                    id={topicId}
                    onClear={() => setTopicId(null)}
                    onSelect={(topic) => setTopicId(topic.id)}
                  />
                </ToolbarItem>
                <ToolbarItem variant="label">Filter by team</ToolbarItem>
                <ToolbarItem>
                  <TeamToolbarFilter
                    id={teamId}
                    onClear={() => setTeamId(null)}
                    onSelect={(team) => setTeamId(team.id)}
                  />
                </ToolbarItem>
                <ToolbarItem variant="label">Filter by types</ToolbarItem>
                <ToolbarItem>
                  <TypesFilter
                    types={types || []}
                    typesSelected={selectedTypes}
                    deleteChip={(type) =>
                      setSelectedTypes(selectedTypes.filter((t) => t !== type))
                    }
                    onSelect={(type) => {
                      if (selectedTypes.indexOf(type) === -1) {
                        setSelectedTypes([...selectedTypes, type]);
                      } else {
                        setSelectedTypes(
                          selectedTypes.filter((t) => t !== type),
                        );
                      }
                    }}
                  />
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarContent>
          </Toolbar>
        </CardBody>
      </Card>
      {topicId !== null && teamId !== null && (
        <Card className="pf-v6-u-mt-lg">
          <CardBody>
            <ComponentCoverage
              teamId={teamId}
              topicId={topicId}
              selectedTypes={selectedTypes}
            />
          </CardBody>
        </Card>
      )}
    </PageSection>
  );
}
