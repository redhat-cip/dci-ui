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
import * as date from "./index";

test("date from now", t => {
  const now = new Date(Date.UTC(2018, 5, 14, 8, 30, 59));
  const timezone = "UTC";
  t.is(
    date.fromNow("2018-06-14T08:20:39.139451", timezone, now),
    "10 minutes ago"
  );
});

test("date duration", t => {
  t.is(
    date.duration("2018-06-14T08:30:39.139451", "2018-06-14T08:20:39.139451"),
    "10 minutes"
  );
});
