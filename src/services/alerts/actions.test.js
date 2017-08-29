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

import test from 'ava';
import * as alertsActions from './actions';

test("create alert", t => {
  const data = {
    "_status": "Unauthorized",
    "message": "Could not verify your access level for that URL. Please login with proper credentials."
  };
  const alert = alertsActions.createAlert({data, status: 401});
  t.is(alert, 'Could not verify your access level for that URL. Please login with proper credentials.');
});

test("create alert with one error", t => {
  const data = {
    "message": "conflict on topics",
    "payload": {
      "error": {
        "name": "already_exists"
      }
    },
    "status_code": 409
  };
  const alert = alertsActions.createAlert({data, status: 409});
  t.is(alert, 'conflict on topics\nname: already_exists\n');
});

test("create alert with multiple errors", t => {
  const data = {
    "message": "Request malformed",
    "payload": {
      "errors": {
        "name": "already_exists",
        "team_id": "not a valid team id"
      }
    },
    "status_code": 400
  };
  const alert = alertsActions.createAlert({data, status: 400});
  t.is(alert, 'Request malformed\nname: already_exists\nteam_id: not a valid team id\n');
});

test("create alert with empty payload", t => {
  const data = {
    "message": "Request malformed",
    "payload": {},
    "status_code": 400
  };
  const alert = alertsActions.createAlert({data, status: 400});
  t.is(alert, 'Request malformed');
});

test("create alert with unknown format", t => {
  const data = {
    "error": "Request malformed"
  };
  const alert = alertsActions.createAlert({data, status: 400});
  t.is(alert, 'We are sorry, an unknown error occurred. Can you try again in a few minutes or contact an administrator?');
});

test("create alert with no data format", t => {
  const alert = alertsActions.createAlert({status: 400});
  t.is(alert, 'We are sorry, an unknown error occurred. Can you try again in a few minutes or contact an administrator?');
});
