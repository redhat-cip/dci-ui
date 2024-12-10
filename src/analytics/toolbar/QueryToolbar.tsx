import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ButtonVariant,
  Icon,
  TextInput,
} from "@patternfly/react-core";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnalyticsToolbarFilters, RangeOptionValue } from "types";
import { ArrowRightIcon } from "@patternfly/react-icons";
import RangeSelect from "ui/form/RangeSelect";
import AnalyticsSaveSearchesToolbar from "./AnalyticsSaveSearchesToolbar";

export default function QueryToolbar({
  onLoad,
  onSearch,
}: {
  onLoad: (values: AnalyticsToolbarFilters) => void;
  onSearch: (values: AnalyticsToolbarFilters) => void;
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [range, setRange] = useState<RangeOptionValue>(
    searchParams.get("range") as RangeOptionValue,
  );
  const [after, setAfter] = useState(searchParams.get("after") || "");
  const [before, setBefore] = useState(searchParams.get("before") || "");

  useEffect(() => {
    onLoad({
      query,
      range,
      after,
      before,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Toolbar id="toolbar-pipelines" style={{ paddingBlockEnd: 0 }}>
        <form
          id="toolbar-pipelines"
          onSubmit={(e) => {
            e.preventDefault();
            const params = {
              query,
              range,
              after,
              before,
            };
            setSearchParams(params);
            onSearch(params);
          }}
        >
          <ToolbarContent>
            <ToolbarItem style={{ minWidth: 480 }}>
              <TextInput
                aria-label="input pipeline query"
                onChange={(_event, value) => setQuery(value)}
                value={query}
                placeholder="Filter job with query string"
              />
            </ToolbarItem>
            <ToolbarItem>
              <RangeSelect
                range={range}
                onChange={(range, after, before) => {
                  setRange(range);
                  setAfter(after);
                  setBefore(before);
                }}
                after={after}
                before={before}
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
            </ToolbarItem>
            <ToolbarItem>
              <Button
                type="submit"
                isDisabled={query === ""}
                variant={ButtonVariant.control}
                icon={
                  <Icon>
                    <ArrowRightIcon />
                  </Icon>
                }
              />
            </ToolbarItem>
          </ToolbarContent>
        </form>
      </Toolbar>
      <AnalyticsSaveSearchesToolbar
        search={{
          query,
          range,
          after,
          before,
        }}
        onLoad={(filters) => {
          setSearchParams({ ...filters });
          navigate(0);
        }}
        style={{ paddingBlockEnd: 0 }}
      />
    </>
  );
}
