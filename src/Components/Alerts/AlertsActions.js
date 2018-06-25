// Copyright 2017 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import * as types from "./AlertsActionsTypes";

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

export function success(message) {
  const alert = {
    id: Date.now(),
    message,
    type: "success"
  };
  return showAndHideAfter10s(alert);
}

export function showSuccess(message) {
  return success(message);
}

export function error(message) {
  const alert = {
    id: Date.now(),
    message,
    type: "error"
  };
  return showAndHideAfter10s(alert);
}

export function showAPIError(response) {
  return error(createAlertMessage(response));
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
