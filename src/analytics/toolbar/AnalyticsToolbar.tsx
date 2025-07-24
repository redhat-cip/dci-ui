import { Card, CardBody } from "@patternfly/react-core";
import QueryToolbar from "./QueryToolbar";
import type {
  AnalyticsToolbarSearch,
  IAnalyticsJob,
  IGenericAnalyticsData,
  TimeRange,
} from "types";
import { useSearchParams } from "react-router";
import { getRangeDates } from "services/date";
import { useEffect } from "react";

function searchParamsToAnalyticsParams(
  params: URLSearchParams,
  partialValues: Partial<AnalyticsToolbarSearch>,
): AnalyticsToolbarSearch {
  const query = partialValues.query ?? params.get("query") ?? "";
  const range = (partialValues.range ??
    params.get("range") ??
    "last7Days") as TimeRange;
  const dates = getRangeDates(range);
  const after =
    partialValues.after ??
    (range === "custom" ? (params.get("after") ?? dates.after) : dates.after);
  const before =
    partialValues.before ??
    (range === "custom"
      ? (params.get("before") ?? dates.before)
      : dates.before);
  const limit = partialValues.limit ?? parseInt(params.get("limit") ?? "200");
  const offset = partialValues.offset ?? parseInt(params.get("offset") ?? "0");
  return {
    query,
    range,
    after,
    before,
    limit,
    offset,
  };
}

export default function AnalyticsToolbar<T extends IAnalyticsJob>({
  data,
  isLoading,
  onSearch,
  onLoad,
  initialSearches = {},
}: {
  data: IGenericAnalyticsData<T> | undefined;
  isLoading: boolean;
  onSearch: (values: AnalyticsToolbarSearch) => void;
  onLoad: (values: AnalyticsToolbarSearch) => void;
  initialSearches?: Partial<AnalyticsToolbarSearch>;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultValues = searchParamsToAnalyticsParams(
    searchParams,
    initialSearches,
  );

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("query", defaultValues.query);
    newParams.set("range", defaultValues.range);
    newParams.set("after", defaultValues.after);
    newParams.set("before", defaultValues.before);
    newParams.set("limit", defaultValues.limit.toString());
    newParams.set("offset", defaultValues.offset.toString());
    setSearchParams(newParams, { replace: true });
    onLoad(defaultValues);
  }, []);

  return (
    <Card>
      <CardBody>
        <QueryToolbar
          isLoading={isLoading}
          data={data}
          defaultValues={defaultValues}
          onSearch={(values) => {
            onSearch(values);
            setSearchParams(
              {
                ...values,
                limit: values.limit.toString(),
                offset: values.offset.toString(),
              },
              { replace: true },
            );
          }}
        />
      </CardBody>
    </Card>
  );
}
