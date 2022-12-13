import {
  Bullseye,
  Button,
  Card,
  CardBody,
  CardTitle,
  DatePicker,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
  ToggleGroup,
  ToggleGroupItem,
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
  Cell,
} from "recharts";
import http from "services/http";
import { TopicSelect } from "jobs/toolbar/TopicsFilter";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showAPIError, showError } from "alerts/alertsActions";
import { RemoteciSelect } from "jobs/toolbar/RemotecisFilter";
import { DateTime } from "luxon";
import { IRemoteci, ITopic } from "types";
import { round } from "lodash";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@patternfly/react-icons";
import {
  global_danger_color_100,
  global_primary_color_100,
} from "@patternfly/react-tokens";

type JunitComputationMode = "mean" | "median";

interface JunitComparisonPayload {
  topic_1_id: string | null;
  topic_1_start_date: string | null;
  topic_1_end_date: string | null;
  remoteci_1_id: string | null;
  topic_1_baseline_computation: JunitComputationMode;
  tags_1: string[];
  topic_2_id: string | null;
  topic_2_start_date: string | null;
  topic_2_end_date: string | null;
  remoteci_2_id: string | null;
  topic_2_baseline_computation: JunitComputationMode;
  tags_2: string[];
  test_name: string | null;
}

function JunitComparisonForm({
  isLoading,
  onSubmit,
}: {
  isLoading: boolean;
  onSubmit: (form: JunitComparisonPayload) => void;
}) {
  const [topic1, setTopic1] = useState<ITopic | null>(null);
  const [topic2, setTopic2] = useState<ITopic | null>(null);
  const [remoteci1, setRemoteci1] = useState<IRemoteci | null>(null);
  const [remoteci2, setRemoteci2] = useState<IRemoteci | null>(null);
  const [baselineComputation, setBaselineComputation] =
    useState<JunitComputationMode>("mean");
  const [topic1StartDate, setTopic1StartDate] = useState(
    DateTime.now().minus({ week: 1 }).toISODate()
  );
  const [topic1EndDate, setTopic1EndDate] = useState(
    DateTime.now().toISODate()
  );
  const [topic2StartDate, setTopic2StartDate] = useState(
    DateTime.now().minus({ week: 1 }).toISODate()
  );
  const [topic2EndDate, setTopic2EndDate] = useState(
    DateTime.now().toISODate()
  );
  const [testName, setTestName] = useState("");

  return (
    <div>
      <Flex direction={{ default: "column", lg: "row" }}>
        <FlexItem flex={{ default: "flex_1" }}>
          <div>
            <h2 className="pf-c-title pf-m-lg">Reference job filters</h2>
            <div className="pf-c-description-list__text">
              All of the jobs corresponding to these filters will be used as the
              basis for the calculation.
            </div>
          </div>
          <div className="pf-u-mt-md">
            <Form>
              <FormGroup label="Reference topic" isRequired fieldId="topic1">
                <TopicSelect
                  topic={topic1}
                  onClear={() => setTopic1(null)}
                  onSelect={setTopic1}
                />
              </FormGroup>
              <FormGroup label="Remoteci" isRequired fieldId="remoteci1">
                <RemoteciSelect
                  remoteci={remoteci1}
                  onClear={() => setRemoteci1(null)}
                  onSelect={(remoteci) => {
                    setRemoteci1(remoteci);
                    if (remoteci2 === null) {
                      setRemoteci2(remoteci);
                    }
                  }}
                />
              </FormGroup>
              <FormGroup label="Dates" fieldId="topic_1_start_date">
                <div className="pf-u-display-flex pf-u-justify-content-space-between">
                  <DatePicker
                    id="topic_1_start_date"
                    value={topic1StartDate}
                    placeholder="Jobs after"
                    onChange={setTopic1StartDate}
                  />
                  <DatePicker
                    id="topic_1_end_date"
                    value={topic1EndDate}
                    placeholder="Jobs before"
                    onChange={setTopic1EndDate}
                  />
                </div>
              </FormGroup>
              <FormGroup label="Test name" isRequired fieldId="test_name">
                <TextInput
                  isRequired
                  type="text"
                  id="test_name"
                  name="test_name"
                  value={testName}
                  onChange={setTestName}
                />
              </FormGroup>
            </Form>
          </div>
        </FlexItem>
        <FlexItem alignSelf={{ default: "alignSelfStretch" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Button
              variant="plain"
              aria-label="Action"
              onClick={() => {
                const tmpTopic2 = topic2;
                const tmpRemoteci2 = remoteci2;
                const tmpTopic2StartDate = topic2StartDate;
                const tmpTopic2EndDate = topic2EndDate;
                setTopic2(topic1);
                setRemoteci2(remoteci1);
                setTopic2StartDate(topic1StartDate);
                setTopic2EndDate(topic1EndDate);
                setTopic1(tmpTopic2);
                setRemoteci1(tmpRemoteci2);
                setTopic1StartDate(tmpTopic2StartDate);
                setTopic1EndDate(tmpTopic2EndDate);
              }}
            >
              <span className="pf-u-display-none pf-u-display-flex-on-lg">
                <ArrowLeftIcon />
                <ArrowRightIcon />
              </span>
              <span className="pf-u-display-flex pf-u-display-none-on-lg">
                <ArrowUpIcon />
                <ArrowDownIcon />
              </span>
            </Button>
          </div>
        </FlexItem>
        <FlexItem flex={{ default: "flex_1" }}>
          <div>
            <h2 className="pf-c-title pf-m-lg">Target job filters</h2>
            <div className="pf-c-description-list__text">
              The test cases of the target jobs will be compared to the test
              cases of the reference jobs.
            </div>
          </div>
          <div className="pf-u-mt-md">
            <Form>
              <FormGroup label="Target topic" isRequired fieldId="topic2">
                <TopicSelect
                  topic={topic2}
                  onClear={() => setTopic2(null)}
                  onSelect={setTopic2}
                />
              </FormGroup>
              <FormGroup label="Remoteci" isRequired fieldId="remoteci1">
                <RemoteciSelect
                  remoteci={remoteci2}
                  onClear={() => setRemoteci2(null)}
                  onSelect={(remoteci) => {
                    setRemoteci2(remoteci);
                    if (remoteci1 === null) {
                      setRemoteci1(remoteci);
                    }
                  }}
                />
              </FormGroup>
              <FormGroup label="Dates" fieldId="topic_2_start_date">
                <div className="pf-u-display-flex pf-u-justify-content-space-between">
                  <DatePicker
                    id="topic_2_start_date"
                    value={topic2StartDate}
                    placeholder="Jobs after"
                    onChange={setTopic2StartDate}
                  />
                  <DatePicker
                    id="topic_2_end_date"
                    value={topic2EndDate}
                    placeholder="Jobs before"
                    onChange={setTopic2EndDate}
                  />
                </div>
              </FormGroup>
              <FormGroup
                label="Calculation mode"
                fieldId="baseline_computation"
              >
                <ToggleGroup>
                  <ToggleGroupItem
                    text="Mean"
                    buttonId="baseline_computation_mean_button"
                    isSelected={baselineComputation === "mean"}
                    onChange={(isSelected) => {
                      setBaselineComputation(isSelected ? "mean" : "median");
                    }}
                  />
                  <ToggleGroupItem
                    text="Median"
                    buttonId="baseline_computation_median_button"
                    isSelected={baselineComputation === "median"}
                    onChange={(isSelected) => {
                      setBaselineComputation(isSelected ? "median" : "mean");
                    }}
                  />
                </ToggleGroup>
              </FormGroup>
            </Form>
          </div>
        </FlexItem>
      </Flex>
      <Button
        isLoading={isLoading}
        isDisabled={
          testName === "" ||
          topic1 === null ||
          topic2 === null ||
          remoteci1 === null ||
          remoteci2 === null
        }
        className="pf-u-mt-xl"
        onClick={() => {
          if (testName && topic1 && topic2 && remoteci1 && remoteci2) {
            onSubmit({
              topic_1_id: topic1.id,
              topic_1_start_date: topic1StartDate,
              topic_1_end_date: topic1EndDate,
              remoteci_1_id: remoteci1.id,
              topic_1_baseline_computation: baselineComputation,
              tags_1: [],
              topic_2_id: topic2.id,
              topic_2_start_date: topic2StartDate,
              topic_2_end_date: topic2EndDate,
              remoteci_2_id: remoteci2.id,
              topic_2_baseline_computation: baselineComputation,
              tags_2: [],
              test_name: testName,
            });
          }
        }}
      >
        {isLoading ? "Loading" : "Compare junits"}
      </Button>
    </div>
  );
}

interface JunitData {
  details: { testcase: string; value: number }[];
  intervals: number[];
  values: number[];
}

export default function JunitComparisonPage() {
  const [testLowerBoundary, setTestLowerBoundary] = useState<number | null>(10);
  const [testUpperBoundary, setTestUpperBoundary] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<JunitData | null>(null);

  const dispatch = useDispatch();

  return (
    <MainPage
      title="Junit comparison"
      description=""
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
          <JunitComparisonForm
            isLoading={isLoading}
            onSubmit={(values) => {
              setData(null);
              setIsLoading(true);
              http
                .post("/api/v1/analytics/junit_comparison", values)
                .then((response) => {
                  if (typeof response.data === "object") {
                    setData(response.data as JunitData);
                  } else {
                    dispatch(
                      showError("JSON returned by the API is not valid")
                    );
                  }
                })
                .catch((error) => {
                  dispatch(showAPIError(error));
                  return error;
                })
                .then(() => setIsLoading(false));
            }}
          />
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

      {data && (
        <>
          <div className="mt-md">
            <Card>
              <CardTitle>
                Nb of tests per percentage deviation range between reference
                topic and target topic.
              </CardTitle>
              <CardBody>
                <div
                  style={{ width: "100%", minHeight: "400px", height: "400px" }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={data.values.map((v, i) => ({
                        y: v,
                        x: data.intervals[i],
                        i,
                      }))}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 15,
                      }}
                      barCategoryGap="10%"
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
                            let message = `${payload[0].value} test${
                              (payload[0].value as number) > 1 ? "s" : ""
                            } with percentage deviation is `;
                            if (range <= -95) {
                              message += "under 90%";
                            } else if (range >= 95) {
                              message += "over 90%";
                            } else {
                              message += `between ${range - 5}% and ${
                                range + 5
                              }%`;
                            }
                            return (
                              <div
                                style={{
                                  backgroundColor: "white",
                                }}
                                className="p-sm"
                              >
                                <p className="desc">{message}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="y"
                        fill="#0066CC"
                        name="# tests"
                        onClick={(d, index) => {
                          const lowerBoundary = data.intervals[index] - 5;
                          const upperBoundary = data.intervals[index] + 5;
                          const isFirstElement = index === 0;
                          const isLastElement =
                            index === data.values.length - 1;
                          if (isFirstElement) {
                            setTestLowerBoundary(null);
                            setTestUpperBoundary(upperBoundary);
                          } else if (isLastElement) {
                            setTestLowerBoundary(lowerBoundary);
                            setTestUpperBoundary(null);
                          } else {
                            setTestLowerBoundary(lowerBoundary);
                            setTestUpperBoundary(upperBoundary);
                          }
                        }}
                      >
                        {data.values.map((value, index) => (
                          <Cell
                            cursor="pointer"
                            fill={
                              data.intervals[index] > 0
                                ? global_danger_color_100.value
                                : global_primary_color_100.value
                            }
                            key={`cell-${index}`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="mt-md">
            <Card>
              <CardTitle>
                {testLowerBoundary === null
                  ? `Testcases under ${testUpperBoundary}%`
                  : testUpperBoundary === null
                  ? `Testcases over ${testLowerBoundary}%`
                  : `Testcases between ${testLowerBoundary}% and ${testUpperBoundary}%`}
              </CardTitle>
              <CardBody>
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
                      .filter((detail) =>
                        testLowerBoundary
                          ? detail.value > testLowerBoundary
                          : true
                      )
                      .filter((detail) =>
                        testUpperBoundary
                          ? detail.value < testUpperBoundary
                          : true
                      )
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
