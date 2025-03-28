import { IAnalyticsJob } from "types";
import AnalyticsJobsModal from "./AnalyticsJobsModal";
import { HelperText, HelperTextItem, Skeleton } from "@patternfly/react-core";

export default function AnalyticsJobsInfo({
  isLoading,
  data,
  ...props
}: {
  isLoading: boolean;
  data: IAnalyticsJob[] | undefined;
  [key: string]: any;
}) {
  if (isLoading) {
    return <Skeleton screenreaderText="Loading jobs hint" />;
  }

  if (data === undefined) {
    return null;
  }
  const nbOfJobs = data.length;
  if (nbOfJobs === 0) {
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
  return (
    <div {...props}>
      <HelperText>
        <HelperTextItem>
          There are{" "}
          <b>
            {nbOfJobs} job{nbOfJobs > 1 ? "s" : ""}
          </b>{" "}
          that match your search.
          <AnalyticsJobsModal className="pf-v6-u-ml-xs" jobs={data} />
        </HelperTextItem>
      </HelperText>
    </div>
  );
}
