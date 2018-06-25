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

import test from "ava";
import * as actions from "./AlertsActions";
import * as types from "./AlertsActionsTypes";

test("showAlert", t => {
  const alert = {
    id: "a1"
  };
  const expectedAction = {
    type: types.SHOW_ALERT,
    alert
  };
  t.deepEqual(actions.showAlert(alert), expectedAction);
});

test("hideAlert", t => {
  const alert = {
    id: "a1"
  };
  const expectedAction = {
    type: types.HIDE_ALERT,
    alert
  };
  t.deepEqual(actions.hideAlert(alert), expectedAction);
});

test("createAlertMessage", t => {
  const data = {
    _status: "Unauthorized",
    message:
      "Could not verify your access level for that URL. Please login with proper credentials."
  };
  t.is(
    actions.createAlertMessage({ data, status: 401 }),
    "Could not verify your access level for that URL. Please login with proper credentials."
  );
});

test("createAlertMessage with one error", t => {
  const data = {
    message: "conflict on topics",
    payload: {
      error: {
        name: "already_exists"
      }
    },
    status_code: 409
  };
  t.is(
    actions.createAlertMessage({ data, status: 409 }),
    "conflict on topics\nname: already_exists"
  );
});

test("createAlertMessage with multiple errors", t => {
  const data = {
    message: "Request malformed",
    payload: {
      errors: {
        name: "already_exists",
        team_id: "not a valid team id"
      }
    },
    status_code: 400
  };
  t.is(
    actions.createAlertMessage({ data, status: 400 }),
    "Request malformed\nname: already_exists\nteam_id: not a valid team id"
  );
});

test("createAlertMessage with empty payload", t => {
  const data = {
    message: "Request malformed",
    payload: {},
    status_code: 400
  };
  t.is(actions.createAlertMessage({ data, status: 400 }), "Request malformed");
});

test("createAlertMessage with unknown format", t => {
  const data = {
    error: "Request malformed"
  };
  t.is(
    actions.createAlertMessage({ data, status: 400 }),
    "We are sorry, an unknown error occurred. Can you try again in a few minutes or contact an administrator?"
  );
});

test("createAlertMessage with no data format", t => {
  t.is(
    actions.createAlertMessage({ status: 400 }),
    "We are sorry, an unknown error occurred. Can you try again in a few minutes or contact an administrator?"
  );
});
