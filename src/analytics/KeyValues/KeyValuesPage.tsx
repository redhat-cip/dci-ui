import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Content,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  PageSection,
  Skeleton,
} from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import { formatDate } from "services/date";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DateTime } from "luxon";
import { extractKeysValues, getTicksInRange } from "./keyValues";
import { FilterIcon, TrashAltIcon } from "@patternfly/react-icons";
import { useGetAnalyticJobsQuery } from "analytics/analyticsApi";
import AnalyticsToolbar from "analytics/toolbar/AnalyticsToolbar";
import {
  IGetAnalyticsJobsEmptyResponse,
  IGetAnalyticsJobsResponse,
  IGraphKeysValues,
  IJob,
} from "types";
import KeyValuesAddGraphModal from "./KeyValuesAddGraphModal";
import { createSearchFromGraphs, parseGraphsFromSearch } from "./filters";
import { useNavigate, useSearchParams } from "react-router";
import { IKeyValueGraph } from "./keyValuesTypes";
import KeyValuesEditGraphModal from "./KeyValuesEditGraphModal";
import { skipToken } from "@reduxjs/toolkit/query";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const jobName = payload[0].payload.name;
    const createdAt = formatDate(
      DateTime.fromMillis(payload[0].payload.created_at),
      DateTime.DATE_MED,
    );
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "1em",
        }}
      >
        <p>{`Created on ${createdAt}`}</p>
        <p>{`Job ${jobName}`}</p>
        {payload.map(
          (p: {
            name: string;
            value: number;
            stroke: string;
            payload: IGraphKeysValues["data"][0];
          }) => (
            <div key={p.name}>
              <p style={{ color: p.stroke }}>
                {p.name}: {p.value}
              </p>
            </div>
          ),
        )}
      </div>
    );
  }

  return null;
};

function tickFormatter(timestamp: number) {
  return DateTime.fromMillis(timestamp).toFormat("dd MMM yyyy");
}

