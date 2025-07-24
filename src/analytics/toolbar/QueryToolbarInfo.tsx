import type { IAnalyticsJob, IGenericAnalyticsData } from "types";
import AnalyticsJobsModal from "./AnalyticsJobsModal";
import { HelperText, HelperTextItem } from "@patternfly/react-core";
import { formatDate } from "services/date";
import { DateTime } from "luxon";
import { InfoIcon } from "@patternfly/react-icons";

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
        {formatDate(firstSyncDate, DateTime.DATETIME_MED)}
      </span>{" "}
      to{" "}
      <span title={lastSyncDate}>
        {formatDate(lastSyncDate, DateTime.DATETIME_MED)}
      </span>
      .
    </span>
  );
}

export default function QueryToolbarInfo<T extends IAnalyticsJob>({
  data,
  className,
}: {
  data: IGenericAnalyticsData<T> | undefined;
  className?: string;
}) {
  if (data === undefined) {
    return null;
  }
  const nbOfJobs = data.jobs.length;
  if (nbOfJobs === 0) {
    return (
      <div className={className}>
        <HelperText>
          <HelperTextItem icon={<InfoIcon />}>
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
    <div className={className}>
      <HelperText>
        <HelperTextItem icon={<InfoIcon />}>
          <LastSyncInfo
            firstSyncDate={data._meta.first_sync_date || ""}
            lastSyncDate={data._meta.last_sync_date}
          />
          <AnalyticsJobsModal className="pf-v6-u-ml-xs" jobs={data.jobs} />
        </HelperTextItem>
      </HelperText>
    </div>
  );
}
