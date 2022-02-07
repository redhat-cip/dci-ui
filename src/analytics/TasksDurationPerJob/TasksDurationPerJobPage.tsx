import MainPage from "pages/MainPage";
import { Breadcrumb } from "ui";
import {
  Button,
  Card,
  CardBody,
  DatePicker,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import TopicsFilter from "jobs/toolbar/TopicsFilter";
import RemotecisFilter from "jobs/toolbar/RemotecisFilter";
import { useEffect, useState } from "react";
import { IRemoteci, ITopic, IDataFromES, IGraphData, IRefArea } from "types";
import http from "services/http";
import { useDispatch } from "react-redux";
import { showAPIError } from "alerts/alertsActions";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { formatDate, humanizeDuration } from "services/date";
import { getDomain, transform } from "./tasksDurationPerJob";
import { Link } from "react-router-dom";
import { LinkIcon } from "@patternfly/react-icons";
import { DateTime } from "luxon";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "1em",
        }}
      >
        {payload
          .sort((p1: any, p2: any) => p2.value - p1.value)
          .map((p: any) => (
            <div key={p.name}>
              <p style={{ color: p.stroke }}>{`${p.name.substring(0, 7)} ${
                p.payload.name
              }`}</p>
              <p style={{ color: p.stroke }}>{`${humanizeDuration(
                p.value * 1000
              )} (${p.value}s)`}</p>
            </div>
          ))}
      </div>
    );
  }

  return null;
};

const colors = [
  "#0066CC",
  "#4CB140",
  "#009596",
  "#5752D1",
  "#F4C145",
  "#EC7A08",
  "#7D1007",
];

