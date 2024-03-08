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
  JobStateHR,
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
  DropdownPosition,
} from "@patternfly/react-core/deprecated";
import {
  SortAmountDownIcon,
  SortAmountDownAltIcon,
  CogIcon,
  CheckIcon,
} from "@patternfly/react-icons";
import {
  global_Color_light_100,
  global_palette_black_500,
} from "@patternfly/react-tokens";
import { useTheme } from "ui/Theme/themeContext";

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
        const element = document.getElementById("toggle-sort-job-tasks");
        element && element.focus();
      }}
      position={DropdownPosition.right}
      toggle={
        <DropdownToggle
          toggleIndicator={null}
          onToggle={(_event, isOpen: boolean) => setIsOpen(isOpen)}
          id="toggle-sort-job-tasks"
          style={{ color: global_palette_black_500.value }}
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

function JobSettingsDropdown({
  seeRawLog,
  setSeeRawLog,
  seeTimestamp,
  setSeeTimestamp,
}: {
  seeRawLog: boolean;
  setSeeRawLog: () => void;
  seeTimestamp: boolean;
  setSeeTimestamp: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown
      onSelect={() => {
        setIsOpen(false);
        const element = document.getElementById("toggle-settings-primary");
        element && element.focus();
      }}
      position={DropdownPosition.right}
      isPlain
      toggle={
        <DropdownToggle
          toggleIndicator={null}
          id="toggle-settings-primary"
          onToggle={(_event, isOpen: boolean) => setIsOpen(isOpen)}
        >
          <CogIcon style={{ color: global_palette_black_500.value }} />
        </DropdownToggle>
      }
      isOpen={isOpen}
      dropdownItems={[
        <DropdownItem
          key="action"
          component="button"
          onClick={setSeeRawLog}
          icon={
            seeRawLog ? (
              <CheckIcon />
            ) : (
              <span className="pf-v5-c-dropdown__menu-item-icon"></span>
            )
          }
        >
          View raw logs
        </DropdownItem>,
        <DropdownItem
          key="action"
          component="button"
          onClick={setSeeTimestamp}
          disabled={seeRawLog}
          icon={
            seeTimestamp ? (
              <CheckIcon />
            ) : (
              <span className="pf-v5-c-dropdown__menu-item-icon"></span>
            )
          }
        >
          Show timestamps
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
  const [seeTimestamp, setSeeTimestamp] = useState(false);
  const [rawLog, setRawLog] = useState("Loading raw log");
  const { isDark } = useTheme();

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
          backgroundColor: isDark ? "#1b1d21" : global_Color_light_100.value,
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
      <JobStates isDark={isDark}>
        <RawLogRow>
          <JobStateFilterButton
            changeFilter={(sort) => {
              setSort(sort);
              setSelectedTaskId(null);
            }}
          />
          {rawLogFile !== undefined && (
            <JobSettingsDropdown
              seeRawLog={seeRawLog}
              setSeeRawLog={() => {
                setSeeRawLog(!seeRawLog);
                getFileContent(rawLogFile)
                  .then((content) => {
                    setRawLog(content);
                  })
                  .catch(() =>
                    setRawLog(
                      "We can't get the raw log. Can you try again in a few minutes or contact an administrator? ",
                    ),
                  );
              }}
              seeTimestamp={seeTimestamp}
              setSeeTimestamp={() => setSeeTimestamp(!seeTimestamp)}
            />
          )}
        </RawLogRow>
        <JobStateHR />

        {seeRawLog ? (
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
                  seeTimestamp={seeTimestamp}
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
                seeTimestamp={seeTimestamp}
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
