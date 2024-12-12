import { Tooltip, Label } from "@patternfly/react-core";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import useLocalStorage from "hooks/useLocalStorage";
import { AnalyticsToolbarSearch } from "types";

export default function QueryToolbarSavedSearches({
  ...props
}: {
  [k: string]: any;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searches, setSearches] = useLocalStorage<
    Record<string, AnalyticsToolbarSearch>
  >("userAnalyticsFilters", {});

  const searchKeys = Object.keys(searches);
  return (
    <div {...props}>
      {searchKeys.map((searchName) => (
        <Tooltip content={searches[searchName].query}>
          <Label
            color="green"
            className="pf-v6-u-mr-xs"
            isCompact
            title={searches[searchName].query}
            onClick={() => {
              navigate({
                pathname: location.pathname,
                search: createSearchParams({
                  ...searches[searchName],
                }).toString(),
              });
              navigate(0);
            }}
            onClose={() => {
              const newSearches = {
                ...searches,
              };
              delete newSearches[searchName];
              setSearches(newSearches);
            }}
          >
            {searchName}
          </Label>
        </Tooltip>
      ))}
    </div>
  );
}
