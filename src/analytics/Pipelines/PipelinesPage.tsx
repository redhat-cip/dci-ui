import {
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
  ToolbarGroup,
  PageSection,
  Content,
} from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import {
  t_global_border_color_default,
  t_global_color_nonstatus_green_100,
  t_global_text_color_required,
  t_global_color_nonstatus_red_100,
} from "@patternfly/react-tokens";
import { DateTime } from "luxon";
import {
  formatDate,
  getRangeDates,
  humanizeDurationShort,
} from "services/date";
import { Fragment, useEffect, useState } from "react";
import TeamsToolbarFilter from "jobs/toolbar/TeamsToolbarFilter";
import ListToolbarFilter from "jobs/toolbar/ListToolbarFilter";
import { Link, useSearchParams } from "react-router-dom";
import { IJobStatus, IPipelines, RangeOptionValue } from "types";
import RangeToolbarFilter from "ui/form/RangeToolbarFilter";
import { ComponentsList } from "jobs/components";
import { notEmpty } from "services/utils";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { JobStatusLabel } from "jobs/components";
import LoadingPageSection from "ui/LoadingPageSection";
import { useLazyGetPipelineStatusQuery } from "./pipelinesApi";

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
  return (
    <>
      <Td
        style={{
          borderLeft:
            index === 0
              ? `1px solid ${t_global_border_color_default.var}`
              : "none",
          whiteSpace: "nowrap",
        }}
      >
        <Link to={`/jobs/${job.id}/jobStates`}>
          <JobStatusLabel
            status={job.status}
            className="pf-v6-u-mr-xs"
            style={{ zIndex: 1 }}
          />

          {job.name}
        </Link>
      </Td>
      <Td
        style={{
          whiteSpace: "nowrap",
          textAlign: "center",
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
        }}
      >
        <Label
          isCompact
          color="green"
          title={`${job?.tests?.success || 0} tests in success`}
          className="pf-v6-u-mr-xs"
        >
          {job?.tests?.success || 0}
        </Label>
        <Label
          isCompact
          color="orange"
          title={`${job?.tests?.skips || 0} skipped tests`}
          className="pf-v6-u-mr-xs"
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
          borderRight: `1px solid ${t_global_border_color_default.var}`,
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
    <Card className="pf-v6-u-mt-md">
      <CardHeader
        actions={{
          actions: (
            <Button
              type="button"
              variant="tertiary"
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
        <Table>
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
                <Tr
                  style={{
                    borderTop: `1px solid ${t_global_border_color_default.var}`,
                  }}
                >
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
                          borderLeft: `1px solid ${t_global_border_color_default.value}`,
                          whiteSpace: "nowrap",
                          backgroundColor:
                            job.status === "success"
                              ? t_global_color_nonstatus_green_100.var
                              : t_global_color_nonstatus_red_100.value,
                        }}
                        colSpan={4}
                      >
                        <ComponentsList
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
      <EmptyState
        headingLevel="h4"
        titleText="No pipeline between these dates"
        variant={EmptyStateVariant.xs}
      >
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

function Pipelines({
  teamsIds,
  before,
  after,
  pipelinesNames,
}: {
  teamsIds: string[];
  before: string;
  after: string;
  pipelinesNames: string[];
}) {
  const [getPipelineStatus, { data: pipelines, isLoading }] =
    useLazyGetPipelineStatusQuery();

  useEffect(() => {
    getPipelineStatus({
      start_date: after,
      end_date: before,
      teams_ids: teamsIds,
      pipelines_names: pipelinesNames,
    });
  }, [after, before, teamsIds, pipelinesNames, getPipelineStatus]);

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!pipelines) {
    return (
      <EmptyState
        headingLevel="h4"
        titleText="Display pipeline jobs"
        variant={EmptyStateVariant.xs}
      >
        <EmptyStateBody>
          You can fill in the filters to view your team's pipelines.
        </EmptyStateBody>
      </EmptyState>
    );
  }

  return <PipelinesTable pipelines={pipelines} />;
}

export default function PipelinesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
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

  useEffect(() => {
    if (teamsIds.length > 0) {
      searchParams.set("teams_ids", teamsIds.join(","));
    } else {
      searchParams.delete("teams_ids");
    }
    setSearchParams(searchParams);
  }, [teamsIds, searchParams, setSearchParams]);

  useEffect(() => {
    if (pipelinesNames.length > 0) {
      searchParams.set("pipelines_names", pipelinesNames.join(","));
    } else {
      searchParams.delete("pipelines_names");
    }
    setSearchParams(searchParams);
  }, [pipelinesNames, searchParams, setSearchParams]);

  useEffect(() => {
    if (before === "" || range !== "custom") {
      searchParams.delete("end_date");
    } else {
      searchParams.set("end_date", before);
    }
    setSearchParams(searchParams);
  }, [before, range, searchParams, setSearchParams]);

  useEffect(() => {
    if (after === "" || range !== "custom") {
      searchParams.delete("start_date");
    } else {
      searchParams.set("start_date", after);
    }
    setSearchParams(searchParams);
  }, [after, range, searchParams, setSearchParams]);

  useEffect(() => {
    if (range !== "custom") {
      const dates = getRangeDates(range);
      setAfter(dates.after);
      setBefore(dates.before);
    }
    searchParams.set("range", range);
    setSearchParams(searchParams);
  }, [range, searchParams, setSearchParams]);

  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/analytics", title: "Analytics" },
          { title: "Pipelines" },
        ]}
      />
      <Content component="h1">Pipelines</Content>
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
              <ToolbarGroup>
                <ToolbarItem variant="label" id="team-label-toolbar">
                  Teams
                  <span style={{ color: t_global_text_color_required.var }}>
                    *
                  </span>
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
              </ToolbarGroup>
            </ToolbarContent>
          </Toolbar>
        </CardBody>
      </Card>
      {teamsIds.length > 0 && (
        <Card className="pf-v6-u-mt-md">
          <CardBody>
            <Pipelines
              teamsIds={teamsIds}
              pipelinesNames={pipelinesNames}
              before={before}
              after={after}
            />
          </CardBody>
        </Card>
      )}
    </PageSection>
  );
}
