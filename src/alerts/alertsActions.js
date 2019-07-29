import { isEmpty, keys } from "lodash";
import * as types from "./alertsActionsTypes";

export function showAlert(alert) {
  return {
    type: types.SHOW_ALERT,
    alert
  };
}

export function hideAlert(alert) {
  return {
    type: types.HIDE_ALERT,
    alert
  };
}

function showAndHideAfter10s(alert) {
  return dispatch => {
    dispatch(showAlert(alert));
    setTimeout(() => dispatch(hideAlert(alert)), 10000);
  };
}

export function showSuccess(message) {
  const alert = {
    id: Date.now(),
    title: message,
    type: "success"
  };
  return showAndHideAfter10s(alert);
}

export function showWarning(message) {
  const alert = {
    id: Date.now(),
    title: message,
    message: "",
    type: "warning"
  };
  return showAndHideAfter10s(alert);
}

export function showError(message) {
  const alert = {
    id: Date.now(),
    title: message,
    message: "",
    type: "danger"
  };
  return showAndHideAfter10s(alert);
}

export function showAPIError(error) {
  console.error(error);
  return showAndHideAfter10s(createAlert(error.response));
}

export function createAlert(response) {
  if (isEmpty(response) || isEmpty(response.data))
    return {
      id: Date.now(),
      title: "Unknown error",
      message:
        "We are sorry, an unknown error occurred. Can you try again in a few minutes or contact an administrator?",
      type: "danger"
    };
  const alert = {
    id: Date.now(),
    title: response.data.message || "Request malformed",
    message: "",
    type: "danger"
  };
  const payload = response.data.payload;
  if (isEmpty(payload)) return alert;
  if (Array.isArray(payload.errors)) {
    alert.message = payload.errors.join("\n");
    return alert;
  }
  const error = payload.error || payload.errors || {};
  alert.message = keys(error)
    .map(k => `${k}: ${error[k]}`)
    .join("\n");
  return alert;
}
