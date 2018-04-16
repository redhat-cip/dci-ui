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

import * as constants from "./constants";

export function sendAlert(alert) {
  return {
    type: constants.SEND_ALERT,
    payload: alert
  };
}

export function closeAlert(id) {
  return {
    type: constants.CLOSE_ALERT,
    payload: {
      id
    }
  };
}

export function sendAndDeleteAlert(message, persist, type) {
  return dispatch => {
    const id = Date.now();
    dispatch(sendAlert({ id, message, type: type }));
    if (!persist) {
      setTimeout(() => dispatch(closeAlert(id)), 10000);
    }
  };
}

export function success(message, persist = false) {
  return dispatch => {
    dispatch(sendAndDeleteAlert(message, persist, "success"));
  };
}

export function error(message, persist = false) {
  return dispatch => {
    dispatch(sendAndDeleteAlert(message, persist, "danger"));
  };
}

export function close({ id }) {
  return dispatch => {
    dispatch(closeAlert(id));
  };
}

export function createAlert(response) {
  let alert =
    "We are sorry, an unknown error occurred. Can you try again in a few minutes or contact an administrator?";
  if (response.data && response.data.message) {
    alert = response.data.message;
  }
  if (response.data && response.data.payload) {
    let errorDetails = "";
    const payload = response.data.payload;
    const error = payload.error || payload.errors || {};
    const errorKeys = Object.keys(error);
    errorKeys.forEach(errorKey => {
      errorDetails += `${errorKey}: ${error[errorKey]}\n`;
    });
    if (errorDetails) {
      alert += `\n${errorDetails}`;
    }
  }
  return alert;
}

export function errorApi(response, persist = false) {
  const alert = createAlert(response);
  return dispatch => {
    dispatch(error(alert, persist));
  };
}
