import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from "@patternfly/react-core";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnalyticsToolbarSearch, RangeOptionValue } from "types";
import { SearchIcon, TimesIcon } from "@patternfly/react-icons";
import RangeSelect from "ui/form/RangeSelect";
import SaveSearchModal from "./SaveSearchModal";

export default function QueryToolbar({
  onLoad,
  onSearch,
  ...props
}: {
  onLoad: (values: AnalyticsToolbarSearch) => void;
  onSearch: (values: AnalyticsToolbarSearch) => void;
  [k: string]: any;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [range, setRange] = useState<RangeOptionValue>(
    (searchParams.get("range") || "last7Days") as RangeOptionValue,
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
    <Toolbar id="toolbar-pipelines" {...props}>
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
          <ToolbarItem style={{ flex: 1 }}>
            <TextInputGroup>
              <TextInputGroupMain
                aria-label="input pipeline query"
                placeholder="Filter job with query string"
                icon={<SearchIcon />}
                value={query}
                onChange={(_event, value) => setQuery(value)}
              />
              {query !== "" && (
                <TextInputGroupUtilities>
                  <Button
                    variant="plain"
                    onClick={() => setQuery("")}
                    aria-label="Clear button and input"
                    icon={<TimesIcon />}
                  />
                </TextInputGroupUtilities>
              )}
            </TextInputGroup>
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
              variant="stateful"
              state="unread"
              isDisabled={query === ""}
            >
              Search
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <SaveSearchModal
              isDisabled={query === ""}
              search={{
                query,
                range,
                after,
                before,
              }}
            />
          </ToolbarItem>
        </ToolbarContent>
      </form>
    </Toolbar>
  );
}
