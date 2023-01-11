import {
  Bullseye,
  Button,
  Card,
  CardBody,
  DatePicker,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Label,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarItem,
} from "@patternfly/react-core";
import { BlinkLogo, Breadcrumb } from "ui";
import MainPage from "pages/MainPage";
import {
  global_palette_black_400,
  global_palette_green_50,
  global_palette_red_50,
} from "@patternfly/react-tokens";
import { DateTime } from "luxon";
import { humanizeDuration } from "services/date";
import { Fragment, useEffect, useState } from "react";
import TeamsFilter from "jobs/toolbar/TeamsFilter";
import ListFilter from "jobs/toolbar/ListFilter";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import http from "services/http";
import { showAPIError } from "alerts/alertsActions";
import { useDispatch } from "react-redux";
import { IPipelines } from "types";

function PipelinesTable({ pipelines }: { pipelines: IPipelines }) {
  const { days, components_headers } = pipelines;
  if (days.length === 0) {
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
    <table className="pf-c-table pf-m-compact pf-m-grid-md">
      <thead>
        <tr>
          <th colSpan={-1}></th>
        </tr>
      </thead>
      <tbody>
        {days.map((day, dayIndex) =>
          day.pipelines.map((pipeline, pipelineIndex) => (
            <Fragment key={pipelineIndex}>
              {pipelineIndex === 0 && dayIndex === 0 && (
                <tr key="header-row">
                  <td
                    style={{
                      whiteSpace: "nowrap",
                      textAlign: "center",
                      minWidth: "82px",
                    }}
                  >
                    day
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>pipeline name</td>
                  {pipeline.jobs.map((job) => (
                    <Fragment key={job.id}>
                      <td
                        style={{
                          borderLeft: `1px solid ${global_palette_black_400.value}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        job name
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>status</td>
                      <td style={{ whiteSpace: "nowrap" }}></td>
                      <td
                        style={{
                          whiteSpace: "nowrap",
                          textAlign: "center",
                        }}
                      >
                        duration
                      </td>
                      {components_headers.map((header) => (
                        <td key={header} style={{ whiteSpace: "nowrap" }}>
                          {header}
                        </td>
                      ))}
                    </Fragment>
                  ))}
                </tr>
              )}

              <tr>
                {pipelineIndex === 0 && (
                  <td
                    rowSpan={day.pipelines.length}
                    style={{
                      verticalAlign: "middle",
                      textAlign: "center",
                    }}
                  >
                    {DateTime.fromISO(day.date).toFormat("dd LLL")}
                  </td>
                )}
                <td style={{ whiteSpace: "nowrap", paddingLeft: "8px" }}>
                  {pipeline.name}
                </td>
                {pipeline.jobs.map((job) => (
                  <Fragment key={job.id}>
                    <td
                      style={{
                        borderLeft: `1px solid ${global_palette_black_400.value}`,
                        whiteSpace: "nowrap",
                        backgroundColor:
                          job.status === "success"
                            ? global_palette_green_50.value
                            : global_palette_red_50.value,
                      }}
                    >
                      {job.name}
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          job.status === "success"
                            ? global_palette_green_50.value
                            : global_palette_red_50.value,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {job.status}
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          job.status === "success"
                            ? global_palette_green_50.value
                            : global_palette_red_50.value,
                        whiteSpace: "nowrap",
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
                          (job?.tests?.failures || 0) +
                          (job?.tests?.errors || 0)
                        } errors and failures tests`}
                      >
                        {(job?.tests?.failures || 0) +
                          (job?.tests?.errors || 0)}
                      </Label>
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          job.status === "success"
                            ? global_palette_green_50.value
                            : global_palette_red_50.value,
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                      {humanizeDuration(job.duration * 1000)}
                    </td>
                    {job.components.length === components_headers.length
                      ? job.components.map((component, i) =>
                          component === null ? (
                            <td
                              key={i}
                              style={{
                                backgroundColor:
                                  job.status === "success"
                                    ? global_palette_green_50.value
                                    : global_palette_red_50.value,
                                whiteSpace: "nowrap",
                              }}
                            >
                              na
                            </td>
                          ) : (
                            <td
                              key={i}
                              style={{
                                backgroundColor:
                                  job.status === "success"
                                    ? global_palette_green_50.value
                                    : global_palette_red_50.value,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {component.name
                                .replace(`${components_headers[i]} `, "")
                                .replace(`${components_headers[i]}:`, "")}
                            </td>
                          )
                        )
                      : components_headers.map((header) => (
                          <td
                            key={header}
                            style={{
                              backgroundColor:
                                job.status === "success"
                                  ? global_palette_green_50.value
                                  : global_palette_red_50.value,
                              whiteSpace: "nowrap",
                            }}
                          >
                            na
                          </td>
                        ))}
                  </Fragment>
                ))}
              </tr>
            </Fragment>
          ))
        )}
      </tbody>
    </table>
  );
}

export default function PipelinesPage() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [pipelines, setPipelines] = useState<IPipelines | null>(null);
  let [searchParams, setSearchParams] = useSearchParams();
  const [pipelinesNames, setPipelinesNames] = useState<string[]>(
    searchParams.get("pipelines_names")?.split(",") || []
  );
  const [teamsIds, setTeamsIds] = useState<string[]>(
    searchParams.get("teams_ids")?.split(",") || []
  );
  const today = DateTime.now();
  const threeDaysAgo = today.minus({ days: 3 });
  const [after, setAfter] = useState<string>(
    searchParams.get("start_date") || threeDaysAgo.toISODate()
  );
  const [before, setBefore] = useState<string>(
    searchParams.get("end_date") || today.toISODate()
  );

  function clearAllFilters() {
    setPipelinesNames([]);
    setTeamsIds([]);
    setAfter(threeDaysAgo.toISODate());
    setBefore(today.toISODate());
  }

  useEffect(() => {
    const newSearchParams: URLSearchParamsInit = {};
    if (pipelinesNames.length > 0) {
      newSearchParams.pipelines_names = pipelinesNames.join(",");
    }
    if (teamsIds.length > 0) {
      newSearchParams.teams_ids = teamsIds.join(",");
    }
    if (before !== null) {
      newSearchParams.end_date = before;
    }
    if (after !== null) {
      newSearchParams.start_date = after;
    }
    setSearchParams(newSearchParams);
  }, [setSearchParams, teamsIds, pipelinesNames, before, after]);

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
            clearAllFilters={clearAllFilters}
            collapseListedFiltersBreakpoint="xl"
          >
            <ToolbarContent>
              <ToolbarItem>
                <TeamsFilter
                  placeholderText="Teams names"
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
              <ToolbarItem></ToolbarItem>
              <ToolbarItem>
                <ToolbarFilter
                  chips={after === null ? [] : [after]}
                  deleteChip={() => setAfter(threeDaysAgo.toISODate())}
                  categoryName="After"
                  showToolbarItem
                >
                  <DatePicker
                    value={after || ""}
                    placeholder="Created after"
                    onChange={(str) => setAfter(str)}
                  />
                </ToolbarFilter>
              </ToolbarItem>
              <ToolbarItem>
                <ToolbarFilter
                  chips={before === null ? [] : [before]}
                  deleteChip={() => setBefore(today.toISODate())}
                  categoryName="Before"
                  showToolbarItem
                >
                  <DatePicker
                    value={before || ""}
                    placeholder="Created before"
                    onChange={(str) => setBefore(str)}
                  />
                </ToolbarFilter>
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
                  }}
                >
                  Show pipelines
                </Button>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
        </CardBody>
      </Card>
      <Card>
        <CardBody style={{ overflow: "auto" }}>
          {isLoading ? (
            <Bullseye>
              <BlinkLogo />
            </Bullseye>
          ) : pipelines === null ? (
            <EmptyState variant={EmptyStateVariant.xs}>
              <Title headingLevel="h4" size="md">
                Display pipeline jobs
              </Title>
              <EmptyStateBody>
                Change your search parameters to display pipeline jobs with
                their components between 2 dates.
              </EmptyStateBody>
            </EmptyState>
          ) : (
            <PipelinesTable pipelines={pipelines} />
          )}
        </CardBody>
      </Card>
    </MainPage>
  );
}
