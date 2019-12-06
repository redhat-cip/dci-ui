import http from "services/http";
import { showError } from "alerts/alertsActions";
import { reverse, sortBy } from "lodash";

export function calcPerformance(jobs_ids) {
  return (dispatch, getState) => {
    const state = getState();
    const [base_job_id, ...jobs] = jobs_ids;
    const request = {
      method: "post",
      data: { base_job_id, jobs },
      url: `${state.config.apiURL}/api/v1/performance`
    };
    return http(request).catch(error => {
      dispatch(
        showError("An error has occurred, make sure the job ids are correct.")
      );
      return error;
    });
  };
}

export function transposePerformance(performance) {
  const rows = [];
  const headers = [null, null];
  for (let i = 0; i < performance.length; i++) {
    const job = performance[i];
    headers.push({
      job_id: job.job_id,
      title: `j${i + 1}`
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
  const sortedRows = reverse(sortBy(rows, r => r[r.length - 1]));
  return {
    headers,
    rows: sortedRows
  };
}
