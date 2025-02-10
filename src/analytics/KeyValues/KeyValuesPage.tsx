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
import { extractKeysValues } from "./keyValues";
import { FilterIcon, TrashAltIcon } from "@patternfly/react-icons";
import { useLazyGetAnalyticJobsQuery } from "analytics/analyticsApi";
import AnalyticsToolbar from "analytics/toolbar/AnalyticsToolbar";
import {
  IGetAnalyticsJobsEmptyResponse,
  IGetAnalyticsJobsResponse,
  IGraphKeysValues,
  IJob,
} from "types";
import KeyValuesAddGraphModal, {
  IKeyValueGraph,
} from "./KeyValuesAddGraphModal";
import { createSearchFromGraphs, parseGraphsFromSearch } from "./filters";
import { useNavigate, useSearchParams } from "react-router";

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
            payload: IGraphKeysValues["data"][0];
          }) => (
            <div key={p.name}>
              <p>
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

const tickFormatter = (timestamp: number) =>
  DateTime.fromMillis(timestamp).toFormat("dd MMM yyyy");

function KeyValueGraph({
  graph,
  data,
  onDelete,
}: {
  graph: IKeyValueGraph;
  data: IGraphKeysValues;
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
        Graph {keys.join(" ")}
        <Button
          onClick={() => {
            onDelete();
          }}
          variant="plain"
          className="pf-v6-u-ml-md"
        >
          <TrashAltIcon />
        </Button>
      </CardHeader>
      <CardBody>
        {graph.graphType === "line" && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={keysValuesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="created_at" tickFormatter={tickFormatter} />
              <YAxis />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={<CustomTooltip />}
              />
              <Legend />
              {graph.keys.map((key, i) => (
                <Line
                  key={i}
                  name={key.key}
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
              <XAxis dataKey="created_at" tickFormatter={tickFormatter} />
              <YAxis />
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
              <XAxis dataKey="created_at" tickFormatter={tickFormatter} />
              <YAxis />
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
  ...props
}: {
  data: IGraphKeysValues;
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
        keys={data.keys}
        onSubmit={(newGraph) => {
          setGraphs((oldGraphs) => [...oldGraphs, newGraph]);
        }}
        className="pf-v6-u-mt-md"
      />
      {graphs.map((graph, index) => (
        <KeyValueGraph
          key={index}
          graph={graph}
          data={data}
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
  ...props
}: {
  isLoading: boolean;
  data: IGetAnalyticsJobsResponse | IGetAnalyticsJobsEmptyResponse | undefined;
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
              We did not find any jobs matching this search. Please modify your
              search.
            </EmptyStateBody>
          </EmptyState>
        </CardBody>
      </Card>
    );
  }

  return <KeyValuesGraphs data={keysValues} />;
}

export default function KeyValuesPage() {
  const [getAnalyticJobs, { data, isLoading, isFetching }] =
    useLazyGetAnalyticJobsQuery();
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
        onLoad={({ query, after, before }) => {
          if (query !== "" && after !== "" && before !== "") {
            getAnalyticJobs({ query, after, before });
          }
        }}
        onSearch={({ query, after, before }) => {
          getAnalyticJobs({ query, after, before });
        }}
        isLoading={isFetching}
        data={data}
      />
      <KeyValues isLoading={isLoading} data={data} className="pf-v6-u-mt-md" />
    </PageSection>
  );
}
