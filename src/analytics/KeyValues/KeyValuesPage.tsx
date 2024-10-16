import {
  Bullseye,
  Button,
  Card,
  CardBody,
  CardHeader,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { BlinkLogo, Breadcrumb } from "ui";
import MainPage from "pages/MainPage";
import { global_palette_red_100 } from "@patternfly/react-tokens";
import { getRangeDates } from "services/date";
import { useEffect, useState } from "react";
import { RangeOptionValue } from "types";
import RangeToolbarFilter from "ui/form/RangeToolbarFilter";
import http from "services/http";
import qs from "qs";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DateTime } from "luxon";
import MultiSelectFilter from "./MultiSelectFilter";
import { useSearchParams } from "react-router-dom";

interface IKeyValue {
  job_id: string;
  key: string;
  value: number;
}

interface IKeyValueResponse {
  _shards: {
    failed: number;
    skipped: number;
    successful: number;
    total: number;
  };
  hits: {
    hits: [
      {
        _id: string;
        _index: string;
        _score: number | null;
        _source: {
          id: string;
          created_at: string;
          keys_values: IKeyValue[];
        };
        _type: string;
        sort: string[];
      },
    ];
    max_score: number | null;
    total: {
      relation: string;
      value: number;
    };
  };
  timed_out: boolean;
  took: number;
}

interface IGraphKeyValue {
  created_at: number;
  value: number;
  job_id: string;
  key: string;
}

interface IGraphKeyValues {
  [key: string]: IGraphKeyValue[];
}

export default function KeyValuesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [keyValues, setKeyValues] = useState<IGraphKeyValues | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
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

  const updateUrlWithParams = () => {
    searchParams.set("selected_keys", selectedKeys.join(","));
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

  return (
    <MainPage
      title="Key Values"
      description="Graph the key values of your jobs"
      Breadcrumb={
        <Breadcrumb
          links={[
            { to: "/", title: "DCI" },
            { to: "/analytics", title: "Analytics" },
            { title: "Key Values" },
          ]}
        />
      }
    >
      <Card>
        <CardBody>
          <Toolbar
            id="toolbar-select-jobs"
            clearAllFilters={() => {
              setRange(defaultRangeValue);
            }}
            collapseListedFiltersBreakpoint="xl"
          >
            <ToolbarContent>
              <ToolbarItem variant="label" id="team-label-toolbar">
                Query{" "}
                <span style={{ color: global_palette_red_100.value }}>*</span>
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

              {keyValues !== null && (
                <>
                  <ToolbarItem variant="label" id="range-label-toolbar">
                    Keys
                  </ToolbarItem>
                  <ToolbarItem>
                    <MultiSelectFilter
                      keys={Object.keys(keyValues)}
                      keysSelected={selectedKeys}
                      keyRemoved={(key) =>
                        setSelectedKeys(selectedKeys.filter((t) => t !== key))
                      }
                      onSelect={(type) => {
                        if (selectedKeys.indexOf(type) === -1) {
                          setSelectedKeys([...selectedKeys, type]);
                        } else {
                          setSelectedKeys(
                            selectedKeys.filter((t) => t !== type),
                          );
                        }
                      }}
                    />
                  </ToolbarItem>
                </>
              )}
              <ToolbarItem>
                <Button
                  variant="primary"
                  isDisabled={query === ""}
                  onClick={() => {
                    setIsLoading(true);
                    const params = qs.stringify(
                      {
                        query: query,
                        offset: 0,
                        limit: 200,
                        sort: "-created_at",
                        includes: "id,created_at,keys_values",
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
                        const data = response.data as IKeyValueResponse;
                        setKeyValues(
                          data.hits.hits.reduce((acc, hit) => {
                            const created_at = DateTime.fromISO(
                              hit._source.created_at,
                            ).toMillis();
                            const keyValues = hit._source.keys_values;
                            for (let i = 0; i < keyValues.length; i++) {
                              const keyValue = keyValues[i];
                              const key = keyValue.key;
                              const value = keyValue.value;
                              const job_id = keyValue.job_id;
                              const tmpKeyValues = acc[key] ?? [];
                              tmpKeyValues.push({
                                created_at,
                                value,
                                job_id,
                                key,
                              });
                              acc[key] = tmpKeyValues;
                            }
                            return acc;
                          }, {} as IGraphKeyValues),
                        );
                      })
                      .catch(console.error)
                      .then(() => setIsLoading(false));
                    updateUrlWithParams();
                  }}
                >
                  Graph
                </Button>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
        </CardBody>
      </Card>
      {isLoading ? (
        <Card className="pf-v5-u-mt-xs">
          <CardBody>
            <Bullseye>
              <BlinkLogo />
            </Bullseye>
          </CardBody>
        </Card>
      ) : (
        <div>
          {keyValues !== null &&
            Object.entries(keyValues)
              .filter(
                ([key, _]) =>
                  selectedKeys.length === 0 || selectedKeys.indexOf(key) !== -1,
              )
              .map(([key, keyValue]) => (
                <Card className="pf-v5-u-mt-xs">
                  <CardHeader>{key}</CardHeader>
                  <CardBody>
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
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                        <Scatter name={key} data={keyValue} fill="#3E8635" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
              ))}
        </div>
      )}
    </MainPage>
  );
}
