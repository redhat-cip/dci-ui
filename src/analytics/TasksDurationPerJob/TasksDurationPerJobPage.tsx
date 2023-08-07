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
import TopicFilter from "jobs/toolbar/TopicFilter";
import RemoteciFilter from "jobs/toolbar/RemoteciFilter";
import { useEffect, useState } from "react";
import { IDataFromES, IGraphData, IRefArea } from "types";
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
import { AppDispatch } from "store";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";

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
                p.value * 1000,
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
  const dispatch = useDispatch<AppDispatch>();
  const [topicId, setTopicId] = useState<string | null>(null);
  const [remoteciId, setRemoteciId] = useState<string | null>(null);
  const [data, setData] = useState<IGraphData[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [before, setBefore] = useState<string | null>(null);

  function clearAllFilters() {
    setTopicId(null);
    setRemoteciId(null);
    setAfter(null);
    setBefore(null);
  }

  useEffect(() => {
    if (topicId && remoteciId) {
      http
        .get(
          `/api/v1/analytics/tasks_duration_cumulated?remoteci_id=${remoteciId}&topic_id=${topicId}`,
        )
        .then((response) => {
          setData(transform(response.data as IDataFromES));
        })
        .catch((error) => {
          dispatch(showAPIError(error));
          return error;
        });
    }
  }, [topicId, remoteciId, dispatch]);

  const maxJobs = 7;
  const filteredData = data
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
    .slice(-maxJobs);

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
                  <TopicFilter
                    topicId={topicId}
                    onClear={() => setTopicId(null)}
                    onSelect={setTopicId}
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <RemoteciFilter
                    remoteciId={remoteciId}
                    onClear={() => setRemoteciId(null)}
                    onSelect={setRemoteciId}
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
                      onChange={(e, str) => setAfter(str)}
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
                      onChange={(e, str) => setBefore(str)}
                    />
                  </ToolbarFilter>
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarContent>
          </Toolbar>
        </CardBody>
      </Card>
      <Card className="pf-v5-u-mt-lg">
        <CardBody>
          {filteredData.length === 0 ? null : (
            <>
              <div
                style={{ width: "100%", minHeight: "400px", height: "400px" }}
              >
                <Graph data={filteredData} />
              </div>
              <div className="pf-v5-u-p-xl">
                <Table
                  className="pf-v5-c-table pf-m-compact pf-m-grid-md"
                  role="grid"
                  aria-label="Job Legend"
                >
                  <Thead>
                    <Tr role="row">
                      <Th role="columnheader" scope="col">
                        id
                      </Th>
                      <Th role="columnheader" scope="col">
                        name
                      </Th>
                      <Th role="columnheader" scope="col">
                        status
                      </Th>
                      <Th role="columnheader" scope="col">
                        created
                      </Th>
                      <Th
                        className="text-center"
                        role="columnheader"
                        scope="col"
                      >
                        Job link
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredData.map((d, i) => (
                      <Tr key={i} role="row">
                        <Td
                          role="cell"
                          data-label="Job id"
                          style={{ color: colors[i % colors.length] }}
                        >
                          {d.id}
                        </Td>
                        <Td role="cell" data-label="Job name">
                          {d.name}
                        </Td>
                        <Td role="cell" data-label="Job status">
                          {d.status}
                        </Td>
                        <Td role="cell" data-label="Job created at">
                          <time title={d.created_at} dateTime={d.created_at}>
                            {formatDate(d.created_at)}
                          </time>
                        </Td>
                        <Td
                          className="text-center"
                          role="cell"
                          data-label="Job status"
                        >
                          <Link to={`/jobs/${d.id}/jobStates`}>
                            <LinkIcon />
                          </Link>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </MainPage>
  );
}
