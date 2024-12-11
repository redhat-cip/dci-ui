import {
  Card,
  CardBody,
  Hint,
  HintBody,
  Skeleton,
} from "@patternfly/react-core";
import QueryToolbar from "analytics/toolbar/QueryToolbar";
import {
  AnalyticsToolbarFilters,
  IGetAnalyticsJobsEmptyResponse,
  IGetAnalyticsJobsResponse,
} from "types";
import AnalyticsJobsInfo from "../jobs/AnalyticsJobsInfo";

export default function AnalyticsToolbar({
  data,
  isLoading,
  onSearch,
  onLoad,
}: {
  data: IGetAnalyticsJobsResponse | IGetAnalyticsJobsEmptyResponse | undefined;
  isLoading: boolean;
  onSearch: (values: AnalyticsToolbarFilters) => void;
  onLoad: (values: AnalyticsToolbarFilters) => void;
}) {
  return (
    <div>
      <Card>
        <CardBody>
          <QueryToolbar onSearch={onSearch} onLoad={onLoad} />
        </CardBody>
      </Card>
      {isLoading && (
        <>
          <Hint className="pf-v6-u-mt-md">
            <HintBody>
              <Skeleton screenreaderText="Loading jobs hint" />
            </HintBody>
          </Hint>
          <Card className="pf-v6-u-mt-md">
            <CardBody>
              <Skeleton
                screenreaderText="Loading analytics jobs"
                style={{ height: 80 }}
              />
            </CardBody>
          </Card>
        </>
      )}
      {!isLoading && data && data.hits && (
        <AnalyticsJobsInfo hits={data.hits} className="pf-v6-u-mt-md" />
      )}
    </div>
  );
}
