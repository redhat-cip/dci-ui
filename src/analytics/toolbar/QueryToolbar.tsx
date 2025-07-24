import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  TextInputGroup,
  Pagination,
  Skeleton,
} from "@patternfly/react-core";
import {
  TimeRanges,
  type AnalyticsToolbarSearch,
  type IAnalyticsJob,
  type IGenericAnalyticsData,
  type TimeRange,
} from "types";
import RangeSelect from "ui/form/RangeSelect";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import QueryToolBarInputSearch from "./QueryToolBarInputSearch";
import { offsetAndLimitToPage, pageAndLimitToOffset } from "services/filters";
import QueryToolbarSavedSearchesIcon from "./QueryToolbarSavedSearchesIcon";
import QueryToolbarInfo from "./QueryToolbarInfo";

const ToolbarSearchSchema = Yup.object<AnalyticsToolbarSearch>().shape({
  query: Yup.string().required(),
  after: Yup.string().required(),
  before: Yup.string().required(),
  range: Yup.mixed<TimeRange>().oneOf(TimeRanges).required(),
  limit: Yup.number().required(),
  offset: Yup.number().required(),
});

export default function QueryToolbar<T extends IAnalyticsJob>({
  isLoading,
  data,
  defaultValues,
  onSearch,
}: {
  isLoading: boolean;
  data: IGenericAnalyticsData<T> | undefined;
  defaultValues: AnalyticsToolbarSearch;
  onSearch: (values: AnalyticsToolbarSearch) => void;
}) {
  const { control, handleSubmit, setValue, watch } =
    useForm<AnalyticsToolbarSearch>({
      resolver: yupResolver(ToolbarSearchSchema),
      defaultValues,
    });
  const values = watch();
  const searchJobs = (values: AnalyticsToolbarSearch) => {
    onSearch(values);
  };
  const nbOfJobs = data?.jobs.length ?? 0;
  const nbTotalJobs = data?._meta.total ?? 0;

  return (
    <>
      <Toolbar id="analytics-toolbar" style={{ paddingBlockEnd: 0 }}>
        <form id="analytics-toolbar-form" onSubmit={handleSubmit(searchJobs)}>
          <ToolbarContent>
            <ToolbarItem style={{ flex: 1 }}>
              <TextInputGroup>
                <Controller
                  control={control}
                  name="query"
                  render={({ field: { onChange, value } }) => (
                    <QueryToolBarInputSearch
                      value={value}
                      onChange={onChange}
                      onSubmit={handleSubmit(searchJobs)}
                    />
                  )}
                />
              </TextInputGroup>
            </ToolbarItem>
            <ToolbarItem>
              <RangeSelect
                defaultValues={defaultValues}
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
                onChange={(range, after, before) => {
                  setValue("range", range);
                  setValue("after", after);
                  setValue("before", before);
                }}
              />
            </ToolbarItem>
            <ToolbarItem gap={{ default: "gapSm" }}>
              <Button type="submit" variant="stateful" state="unread">
                Search
              </Button>
              <QueryToolbarSavedSearchesIcon />
            </ToolbarItem>
          </ToolbarContent>
        </form>
      </Toolbar>
      <Toolbar
        id="analytics-toolbar-pagination"
        className="pf-v6-u-mt-sm"
        style={{ paddingBlockEnd: 0 }}
      >
        <ToolbarContent>
          {isLoading ? (
            <Skeleton
              screenreaderText="Loading analytics jobs"
              style={{ width: "100%", height: "2.4rem" }}
            />
          ) : (
            <>
              <ToolbarItem>
                <QueryToolbarInfo data={data} className="pf-v6-u-mt-sm" />
              </ToolbarItem>
              <ToolbarItem align={{ default: "alignEnd" }}>
                {nbOfJobs < nbTotalJobs && (
                  <Pagination
                    perPage={values.limit}
                    page={offsetAndLimitToPage(values.offset, values.limit)}
                    itemCount={data?._meta.total ?? 0}
                    onSetPage={(_, newPage) => {
                      const newOffset = pageAndLimitToOffset(
                        newPage,
                        values.limit,
                      );
                      setValue("offset", newOffset);
                      onSearch({
                        ...values,
                        offset: newOffset,
                      });
                    }}
                    onPerPageSelect={(_, newPerPage) => {
                      setValue("limit", newPerPage);
                      onSearch({
                        ...values,
                        limit: newPerPage,
                      });
                    }}
                  />
                )}
              </ToolbarItem>
            </>
          )}
        </ToolbarContent>
      </Toolbar>
    </>
  );
}
