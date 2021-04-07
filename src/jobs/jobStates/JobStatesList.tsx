import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { addDuration, addPipelineStatus } from "./jobStatesActions";
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
import { IEnhancedJob, IPipelineStatus } from "types";
import { useLocation, Link } from "react-router-dom";
import { humanizeDuration } from "services/date";
import {
  global_success_color_100,
  global_danger_color_100,
} from "@patternfly/react-tokens";
import styled from "styled-components";

export const Pipeline = styled.div`
  margin: 0.5rem 0;
  padding: 1rem 0;
  padding-top: 2rem;
  background-color: white;
`;

function getJobStateColor(status: IPipelineStatus | undefined) {
  switch (status) {
    case "success":
      return global_success_color_100.value;
    default:
      return global_danger_color_100.value;
  }
}

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

  const jobStates = addDuration(addPipelineStatus(job.jobstates)).filter(
    (jobState) => jobState.files.length !== 0
  );

  return (
    <div>
      <div
        style={{
          margin: "0.5rem 0",
          paddingTop: "calc(2rem + 10px)",
          paddingBottom: "calc(2rem - 10px)",
          backgroundColor: "white",
        }}
      >
        <ul
          className="timeline"
          style={{
            listStyleType: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {jobStates.map((jobState, i) => {
            const jobStateColor = getJobStateColor(jobState.pipelineStatus);
            return (
              <li
                key={i}
                className="li complete"
                style={{ position: "relative" }}
              >
                <div
                  className="status"
                  style={{
                    padding: "0px 2rem",
                    display: "flex",
                    justifyContent: "center",
                    borderTop: `2px solid ${jobStateColor}`,
                    position: "relative",
                  }}
                >
                  <Link
                    to={`${location.pathname}#${jobState.id}:file${
                      jobState.files.length - 1
                    }`}
                    style={{ paddingTop: "1rem", color: jobStateColor }}
                  >
                    {jobState.status}
                  </Link>
                </div>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: jobStateColor,
                    borderRadius: "20px",
                    border: `1px solid ${jobStateColor}`,
                    position: "absolute",
                    top: "-10px",
                    left: "calc(50% - 10px)",
                    display: "block",
                  }}
                ></div>
              </li>
            );
          })}
        </ul>
      </div>
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
              {loadingRawLog
                ? "Loading"
                : seeRawLog
                ? "Hide Raw log"
                : "Raw Log"}
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
          jobStates.map((jobstate, i) => (
            <div key={i}>
              <JobStateRow>
                <JobStateName
                  title={`${Math.round(jobstate.duration)} seconds`}
                >
                  {`Job state ${jobstate.status} (~${humanizeDuration(
                    jobstate.duration * 1000
                  )})`}
                </JobStateName>
              </JobStateRow>
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
    </div>
  );
}
