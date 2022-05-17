import { useEffect, useRef, useState } from "react";
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
  Label,
  LabelGroup,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
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
import { IComponentCoverageESData, ITopic } from "types";
import {
  buildComponentCoverage,
  IComponentCoverage,
} from "./componentCoverage";
import http from "services/http";
import { useDispatch } from "react-redux";
import { showAPIError } from "alerts/alertsActions";
import MainPage from "pages/MainPage";
import TopicsFilter from "jobs/toolbar/TopicsFilter";
import {
  InfoCircleIcon,
  SearchIcon,
  WarningTriangleIcon,
} from "@patternfly/react-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bar, BarChart, XAxis, Tooltip } from "recharts";
import { DateTime } from "luxon";
import { sortByNewestFirst } from "services/sort";
import { formatDate } from "services/date";
import JobStatusLabel from "jobs/JobStatusLabel";
import TypesFilter from "./TypesFilter";
import qs from "qs";
import TeamsFilter from "jobs/toolbar/TeamsFilter";

interface CumulatedDataPerWeek {
  [weekNumber: number]: {
    success: number;
    failure: number;
    name: string;
    weekNumber: number;
  };
}

interface ICoverageFilters {
  topic_id: string | null;
  types: string[];
  team_id: string | null;
}

export function parseCoverageFiltersFromSearch(
  search: string
): ICoverageFilters {
  const emptyFilters = {
    topic_id: null,
    types: [],
    team_id: null,
  };
  if (!search) {
    return emptyFilters;
  }
  const filters = {
    ...emptyFilters,
    ...qs.parse(search, { ignoreQueryPrefix: true }),
  };
  if (typeof filters.types === "string") {
    filters.types = [filters.types];
  }
  return filters;
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
    }
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
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const params = parseCoverageFiltersFromSearch(location.search);
  const [topicId, setTopicId] = useState<string | null>(params.topic_id);
  const [teamId, setTeamId] = useState<string | null>(params.team_id);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(params.types);
  const [isLoading, setIsLoading] = useState(false);

  const [ESData, setESData] = useState<IComponentCoverageESData | null>(null);
  const components = buildComponentCoverage(ESData);
  const [componentDetails, setComponentDetails] =
    useState<IComponentCoverage | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerIsExpanded = componentDetails !== null;

  const clearAllFilters = () => {
    setTopicId(null);
    setSelectedTypes([]);
  };

  useEffect(() => {
    const newSearch = createCoverageSearchFromFilters({
      team_id: teamId,
      topic_id: topicId,
      types: selectedTypes,
    });
    navigate(`/analytics/component_coverage${newSearch}`);
  }, [navigate, teamId, topicId, selectedTypes]);

  useEffect(() => {
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
  }, [teamId, topicId, selectedTypes]);

  useEffect(() => {
    if (topicId) {
      getAllComponentTypes({ id: topicId } as ITopic)
        .then(setTypes)
        .catch((error) => {
          dispatch(showAPIError(error));
          return error;
        });
    }
  }, [topicId]);

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
              <ToolbarGroup>
                <ToolbarItem>Choose a topic</ToolbarItem>
              </ToolbarGroup>
              <ToolbarGroup>
                <ToolbarItem>
                  <TopicsFilter
                    topic_id={topicId}
                    onClear={() => setTopicId(null)}
                    onSelect={(topic) => setTopicId(topic.id)}
                  />
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarGroup>
                <ToolbarItem>Filter by team</ToolbarItem>
              </ToolbarGroup>
              <ToolbarGroup>
                <ToolbarItem>
                  <TeamsFilter
                    team_id={teamId}
                    onClear={() => setTeamId(null)}
                    onSelect={(team) => setTeamId(team.id)}
                  />
                </ToolbarItem>
              </ToolbarGroup>
              {types.length === 0 ? null : (
                <>
                  <ToolbarGroup>
                    <ToolbarItem>Filter by types</ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarGroup>
                    <ToolbarItem>
                      <TypesFilter
                        types={types}
                        typesSelected={selectedTypes}
                        onClear={() => setSelectedTypes([])}
                        deleteChip={(type) =>
                          setSelectedTypes(
                            selectedTypes.filter((t) => t !== type)
                          )
                        }
                        onSelect={(type) => {
                          if (selectedTypes.indexOf(type) === -1) {
                            setSelectedTypes([...selectedTypes, type]);
                          } else {
                            setSelectedTypes(
                              selectedTypes.filter((t) => t !== type)
                            );
                          }
                        }}
                      />
                    </ToolbarItem>
                  </ToolbarGroup>
                </>
              )}
            </ToolbarContent>
          </Toolbar>

          {topicId === null ? (
            <EmptyState
              title="Choose a topic"
              info="Select a topic in the topic list to display the components coverage"
              icon={() => <InfoCircleIcon size="lg" />}
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
                        <table
                          className="pf-c-table pf-m-compact pf-m-grid-md"
                          role="grid"
                          aria-label="list jobs"
                        >
                          <caption>
                            {componentDetails && (
                              <span>
                                Jobs for component{" "}
                                <Link
                                  to={`/topics/${componentDetails.topic_id}/components/${componentDetails.id}`}
                                >
                                  {componentDetails.canonical_project_name}
                                </Link>
                              </span>
                            )}
                          </caption>
                          <thead>
                            <tr role="row">
                              <th role="columnheader" scope="col">
                                Id
                              </th>
                              <th role="columnheader" scope="col">
                                Status
                              </th>
                              <th role="columnheader" scope="col">
                                Created at
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {componentDetails &&
                              sortByNewestFirst(componentDetails.jobs).map(
                                (job, i) => (
                                  <tr key={i} role="row">
                                    <td role="cell" data-label="Component name">
                                      <Link to={`/jobs/${job.id}`}>
                                        {job.id}
                                      </Link>
                                    </td>
                                    <td role="cell" data-label="Warning">
                                      <JobStatusLabel status={job.status} />
                                    </td>
                                    <td role="cell" data-label="Warning">
                                      {formatDate(job.created_at)}
                                    </td>
                                  </tr>
                                )
                              )}
                          </tbody>
                        </table>
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
                  <table
                    className="pf-c-table pf-m-compact pf-m-grid-md"
                    role="grid"
                    aria-label="component coverage"
                  >
                    <thead>
                      <tr role="row">
                        <th role="columnheader" scope="col">
                          Component name
                        </th>
                        <th role="columnheader" scope="col">
                          Tags
                        </th>
                        <th role="columnheader" scope="col"></th>
                        <th role="columnheader" scope="col">
                          Percentage of successful jobs{" "}
                        </th>
                        <th role="columnheader" scope="col">
                          Nb success/failed jobs
                          <br />
                          over the last 5 weeks
                        </th>
                        <th
                          role="columnheader"
                          scope="col"
                          className="text-center"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(components).map((component, i) => {
                        const percentageSuccess =
                          component.nbOfJobs === 0
                            ? 0
                            : Math.round(
                                (component.nbOfSuccessfulJobs * 100) /
                                  component.nbOfJobs
                              );

                        const now = DateTime.now();
                        const nbWeeksInThePast = 5;
                        const initialCumulatedData = [
                          ...Array(nbWeeksInThePast).keys(),
                        ].reduce((acc, weekInThePast) => {
                          const weekNumber = now.minus({
                            weeks: weekInThePast,
                          }).weekNumber;
                          acc[weekNumber] = {
                            success: 0,
                            failure: 0,
                            name: `w${weekNumber}`,
                            weekNumber,
                          };
                          return acc;
                        }, {} as CumulatedDataPerWeek);
                        const cumulatedPerWeek = component.jobs.reduce(
                          (acc, job) => {
                            const jobDate = DateTime.fromISO(job.created_at);
                            const weekNumber = jobDate.weekNumber;
                            if (!(weekNumber in initialCumulatedData)) {
                              return acc;
                            }
                            if (job.status === "success") {
                              acc[weekNumber].success += 1;
                            } else {
                              acc[weekNumber].failure += 1;
                            }
                            return acc;
                          },
                          { ...initialCumulatedData } as CumulatedDataPerWeek
                        );
                        const data = Object.values(cumulatedPerWeek).sort(
                          (stat1, stat2) => {
                            if (stat1.weekNumber < stat2.weekNumber) {
                              return -1;
                            }
                            if (stat1.weekNumber > stat2.weekNumber) {
                              return 1;
                            }
                            return 0;
                          }
                        );
                        return (
                          <tr key={i} role="row">
                            <td role="cell" data-label="Component name">
                              <Link
                                to={`/topics/${component.topic_id}/components/${component.id}`}
                              >
                                {component.canonical_project_name}
                              </Link>
                            </td>
                            <td role="cell" data-label="Tags">
                              <LabelGroup numLabels={3} isCompact>
                                {component.tags.map((tag, index) => (
                                  <Label key={index} color="blue" isCompact>
                                    {tag}
                                  </Label>
                                ))}
                              </LabelGroup>
                            </td>
                            <td role="cell" data-label="Warning">
                              {component.nbOfJobs === 0 && (
                                <span
                                  style={{
                                    color: global_palette_red_100.value,
                                  }}
                                >
                                  <WarningTriangleIcon className="mr-xs" />
                                  not tested
                                </span>
                              )}
                            </td>
                            <td
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
                                  className="mr-md"
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
                                  className="mr-md"
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
                            </td>
                            <td
                              role="cell"
                              data-label="number of successful/failed jobs over the last 5 weeks."
                              style={{
                                padding: 0,
                                verticalAlign: "inherit",
                              }}
                            >
                              <BarChart
                                data={data}
                                width={150}
                                height={52}
                                margin={{
                                  top: 5,
                                  right: 5,
                                  bottom: 0,
                                  left: 5,
                                }}
                              >
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <Tooltip
                                  wrapperStyle={{ zIndex: 1000 }}
                                  allowEscapeViewBox={{ x: true }}
                                  labelFormatter={(label, payloads) => {
                                    if (payloads && payloads.length > 1) {
                                      return `Week ${payloads[0].payload.weekNumber}`;
                                    }
                                  }}
                                />
                                <Bar
                                  dataKey="success"
                                  fill={global_palette_green_500.value}
                                />
                                <Bar
                                  dataKey="failure"
                                  fill={global_danger_color_100.value}
                                />
                              </BarChart>
                            </td>
                            <td
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
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </DrawerContentBody>
              </DrawerContent>
            </Drawer>
          )}
        </CardBody>
      </Card>
    </MainPage>
  );
}
