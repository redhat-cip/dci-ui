import { Label } from "@patternfly/react-core";
import { createSearchParams, useLocation, useNavigate } from "react-router";
import type { AnalyticsToolbarSearches } from "types";

export default function QueryToolbarSavedSearches({
  searches,
  setSearches,
  ...props
}: {
  searches: AnalyticsToolbarSearches;
  setSearches: (newSearches: AnalyticsToolbarSearches) => void;
  [key: string]: any;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const searchKeys = Object.keys(searches);
  return (
    <div {...props}>
      {searchKeys.map((searchName) => (
        <Label
          key={searchName}
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
      ))}
    </div>
  );
}
