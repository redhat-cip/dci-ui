import { useEffect, useState } from "react";
import {
  addDuration,
  addPipelineStatus,
  getLongerTaskFirst,
} from "./jobStatesActions";
import { useSearchParams } from "react-router";
import JobStateRow from "./JobStateFile";
import { EmptyState } from "ui";
import { IEnhancedJob, IJobStateWithDuration } from "types";
import { humanizeDuration } from "services/date";
import {
  Button,
  Card,
  CardBody,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  Content,
} from "@patternfly/react-core";
import {
  SortAmountDownIcon,
  SortAmountDownAltIcon,
  FileIcon,
  ListIcon,
} from "@patternfly/react-icons";
import JobStateStepper from "./JobStateStepper";
import FileContent from "../files/FileContent";

function JobStateName(jobstate: IJobStateWithDuration) {
  let jobStateName = `Job state ${jobstate.status}`;
  if (jobstate.duration > 0) {
    jobStateName += ` (${humanizeDuration(jobstate.duration * 1000)})`;
  }

  return (
    <span title={`${Math.round(jobstate.duration)} seconds`}>
      {jobStateName}
    </span>
  );
}

interface JobStatesListProps {
  job: IEnhancedJob;
}

export default function JobStatesList({ job }: JobStatesListProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  type AnsibleTaskFilter = "date" | "duration";
  const [sort, setSort] = useState<AnsibleTaskFilter>(
    (searchParams.get("sort") as AnsibleTaskFilter) || "date",
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    searchParams.get("task"),
  );
  const [seeRawLog, setSeeRawLog] = useState(false);

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

  if (job.jobstates.length === 0) {
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

  const jobStates = addDuration(addPipelineStatus(job.jobstates));

  const seeRawLogAction = (
    <CodeBlockAction key="raw-log-action">
      <Button
        variant="plain"
        aria-label="Play icon"
        icon={<FileIcon />}
        isDisabled={!hasRawLogFile}
        onClick={() => {
          setSeeRawLog(!seeRawLog);
        }}
      >
        {seeRawLog ? "hide raw log" : "view raw log"}
      </Button>
    </CodeBlockAction>
  );

  const sortAction = (
    <CodeBlockAction key="sort-action">
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
        {sort === "date" ? "Filter by duration" : "Filter by date"}
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
      {seeRawLog && rawLogFile !== undefined ? (
        <CodeBlock actions={[seeRawLogAction]}>
          <CodeBlockCode>
            <FileContent file={rawLogFile} />
          </CodeBlockCode>
        </CodeBlock>
      ) : (
        <CodeBlock actions={[sortAction, seeRawLogAction]}>
          <CodeBlockCode>
            {sort === "date" ? (
              jobStates.map((jobstate, i) => (
                <div key={i}>
                  <Content component="h6">{JobStateName(jobstate)}</Content>
                  {jobstate.files.length === 0 &&
                    "This job state does not contain any tasks."}
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
              <div>
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
              </div>
            )}
          </CodeBlockCode>
        </CodeBlock>
      )}
    </div>
  );
}
