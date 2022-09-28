import {
  Button,
  Card,
  CardBody,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import MainPage from "pages/MainPage";
import { Breadcrumb } from "ui";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Bar,
} from "recharts";
import http from "services/http";
import TopicsFilter from "jobs/toolbar/TopicsFilter";
import qs from "qs";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showAPIError } from "alerts/alertsActions";
import RemotecisFilter from "jobs/toolbar/RemotecisFilter";
import { DateTime } from "luxon";
import TestNameFilter from "./TestNameFilter";

export function parseJunitComparisonFiltersFromSearch(
  search: string
): JunitComparisonFilter {
  const emptyFilters = {
    topic_1_id: null,
    topic_1_start_date: null,
    topic_1_end_date: null,
    remoteci_1_id: null,
    topic_1_baseline_computation: "mean",
    tags_1: [],
    topic_2_id: null,
    topic_2_start_date: null,
    topic_2_end_date: null,
    remoteci_2_id: null,
    topic_2_baseline_computation: "mean",
    tags_2: [],
    test_name: null,
  } as JunitComparisonFilter;
  if (!search) {
    return emptyFilters;
  }
  const filters = {
    ...emptyFilters,
    ...qs.parse(search, { ignoreQueryPrefix: true }),
  };
  return filters;
}

export function createJunitComparisonSearchFromFilters(
  filters: JunitComparisonFilter
) {
  if (filters.topic_1_id === null || filters.topic_2_id === null) {
    return "";
  }
  return qs.stringify(
    {
      ...filters,
    },
    {
      addQueryPrefix: true,
      encode: false,
      skipNulls: true,
    }
  );
}

interface JunitData {
  details: { testcase: string; value: number }[];
  intervals: [number, number][];
  values: number[];
}

export interface JunitComparisonFilter {
  topic_1_id: string | null;
  topic_1_start_date: string | null;
  topic_1_end_date: string | null;
  remoteci_1_id: string | null;
  topic_1_baseline_computation: "mean" | "median";
  tags_1: string[];
  topic_2_id: string | null;
  topic_2_start_date: string | null;
  topic_2_end_date: string | null;
  remoteci_2_id: string | null;
  topic_2_baseline_computation: "mean" | "median";
  tags_2: string[];
  test_name: string | null;
}

export default function JunitComparisonPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialValues = parseJunitComparisonFiltersFromSearch(location.search);
  const [values, setValues] = useState<JunitComparisonFilter>({
    ...initialValues,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<JunitData | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const newSearch = createJunitComparisonSearchFromFilters(values);
    navigate(`/analytics/junit_comparison${newSearch}`);
  }, [navigate, values]);

  function clearAllFilters() {
    setValues({ ...initialValues });
  }

  function setPartialValues<T extends keyof JunitComparisonFilter>(
    newValues: Record<T, JunitComparisonFilter[T]>
  ) {
    setValues({
      ...values,
      ...newValues,
    });
  }

  return (
    <MainPage
      title="Junit comparison"
      description="Compare 2 topics togethers and see how your tests behave in term of performance."
      Breadcrumb={
        <Breadcrumb
          links={[
            { to: "/", title: "DCI" },
            { to: "/analytics", title: "Analytics" },
            { title: "Junit comparison" },
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
                  <TestNameFilter
                    testName={values.test_name}
                    onClear={() =>
                      setPartialValues({
                        test_name: null,
                      })
                    }
                    onChange={(testName) =>
                      setPartialValues({
                        test_name: testName,
                      })
                    }
                  />
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarGroup>
                <ToolbarItem>
                  <ToggleGroup>
                    <ToggleGroupItem
                      text="Mean"
                      buttonId="topic_1_baseline_computation_mean"
                      isSelected={
                        values.topic_1_baseline_computation === "mean"
                      }
                      onChange={(isSelected) => {
                        const baselineComputation = isSelected
                          ? "mean"
                          : "median";
                        setPartialValues({
                          topic_1_baseline_computation: baselineComputation,
                          topic_2_baseline_computation: baselineComputation,
                        });
                      }}
                    />
                    <ToggleGroupItem
                      text="Median"
                      buttonId="topic_1_baseline_computation_median"
                      isSelected={
                        values.topic_1_baseline_computation === "median"
                      }
                      onChange={(isSelected) => {
                        const baselineComputation = isSelected
                          ? "median"
                          : "mean";
                        setPartialValues({
                          topic_1_baseline_computation: baselineComputation,
                          topic_2_baseline_computation: baselineComputation,
                        });
                      }}
                    />
                  </ToggleGroup>
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarContent>
            <ToolbarContent>
              <ToolbarGroup>
                <ToolbarItem>
                  <TopicsFilter
                    categoryName="Topic 1"
                    topic_id={values.topic_1_id}
                    onClear={() =>
                      setPartialValues({
                        topic_1_id: null,
                      })
                    }
                    onSelect={(topic) =>
                      setPartialValues({
                        topic_1_id: topic.id,
                        topic_1_start_date: DateTime.fromISO(
                          topic.created_at
                        ).toISODate(),
                        topic_1_end_date: DateTime.now().toISODate(),
                      })
                    }
                    placeholderText="Topic 1"
                  />
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarGroup>
                <ToolbarItem>
                  <RemotecisFilter
                    categoryName="Remoteci 1"
                    remoteci_id={values.remoteci_1_id}
                    onClear={() =>
                      setPartialValues({
                        remoteci_1_id: null,
                      })
                    }
                    onSelect={(remoteci) =>
                      setPartialValues({
                        remoteci_1_id: remoteci.id,
                      })
                    }
                    placeholderText="Remoteci 1"
                  />
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarContent>
            <ToolbarContent>
              <ToolbarGroup>
                <ToolbarItem>
                  <TopicsFilter
                    categoryName="Topic 2"
                    topic_id={values.topic_2_id}
                    onClear={() =>
                      setPartialValues({
                        topic_2_id: null,
                      })
                    }
                    onSelect={(topic) =>
                      setPartialValues({
                        topic_2_id: topic.id,
                        topic_2_start_date: DateTime.fromISO(
                          topic.created_at
                        ).toISODate(),
                        topic_2_end_date: DateTime.now().toISODate(),
                      })
                    }
                    placeholderText="Topic 2"
                  />
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarGroup>
                <ToolbarItem>
                  <RemotecisFilter
                    categoryName="Remoteci 2"
                    remoteci_id={values.remoteci_2_id}
                    onClear={() =>
                      setPartialValues({
                        remoteci_2_id: null,
                      })
                    }
                    onSelect={(remoteci) =>
                      setPartialValues({
                        remoteci_2_id: remoteci.id,
                      })
                    }
                    placeholderText="Remoteci 2"
                  />
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarContent>
          </Toolbar>

          <div className="p-md">
            <Button
              variant="primary"
              onClick={() => {
                setIsLoading(true);
                http
                  .post("/api/v1/analytics/junit_comparison", values)
                  .then((response) => {
                    setData(response.data as JunitData);
                  })
                  .catch((error) => {
                    dispatch(showAPIError(error));
                    return error;
                  })
                  .then(() => setIsLoading(false));
              }}
              isDisabled={isLoading}
            >
              Compare
            </Button>
          </div>
          {data && (
            <div style={{ width: "100%", minHeight: "400px", height: "400px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={data.values.map((v, i) => {
                    const [y1, y2] = data.intervals[i];
                    return { y: v, x: (y1 + y2) / 2 };
                  })}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="y" fill="#0066CC" name="# tests" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardBody>
      </Card>
    </MainPage>
  );
}
