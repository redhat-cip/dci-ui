import { AxiosError } from "axios";
import { isEmpty } from "lodash";
import { AppThunk } from "store";
import { DCIError, IAlert } from "types";
import * as types from "./alertsActionsTypes";

export function showAlert(alert: IAlert) {
  return {
    type: types.SHOW_ALERT,
    alert,
  };
}

export function hideAlert(alert: IAlert) {
  return {
    type: types.HIDE_ALERT,
    alert,
  };
}

function showAndHideAfter10s(alert: IAlert): AppThunk<void> {
  return (dispatch) => {
    dispatch(showAlert(alert));
    setTimeout(() => dispatch(hideAlert(alert)), 10000);
  };
}

export function showSuccess(title: string, message: string = "") {
  const alert: IAlert = {
    id: Date.now().toString(),
    title,
    type: "success",
    message,
  };
  return showAndHideAfter10s(alert);
}

export function showWarning(title: string, message: string = "") {
  const alert: IAlert = {
    id: Date.now().toString(),
    title,
    type: "warning",
    message,
  };
  return showAndHideAfter10s(alert);
}

export function showError(title: string, message: string = "") {
  const alert: IAlert = {
    id: Date.now().toString(),
    title,
    type: "danger",
    message,
  };
  return showAndHideAfter10s(alert);
}

export function showAPIError(error: AxiosError<DCIError>) {
  return showAndHideAfter10s(createAlert(error));
}

export function createAlert(axiosError: AxiosError<DCIError>): IAlert {
  const data = axiosError?.response?.data;
  if (isEmpty(data))
    return {
      id: Date.now().toString(),
      title: "Unknown error",
      message:
        "We are sorry, an unknown error occurred. Can you try again in a few minutes or contact an administrator?",
      type: "danger",
    };
  const alert: IAlert = {
    id: Date.now().toString(),
    title: data.message || "Request malformed",
    message: "",
    type: "danger",
  };
  const payload = data.payload;
  if (isEmpty(payload)) return alert;
  if (Array.isArray(payload.errors)) {
    alert.message = payload.errors.join("\n");
    return alert;
  }
  const error = payload.error || payload.errors || {};
  alert.message = (Object.keys(error) as Array<keyof typeof error>)
    .map((k) => `${k}: ${error[k]}`)
    .join("\n");
  return alert;
}
