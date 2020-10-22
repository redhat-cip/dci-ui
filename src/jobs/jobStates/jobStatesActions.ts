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

export function addDuration(jobStates: IJobState[]) {
  const { newJobStates } = jobStates
    .sort((js1, js2) => {
      const js1CreatedAt = DateTime.fromISO(js1.created_at);
      const js2CreatedAt = DateTime.fromISO(js2.created_at);
      if (js1CreatedAt > js2CreatedAt) {
        return 1;
      }
      if (js1CreatedAt < js2CreatedAt) {
        return -1;
      }
      return 0;
    })
    .reduce(
      (acc, jobState) => {
        const { newFiles, duration } = jobState.files
          .sort((f1, f2) => {
            const f1CreatedAt = DateTime.fromISO(f1.created_at);
            const f2CreatedAt = DateTime.fromISO(f2.created_at);
            if (f1CreatedAt > f2CreatedAt) {
              return 1;
            }
            if (f1CreatedAt < f2CreatedAt) {
              return -1;
            }
            return 0;
          })
          .reduce(
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
