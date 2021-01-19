import http from "services/http";
import { DateTime } from "luxon";
import {
  IJob,
  IJobState,
  IJobStateWithDuration,
  IFileWithDuration,
  IGetJobStates,
} from "types";
import { AppThunk } from "store";
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

export function getJobStatesWithFiles(
  job: IJob
): AppThunk<AxiosPromise<IGetJobStates>> {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "get",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/jobstates`,
      params: {
        embed: "files",
      },
    });
  };
}
