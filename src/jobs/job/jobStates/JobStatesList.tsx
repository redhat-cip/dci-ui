import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import {
  addDuration,
  addPipelineStatus,
  getLongerTaskFirst,
} from "./jobStatesActions";
import { useSearchParams } from "react-router-dom";
import JobStateRow from "./JobStateFile";
import { EmptyState } from "ui";
import { getFileContent } from "jobs/job/files/filesActions";
import { IEnhancedJob } from "types";
import { humanizeDuration } from "services/date";
import {
  Button,
  Card,
  CardBody,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
} from "@patternfly/react-core";
import {
  SortAmountDownIcon,
  SortAmountDownAltIcon,
  FileIcon,
  ListIcon,
} from "@patternfly/react-icons";
import JobStateStepper from "./JobStateStepper";
import { showError } from "alerts/alertsSlice";
import { useAppDispatch } from "store";
type AnsibleTaskFilter = "date" | "duration";

interface JobStatesListProps {
  job: IEnhancedJob;
}

export default function JobStatesList({ job }: JobStatesListProps) {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<AnsibleTaskFilter>(
    (searchParams.get("sort") as AnsibleTaskFilter) || "date",
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    searchParams.get("task"),
  );
  const [seeRawLog, setSeeRawLog] = useState(false);
  const [rawLog, setRawLog] = useState<string | null>(null);

  useEffect(() => {
    searchParams.set("sort", sort);
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams, sort]);

  useEffect(() => {
    if (selectedTaskId) {
      searchParams.set("task", selectedTaskId);
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, selectedTaskId]);

  const rawLogFile = job.files.find(
    (f) => f.name.toLowerCase() === "ansible.log",
  );
  const hasRawLogFile = rawLogFile !== undefined;

  if (isEmpty(job.jobstates)) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            icon={ListIcon}
            title="No logs"
            info="There is no logs for this job"
          />
        </CardBody>
      </Card>
    );
  }

  const jobStates = addDuration(addPipelineStatus(job.jobstates)).filter(
    (jobState) => jobState.files.length !== 0,
  );

  const seeRawLogAction = (
    <CodeBlockAction>
      <Button
        variant="plain"
        aria-label="Play icon"
        icon={<FileIcon />}
        isDisabled={!hasRawLogFile}
        onClick={() => {
          setSeeRawLog(!seeRawLog);
          if (rawLog === null && hasRawLogFile) {
            getFileContent(rawLogFile)
              .then((content) => {
                setRawLog(content);
              })
              .catch(() =>
                dispatch(
                  showError(
                    "We can't get the raw log. Can you try again in a few minutes or contact an administrator? ",
                  ),
                ),
              );
          }
        }}
      >
        {seeRawLog ? "hide raw log" : "view raw log"}
      </Button>
    </CodeBlockAction>
  );

  const sortAction = (
    <CodeBlockAction>
      <Button
        variant="plain"
        aria-label="Play icon"
        icon={
          sort === "date" ? <SortAmountDownIcon /> : <SortAmountDownAltIcon />
        }
        onClick={() => {
          if (sort === "date") {
            setSort("duration");
          } else {
            setSort("date");
          }
        }}
      >
        {sort === "date" ? "Filter by date" : "Filter by duration"}
      </Button>
    </CodeBlockAction>
  );

  return (
    <div>
      <JobStateStepper
        jobStates={jobStates}
        jobStateSelected={(jobState) => {
          const latestTask = jobState.files[jobState.files.length - 1];
          setSelectedTaskId(latestTask.id);
        }}
        className="pf-v6-u-mb-md"
      />
      {seeRawLog ? (
        <CodeBlock actions={[seeRawLogAction]}>
          <CodeBlockCode>{rawLog}</CodeBlockCode>
        </CodeBlock>
      ) : (
        <CodeBlock actions={[sortAction, seeRawLogAction]}>
          <CodeBlockCode>
            {sort === "date" ? (
              jobStates.map((jobstate, i) => (
                <div key={i}>
                  <div
                    style={{
                      fontSize: 14,
                      marginBottom: ".5em",
                    }}
                  >
                    <span title={`${Math.round(jobstate.duration)} seconds`}>
                      {`Job state ${jobstate.status} (~${humanizeDuration(
                        jobstate.duration * 1000,
                      )})`}
                    </span>
                  </div>
                  <ul style={{ listStyle: "none" }} className="pf-v6-u-mb-md">
                    {jobstate.files.map((file, j) => (
                      <JobStateRow
                        key={j}
                        file={file}
                        isSelected={selectedTaskId === file.id}
                        onClick={(seeDetails) => {
                          if (seeDetails) {
                            setSelectedTaskId(file.id);
                          } else {
                            setSelectedTaskId(null);
                          }
                        }}
                      />
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <ul style={{ listStyle: "none" }} className="pf-v6-u-mb-md">
                {getLongerTaskFirst(jobStates).map((file, j) => (
                  <JobStateRow
                    key={j}
                    file={file}
                    isSelected={selectedTaskId === file.id}
                    onClick={(seeDetails) => {
                      if (seeDetails) {
                        setSelectedTaskId(file.id);
                      } else {
                        setSelectedTaskId(null);
                      }
                    }}
                  />
                ))}
              </ul>
            )}
          </CodeBlockCode>
        </CodeBlock>
      )}
    </div>
  );
}
