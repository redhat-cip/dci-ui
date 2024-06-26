import {
  Bullseye,
  Button,
  Card,
  CardBody,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Label,
  ProgressStep,
  ProgressStepper,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Tooltip,
  CardHeader,
  Truncate,
  EmptyStateHeader,
} from "@patternfly/react-core";
import { BlinkLogo, Breadcrumb } from "ui";
import MainPage from "pages/MainPage";
import {
  global_palette_black_400,
  global_palette_green_50,
  global_palette_red_100,
  global_palette_red_50,
} from "@patternfly/react-tokens";
import { DateTime } from "luxon";
import {
  formatDate,
  getRangeDates,
  humanizeDurationShort,
} from "services/date";
import { Fragment, useCallback, useEffect, useState } from "react";
import TeamsToolbarFilter from "jobs/toolbar/TeamsToolbarFilter";
import ListToolbarFilter from "jobs/toolbar/ListToolbarFilter";
import { Link, useSearchParams } from "react-router-dom";
import http from "services/http";
import { showAPIError } from "alerts/alertsSlice";
import { IJobStatus, IPipelines, RangeOptionValue } from "types";
import RangeToolbarFilter from "ui/form/RangeToolbarFilter";
import { getColor, getIcon } from "jobs/jobUtils";
import { Components } from "jobs/job/JobDetailsHeader";
import { notEmpty } from "services/utils";
import { useAppDispatch } from "store";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";

function jobStatusToVariant(status: IJobStatus) {
  switch (status) {
    case "new":
    case "pre-run":
    case "post-run":
      return "info";
    case "success":
      return "success";
    case "killed":
      return "warning";
    case "error":
    case "failure":
      return "danger";
    default:
      return "default";
  }
}

type PipelineJob = IPipelines["days"][0]["pipelines"][0]["jobs"][0];

function PipelineJobInfo({ job, index }: { job: PipelineJob; index: number }) {
  const color = getColor(job.status);
  return (
    <>
      <Td
        style={{
          borderLeft:
            index === 0
              ? `1px solid ${global_palette_black_400.value}`
              : "none",
          whiteSpace: "nowrap",
          backgroundColor:
            job.status === "success"
              ? global_palette_green_50.value
              : global_palette_red_50.value,
        }}
      >
        <Link to={`/jobs/${job.id}/jobStates`}>
          <span
            style={{
              color,
            }}
            className="pf-v5-u-mr-xs"
          >
            {getIcon(job.status)}
          </span>
          {job.name}
        </Link>
      </Td>
      <Td
        style={{
          whiteSpace: "nowrap",
          textAlign: "center",
          backgroundColor:
            job.status === "success"
              ? global_palette_green_50.value
              : global_palette_red_50.value,
        }}
      >
        <Tooltip content={<div>{job.status_reason}</div>}>
          <span
            style={{
              textDecorationLine: "underline",
              textDecorationStyle: "dashed",
              textDecorationColor: "#000",
            }}
          >
            {job.comment || ""}
          </span>
        </Tooltip>
      </Td>
      <Td
        style={{
          whiteSpace: "nowrap",
          backgroundColor:
            job.status === "success"
              ? global_palette_green_50.value
              : global_palette_red_50.value,
        }}
      >
        <Label
          isCompact
          color="green"
          title={`${job?.tests?.success || 0} tests in success`}
          className="pf-v5-u-mr-xs"
        >
          {job?.tests?.success || 0}
        </Label>
        <Label
          isCompact
          color="orange"
          title={`${job?.tests?.skips || 0} skipped tests`}
          className="pf-v5-u-mr-xs"
        >
          {job?.tests?.skips || 0}
        </Label>
        <Label
          isCompact
          color="red"
          title={`${
            (job?.tests?.failures || 0) + (job?.tests?.errors || 0)
          } errors and failures tests`}
        >
          {(job?.tests?.failures || 0) + (job?.tests?.errors || 0)}
        </Label>
      </Td>
      <Td
        style={{
          whiteSpace: "nowrap",
          textAlign: "center",
          borderRight: `1px solid ${global_palette_black_400.value}`,
          backgroundColor:
            job.status === "success"
              ? global_palette_green_50.value
              : global_palette_red_50.value,
        }}
      >
        {humanizeDurationShort(job.duration * 1000, {
          delimiter: " ",
          round: true,
          largest: 2,
        })}
      </Td>
    </>
  );
}