function Graph({ data }: { data: IGraphData[] }) {
  const [left, setLeft] = useState<number | null>(null);
  const [right, setRight] = useState<number | null>(null);
  const [refArea, setRefArea] = useState<IRefArea>({ left: null, right: null });
  const [domain, setDomain] = useState(getDomain(data, refArea));
  useEffect(() => {
    setDomain(getDomain(data, refArea));
  }, [data, refArea]);
  const { minXDomain, maxXDomain, minYDomain, maxYDomain } = domain;
  const isZoomed = refArea.left && refArea.right;
  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {isZoomed && (
          <Button
            type="button"
            variant="tertiary"
            onClick={() => setRefArea({ left: null, right: null })}
          >
            reset zoom
          </Button>
        )}
      </div>
      <ResponsiveContainer>
        <LineChart
          onMouseDown={(e: any) => e && setLeft(e.activeLabel)}
          onMouseMove={(e: any) => e && left && setRight(e.activeLabel)}
          onMouseUp={() => {
            if (left === right || right === null) {
              setLeft(null);
              setRight(null);
              return;
            }

            if (left && right && left > right) {
              setRefArea({
                left: right,
                right: left,
              });
            } else {
              setRefArea({
                left,
                right,
              });
            }
            setLeft(null);
            setRight(null);
          }}
        >
          <XAxis
            tick={false}
            dataKey="x"
            type="number"
            allowDuplicatedCategory={false}
            domain={[() => minXDomain, () => maxXDomain]}
          />
          <YAxis
            type="number"
            dataKey="y"
            interval="preserveEnd"
            allowDataOverflow
            domain={[() => minYDomain, () => Math.round(maxYDomain * 1.05)]}
          />

          {!left && (
            <Tooltip isAnimationActive={false} content={<CustomTooltip />} />
          )}

          {data.map((d, i) => (
            <Line
              key={d.id}
              dataKey="y"
              data={d.data}
              dot={false}
              name={`${d.id} ${d.name} ${d.status}`}
              type="stepAfter"
              stroke={colors[i % colors.length]}
            />
          ))}
          {left && right && (
            <ReferenceArea x1={left} x2={right} strokeOpacity={0.3} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default function TasksDurationPerJobPage() {
  const dispatch = useDispatch();
  const [topic, setTopic] = useState<ITopic | null>(null);
  const [remoteci, setRemoteci] = useState<IRemoteci | null>(null);
  const [ESData, setESData] = useState<IDataFromES | null>(null);
  const [data, setData] = useState<IGraphData[]>([]);
  const maxJobs = 7;
  const [after, setAfter] = useState<string | null>(null);
  const [before, setBefore] = useState<string | null>(null);

  function clearAllFilters() {
    setTopic(null);
    setRemoteci(null);
    setAfter(null);
    setBefore(null);
  }

  useEffect(() => {
    if (topic && remoteci) {
      http
        .get(
          `/api/v1/analytics/tasks_duration_cumulated?remoteci_id=${remoteci.id}&topic_id=${topic.id}`
        )
        .then((response) => {
          setESData(response.data as IDataFromES);
        })
        .catch((error) => {
          dispatch(showAPIError(error));
          return error;
        });
    }
  }, [topic, remoteci, after, before, dispatch]);

  useEffect(() => {
    if (ESData) {
      setData(
        transform(ESData)
          .filter((d) => {
            if (after) {
              return DateTime.fromISO(d.created_at) >= DateTime.fromISO(after);
            }
            return true;
          })
          .filter((d) => {
            if (before) {
              return DateTime.fromISO(d.created_at) <= DateTime.fromISO(before);
            }
            return true;
          })
          .slice(-maxJobs)
      );
    }
  }, [ESData]);

  return (
    <MainPage
      title="Tasks duration per job"
      description="Select your topic and remoteci to see duration of tasks per job."
      Breadcrumb={
        <Breadcrumb
          links={[
            { to: "/", title: "DCI" },
            { to: "/analytics", title: "Analytics" },
            { title: "Jobs tasks duration" },
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
                <ToolbarItem>Filter Jobs</ToolbarItem>
              </ToolbarGroup>
              <ToolbarGroup>
                <ToolbarItem>
                  <TopicsFilter
                    topic_id={topic ? topic.id : null}
                    onClear={() => setTopic(null)}
                    onSelect={setTopic}
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <RemotecisFilter
                    remoteci_id={remoteci ? remoteci.id : null}
                    onClear={() => setRemoteci(null)}
                    onSelect={setRemoteci}
                  />
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarGroup>
                <ToolbarItem>
                  <ToolbarFilter
                    chips={after === null ? [] : [after]}
                    deleteChip={() => setAfter(null)}
                    categoryName="Created after"
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
                    deleteChip={() => setBefore(null)}
                    categoryName="Created before"
                    showToolbarItem
                  >
                    <DatePicker
                      value={before || ""}
                      placeholder="Created before"
                      onChange={(str) => setBefore(str)}
                    />
                  </ToolbarFilter>
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarContent>
          </Toolbar>
        </CardBody>
      </Card>
      <Card className="mt-lg">
        <CardBody>
          {ESData === null && (
            <p>To start choose one topic and one remoteci.</p>
          )}
          {ESData !== null && data.length === 0 && (
            <p>No data available with these filters, change your filters.</p>
          )}
          {data.length === 0 ? null : (
            <>
              <div
                style={{ width: "100%", minHeight: "400px", height: "400px" }}
              >
                <Graph data={data} />
              </div>
              <div className="p-xl">
                <table
                  className="pf-c-table pf-m-compact pf-m-grid-md"
                  role="grid"
                  aria-label="Job Legend"
                >
                  <thead>
                    <tr role="row">
                      <th role="columnheader" scope="col">
                        id
                      </th>
                      <th role="columnheader" scope="col">
                        name
                      </th>
                      <th role="columnheader" scope="col">
                        status
                      </th>
                      <th role="columnheader" scope="col">
                        created
                      </th>
                      <th
                        className="text-center"
                        role="columnheader"
                        scope="col"
                      >
                        Job link
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((d, i) => (
                      <tr key={i} role="row">
                        <td
                          role="cell"
                          data-label="Job id"
                          style={{ color: colors[i % colors.length] }}
                        >
                          {d.id}
                        </td>
                        <td role="cell" data-label="Job name">
                          {d.name}
                        </td>
                        <td role="cell" data-label="Job status">
                          {d.status}
                        </td>
                        <td role="cell" data-label="Job created at">
                          <time title={d.created_at} dateTime={d.created_at}>
                            {formatDate(d.created_at)}
                          </time>
                        </td>
                        <td
                          className="text-center"
                          role="cell"
                          data-label="Job status"
                        >
                          <Link to={`/jobs/${d.id}/jobStates`}>
                            <LinkIcon />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </MainPage>
  );
}
