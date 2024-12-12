import { Card, CardBody } from "@patternfly/react-core";
import QueryToolbar from "analytics/toolbar/QueryToolbar";
import {
  AnalyticsToolbarSearch,
  IGetAnalyticsJobsEmptyResponse,
  IGetAnalyticsJobsResponse,
} from "types";
import QueryToolbarInfo from "./QueryToolbarInfo";
import QueryToolbarSavedSearches from "./QueryToolbarSavedSearches";

export default function AnalyticsToolbar({
  data,
  isLoading,
  onSearch,
  onLoad,
}: {
  data: IGetAnalyticsJobsResponse | IGetAnalyticsJobsEmptyResponse | undefined;
  isLoading: boolean;
  onSearch: (values: AnalyticsToolbarSearch) => void;
  onLoad: (values: AnalyticsToolbarSearch) => void;
}) {
  return (
    <Card>
      <CardBody>
        <QueryToolbar
          onSearch={onSearch}
          onLoad={onLoad}
          style={{ paddingBlockEnd: 0 }}
        />
        <QueryToolbarSavedSearches className="pf-v6-u-mb-md pf-v6-u-mt-xs" />
        <QueryToolbarInfo isLoading={isLoading} data={data} />
      </CardBody>
    </Card>
  );
}
