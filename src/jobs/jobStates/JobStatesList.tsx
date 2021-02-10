import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { addDuration } from "./jobStatesActions";
import JobStateFile from "./JobStateFile";
import {
  JobStates,
  JobStateRow,
  JobStatePre,
  JobStateName,
  FileContent,
  RawLogRow,
  RawLogButton,
} from "./JobStateComponents";
import { EmptyState } from "ui";
import { getFileContent } from "jobs/files/filesActions";
import { IEnhancedJob } from "types";
import { useLocation } from "react-router-dom";
import { humanizeDuration } from "services/date";

interface JobStatesListProps {
  job: IEnhancedJob;
}

export default function JobStatesList({ job }: JobStatesListProps) {
  const location = useLocation();
  const [hash, setHash] = useState<string | null>(null);
  const [seeRawLog, setSeeRawLog] = useState(false);
  const [loadingRawLog, setLoadingRawLog] = useState(false);
  const [rawLog, setRawLog] = useState("");

  useEffect(() => {
    if (location.hash) {
      setHash(location.hash);
    }
  }, [location.hash]);

  const rawLogFile = job.files.find(
    (f) => f.name.toLowerCase() === "ansible.log"
  );
  if (isEmpty(job.jobstates)) {
    return <EmptyState title="No logs" info="There is no logs for this job" />;
  }

  return (
    <JobStates>
      {rawLogFile && (
        <RawLogRow>
          <RawLogButton
            variant="tertiary"
            isSmall
            onClick={() => {
              setLoadingRawLog(true);
              getFileContent(rawLogFile)
                .then((content) => {
                  setRawLog(content);
                  setSeeRawLog(!seeRawLog);
                })
                .catch(console.error)
                .then(() => setLoadingRawLog(false));
            }}
          >
            {loadingRawLog ? "Loading" : seeRawLog ? "Hide Raw log" : "Raw Log"}
          </RawLogButton>
        </RawLogRow>
      )}
      {seeRawLog && !loadingRawLog ? (
        <div>
          <FileContent>
            <JobStatePre>{rawLog}</JobStatePre>
          </FileContent>
        </div>
      ) : (
        addDuration(job.jobstates).map((jobstate, i) => (
          <div key={i}>
            {jobstate.files.length === 0 ? null : (
              <JobStateRow>
                <JobStateName
                  title={`${Math.round(jobstate.duration)} seconds`}
                >
                  {`Job state ${jobstate.status} (~${humanizeDuration(
                    jobstate.duration * 1000
                  )})`}
                </JobStateName>
              </JobStateRow>
            )}
            {jobstate.files.map((file, j) => {
              const h = `${jobstate.id}:file${j}`;
              return (
                <JobStateFile
                  id={h}
                  key={j}
                  file={file}
                  isSelected={hash === `#${h}`}
                  link={`${location.pathname}#${h}`}
                />
              );
            })}
          </div>
        ))
      )}
    </JobStates>
  );
}
