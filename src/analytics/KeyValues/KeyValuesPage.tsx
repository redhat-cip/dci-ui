import {
  Card,
  CardBody,
  CardHeader,
  Content,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  FormSelect,
  FormSelectOption,
  PageSection,
} from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import { formatDate } from "services/date";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
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
import { extractKeyValues } from "./keyValues";
import { FilterIcon } from "@patternfly/react-icons";
import { useLazyGetAnalyticJobsQuery } from "analytics/analyticsApi";
import AnalyticsToolbar from "analytics/toolbar/AnalyticsToolbar";
import { IGraphKeyValue, IGraphKeyValues } from "types";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const jobName = payload[0].payload.job.name;
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "1em",
        }}
      >
        <p>{`Job ${jobName}`}</p>
        {payload.map(
          (p: { name: string; value: number; payload: IGraphKeyValue }) => (
            <div key={p.name}>
              <p>
                {p.name === "created_at"
                  ? `Created on ${formatDate(DateTime.fromMillis(p.value), DateTime.DATE_MED)}`
                  : `${p.payload.key}: ${p.value}`}
              </p>
            </div>
          ),
        )}
      </div>
    );
  }

  return null;
};

type IGraphType = "bar" | "line" | "scatter";

const graphTypeLabels: Record<IGraphType, string> = {
  scatter: "scatter chart",
  line: "line chart",
  bar: "bar chart",
};

function KeyValues({ data }: { data: IGraphKeyValues }) {
  const [graphType, setGraphType] = useState<IGraphType>("scatter");

  if (Object.keys(data).length === 0) {
    return (
      <Card className="pf-v6-u-mt-md">
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

  return (
    <div>
      <FormSelect
        id="select-graph-type"
        className="pf-v6-u-mt-md"
        value={graphType}
        onChange={(event, newGraph) => {
          setGraphType(newGraph as IGraphType);
        }}
      >
        {(
          Object.keys(graphTypeLabels) as Array<keyof typeof graphTypeLabels>
        ).map((gT, index) => (
          <FormSelectOption
            key={index}
            value={gT}
            label={graphTypeLabels[gT]}
          />
        ))}
      </FormSelect>

      {Object.entries(data).map(([key, keyValue]) => (
        <Card className="pf-v6-u-mt-md">
          <CardHeader>{key}</CardHeader>
          <CardBody>
            {graphType === "scatter" && (
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid />
                  <XAxis
                    dataKey="created_at"
                    type="number"
                    domain={["auto", "auto"]}
                    scale="time"
                    hide
                  />
                  <YAxis dataKey="value" />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={<CustomTooltip />}
                  />
                  <Scatter name={key} data={keyValue} fill="#3E8635" />
                </ScatterChart>
              </ResponsiveContainer>
            )}
            {graphType === "bar" && (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  width={500}
                  height={400}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                  data={keyValue}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="created_at" hide />
                  <YAxis />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={<CustomTooltip />}
                  />
                  <Bar dataKey="value" fill="#3E8635" />
                </BarChart>
              </ResponsiveContainer>
            )}
            {graphType === "line" && (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  width={500}
                  height={400}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                  data={keyValue}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="created_at" hide />
                  <YAxis />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={<CustomTooltip />}
                  />
                  <Line
                    dot={false}
                    type="monotone"
                    dataKey="value"
                    fill="#3E8635"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default function KeyValuesPage() {
  const [getAnalyticJobs, { data, isFetching }] = useLazyGetAnalyticJobsQuery();
  if (data && data.hits) {
    console.log(extractKeyValues(data));
  }
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
      {!isFetching && data && data.hits && (
        <KeyValues data={extractKeyValues(data)} />
      )}
    </PageSection>
  );
}
