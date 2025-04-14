import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  TextInputGroup,
} from "@patternfly/react-core";
import { useSearchParams } from "react-router";
import {
  AnalyticsToolbarSearch,
  AnalyticsToolbarSearches,
  TimeRange,
  TimeRanges,
} from "types";
import RangeSelect from "ui/form/RangeSelect";
import SaveSearchModal from "./SaveSearchModal";
import { getRangeDates } from "services/date";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import QueryToolBarInputSearch from "./QueryToolBarInputSearch";

const ToolbarSearchSchema = Yup.object<AnalyticsToolbarSearch>().shape({
  query: Yup.string().required(),
  after: Yup.string().required(),
  before: Yup.string().required(),
  range: Yup.mixed<TimeRange>().oneOf(TimeRanges).required(),
});

function getDefaultValues(params: URLSearchParams) {
  const query = params.get("query") || "";
  const range = (params.get("range") || "last7Days") as TimeRange;
  const dates = getRangeDates(range);
  const after =
    range === "custom" ? params.get("after") || dates.after : dates.after;
  const before =
    range === "custom" ? params.get("before") || dates.before : dates.before;
  return {
    query,
    range,
    after,
    before,
  };
}

export default function QueryToolbar({
  searches,
  setSearches,
  onLoad,
  onSearch,
  ...props
}: {
  searches: AnalyticsToolbarSearches;
  setSearches: (newSearches: AnalyticsToolbarSearches) => void;
  onLoad: (values: AnalyticsToolbarSearch) => void;
  onSearch: (values: AnalyticsToolbarSearch) => void;
  [key: string]: any;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultValues = getDefaultValues(searchParams);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty, isValid },
  } = useForm<AnalyticsToolbarSearch>({
    resolver: yupResolver(ToolbarSearchSchema),
    defaultValues,
  });

  const search = watch();

  useEffect(() => {
    onLoad(defaultValues);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Toolbar id="toolbar-pipelines" {...props}>
      <form
        id="toolbar-pipelines"
        onSubmit={handleSubmit((values) => {
          const params = {
            ...values,
            range: values.range,
          };
          setSearchParams(params);
          onSearch(params);
        })}
      >
        <ToolbarContent>
          <ToolbarItem style={{ flex: 1 }}>
            <TextInputGroup>
              <Controller
                control={control}
                name="query"
                render={({ field: { onChange, value } }) => (
                  <QueryToolBarInputSearch value={value} onChange={onChange} />
                )}
              />
            </TextInputGroup>
          </ToolbarItem>
          <ToolbarItem>
            <Controller
              control={control}
              name="range"
              render={({ field: { onChange, value } }) => (
                <RangeSelect
                  range={value}
                  onChange={(range, after, before) => {
                    onChange(range);
                    setValue("after", after);
                    setValue("before", before);
                  }}
                  after={defaultValues.after}
                  before={defaultValues.before}
                  ranges={[
                    "last7Days",
                    "last30Days",
                    "last90Days",
                    "previousWeek",
                    "currentWeek",
                    "yesterday",
                    "today",
                    "custom",
                  ]}
                />
              )}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button
              type="submit"
              variant="stateful"
              state="unread"
              isDisabled={!isDirty || !isValid}
            >
              Search
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <SaveSearchModal
              search={search}
              searches={searches}
              setSearches={setSearches}
            />
          </ToolbarItem>
        </ToolbarContent>
      </form>
    </Toolbar>
  );
}
