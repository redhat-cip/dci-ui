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
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Tooltip,
  CardActions,
  Dropdown,
  KebabToggle,
  DropdownItem,
  CardHeader,
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
import { formatDate, humanizeDurationShort } from "services/date";
import { Fragment, useState } from "react";
import TeamsFilter from "jobs/toolbar/TeamsFilter";
import ListFilter from "jobs/toolbar/ListFilter";
import { Link, useSearchParams } from "react-router-dom";
import http from "services/http";
import { showAPIError } from "alerts/alertsActions";
import { useDispatch } from "react-redux";
import { IJobStatus, IPipelines } from "types";
import RangeFilter, { RangeOptionValue } from "jobs/toolbar/RangeFilter";
import { getColor, getIcon } from "jobs/jobSummary/jobSummaryUtils";
import { Components } from "jobs/job/JobDetailsSummary";
import { notEmpty } from "../../services/utils";

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
      <td
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
            className="pf-u-mr-xs"
          >
            {getIcon(job.status)}
          </span>
          {job.name}
        </Link>
      </td>
      <td
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
      </td>
      <td
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
          className="mr-xs"
        >
          {job?.tests?.success || 0}
        </Label>
        <Label
          isCompact
          color="orange"
          title={`${job?.tests?.skips || 0} skipped tests`}
          className="mr-xs"
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
      </td>
      <td
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
      </td>
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
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  return (
    <Card key={pipelineDay.date} className="pf-u-mt-xs">
      <CardHeader>
        <CardActions>
          <Dropdown
            onSelect={() => {
              console.log("what");
              setSeeJobComponents(!seeJobComponents);
            }}
            toggle={
              <KebabToggle
                id={`${pipelineDay.date}-dropdown-toggle`}
                onToggle={(isOpen) => {
                  console.log(isOpen);
                  setDropdownIsOpen(isOpen);
                }}
              />
            }
            isOpen={dropdownIsOpen}
            isPlain
            dropdownItems={[
              <DropdownItem
                key={`${pipelineDay.date}-dropdown-item`}
                component="button"
              >
                {seeJobComponents
                  ? "Hide job components"
                  : "See job components"}
              </DropdownItem>,
            ]}
            position={"right"}
          />
        </CardActions>
        <CardTitle>
          {formatDate(
            pipelineDay.datetime,
            undefined,
            DateTime.DATE_MED_WITH_WEEKDAY
          )}
        </CardTitle>
      </CardHeader>
      <CardBody style={{ overflow: "auto" }}>
        <table className="pf-c-table pf-m-compact pf-m-grid-md">
          <thead>
            <tr>
              <th>pipeline</th>
              <th>name</th>
              <th colSpan={-1}>jobs</th>
            </tr>
          </thead>
          <tbody>
            {pipelineDay.pipelines.map((pipeline, i) => (
              <Fragment key={i}>
                <tr>
                  <td
                    rowSpan={seeJobComponents ? 2 : 1}
                    style={{ verticalAlign: "middle" }}
                  >
                    <ProgressStepper isCompact>
                      {pipeline.jobs.map((job) => (
                        <ProgressStep
                          variant={jobStatusToVariant(job.status)}
                          id={job.name}
                          titleId={job.name}
                        />
                      ))}
                    </ProgressStepper>
                  </td>
                  <td
                    rowSpan={seeJobComponents ? 2 : 1}
                    style={{ verticalAlign: "middle" }}
                  >
                    {pipeline.name}
                  </td>
                  {pipeline.jobs.map((job, i) => (
                    <PipelineJobInfo index={i} job={job} />
                  ))}
                </tr>
                {seeJobComponents && (
                  <tr>
                    {pipeline.jobs.map((job) => (
                      <td
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
                      </td>
                    ))}
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

function PipelinesTable({ pipelines }: { pipelines: IPipelines }) {
  if (pipelines.days.length === 0) {
    return (
      <EmptyState variant={EmptyStateVariant.xs}>
        <Title headingLevel="h4" size="md">
          No pipeline between these dates
        </Title>
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
        .map((day) => (
          <PipelineCard pipelineDay={day} />
        ))}
    </div>
  );
}

export default function PipelinesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [pipelinesNames, setPipelinesNames] = useState<string[]>(
    searchParams.get("pipelines_names")?.split(",") || []
  );
  const [teamsIds, setTeamsIds] = useState<string[]>(
    searchParams.get("teams_ids")?.split(",") || []
  );
  const defaultRangeValue: RangeOptionValue = "last7Days";
  const [range, setRange] = useState<RangeOptionValue>(
    (searchParams.get("range") as RangeOptionValue) || defaultRangeValue
  );
  const [after, setAfter] = useState(searchParams.get("start_date") || "");
  const [before, setBefore] = useState(searchParams.get("end_date") || "");
  const [pipelines, setPipelines] = useState<IPipelines | null>(null);

  const dispatch = useDispatch();

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
                <TeamsFilter
                  teamsIds={teamsIds}
                  onClear={(team) =>
                    setTeamsIds((oldTeamsIds) =>
                      oldTeamsIds.filter((t) => t !== team.id)
                    )
                  }
                  onClearAll={() => setTeamsIds([])}
                  onSelect={(team) =>
                    setTeamsIds((oldTeamsIds) => [...oldTeamsIds, team.id])
                  }
                />
              </ToolbarItem>
              <ToolbarItem>
                <ListFilter
                  items={pipelinesNames}
                  categoryName="Pipelines names"
                  placeholderText="Pipelines names"
                  onClear={(item) =>
                    setPipelinesNames((oldPipelinesNames) =>
                      oldPipelinesNames.filter((p) => p !== item)
                    )
                  }
                  onSearch={(item) =>
                    setPipelinesNames((oldPipelinesNames) => [
                      ...oldPipelinesNames,
                      item,
                    ])
                  }
                />
              </ToolbarItem>
              <ToolbarItem variant="label" id="range-label-toolbar">
                Range
              </ToolbarItem>
              <ToolbarItem>
                <RangeFilter
                  range={range}
                  setRange={setRange}
                  after={after}
                  setAfter={setAfter}
                  before={before}
                  setBefore={setBefore}
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
                      searchParams.set(
                        "pipelines_names",
                        pipelinesNames.join(",")
                      );
                    } else {
                      searchParams.delete("pipelines_names");
                    }
                    if (teamsIds.length > 0) {
                      searchParams.set("teams_ids", teamsIds.join(","));
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
              <Title headingLevel="h4" size="md">
                Display pipeline jobs
              </Title>
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
