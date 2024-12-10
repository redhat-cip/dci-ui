import { Hint, HintBody } from "@patternfly/react-core";
import { IGetAnalyticsJobsResponse } from "types";
import AnalyticsJobsModal from "./AnalyticsJobsModal";

export default function AnalyticsJobsInfo({
  hits,
  ...props
}: {
  hits: IGetAnalyticsJobsResponse["hits"];
  [k: string]: any;
}) {
  const nbOfJobs = hits.total.value;
  const showWarning = nbOfJobs > 200;
  return (
    <Hint {...props}>
      <HintBody>
        There are{" "}
        <b>
          {nbOfJobs} job{nbOfJobs > 1 ? "s" : ""}
        </b>{" "}
        that match your search.
        {showWarning ? " Only 200 are returned by the API." : ""}
        <AnalyticsJobsModal
          className="pf-v6-u-ml-xs"
          jobs={hits.hits.map((h) => h._source)}
        />
      </HintBody>
    </Hint>
  );
}
