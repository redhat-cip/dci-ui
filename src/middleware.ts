import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import { hideAlert, showAlert } from "alerts/alertsActions";
import { getAlertFromBaseQueryError } from "services/errorHelpers";

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const alert = getAlertFromBaseQueryError(action.payload);
      api.dispatch(showAlert(alert));
      setTimeout(() => api.dispatch(hideAlert(alert)), 10000);
    }
    return next(action);
  };
