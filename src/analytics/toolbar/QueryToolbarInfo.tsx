import { IAnalyticsJob, IGenericAnalyticsData } from "types";
import AnalyticsJobsModal from "./AnalyticsJobsModal";
import { HelperText, HelperTextItem, Skeleton } from "@patternfly/react-core";
import { formatDate } from "services/date";
import { DateTime } from "luxon";

function LastSyncInfo({
  firstSyncDate,
  lastSyncDate,
  className,
}: {
  firstSyncDate: string;
  lastSyncDate: string;
  className?: string;
}) {
  return (
    <span className={className}>
      Data synchronized from{" "}
      <span title={firstSyncDate}>
        {formatDate(firstSyncDate, DateTime.DATE_MED)}
      </span>{" "}
      to{" "}
      <span title={lastSyncDate}>
        {formatDate(lastSyncDate, DateTime.DATE_MED)}
      </span>
      .
    </span>
  );
}

export default function QueryToolbarInfo<T extends IAnalyticsJob>({
  isLoading,
  data,
  ...props
}: {
  isLoading: boolean;
  data: IGenericAnalyticsData<T> | undefined;
  [key: string]: any;
}) {
  if (isLoading) {
    return <Skeleton screenreaderText="Loading jobs hint" />;
  }

  if (data === undefined) {
    return null;
  }
  const nbOfJobs = data.jobs.length;
  const nbTotalJobs = data._meta.total;
  if (nbOfJobs === 0) {
    return (
      <div {...props}>
        <HelperText>
          <HelperTextItem>
            There are no jobs that match your search.
            <LastSyncInfo
              firstSyncDate={data._meta.first_sync_date || ""}
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
          {nbOfJobs < nbTotalJobs ? (
            <span>
              Showing <b>{`${nbOfJobs} of ${nbTotalJobs}`} jobs</b>
            </span>
          ) : (
            <b>{`${nbOfJobs} job${nbOfJobs > 1 ? "s" : ""}`}</b>
          )}{" "}
          matching your search.
          <AnalyticsJobsModal className="pf-v6-u-ml-xs" jobs={data.jobs} />
        </HelperTextItem>
        <HelperTextItem>
          <LastSyncInfo
            firstSyncDate={data._meta.first_sync_date || ""}
            lastSyncDate={data._meta.last_sync_date}
          />
        </HelperTextItem>
      </HelperText>
    </div>
  );
}
