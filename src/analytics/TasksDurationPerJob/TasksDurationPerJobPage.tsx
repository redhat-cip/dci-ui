import { Page } from "layout";
import { Breadcrumb } from "ui";
import {
  Card,
  CardBody,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import TopicsFilter from "jobs/toolbar/TopicsFilter";
import RemotecisFilter from "jobs/toolbar/RemotecisFilter";
import { useEffect, useState } from "react";
import { IRemoteci, ITopic } from "types";
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
} from "recharts";
import { humanizeDuration } from "services/date";

interface IDataFromES {
  total: {
    value: number;
    relation: string;
  };
  max_score: number;
  hits: {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _source: {
      job_id: string;
      created_at: string;
      topic_id: string;
      remoteci_id: string;
      data: {
        name: string;
        duration: number;
      }[];
    };
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "1em",
        }}
      >
        <p className="label">{`Task n°${label}`}</p>
        {payload.map((p: any) => (
          <div key={p.name}>
            <p style={{ color: p.stroke }}>{`${p.name.substring(0, 8)}: ${
              p.payload.name
            }`}</p>
            <p style={{ color: p.stroke }}>{`${humanizeDuration(
              p.value * 1000
            )} elapsed (${p.value}s)`}</p>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

interface IGraphData {
  name: string;
  data: { name: string; x: number; y: number }[];
}

function transform(dataFromES: IDataFromES) {
  return dataFromES.hits.reduce((acc, hit) => {
    acc.push({
      name: hit._source.job_id,
      data: hit._source.data.reduce(
        (dataAcc, d, i) => {
          dataAcc.push({
            name: d.name,
            x: i + 1,
            y: d.duration,
          });
          return dataAcc;
        },
        [] as {
          name: string;
          x: number;
          y: number;
        }[]
      ),
    });
    return acc;
  }, [] as IGraphData[]);
}

export default function TasksDurationPerJobPage() {
  const dispatch = useDispatch();
  const [topic, setTopic] = useState<ITopic | null>(null);
  const [remoteci, setRemoteci] = useState<IRemoteci | null>(null);
  const [data, setData] = useState<IGraphData[]>([]);

  function clearAllFilters() {
    setTopic(null);
    setRemoteci(null);
  }

  useEffect(() => {
    if (topic && remoteci) {
      http
        .get(
          `/api/v1/analytics/tasks_duration_cumulated?remoteci_id=${remoteci.id}&topic_id=${topic.id}`
        )
        .then((response) => {
          const ESData = response.data as IDataFromES;
          setData(transform(ESData));
        })
        .catch((error) => {
          dispatch(showAPIError(error));
          return error;
        });
    }
  }, [topic, remoteci, dispatch]);

  const colors = ["#23511E", "#38812F", "#4CB140", "#7CC674", "#BDE2B9"];
  const { minXDomain, maxXDomain, maxYDomain } =
    data === null
      ? { minXDomain: 0, maxXDomain: 0, maxYDomain: 0 }
      : data.reduce(
          (acc, d, i) => {
            const nbOfTasks = d.data.length;
            if (i === 0) {
              acc.minXDomain = nbOfTasks;
            }
            if (nbOfTasks > acc.maxXDomain) {
              acc.maxXDomain = nbOfTasks;
            }
            if (nbOfTasks < acc.minXDomain) {
              acc.minXDomain = nbOfTasks;
            }
            const latestYValue = d.data[nbOfTasks - 1].y;
            if (latestYValue > acc.maxYDomain) {
              acc.maxYDomain = latestYValue;
            }
            return acc;
          },
          { minXDomain: 0, maxXDomain: 0, maxYDomain: 0 }
        );

  return (
    <Page
      title="Tasks duration per job"
      description="Select your topic and remoteci to see duration of tasks per job."
      breadcrumb={
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
            </ToolbarContent>
          </Toolbar>
        </CardBody>
      </Card>
      <Card className="mt-lg">
        <CardBody>
          {data.length === 0 ? null : (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart>
                  <XAxis
                    tick={false}
                    dataKey="x"
                    type="category"
                    allowDuplicatedCategory={false}
                  />
                  <YAxis type="number" interval="preserveEnd" />

                  <Tooltip content={<CustomTooltip />} />

                  {data.map((d, i) => (
                    <Line
                      key={d.name}
                      dataKey="y"
                      data={d.data}
                      dot={false}
                      name={d.name}
                      type="stepAfter"
                      stroke={colors[i % colors.length]}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardBody>
      </Card>
    </Page>
  );
}
