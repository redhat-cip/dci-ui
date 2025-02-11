import {
  IGetAnalyticsJobsEmptyResponse,
  IGetAnalyticsJobsResponse,
} from "types";
import AnalyticsJobsModal from "./AnalyticsJobsModal";
import { HelperText, HelperTextItem, Skeleton } from "@patternfly/react-core";

export default function AnalyticsJobsInfo({
  isLoading,
  data,
  ...props
}: {
  isLoading: boolean;
  data: IGetAnalyticsJobsResponse | IGetAnalyticsJobsEmptyResponse | undefined;
  [key: string]: any;
}) {
  if (isLoading) {
    return <Skeleton screenreaderText="Loading jobs hint" />;
  }

  if (!data || !data.hits) {
    return (
      <div {...props}>
        <HelperText>
          <HelperTextItem>
            There are no jobs that match your search.
          </HelperTextItem>
        </HelperText>
      </div>
    );
  }

  const jobs = data.hits.hits.map((h) => h._source);
  const nbOfJobs = data.hits.total.value;
  const showWarning = nbOfJobs > 200;
  return (
    <div {...props}>
      <HelperText>
        <HelperTextItem>
          There are{" "}
          <b>
            {nbOfJobs} job{nbOfJobs > 1 ? "s" : ""}
          </b>{" "}
          that match your search.
          {showWarning ? " Only 200 are returned by the API." : ""}
          <AnalyticsJobsModal className="pf-v6-u-ml-xs" jobs={jobs} />
        </HelperTextItem>
      </HelperText>
    </div>
  );
}
