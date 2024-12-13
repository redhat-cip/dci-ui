import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Grid,
  GridItem,
  DatePicker,
  TextInput,
  Button,
  ToggleGroup,
  ToggleGroupItem,
} from "@patternfly/react-core";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@patternfly/react-icons";
import RemoteciSelect from "jobs/toolbar/RemoteciSelect";
import TopicSelect from "jobs/toolbar/TopicSelect";
import { DateTime } from "luxon";
import { useState } from "react";
import { useSearchParams } from "react-router";
import ListInputWithChip from "ui/form/ListInputWithChip";
import type {
  JunitComparisonPayload,
  JunitComputationMode,
} from "./junitComparisonApi";

export function JunitComparisonForm({
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
    searchParams.get("remoteciId1"),
  );
  const [remoteciId2, setRemoteciId2] = useState(
    searchParams.get("remoteciId2"),
  );
  const [tags1, setTags1] = useState<string[]>(
    searchParams.get("tags1")?.split(",") || [],
  );
  const [tags2, setTags2] = useState<string[]>(
    searchParams.get("tags2")?.split(",") || [],
  );
  const [baselineComputation, setBaselineComputation] =
    useState<JunitComputationMode>(
      (searchParams.get("baselineComputation") ||
        "mean") as JunitComputationMode,
    );
  const [topic1StartDate, setTopic1StartDate] = useState(
    searchParams.get("topic1StartDate") ||
      DateTime.now().minus({ week: 1 }).toISODate(),
  );
  const [topic1EndDate, setTopic1EndDate] = useState(
    searchParams.get("topic1EndDate") || DateTime.now().toISODate(),
  );
  const [topic2StartDate, setTopic2StartDate] = useState(
    searchParams.get("topic2StartDate") ||
      DateTime.now().minus({ week: 1 }).toISODate(),
  );
  const [topic2EndDate, setTopic2EndDate] = useState(
    searchParams.get("topic2EndDate") || DateTime.now().toISODate(),
  );
  const [testName, setTestName] = useState(searchParams.get("testName"));

  return (
    <div>
      <Flex direction={{ default: "column", lg: "row" }}>
        <FlexItem flex={{ default: "flex_1" }}>
          <div>
            <h2 className="pf-v6-c-title pf-m-lg">Reference job filters</h2>
            <div className="pf-v6-c-description-list__text">
              All of the jobs corresponding to these filters will be used as the
              basis for the calculation.
            </div>
          </div>
          <div className="pf-v6-u-mt-md">
            <Form>
              <FormGroup label="Reference topic" isRequired fieldId="topic1">
                <TopicSelect
                  id={topicId1}
                  onClear={() => setTopicId1(null)}
                  onSelect={(topic) => setTopicId1(topic.id)}
                />
              </FormGroup>
              <FormGroup label="Remoteci" isRequired fieldId="remoteci1">
                <RemoteciSelect
                  id={remoteciId1}
                  onClear={() => setRemoteciId1(null)}
                  onSelect={(remoteci) => {
                    setRemoteciId1(remoteci.id);
                    if (remoteciId2 === null) {
                      setRemoteciId2(remoteci.id);
                    }
                  }}
                />
              </FormGroup>
              <Grid hasGutter>
                <GridItem span={3}>
                  <FormGroup label="From" fieldId="topic_1_start_date">
                    <DatePicker
                      id="topic_1_start_date"
                      value={topic1StartDate || ""}
                      placeholder="Jobs after"
                      onChange={(e, value) => setTopic1StartDate(value)}
                      appendTo={() => document.body}
                    />
                  </FormGroup>
                </GridItem>
                <GridItem span={3}>
                  <FormGroup label="To" fieldId="topic_1_end_date">
                    <DatePicker
                      id="topic_1_end_date"
                      value={topic1EndDate || ""}
                      placeholder="Jobs before"
                      onChange={(e, value) => setTopic1EndDate(value)}
                      appendTo={() => document.body}
                    />
                  </FormGroup>
                </GridItem>
                <GridItem span={6}>
                  <FormGroup label="Tags" fieldId="tags_1">
                    <ListInputWithChip
                      id="tags_1"
                      placeholder="Tags"
                      items={tags1}
                      setItems={(tags) => setTags1(tags)}
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
                  onChange={(_event, val) => setTestName(val)}
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
              icon={
                <>
                  <span className="pf-v6-u-display-none pf-v6-u-display-flex-on-lg">
                    <ArrowLeftIcon />
                    <ArrowRightIcon />
                  </span>
                  <span className="pf-v6-u-display-flex pf-v6-u-display-none-on-lg">
                    <ArrowUpIcon />
                    <ArrowDownIcon />
                  </span>
                </>
              }
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
            />
          </div>
        </FlexItem>
        <FlexItem flex={{ default: "flex_1" }}>
          <div>
            <h2 className="pf-v6-c-title pf-m-lg">Target job filters</h2>
            <div className="pf-v6-c-description-list__text">
              The test cases of the target jobs will be compared to the test
              cases of the reference jobs.
            </div>
          </div>
          <div className="pf-v6-u-mt-md">
            <Form>
              <FormGroup label="Target topic" isRequired fieldId="topic2">
                <TopicSelect
                  id={topicId2}
                  onClear={() => setTopicId2(null)}
                  onSelect={(topic) => setTopicId2(topic.id)}
                />
              </FormGroup>
              <FormGroup label="Remoteci" isRequired fieldId="remoteci1">
                <RemoteciSelect
                  id={remoteciId2}
                  onClear={() => setRemoteciId2(null)}
                  onSelect={(remoteci) => {
                    setRemoteciId2(remoteci.id);
                    if (remoteciId1 === null) {
                      setRemoteciId1(remoteci.id);
                    }
                  }}
                />
              </FormGroup>
              <Grid hasGutter>
                <GridItem span={3}>
                  <FormGroup label="From" fieldId="topic_2_start_date">
                    <DatePicker
                      id="topic_2_start_date"
                      value={topic2StartDate || ""}
                      placeholder="Jobs after"
                      onChange={(e, value) => setTopic2StartDate(value)}
                      appendTo={() => document.body}
                    />
                  </FormGroup>
                </GridItem>
                <GridItem span={3}>
                  <FormGroup label="To" fieldId="topic_2_end_date">
                    <DatePicker
                      id="topic_2_end_date"
                      value={topic2EndDate || ""}
                      placeholder="Jobs before"
                      onChange={(e, value) => setTopic2EndDate(value)}
                      appendTo={() => document.body}
                    />
                  </FormGroup>
                </GridItem>
                <GridItem span={6}>
                  <FormGroup label="Tags" fieldId="tags_2">
                    <ListInputWithChip
                      id="tags_2"
                      placeholder="Tags"
                      items={tags2}
                      setItems={(tags) => setTags2(tags)}
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
                    onChange={(_event, isSelected) => {
                      setBaselineComputation(isSelected ? "mean" : "median");
                    }}
                  />
                  <ToggleGroupItem
                    text="Median"
                    buttonId="baseline_computation_median_button"
                    isSelected={baselineComputation === "median"}
                    onChange={(_event, isSelected) => {
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
          remoteciId2 === null ||
          topic1StartDate === null ||
          topic1EndDate === null ||
          topic2StartDate === null ||
          topic2EndDate === null
        }
        className="pf-v6-u-mt-xl"
        onClick={() => {
          if (
            testName &&
            topicId1 &&
            topicId2 &&
            remoteciId1 &&
            remoteciId2 &&
            topic1StartDate &&
            topic1EndDate &&
            topic2StartDate &&
            topic2EndDate
          ) {
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
