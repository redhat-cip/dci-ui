import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bullseye,
  Button,
  Card,
  CardBody,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  Icon,
  Label,
  LabelGroup,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  global_danger_color_100,
  global_palette_green_100,
  global_palette_green_500,
  global_palette_red_100,
  global_palette_red_50,
} from "@patternfly/react-tokens";
import { BlinkLogo, Breadcrumb, EmptyState } from "ui";
import { IComponentCoverageESData, ITopic, IComponentCoverage } from "types";
import { buildComponentCoverage } from "./componentCoverage";
import http from "services/http";
import { useDispatch } from "react-redux";
import { showAPIError } from "alerts/alertsActions";
import MainPage from "pages/MainPage";
import TopicFilter from "jobs/toolbar/TopicFilter";
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
import TeamFilter from "jobs/toolbar/TeamFilter";
import LastComponentsJobsBarChart from "./LastComponentsJobsBarChart";
import { AppDispatch } from "store";
import {
  Table,
  Caption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@patternfly/react-table";

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

export function getAllComponentTypes(topic: ITopic) {
  // tasks_components_coverage returns latest components one per type
  return http
    .get(`/api/v1/analytics/tasks_components_coverage?topic_id=${topic.id}`)
    .then((response) => {
      const data = response.data as IComponentCoverageESData;
      return data.hits.map((component) => component._source.type);
    });
}

export default function ComponentCoveragePage() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [topicId, setTopicId] = useState<string | null>(
    searchParams.get("topic_id"),
  );
  const [teamId, setTeamId] = useState<string | null>(
    searchParams.get("team_id"),
  );
  const [types, setTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get("types")?.split(",") || [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [ESData, setESData] = useState<IComponentCoverageESData | null>(null);
  const components = buildComponentCoverage(ESData);
  const [componentDetails, setComponentDetails] =
    useState<IComponentCoverage | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerIsExpanded = componentDetails !== null;

  const memoizedGetComponentsCoverage = useCallback(() => {
    if (topicId) {
      const newSearch = createCoverageSearchFromFilters({
        team_id: teamId,
        topic_id: topicId,
        types: selectedTypes,
      });
      setIsLoading(true);
      http
        .get(`/api/v1/analytics/tasks_components_coverage${newSearch}`)
        .then((response) => {
          setESData(response.data as IComponentCoverageESData);
        })
        .catch((error) => {
          dispatch(showAPIError(error));
          return error;
        })
        .then(() => setIsLoading(false));
    }
  }, [teamId, topicId, selectedTypes, dispatch]);

  const updateUrlWithParams = () => {
    if (topicId) {
      searchParams.set("topic_id", topicId);
    } else {
      searchParams.delete("topic_id");
    }
    if (teamId) {
      searchParams.set("team_id", teamId);
    } else {
      searchParams.delete("team_id");
    }
    if (selectedTypes.length > 0) {
      searchParams.set("types", selectedTypes.join(","));
    } else {
      searchParams.delete("types");
    }
    setSearchParams(searchParams, { replace: true });
  };

  const clearAllFilters = () => {
    setTopicId(null);
    setTeamId(null);
    setSelectedTypes([]);
  };

  useEffect(() => {
    if (topicId) {
      getAllComponentTypes({ id: topicId } as ITopic)
        .then(setTypes)
        .catch((error) => {
          dispatch(showAPIError(error));
          return error;
        });
    }
  }, [topicId, dispatch]);

  useEffect(() => {
    memoizedGetComponentsCoverage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MainPage
      title="Component coverage"
      description="See which components has been tested. Table of components and associated jobs."
      Breadcrumb={
        <Breadcrumb
          links={[
            { to: "/", title: "DCI" },
            { to: "/analytics", title: "Analytics" },
            { title: "Component coverage" },
          ]}
        />
      }
    >
      <Card>
        <CardBody>
          <Toolbar
            id="toolbar-select-jobs"
            clearAllFilters={clearAllFilters}
            collapseListedFiltersBreakpoint="xl"
          >
            <ToolbarContent>
              <ToolbarItem>Choose a topic</ToolbarItem>
              <ToolbarItem>
                <TopicFilter
                  topicId={topicId}
                  onClear={() => setTopicId(null)}
                  onSelect={setTopicId}
                />
              </ToolbarItem>
              <ToolbarItem>Filter by team</ToolbarItem>
              <ToolbarItem>
                <TeamFilter
                  teamId={teamId}
                  onClear={() => setTeamId(null)}
                  onSelect={(team) => setTeamId(team.id)}
                />
              </ToolbarItem>
              {types.length === 0 ? null : (
                <>
                  <ToolbarItem>Filter by types</ToolbarItem>
                  <ToolbarItem>
                    <TypesFilter
                      types={types}
                      typesSelected={selectedTypes}
                      onClear={() => setSelectedTypes([])}
                      deleteChip={(type) =>
                        setSelectedTypes(
                          selectedTypes.filter((t) => t !== type),
                        )
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
                </>
              )}
              <ToolbarItem>
                <Button
                  variant="primary"
                  isDisabled={topicId === null}
                  onClick={() => {
                    memoizedGetComponentsCoverage();
                    updateUrlWithParams();
                  }}
                >
                  Get component coverage
                </Button>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
          {ESData === null ? (
            <EmptyState
              title="Choose a topic"
              info="Select a topic in the topic list to display the components coverage"
              icon={() => (
                <Icon size="lg">
                  <InfoCircleIcon />
                </Icon>
              )}
            />
          ) : isLoading ? (
            <Bullseye>
              <BlinkLogo />
            </Bullseye>
          ) : Object.keys(components).length === 0 ? (
            <EmptyState
              title="No results found"
              info="No results match the filter criteria. Clear all filters and try again."
              action={
                <Button variant="link" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              }
              icon={SearchIcon}
            />
          ) : (
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
                        <Table variant="compact" aria-label="jobs list">
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
                            <Tr role="row">
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
                                  <Tr key={i} role="row">
                                    <Td role="cell" data-label="Component name">
                                      <Link to={`/jobs/${job.id}`}>
                                        {job.name}
                                      </Link>
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
                  <Table
                    className="pf-v5-c-table pf-m-compact pf-m-grid-md"
                    role="grid"
                    aria-label="component coverage"
                  >
                    <Thead>
                      <Tr role="row">
                        <Th role="columnheader" scope="col">
                          Component name
                        </Th>
                        <Th role="columnheader" scope="col">
                          Tags
                        </Th>
                        <Th role="columnheader" scope="col"></Th>
                        <Th role="columnheader" scope="col">
                          Percentage of successful jobs{" "}
                        </Th>
                        <Th role="columnheader" scope="col">
                          Nb success/failed jobs
                          <br />
                          over the last 5 weeks
                        </Th>
                        <Th
                          role="columnheader"
                          scope="col"
                          className="text-center"
                        >
                          Actions
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {Object.values(components).map((component, i) => {
                        const percentageSuccess =
                          component.nbOfJobs === 0
                            ? 0
                            : Math.round(
                                (component.nbOfSuccessfulJobs * 100) /
                                  component.nbOfJobs,
                              );
                        return (
                          <Tr key={i} role="row">
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
                                    color: global_palette_red_100.value,
                                  }}
                                >
                                  <WarningTriangleIcon className="pf-v5-u-mr-xs" />
                                  not tested
                                </span>
                              )}
                            </Td>
                            <Td
                              role="cell"
                              data-label="% success failures jobs"
                            >
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
                                        ? global_palette_red_50.value
                                        : global_palette_green_100.value,
                                    width: "200px",
                                    display: "block",
                                  }}
                                  className="pf-v5-u-mr-md"
                                >
                                  <div
                                    style={{
                                      height: "16px",
                                      width: `${percentageSuccess}%`,
                                      backgroundColor:
                                        global_palette_green_500.value,
                                    }}
                                  ></div>
                                </div>
                                <span
                                  style={{
                                    color:
                                      percentageSuccess === 0
                                        ? global_danger_color_100.value
                                        : global_palette_green_500.value,
                                    width: "35px",
                                    textAlign: "right",
                                  }}
                                  className="pf-v5-u-mr-md"
                                >
                                  {percentageSuccess}%
                                </span>
                                <span
                                  style={{
                                    color:
                                      percentageSuccess === 0
                                        ? global_danger_color_100.value
                                        : global_palette_green_500.value,
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
                              <LastComponentsJobsBarChart
                                component={component}
                              />
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
          )}
        </CardBody>
      </Card>
    </MainPage>
  );
}
