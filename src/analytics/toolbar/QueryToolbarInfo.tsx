import { IAnalyticsData } from "types";
import AnalyticsJobsModal from "./AnalyticsJobsModal";
import { HelperText, HelperTextItem, Skeleton } from "@patternfly/react-core";
import { formatDate } from "services/date";

function LastSyncInfo({
  lastSyncDate,
  className,
}: {
  lastSyncDate: string;
  className?: string;
}) {
  return (
    <span className={className}>Last sync: {formatDate(lastSyncDate)}.</span>
  );
}

export default function QueryToolbarInfo({
  isLoading,
  data,
  ...props
}: {
  isLoading: boolean;
  data: IAnalyticsData | undefined;
  [key: string]: any;
}) {
  if (isLoading) {
    return <Skeleton screenreaderText="Loading jobs hint" />;
  }

  if (data === undefined) {
    return null;
  }
  const nbOfJobs = data.jobs.length;
  if (nbOfJobs === 0) {
    return (
      <div {...props}>
        <HelperText>
          <HelperTextItem>
            There are no jobs that match your search.
            <LastSyncInfo
              lastSyncDate={data._meta.last_sync_date}
              className="pf-v6-u-ml-xs"
            />
          </HelperTextItem>
        </HelperText>
      </div>
    );
  }
  return (
    <div {...props}>
      <HelperText>
        <HelperTextItem>
          There are{" "}
          <b>
            {nbOfJobs} job{nbOfJobs > 1 ? "s" : ""}
          </b>{" "}
          that match your search.
          <LastSyncInfo
            lastSyncDate={data._meta.last_sync_date}
            className="pf-v6-u-ml-xs"
          />
          <AnalyticsJobsModal className="pf-v6-u-ml-xs" jobs={data.jobs} />
        </HelperTextItem>
      </HelperText>
    </div>
  );
}
