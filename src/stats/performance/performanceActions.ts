import http from "services/http";
import { showError } from "alerts/alertsActions";
import { reverse, sortBy } from "lodash";
import { PerformanceData } from "types";
import { AppThunk } from "store";
import { AxiosPromise } from "axios";

export function calcPerformance<T>(
  jobsIds: string[]
): AppThunk<AxiosPromise<T>> {
  return (dispatch) => {
    const [base_job_id, ...jobs] = jobsIds;
    return http({
      method: "post",
      data: { base_job_id, jobs },
      url: `/api/v1/performance`,
    }).catch((error) => {
      dispatch(
        showError("An error has occurred, make sure the job ids are correct.")
      );
      return error;
    });
  };
}

export function transposePerformance(performance: PerformanceData[]) {
  const rows: (string | number)[][] = [];
  const headers: (null | { job_id: string; title: string })[] = [null, null];
  for (let i = 0; i < performance.length; i++) {
    const job = performance[i];
    headers.push({
      job_id: job.job_id,
      title: `j${i + 1}`,
    });
    const testscases = job.testscases;
    for (let j = 0; j < testscases.length; j++) {
      const testscase = testscases[j];
      if (i === 0) {
        rows.push([testscase.classname, testscase.name]);
      }
      rows[j].push(testscase.delta);
    }
  }
  const sortedRows = reverse(sortBy(rows, (r) => r[r.length - 1]));
  return {
    headers,
    rows: sortedRows,
  };
}
