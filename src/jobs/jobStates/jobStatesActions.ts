import http from "services/http";
import { DateTime } from "luxon";
import {
  IJob,
  IJobState,
  IJobStateWithDuration,
  IFileWithDuration,
  IGetJobStates,
  IJobStateStatus,
  IPipelineStatus,
} from "types";
import { AxiosPromise } from "axios";
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
        }
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
    }
  );
  return newJobStates;
}

export function getJobStatesWithFiles(job: IJob): AxiosPromise<IGetJobStates> {
  return http({
    method: "get",
    url: `/api/v1/jobs/${job.id}/jobstates`,
    params: {
      embed: "files",
    },
  });
}

function getPipelineStatus(status: IJobStateStatus): IPipelineStatus {
  switch (status) {
    case "success":
      return "success";
    case "failure":
    case "error":
      return "failure";
    case "killed":
      return "failure";
    default:
      return "success";
  }
}

export function addPipelineStatus(jobStates: IJobState[]) {
  return sortByOldestFirst(jobStates).map((jobState, i, arr) => {
    const isTheLastOne = arr.length - 1 === i;
    return {
      ...jobState,
      pipelineStatus: isTheLastOne
        ? getPipelineStatus(jobState.status)
        : getPipelineStatus(arr[i + 1].status),
    };
  });
}
