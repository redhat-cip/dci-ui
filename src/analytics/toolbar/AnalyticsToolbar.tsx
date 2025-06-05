import { Card, CardBody } from "@patternfly/react-core";
import QueryToolbar from "analytics/toolbar/QueryToolbar";
import {
  AnalyticsToolbarSearch,
  IAnalyticsJob,
  IGenericAnalyticsData,
} from "types";
import QueryToolbarInfo from "./QueryToolbarInfo";
import QueryToolbarSavedSearches from "./QueryToolbarSavedSearches";
import useLocalStorage from "hooks/useLocalStorage";

export default function AnalyticsToolbar<T extends IAnalyticsJob>({
  data,
  isLoading,
  onSearch,
  onLoad,
}: {
  data: IGenericAnalyticsData<T> | undefined;
  isLoading: boolean;
  onSearch: (values: AnalyticsToolbarSearch) => void;
  onLoad: (values: AnalyticsToolbarSearch) => void;
}) {
  const [searches, setSearches] = useLocalStorage<
    Record<string, AnalyticsToolbarSearch>
  >("userAnalyticsFilters", {});

  return (
    <Card>
      <CardBody>
        <QueryToolbar
          onSearch={onSearch}
          onLoad={onLoad}
          style={{ paddingBlockEnd: 0 }}
          searches={searches}
          setSearches={setSearches}
        />
        <QueryToolbarSavedSearches
          searches={searches}
          setSearches={setSearches}
          className="pf-v6-u-mb-md pf-v6-u-mt-xs"
        />
        <QueryToolbarInfo isLoading={isLoading} data={data} />
      </CardBody>
    </Card>
  );
}
