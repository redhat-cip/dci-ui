import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Content,
  PageSection,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import { t_global_text_color_required } from "@patternfly/react-tokens";
import { formatDate, getRangeDates } from "services/date";
import { useCallback, useEffect, useState } from "react";
import { RangeOptionValue } from "types";
import RangeToolbarFilter from "ui/form/RangeToolbarFilter";
import http from "services/http";
import qs from "qs";
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
import MultiSelectFilter from "./MultiSelectFilter";
import { useSearchParams } from "react-router-dom";
import {
  extractKeyValues,
  IGraphKeyValue,
  IGraphKeyValues,
  IKeyValueResponse,
} from "./keyvalues";
import { DateTime } from "luxon";
import SelectFilter from "./SelectFilter";
import LoadingPageSection from "ui/LoadingPageSection";

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
type IGraphTypeItem = { label: string; value: IGraphType };

export default function KeyValuesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [keyValues, setKeyValues] = useState<IGraphKeyValues | null>(null);
  const graphTypes: IGraphTypeItem[] = [
    { label: "scatter chart", value: "scatter" },
    { label: "line chart", value: "line" },
    { label: "bar chart", value: "bar" },
  ];
  const [graphType, setGraphType] = useState<IGraphTypeItem>(
    graphTypes.find((gt) => gt.value === searchParams.get("graph_type")) ||
      graphTypes[0],
  );
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    searchParams.get("selected_keys")?.split(",") || [],
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

  const memoizedGetKeyValues = useCallback(() => {
    if (query === "") return;
    setIsLoading(true);
    const params = qs.stringify(
      {
        query: query,
        offset: 0,
        limit: 200,
        sort: "-created_at",
        includes: "id,name,created_at,keys_values",
        from: after,
        to: before,
      },
      {
        addQueryPrefix: true,
        encode: true,
        skipNulls: true,
      },
    );
    http
      .get(`/api/v1/analytics/jobs${params}`)
      .then((response) => {
        setKeyValues(extractKeyValues(response.data as IKeyValueResponse));
      })
      .catch(console.error)
      .then(() => setIsLoading(false));
  }, [query, after, before]);

  useEffect(() => {
    memoizedGetKeyValues();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUrlWithParams = () => {
    if (selectedKeys.length > 0) {
      searchParams.set("selected_keys", selectedKeys.join(","));
    }
    searchParams.set("graph_type", graphType.value);
    searchParams.set("query", query);
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

  useEffect(() => {
    if (range !== "custom") {
      const dates = getRangeDates(range);
      setAfter(dates.after);
      setBefore(dates.before);
    }
  }, [range]);

  if (isLoading) {
    return <LoadingPageSection />;
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
      <Card>
        <CardBody>
          <Toolbar
            id="toolbar-select-jobs"
            clearAllFilters={() => {
              setRange(defaultRangeValue);
              setGraphType(graphTypes[0]);
              setRange(defaultRangeValue);
              setSelectedKeys([]);
              updateUrlWithParams();
            }}
            collapseListedFiltersBreakpoint="xl"
          >
            <ToolbarContent>
              <ToolbarGroup>
                <ToolbarItem variant="label" id="team-label-toolbar">
                  Query
                  <span style={{ color: t_global_text_color_required.value }}>
                    *
                  </span>
                </ToolbarItem>
                <ToolbarItem>
                  <TextInput
                    name="query"
                    id="input-query"
                    type="search"
                    onChange={(_event, val) => setQuery(val)}
                    value={query}
                    isRequired
                    style={{ width: 500 }}
                  />
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
                  <MultiSelectFilter
                    categoryName="Keys"
                    placeholder="Filter by keys"
                    items={keyValues === null ? [] : Object.keys(keyValues)}
                    itemsSelected={selectedKeys}
                    itemRemoved={(key) =>
                      setSelectedKeys(selectedKeys.filter((t) => t !== key))
                    }
                    onSelect={(type) => {
                      if (selectedKeys.indexOf(type) === -1) {
                        setSelectedKeys([...selectedKeys, type]);
                      } else {
                        setSelectedKeys(selectedKeys.filter((t) => t !== type));
                      }
                    }}
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <SelectFilter
                    item={graphType}
                    items={graphTypes}
                    categoryName="Graph type"
                    placeholder="Select graph type"
                    onSelect={(selectedGraphType) => {
                      console.log(selectedGraphType);
                      setGraphType(selectedGraphType as IGraphTypeItem);
                    }}
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <Button
                    variant="primary"
                    isDisabled={query === ""}
                    onClick={() => {
                      memoizedGetKeyValues();
                      updateUrlWithParams();
                    }}
                  >
                    Graph
                  </Button>
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarContent>
          </Toolbar>
        </CardBody>
      </Card>
      <div>
        {keyValues !== null &&
          Object.entries(keyValues)
            .filter(
              ([key, _]) =>
                selectedKeys.length === 0 || selectedKeys.indexOf(key) !== -1,
            )
            .map(([key, keyValue]) => (
              <Card className="pf-v6-u-mt-xs">
                <CardHeader>{key}</CardHeader>
                <CardBody>
                  {graphType.value === "scatter" && (
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
                  {graphType.value === "bar" && (
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
                  {graphType.value === "line" && (
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
        {keyValues !== null && Object.keys(keyValues).length === 0 && (
          <Card className="pf-v6-u-mt-xs">
            <CardBody>
              There is no key values corresponding to this query: {query}
            </CardBody>
          </Card>
        )}
      </div>
    </PageSection>
  );
}