function PipelineCard({
  pipelineDay,
}: {
  pipelineDay: IPipelines["days"][0] & {
    datetime: DateTime;
  };
}) {
  const [seeJobComponents, setSeeJobComponents] = useState(false);
  return (
    <Card className="pf-v5-u-mt-xs">
      <CardHeader
        actions={{
          actions: (
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={() => {
                setSeeJobComponents(!seeJobComponents);
              }}
            >
              {seeJobComponents ? "Hide job components" : "See job components"}
            </Button>
          ),
          hasNoOffset: false,
          className: undefined,
        }}
      >
        <CardTitle>
          {formatDate(pipelineDay.datetime, DateTime.DATE_MED_WITH_WEEKDAY)}
        </CardTitle>
      </CardHeader>
      <CardBody style={{ overflow: "auto" }}>
        <Table className="pf-v5-c-table pf-m-compact pf-m-grid-md">
          <Thead>
            <Tr>
              <Th>pipeline</Th>
              <Th style={{ minWidth: "250px" }}>name</Th>
              <Th colSpan={-1}>jobs</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pipelineDay.pipelines.map((pipeline, index) => (
              <Fragment key={index}>
                <Tr>
                  <Td
                    rowSpan={seeJobComponents ? 2 : 1}
                    style={{ verticalAlign: "middle" }}
                  >
                    <ProgressStepper isCompact>
                      {pipeline.jobs.map((job) => (
                        <ProgressStep
                          key={job.id}
                          variant={jobStatusToVariant(job.status)}
                          id={job.name}
                          titleId={job.name}
                        />
                      ))}
                    </ProgressStepper>
                  </Td>
                  <Td
                    rowSpan={seeJobComponents ? 2 : 1}
                    style={{ verticalAlign: "middle" }}
                  >
                    <Truncate content={pipeline.name} />
                  </Td>
                  {pipeline.jobs.map((job, index) => (
                    <PipelineJobInfo key={index} index={index} job={job} />
                  ))}
                </Tr>
                {seeJobComponents && (
                  <Tr>
                    {pipeline.jobs.map((job) => (
                      <Td
                        style={{
                          borderLeft: `1px solid ${global_palette_black_400.value}`,
                          whiteSpace: "nowrap",
                          backgroundColor:
                            job.status === "success"
                              ? global_palette_green_50.value
                              : global_palette_red_50.value,
                        }}
                        colSpan={4}
                      >
                        <Components
                          components={job.components.filter(notEmpty)}
                        />
                      </Td>
                    ))}
                  </Tr>
                )}
              </Fragment>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
}

function PipelinesTable({ pipelines }: { pipelines: IPipelines }) {
  if (pipelines.days.length === 0) {
    return (
      <EmptyState variant={EmptyStateVariant.xs}>
        <EmptyStateHeader
          titleText="No pipeline between these dates"
          headingLevel="h4"
        />
        <EmptyStateBody>
          change your search parameters and try again
        </EmptyStateBody>
      </EmptyState>
    );
  }

  return (
    <div>
      {pipelines.days
        .map((d) => ({ ...d, datetime: DateTime.fromISO(d.date) }))
        .sort((day1, day2) => {
          const epoch1 = day1.datetime.toMillis();
          const epoch2 = day2.datetime.toMillis();
          return epoch1 < epoch2 ? 1 : epoch1 > epoch2 ? -1 : 0;
        })
        .map((day, index) => (
          <PipelineCard key={index} pipelineDay={day} />
        ))}
    </div>
  );
}

export default function PipelinesPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [pipelinesNames, setPipelinesNames] = useState<string[]>(
    searchParams.get("pipelines_names")?.split(",") || [],
  );
  const [teamsIds, setTeamsIds] = useState<string[]>(
    searchParams.get("teams_ids")?.split(",") || [],
  );
  const defaultRangeValue: RangeOptionValue = "last7Days";
  const [range, setRange] = useState<RangeOptionValue>(
    (searchParams.get("range") as RangeOptionValue) || defaultRangeValue,
  );
  const dates = getRangeDates(range);
  const [after, setAfter] = useState(
    searchParams.get("start_date") || dates.after,
  );
  const [before, setBefore] = useState(
    searchParams.get("end_date") || dates.before,
  );
  const [pipelines, setPipelines] = useState<IPipelines | null>(null);

  const updateUrlWithParams = () => {
    searchParams.set("teams_ids", teamsIds.join(","));
    if (pipelinesNames.length > 0) {
      searchParams.set("pipelines_names", pipelinesNames.join(","));
    } else {
      searchParams.delete("pipelines_names");
    }
    if (after === "" || range !== "custom") {
      searchParams.delete("start_date");
    } else {
      searchParams.set("start_date", after);
    }
    if (before === "" || range !== "custom") {
      searchParams.delete("end_date");
    } else {
      searchParams.set("end_date", before);
    }
    searchParams.set("range", range);
    setSearchParams(searchParams, { replace: true });
  };

  const memoizedGetPipelines = useCallback(() => {
    if (teamsIds.length > 0) {
      setIsLoading(true);
      const data: {
        start_date: string;
        end_date: string;
        teams_ids: string[];
        pipelines_names?: string[];
      } = {
        start_date: after,
        end_date: before,
        teams_ids: teamsIds,
      };
      if (pipelinesNames.length > 0) {
        data.pipelines_names = pipelinesNames;
      }
      http
        .post("/api/v1/analytics/pipelines_status", data)
        .then((response) => {
          setPipelines(response.data as IPipelines);
        })
        .catch((error) => {
          dispatch(showAPIError(error));
          return error;
        })
        .then(() => setIsLoading(false));
    }
  }, [teamsIds, after, before, pipelinesNames, dispatch]);

  useEffect(() => {
    memoizedGetPipelines();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (range !== "custom") {
      const dates = getRangeDates(range);
      setAfter(dates.after);
      setBefore(dates.before);
    }
  }, [range]);

  return (
    <MainPage
      title="Pipelines"
      description=""
      Breadcrumb={
        <Breadcrumb
          links={[
            { to: "/", title: "DCI" },
            { to: "/analytics", title: "Analytics" },
            { title: "Pipelines" },
          ]}
        />
      }
    >
      <Card>
        <CardBody>
          <Toolbar
            id="toolbar-select-jobs"
            clearAllFilters={() => {
              setTeamsIds([]);
              setPipelinesNames([]);
              setRange(defaultRangeValue);
            }}
            collapseListedFiltersBreakpoint="xl"
          >
            <ToolbarContent>
              <ToolbarItem variant="label" id="team-label-toolbar">
                Teams{" "}
                <span style={{ color: global_palette_red_100.value }}>*</span>
              </ToolbarItem>
              <ToolbarItem>
                <TeamsToolbarFilter
                  ids={teamsIds}
                  onClear={(teamId) =>
                    setTeamsIds((oldTeamsIds) =>
                      oldTeamsIds.filter((t) => t !== teamId),
                    )
                  }
                  onSelect={(team) =>
                    setTeamsIds((oldTeamsIds) => [...oldTeamsIds, team.id])
                  }
                />
              </ToolbarItem>
              <ToolbarItem>
                <ListToolbarFilter
                  items={pipelinesNames}
                  categoryName="Pipelines names"
                  placeholderText="Pipelines names"
                  onSubmit={setPipelinesNames}
                />
              </ToolbarItem>
              <ToolbarItem variant="label" id="range-label-toolbar">
                Range
              </ToolbarItem>
              <ToolbarItem>
                <RangeToolbarFilter
                  range={range}
                  onChange={(range, after, before) => {
                    if (range === "custom") {
                      setAfter(after);
                      setBefore(before);
                    }
                    setRange(range);
                  }}
                  after={after}
                  before={before}
                  ranges={[
                    defaultRangeValue,
                    "previousWeek",
                    "currentWeek",
                    "yesterday",
                    "today",
                    "custom",
                  ]}
                />
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  variant="primary"
                  isDisabled={teamsIds.length === 0}
                  onClick={() => {
                    memoizedGetPipelines();
                    updateUrlWithParams();
                  }}
                >
                  Show pipelines
                </Button>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
        </CardBody>
      </Card>
      {isLoading ? (
        <Card>
          <CardBody>
            <Bullseye>
              <BlinkLogo />
            </Bullseye>
          </CardBody>
        </Card>
      ) : pipelines === null ? (
        <Card>
          <CardBody>
            <EmptyState variant={EmptyStateVariant.xs}>
              <EmptyStateHeader
                titleText="Display pipeline jobs"
                headingLevel="h4"
              />
              <EmptyStateBody>
                You can fill in the filters to view your team's pipelines.
              </EmptyStateBody>
            </EmptyState>
          </CardBody>
        </Card>
      ) : (
        <PipelinesTable pipelines={pipelines} />
      )}
    </MainPage>
  );
}