function KeyValueGraph({
  graph,
  data,
  ticks,
  onEdit,
  onDelete,
}: {
  graph: IKeyValueGraph;
  data: IGraphKeysValues;
  ticks: number[];
  onEdit: (newGraph: IKeyValueGraph) => void;
  onDelete: () => void;
}) {
  const keys = graph.keys.map((k) => k.key);
  const keysValuesData = [...data.data]
    .filter((obj) => keys.some((key) => key in obj.keysValues))
    .sort((a, b) => a.created_at - b.created_at);
  const openJob = (payload: any) => {
    if ("payload" in payload) {
      const job = payload.payload as IJob;
      window.open(`/jobs/${job.id}/jobStates`);
    }
  };
  return (
    <Card className="pf-v6-u-mt-md">
      <CardHeader>
        {graph.name}
        <KeyValuesEditGraphModal
          data={data}
          graph={graph}
          className="pf-v6-u-ml-md"
          onSubmit={onEdit}
        />
        <Button
          onClick={() => {
            onDelete();
          }}
          variant="plain"
          className="pf-v6-u-ml-xs"
        >
          <TrashAltIcon />
        </Button>
      </CardHeader>
      <CardBody>
        {graph.graphType === "line" && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={keysValuesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="created_at"
                tickFormatter={tickFormatter}
                ticks={ticks}
                domain={[ticks[0], ticks[ticks.length - 1]]}
                type="number"
              />
              {graph.keys.map((key, i) => (
                <YAxis key={i} yAxisId={key.axis} orientation={key.axis}>
                  <Label
                    value={key.key}
                    position={
                      key.axis === "left" ? "insideLeft" : "insideRight"
                    }
                    angle={-90}
                    fill={key.color}
                    style={{ textAnchor: "middle" }}
                  />
                </YAxis>
              ))}
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={<CustomTooltip />}
              />
              <Legend />
              {graph.keys.map((key, i) => (
                <Line
                  key={i}
                  name={key.key}
                  yAxisId={key.axis}
                  dataKey={`keysValues.${key.key}`}
                  stroke={key.color}
                  connectNulls
                  type="monotone"
                  activeDot={{
                    r: 6,
                    cursor: "pointer",
                    onClick: (event, payload) => {
                      openJob(payload);
                    },
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
        {graph.graphType === "bar" && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={keysValuesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="created_at"
                tickFormatter={tickFormatter}
                ticks={ticks}
                domain={[ticks[0], ticks[ticks.length - 1]]}
                type="number"
              />
              {graph.keys.map((key, i) => (
                <YAxis key={i} yAxisId={key.axis} orientation={key.axis}>
                  <Label
                    value={key.key}
                    position={
                      key.axis === "left" ? "insideLeft" : "insideRight"
                    }
                    angle={-90}
                    fill={key.color}
                    style={{ textAnchor: "middle" }}
                  />
                </YAxis>
              ))}
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={<CustomTooltip />}
              />
              <Legend />
              {graph.keys.map((key, i) => (
                <Bar
                  key={i}
                  name={key.key}
                  dataKey={`keysValues.${key.key}`}
                  yAxisId={key.axis}
                  fill={key.color}
                  scale="time"
                  cursor="pointer"
                  onClick={openJob}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
        {graph.graphType === "scatter" && (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={keysValuesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="created_at"
                tickFormatter={tickFormatter}
                ticks={ticks}
                domain={[ticks[0], ticks[ticks.length - 1]]}
                type="number"
              />
              {graph.keys.map((key, i) => (
                <YAxis key={i} yAxisId={key.axis} orientation={key.axis}>
                  <Label
                    value={key.key}
                    position={
                      key.axis === "left" ? "insideLeft" : "insideRight"
                    }
                    angle={-90}
                    fill={key.color}
                    style={{ textAnchor: "middle" }}
                  />
                </YAxis>
              ))}
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={<CustomTooltip />}
              />
              <Legend />
              {graph.keys.map((key, i) => (
                <Scatter
                  key={i}
                  name={key.key}
                  dataKey={`keysValues.${key.key}`}
                  yAxisId={key.axis}
                  fill={key.color}
                  scale="time"
                  cursor="pointer"
                  onClick={openJob}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
}

function KeyValuesGraphs({
  data,
  ticks,
  ...props
}: {
  data: IGraphKeysValues;
  ticks: number[];
  [key: string]: any;
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [graphs, setGraphs] = useState<IKeyValueGraph[]>(
    parseGraphsFromSearch(searchParams.get("graphs")),
  );

  useEffect(() => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    const graphSearch = createSearchFromGraphs(graphs);
    if (graphSearch) {
      updatedSearchParams.set("graphs", graphSearch);
    } else {
      updatedSearchParams.delete("graphs");
    }
    navigate(`?${updatedSearchParams.toString()}`);
  }, [graphs, graphs.length, navigate, searchParams]);

  return (
    <div {...props}>
      <KeyValuesAddGraphModal
        data={data}
        onSubmit={(newGraph) => {
          setGraphs((oldGraphs) => [newGraph, ...oldGraphs]);
        }}
        className="pf-v6-u-mt-md"
      />
      {graphs.map((graph, index) => (
        <KeyValueGraph
          key={index}
          graph={graph}
          data={data}
          ticks={ticks}
          onEdit={(newGraph) =>
            setGraphs((oldGraphs) =>
              oldGraphs.map((g, i) =>
                index === i ? { ...newGraph } : { ...g },
              ),
            )
          }
          onDelete={() =>
            setGraphs((oldGraphs) => oldGraphs.filter((g, i) => index !== i))
          }
        />
      ))}
    </div>
  );
}

function KeyValues({
  isLoading,
  data,
  after,
  before,
  ...props
}: {
  isLoading: boolean;
  data: IGetAnalyticsJobsResponse | IGetAnalyticsJobsEmptyResponse | undefined;
  before: string;
  after: string;
  [key: string]: any;
}) {
  if (isLoading) {
    return (
      <Card {...props}>
        <CardBody>
          <Skeleton
            screenreaderText="Loading analytics jobs"
            style={{ height: 80 }}
          />
        </CardBody>
      </Card>
    );
  }

  if (!data || !data.hits) {
    return null;
  }

  const keysValues = extractKeysValues(data);
  const ticks = getTicksInRange({ after, before });
  if (keysValues.keys.length === 0) {
    return (
      <Card {...props}>
        <CardBody>
          <EmptyState
            variant={EmptyStateVariant.xs}
            icon={FilterIcon}
            titleText="No job"
            headingLevel="h4"
          >
            <EmptyStateBody>
              We did not find any jobs with key values matching this search.
              Please modify your search.
            </EmptyStateBody>
          </EmptyState>
        </CardBody>
      </Card>
    );
  }
  return <KeyValuesGraphs data={keysValues} ticks={ticks} />;
}

export default function KeyValuesPage() {
  const [params, setParams] = useState<{
    query: string;
    after: string;
    before: string;
  }>({
    query: "",
    after: "",
    before: "",
  });
  const { query, after, before } = params;
  const shouldSearch = query !== "" && after !== "" && before !== "";
  const { data, isLoading, isFetching } = useGetAnalyticJobsQuery(
    shouldSearch ? params : skipToken,
  );
  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/analytics", title: "Analytics" },
          { title: "Key Values" },
        ]}
      />
      <Content component="h1">Key Values</Content>
      <Content component="p">Graph the key values of your jobs</Content>
      <AnalyticsToolbar
        onLoad={setParams}
        onSearch={setParams}
        isLoading={isFetching}
        data={data}
      />
      <KeyValues
        isLoading={isLoading}
        data={data}
        after={after}
        before={before}
        className="pf-v6-u-mt-md"
      />
    </PageSection>
  );
}
