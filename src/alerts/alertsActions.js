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
    message,
    type: "success"
  };
  return showAndHideAfter10s(alert);
}

export function showWarning(message) {
  const alert = {
    id: Date.now(),
    message,
    type: "warning"
  };
  return showAndHideAfter10s(alert);
}

export function showError(message) {
  const alert = {
    id: Date.now(),
    message,
    type: "error"
  };
  return showAndHideAfter10s(alert);
}

export function showAPIError(response) {
  return showError(createAlertMessage(response));
}

export function createAlertMessage(response) {
  let alertMessage =
    "We are sorry, an unknown error occurred. Can you try again in a few minutes or contact an administrator?";
  if (response.data && response.data.message) {
    alertMessage = response.data.message;
  }
  if (response.data && response.data.payload) {
    let errorDetails = "";
    const payload = response.data.payload;
    const error = payload.error || payload.errors || {};
    const errorKeys = Object.keys(error);
    errorKeys.forEach(errorKey => {
      errorDetails += `\n${errorKey}: ${error[errorKey]}`;
    });
    if (errorDetails) {
      alertMessage += errorDetails;
    }
  }
  return alertMessage;
}
