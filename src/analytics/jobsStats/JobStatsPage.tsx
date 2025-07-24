import {
  Card,
  CardBody,
  Content,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Gallery,
  PageSection,
  Skeleton,
  TextInput,
} from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import { createRef, useEffect, useMemo, useState } from "react";
import { useLazyGetAnalyticJobsQuery } from "analytics/analyticsApi";
import AnalyticsToolbar from "analytics/toolbar/AnalyticsToolbar";
import { groupByKeys, groupByKeysWithLabel } from "types";
import type {
  AnalyticsToolbarSearch,
  IAnalyticsJob,
  IGenericAnalyticsData,
} from "types";
import Select from "ui/form/Select";
import {
  getJobStats,
  sliceByKeys,
  sliceByKeysWithLabel,
  type IGroupByKey,
  type IStat,
  type ISliceByKey,
} from "./jobStats";
import JobStatChart from "./JobStatChart";
import ScreeshotNodeButton from "ui/ScreenshotNodeButton";
import { sort } from "services/sort";
import { useSearchParams } from "react-router";

function JobStatsGraphs({
  data,
  ...props
}: {
  data: IAnalyticsJob[];
  [key: string]: any;
}) {
  const graphRef = createRef<HTMLDivElement>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [groupByKey, setGroupByKey] = useState<IGroupByKey>(
    (searchParams.get("groupByKey") as IGroupByKey) || "topic",
  );
  const [sliceByKey, setSliceByKey] = useState<ISliceByKey>(
    (searchParams.get("sliceByKey") as ISliceByKey) || "status",
  );
  const [groupFilterRegex, setGroupFilterRegex] = useState<string>(
    searchParams.get("groupFilterRegex") || "",
  );
  const [sliceFilterRegex, setSliceFilterRegex] = useState<string>(
    searchParams.get("sliceFilterRegex") || "",
  );

  useEffect(() => {
    searchParams.set("groupByKey", groupByKey);
    searchParams.set("sliceByKey", sliceByKey);
    if (groupFilterRegex === "") {
      searchParams.delete("groupFilterRegex");
    } else {
      searchParams.set("groupFilterRegex", groupFilterRegex);
    }
    if (sliceFilterRegex === "") {
      searchParams.delete("sliceFilterRegex");
    } else {
      searchParams.set("sliceFilterRegex", sliceFilterRegex);
    }
    setSearchParams(searchParams);
  }, [groupByKey, sliceByKey, groupFilterRegex, sliceFilterRegex]);

  const jobStats = useMemo(() => {
    const filteredData = data;
    const rawStats = getJobStats(filteredData, groupByKey, sliceByKey);
    let groupRegex: RegExp | null = null;
    try {
      if (groupFilterRegex) {
        groupRegex = new RegExp(groupFilterRegex, "i");
      }
    } catch {
      groupRegex = null;
    }
    let sliceRegex: RegExp | null = null;
    try {
      if (sliceFilterRegex) {
        sliceRegex = new RegExp(sliceFilterRegex, "i");
      }
    } catch {
      sliceRegex = null;
    }
    const result: Record<string, Record<string, IStat>> = {};
    for (const [groupName, slices] of Object.entries(rawStats)) {
      if (groupRegex && !groupRegex.test(groupName)) {
        continue;
      }
      const filteredSlices: Record<string, IStat> = {};
      for (const [sliceName, stat] of Object.entries(slices)) {
        if (!sliceRegex || sliceRegex.test(sliceName)) {
          filteredSlices[sliceName] = stat;
        }
      }
      if (Object.keys(filteredSlices).length > 0) {
        result[groupName] = filteredSlices;
      }
    }
    return result;
  }, [data, groupByKey, sliceByKey, groupFilterRegex, sliceFilterRegex]);
  return (
    <div {...props}>
      <Card className="pf-v6-u-mt-md">
        <CardBody>
          <Form>
            <Flex
              columnGap={{ default: "columnGap2xl" }}
              direction={{ default: "column", lg: "row" }}
              justifyContent={{ default: "justifyContentSpaceBetween" }}
            >
              <Flex
                flex={{ default: "flex_1" }}
                columnGap={{ default: "columnGapXl" }}
              >
                <FormGroup label="Group by">
                  <Select
                    onSelect={(selection) => {
                      if (selection) {
                        setGroupByKey(selection.value);
                      }
                    }}
                    item={{
                      value: groupByKey,
                      label: groupByKeysWithLabel[groupByKey],
                    }}
                    items={groupByKeys.map((key) => ({
                      value: key,
                      label: groupByKeysWithLabel[key],
                    }))}
                  />
                </FormGroup>
                <FormGroup label="Filter groups">
                  <TextInput
                    id="jobStats-group-filter"
                    type="text"
                    value={groupFilterRegex}
                    onChange={(_event, value) => setGroupFilterRegex(value)}
                    placeholder="Regexp to filter groups"
                  />
                </FormGroup>
                <FormGroup label="Slice by">
                  <Select
                    onSelect={(selection) => {
                      if (selection) {
                        setSliceByKey(selection.value);
                      }
                    }}
                    item={{
                      value: sliceByKey,
                      label: sliceByKeysWithLabel[sliceByKey],
                    }}
                    items={sliceByKeys.map((key) => ({
                      value: key,
                      label: sliceByKeysWithLabel[key],
                    }))}
                  />
                </FormGroup>
                <FormGroup label="Filter slices">
                  <TextInput
                    id="jobStats-slice-filter"
                    type="text"
                    value={sliceFilterRegex}
                    onChange={(_event, value) => setSliceFilterRegex(value)}
                    placeholder="Regexp to filter slices"
                  />
                </FormGroup>
              </Flex>
              <Flex alignSelf={{ default: "alignSelfFlexEnd" }}>
                <FlexItem>
                  <ScreeshotNodeButton
                    node={graphRef}
                    filename="job-stat-charts.png"
                  />
                </FlexItem>
              </Flex>
            </Flex>
          </Form>
        </CardBody>
      </Card>

      <div ref={graphRef}>
        <Gallery hasGutter className="pf-v6-u-py-md">
          {Object.entries(jobStats)
            .sort(([name1], [name2]) => sort(name1, name2))
            .map(([name, stat], index) => (
              <Card key={index}>
                <CardBody>
                  <JobStatChart name={name} stat={stat} />
                </CardBody>
              </Card>
            ))}
        </Gallery>
      </div>
    </div>
  );
}

function JobStats({
  isLoading,
  data,
  ...props
}: {
  isLoading: boolean;
  data: IGenericAnalyticsData<IAnalyticsJob> | undefined;
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

  if (data === undefined) {
    return null;
  }

  return <JobStatsGraphs data={data.jobs} />;
}

export default function JobStatsPage() {
  const [getAnalyticJobsQuery, { data, isLoading, isFetching }] =
    useLazyGetAnalyticJobsQuery();
  const search = (values: AnalyticsToolbarSearch) => {
    if (values.query) {
      getAnalyticJobsQuery(values);
    }
  };
  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/analytics", title: "Analytics" },
          { title: "Job Stats" },
        ]}
      />
      <Content component="h1">Job Stats</Content>
      <Content component="p">Build a statistical view of your jobs!</Content>
      <AnalyticsToolbar
        onLoad={search}
        onSearch={search}
        isLoading={isFetching}
        data={data}
      />
      <JobStats isLoading={isLoading} data={data} className="pf-v6-u-mt-md" />
    </PageSection>
  );
}
