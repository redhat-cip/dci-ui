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
  Grid,
  GridItem,
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
import { TopicSelect } from "jobs/toolbar/TopicFilter";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showAPIError, showError } from "alerts/alertsActions";
import { RemoteciSelect } from "jobs/toolbar/RemoteciFilter";
import { DateTime } from "luxon";
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
import { TagsInput } from "jobs/toolbar/TagsFilter";
import { useSearchParams } from "react-router-dom";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [topicId1, setTopicId1] = useState(searchParams.get("topicId1"));
  const [topicId2, setTopicId2] = useState(searchParams.get("topicId2"));
  const [remoteciId1, setRemoteciId1] = useState(
    searchParams.get("remoteciId1")
  );
  const [remoteciId2, setRemoteciId2] = useState(
    searchParams.get("remoteciId2")
  );
  const [tags1, setTags1] = useState<string[]>(
    searchParams.get("tags1")?.split(",") || []
  );
  const [tags2, setTags2] = useState<string[]>(
    searchParams.get("tags2")?.split(",") || []
  );
  const [baselineComputation, setBaselineComputation] =
    useState<JunitComputationMode>(
      (searchParams.get("baselineComputation") ||
        "mean") as JunitComputationMode
    );
  const [topic1StartDate, setTopic1StartDate] = useState(
    searchParams.get("topic1StartDate") ||
      DateTime.now().minus({ week: 1 }).toISODate()
  );
  const [topic1EndDate, setTopic1EndDate] = useState(
    searchParams.get("topic1EndDate") || DateTime.now().toISODate()
  );
  const [topic2StartDate, setTopic2StartDate] = useState(
    searchParams.get("topic2StartDate") ||
      DateTime.now().minus({ week: 1 }).toISODate()
  );
  const [topic2EndDate, setTopic2EndDate] = useState(
    searchParams.get("topic2EndDate") || DateTime.now().toISODate()
  );
  const [testName, setTestName] = useState(searchParams.get("testName"));

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
                  topicId={topicId1}
                  onClear={() => setTopicId1(null)}
                  onSelect={setTopicId1}
                />
              </FormGroup>
              <FormGroup label="Remoteci" isRequired fieldId="remoteci1">
                <RemoteciSelect
                  remoteciId={remoteciId1}
                  onClear={() => setRemoteciId1(null)}
                  onSelect={(remoteciId) => {
                    setRemoteciId1(remoteciId);
                    if (remoteciId2 === null) {
                      setRemoteciId2(remoteciId);
                    }
                  }}
                />
              </FormGroup>
              <Grid hasGutter>
                <GridItem span={3}>
                  <FormGroup label="From" fieldId="topic_1_start_date">
                    <DatePicker
                      id="topic_1_start_date"
                      value={topic1StartDate}
                      placeholder="Jobs after"
                      onChange={setTopic1StartDate}
                      style={{ width: "100%" }}
                    />
                  </FormGroup>
                </GridItem>
                <GridItem span={3}>
                  <FormGroup label="To" fieldId="topic_1_end_date">
                    <DatePicker
                      id="topic_1_end_date"
                      value={topic1EndDate}
                      placeholder="Jobs before"
                      onChange={setTopic1EndDate}
                      style={{ width: "100%" }}
                    />
                  </FormGroup>
                </GridItem>
                <GridItem span={6}>
                  <FormGroup label="Tags" fieldId="tags_1">
                    <TagsInput
                      id="tags_1"
                      tags={tags1}
                      setTags={(tags) => setTags1(tags)}
                    />
                  </FormGroup>
                </GridItem>
              </Grid>
              <FormGroup label="Test name" isRequired fieldId="test_name">
                <TextInput
                  isRequired
                  type="text"
                  id="test_name"
                  name="test_name"
                  value={testName || ""}
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
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Button
              variant="plain"
              aria-label="Action"
              onClick={() => {
                const tmpTopic2 = topicId2;
                const tmpRemoteci2 = remoteciId2;
                const tmpTopic2StartDate = topic2StartDate;
                const tmpTopic2EndDate = topic2EndDate;
                const tmpTags2 = tags2;
                setTopicId2(topicId1);
                setRemoteciId2(remoteciId1);
                setTopic2StartDate(topic1StartDate);
                setTopic2EndDate(topic1EndDate);
                setTags2(tags1);
                setTopicId1(tmpTopic2);
                setRemoteciId1(tmpRemoteci2);
                setTopic1StartDate(tmpTopic2StartDate);
                setTopic1EndDate(tmpTopic2EndDate);
                setTags1(tmpTags2);
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
                  topicId={topicId2}
                  onClear={() => setTopicId2(null)}
                  onSelect={setTopicId2}
                />
              </FormGroup>
              <FormGroup label="Remoteci" isRequired fieldId="remoteci1">
                <RemoteciSelect
                  remoteciId={remoteciId2}
                  onClear={() => setRemoteciId2(null)}
                  onSelect={(remoteciId) => {
                    setRemoteciId2(remoteciId);
                    if (remoteciId1 === null) {
                      setRemoteciId1(remoteciId);
                    }
                  }}
                />
              </FormGroup>
              <Grid hasGutter>
                <GridItem span={3}>
                  <FormGroup label="From" fieldId="topic_2_start_date">
                    <DatePicker
                      id="topic_2_start_date"
                      value={topic2StartDate}
                      placeholder="Jobs after"
                      onChange={setTopic2StartDate}
                      style={{ width: "100%" }}
                    />
                  </FormGroup>
                </GridItem>
                <GridItem span={3}>
                  <FormGroup label="To" fieldId="topic_2_end_date">
                    <DatePicker
                      id="topic_2_end_date"
                      value={topic2EndDate}
                      placeholder="Jobs before"
                      onChange={setTopic2EndDate}
                      style={{ width: "100%" }}
                    />
                  </FormGroup>
                </GridItem>
                <GridItem span={6}>
                  <FormGroup label="Tags" fieldId="tags_2">
                    <TagsInput
                      id="tags_2"
                      tags={tags2}
                      setTags={(tags) => setTags2(tags)}
                    />
                  </FormGroup>
                </GridItem>
              </Grid>
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
          topicId1 === null ||
          topicId2 === null ||
          remoteciId1 === null ||
          remoteciId2 === null
        }
        className="pf-u-mt-xl"
        onClick={() => {
          if (testName && topicId1 && topicId2 && remoteciId1 && remoteciId2) {
            searchParams.set("topicId1", topicId1);
            searchParams.set("topicId2", topicId2);
            searchParams.set("remoteciId1", remoteciId1);
            searchParams.set("remoteciId2", remoteciId2);
            searchParams.set("testName", testName);
            searchParams.set("baselineComputation", baselineComputation);
            searchParams.set("topic1StartDate", topic1StartDate);
            searchParams.set("topic1EndDate", topic1EndDate);
            searchParams.set("topic2StartDate", topic2StartDate);
            searchParams.set("topic2EndDate", topic2EndDate);
            if (tags1.length > 0) {
              searchParams.set("tags1", tags1.join(","));
            } else {
              searchParams.delete("tags1");
            }
            if (tags2.length > 0) {
              searchParams.set("tags2", tags2.join(","));
            } else {
              searchParams.delete("tags2");
            }
            setSearchParams(searchParams, { replace: true });
            onSubmit({
              topic_1_id: topicId1,
              topic_1_start_date: topic1StartDate,
              topic_1_end_date: topic1EndDate,
              remoteci_1_id: remoteciId1,
              topic_1_baseline_computation: baselineComputation,
              tags_1: tags1,
              topic_2_id: topicId2,
              topic_2_start_date: topic2StartDate,
              topic_2_end_date: topic2EndDate,
              remoteci_2_id: remoteciId2,
              topic_2_baseline_computation: baselineComputation,
              tags_2: tags2,
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
  len_jobs_topic_1: number;
  len_jobs_topic_2: number;
}

export default function JunitComparisonPage() {
  const [testLowerBoundary, setTestLowerBoundary] = useState<number | null>(
    null
  );
  const [testUpperBoundary, setTestUpperBoundary] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<JunitData | null>(null);

  const dispatch = useDispatch();
  const interval = 10;
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
                <br />
                We compared {data.len_jobs_topic_1} reference jobs with{" "}
                {data.len_jobs_topic_2} target jobs.
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
                            const lowerBoundary =
                              data.intervals[0] + interval / 2;
                            const upperBoundary =
                              data.intervals[data.intervals.length - 1] -
                              interval / 2;
                            if (range <= lowerBoundary) {
                              message += `under ${lowerBoundary}%`;
                            } else if (range >= upperBoundary) {
                              message += `over ${upperBoundary}%`;
                            } else {
                              message += `between ${
                                range - interval / 2
                              }% and ${range + interval / 2}%`;
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
                          const lowerBoundary =
                            data.intervals[index] - interval / 2;
                          const upperBoundary =
                            data.intervals[index] + interval / 2;
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
                <div>
                  {testLowerBoundary === null
                    ? testUpperBoundary === null
                      ? "All testcases"
                      : `Testcases under ${testUpperBoundary}%`
                    : testUpperBoundary === null
                    ? `Testcases over ${testLowerBoundary}%`
                    : `Testcases between ${testLowerBoundary}% and ${testUpperBoundary}%`}
                  {testLowerBoundary !== null && testUpperBoundary !== null && (
                    <small>
                      <Button
                        variant="link"
                        onClick={() => {
                          setTestLowerBoundary(null);
                          setTestUpperBoundary(null);
                        }}
                      >
                        (reset)
                      </Button>
                    </small>
                  )}
                </div>
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
