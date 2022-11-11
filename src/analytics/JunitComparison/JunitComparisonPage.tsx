import {
  Bullseye,
  Button,
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  InputGroup,
  InputGroupText,
  InputGroupTextVariant,
  Text,
  TextInput,
  TextVariants,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import MainPage from "pages/MainPage";
import { BlinkLogo, Breadcrumb } from "ui";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Bar,
  Label,
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
import { ITopic } from "types";
import { round } from "lodash";

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
  const [topic1, setTopic1] = useState<ITopic | null>(null);
  const [topic2, setTopic2] = useState<ITopic | null>(null);
  const [thresholdPercentage, setThresholdPercentage] = useState(10);
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
                    onClear={() => {
                      setTopic1(null);
                      return setPartialValues({
                        topic_1_id: null,
                      });
                    }}
                    onSelect={(topic) => {
                      setTopic1(topic);
                      return setPartialValues({
                        topic_1_id: topic.id,
                        topic_1_start_date: DateTime.fromISO(
                          topic.created_at
                        ).toISODate(),
                        topic_1_end_date: DateTime.now().toISODate(),
                      });
                    }}
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
                    onClear={() => {
                      setTopic2(null);
                      return setPartialValues({
                        topic_2_id: null,
                      });
                    }}
                    onSelect={(topic) => {
                      setTopic2(topic);
                      return setPartialValues({
                        topic_2_id: topic.id,
                        topic_2_start_date: DateTime.fromISO(
                          topic.created_at
                        ).toISODate(),
                        topic_2_end_date: DateTime.now().toISODate(),
                      });
                    }}
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
                setData(null);
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
              isDisabled={
                isLoading ||
                values.test_name === null ||
                values.topic_1_id === null ||
                values.topic_2_id === null ||
                values.remoteci_1_id === null ||
                values.remoteci_2_id === null
              }
            >
              Compare
            </Button>
          </div>
        </CardBody>
      </Card>

      {isLoading && (
        <div className="mt-md">
          <Card>
            <CardBody>
              <Bullseye>
                <BlinkLogo />
              </Bullseye>
            </CardBody>
          </Card>
        </div>
      )}

      {data && topic1 && topic2 && (
        <>
          <div className="mt-md">
            <Card>
              <CardTitle>
                Nb of tests per percentage deviation range between {topic2.name}{" "}
                and {topic1.name}
              </CardTitle>
              <CardBody>
                <div
                  style={{ width: "100%", minHeight: "400px", height: "400px" }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={data.values.map((v, i) => {
                        const [y1, y2] = data.intervals[i];
                        return { y: v, x: (y1 + y2) / 2, i };
                      })}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 15,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="x">
                        <Label
                          value="Percentage deviation ranges"
                          offset={-10}
                          position="insideBottom"
                        />
                      </XAxis>
                      <YAxis>
                        <Label
                          value="Number of tests"
                          angle={-90}
                          position="insideLeft"
                        />
                      </YAxis>
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const range = data.intervals[payload[0].payload.i];

                            return (
                              <div
                                style={{
                                  backgroundColor: "white",
                                }}
                                className="p-sm"
                              >
                                <p className="desc">
                                  {`${payload[0].value} test${
                                    (payload[0].value as number) > 1 ? "s" : ""
                                  } with percentage deviation is between ${
                                    range[0]
                                  }% and ${range[1]}%`}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      {/* <Tooltip formatter={(value:string,name:string, props:any)=>{
                      console.log(value,name,props)
                      return ["test", "Nb of tests"]
                    }} /> */}
                      <Bar dataKey="y" fill="#0066CC" name="# tests" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="mt-md">
            <Card>
              <CardBody>
                <Grid>
                  <GridItem span={11}>
                    <Text component={TextVariants.p}>
                      {`We compared ${data.details.length} testcases between ${topic1.name} and ${topic2.name}.`}
                    </Text>
                    <Text component={TextVariants.p}>
                      {`A positive percentage indicates that on average, the test is less good on ${topic2.name} compared to ${topic1.name}.`}
                    </Text>
                  </GridItem>
                  <GridItem span={1}>
                    <InputGroup>
                      <TextInput
                        name="percentage-threshold"
                        id="percentage-threshold"
                        type="text"
                        aria-label="percentage"
                        value={thresholdPercentage.toString()}
                        onChange={(e) => {
                          const thresholdPercentage = Number(e);
                          if (!isNaN(thresholdPercentage)) {
                            setThresholdPercentage(thresholdPercentage);
                          }
                        }}
                      />
                      <InputGroupText
                        id="plain-example"
                        variant={InputGroupTextVariant.plain}
                      >
                        %
                      </InputGroupText>
                    </InputGroup>
                  </GridItem>
                </Grid>

                <table
                  className="pf-c-table pf-m-compact"
                  role="grid"
                  aria-label="junit testcase details"
                >
                  <thead>
                    <tr role="row">
                      <th role="columnheader" scope="col">
                        Testcase name
                      </th>
                      <th
                        role="columnheader"
                        scope="col"
                        style={{ textAlign: "center" }}
                      >
                        <span>% of deviation</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.details
                      .filter((detail) => detail.value > thresholdPercentage)
                      .map((detail) => (
                        <tr>
                          <td>{detail.testcase}</td>
                          <td style={{ textAlign: "center" }}>
                            <span title={detail.value.toString()}>
                              {round(detail.value, 2)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </MainPage>
  );
}
