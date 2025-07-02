import { DateTime } from "luxon";
import { FinalJobStatuses } from "types";
import type {
  IJobState,
  IJobStateWithDuration,
  IFileWithDuration,
  IJobStatus,
  IPipelineStatus,
} from "types";
import { sortByOldestFirst } from "services/sort";

export function addDuration(jobStates: IJobState[]) {
  const { newJobStates } = sortByOldestFirst(jobStates).reduce(
    (acc, jobState) => {
      const { newFiles, duration } = sortByOldestFirst(jobState.files).reduce(
        (fileAcc, file) => {
          const duration = acc.currentDate
            ? DateTime.fromISO(file.created_at)
                .diff(acc.currentDate)
                .as("seconds")
            : 0;
          fileAcc.newFiles.push({
            ...file,
            duration,
          });
          fileAcc.duration += duration;
          acc.currentDate = DateTime.fromISO(file.updated_at);
          return fileAcc;
        },
        { newFiles: [], duration: 0 } as {
          newFiles: IFileWithDuration[];
          duration: number;
        },
      );
      acc.newJobStates.push({
        ...jobState,
        files: newFiles,
        duration,
      });
      return acc;
    },
    { newJobStates: [], currentDate: null } as {
      newJobStates: IJobStateWithDuration[];
      currentDate: DateTime | null;
    },
  );
  return newJobStates;
}

function getFinalPipelineStatus(status: IJobStatus): IPipelineStatus {
  switch (status) {
    case "running":
      return "info";
    case "failure":
    case "error":
      return "danger";
    case "killed":
      return "warning";
    default:
      return "success";
  }
}

export function addPipelineStatus(jobStates: IJobState[]) {
  return sortByOldestFirst(jobStates).map((jobState, i, arr) => {
    const isTheLastOne = arr.length - 1 === i;
    const isThePenultimate = arr.length > 1 && arr.length - 2 === i;
    let pipelineStatus: IPipelineStatus = "success";
    if (isTheLastOne) {
      pipelineStatus = getFinalPipelineStatus(jobState.status);
    } else {
      const nextStatus = arr[i + 1].status;
      const nextStatusIsFinalJobStatus =
        (FinalJobStatuses as readonly string[]).indexOf(nextStatus) !== -1;
      if (isThePenultimate && nextStatusIsFinalJobStatus) {
        pipelineStatus = getFinalPipelineStatus(nextStatus);
      }
    }
    return {
      ...jobState,
      pipelineStatus,
    };
  });
}

export function getLongerTaskFirst(jobStates: IJobStateWithDuration[]) {
  const tasks: IFileWithDuration[] = [];
  for (let index = 0; index < jobStates.length; index++) {
    const jobState = jobStates[index];
    for (let j = 0; j < jobState.files.length; j++) {
      const task = jobState.files[j];
      tasks.push(task);
    }
  }
  return tasks.sort((t1, t2) => t2.duration - t1.duration);
}
