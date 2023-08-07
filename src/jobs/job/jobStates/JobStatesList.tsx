import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import {
  addDuration,
  addPipelineStatus,
  getLongerTaskFirst,
} from "./jobStatesActions";
import { useSearchParams } from "react-router-dom";
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
import { getFileContent } from "jobs/job/files/filesActions";
import { IEnhancedJob } from "types";
import { humanizeDuration } from "services/date";
import { ProgressStepper, ProgressStep, Button } from "@patternfly/react-core";
import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
} from "@patternfly/react-core/deprecated";
import {
  SortAmountDownIcon,
  SortAmountDownAltIcon,
} from "@patternfly/react-icons";
import { global_palette_black_200 } from "@patternfly/react-tokens";

type AnsibleTaskFilter = "date" | "duration";

function JobStateFilterButton({
  changeFilter,
}: {
  changeFilter: (newFilter: AnsibleTaskFilter) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dropdown
      onSelect={() => {
        setIsOpen(false);
        const element = document.getElementById("toggle-icon-only");
        element && element.focus();
      }}
      toggle={
        <DropdownToggle
          toggleIndicator={null}
          onToggle={(_event, isOpen: boolean) => setIsOpen(isOpen)}
          aria-label="Applications"
          id="toggle-icon-only"
          style={{ color: global_palette_black_200.value }}
        >
          <SortAmountDownIcon />
        </DropdownToggle>
      }
      isOpen={isOpen}
      isPlain
      dropdownItems={[
        <DropdownItem
          key="action"
          component="button"
          onClick={() => changeFilter("date")}
          icon={<SortAmountDownAltIcon />}
        >
          Filter by date
        </DropdownItem>,
        <DropdownItem
          key="action"
          component="button"
          onClick={() => changeFilter("duration")}
          icon={<SortAmountDownIcon />}
        >
          Filter by duration
        </DropdownItem>,
      ]}
    />
  );
}

interface JobStatesListProps {
  job: IEnhancedJob;
}

export default function JobStatesList({ job }: JobStatesListProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<AnsibleTaskFilter>(
    (searchParams.get("sort") as AnsibleTaskFilter) || "date",
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    searchParams.get("task"),
  );
  const [seeRawLog, setSeeRawLog] = useState(false);
  const [loadingRawLog, setLoadingRawLog] = useState(false);
  const [rawLog, setRawLog] = useState("");

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
  if (isEmpty(job.jobstates)) {
    return <EmptyState title="No logs" info="There is no logs for this job" />;
  }

  const jobStates = addDuration(addPipelineStatus(job.jobstates)).filter(
    (jobState) => jobState.files.length !== 0,
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
        <ProgressStepper isCenterAligned>
          {jobStates.map((jobState, i) => (
            <ProgressStep
              key={i}
              variant={jobState.pipelineStatus}
              id={jobState.status}
            >
              <Button
                variant="link"
                onClick={() => {
                  const latestTask = jobState.files[jobState.files.length - 1];
                  setSelectedTaskId(latestTask.id);
                }}
              >
                {jobState.status}
              </Button>
            </ProgressStep>
          ))}
        </ProgressStepper>
      </div>
      <JobStates>
        <RawLogRow>
          <JobStateFilterButton
            changeFilter={(sort) => {
              setSort(sort);
              setSelectedTaskId(null);
            }}
          />
          {rawLogFile && (
            <RawLogButton
              variant="tertiary"
              size="sm"
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
          )}
        </RawLogRow>
        {seeRawLog && !loadingRawLog ? (
          <div>
            <FileContent>
              <JobStatePre>{rawLog}</JobStatePre>
            </FileContent>
          </div>
        ) : sort === "date" ? (
          jobStates.map((jobstate, i) => (
            <div key={i}>
              <JobStateRow>
                <JobStateName
                  title={`${Math.round(jobstate.duration)} seconds`}
                >
                  {`Job state ${jobstate.status} (~${humanizeDuration(
                    jobstate.duration * 1000,
                  )})`}
                </JobStateName>
              </JobStateRow>
              {jobstate.files.map((file, j) => (
                <JobStateFile
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
            </div>
          ))
        ) : (
          <div className="pf-v5-u-mt-md">
            {getLongerTaskFirst(jobStates).map((file, k) => (
              <JobStateFile
                key={k}
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
          </div>
        )}
      </JobStates>
    </div>
  );
}
