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
import { get_teams_from_remotecis, order } from "./index";

test("get teams from remotecis", t => {
  const remotecis = [
    { id: "r1", team: { id: "t1" } },
    { id: "r2", team: { id: "t1" } },
    { id: "r3", team: { id: "t2" } }
  ];
  const teams = get_teams_from_remotecis(remotecis);
  const expected_teams = [
    { id: "t1", remotecis: [{ id: "r1" }, { id: "r2" }] },
    { id: "t2", remotecis: [{ id: "r3" }] }
  ];
  t.deepEqual(expected_teams, teams);
});

test("order teams by name", t => {
  const teams = [{ id: "t1", name: "b" }, { id: "t2", name: "a" }];
  const ordered_teams = order(teams);
  const expected_teams = [{ id: "t2", name: "a" }, { id: "t1", name: "b" }];
  t.deepEqual(expected_teams, ordered_teams);
});

test("order teams by name already ordered", t => {
  const teams = [{ id: "t1", name: "a" }, { id: "t2", name: "b" }];
  const ordered_teams = order(teams);
  const expected_teams = [{ id: "t1", name: "a" }, { id: "t2", name: "b" }];
  t.deepEqual(expected_teams, ordered_teams);
});

test("order teams by name same name", t => {
  const teams = [{ id: "t1", name: "a" }, { id: "t2", name: "a" }];
  const ordered_teams = order(teams);
  const expected_teams = [{ id: "t1", name: "a" }, { id: "t2", name: "a" }];
  t.deepEqual(expected_teams, ordered_teams);
});

test("order teams by name case insensitive", t => {
  const teams = [{ id: "t1", name: "a" }, { id: "t2", name: "A" }];
  const ordered_teams = order(teams);
  const expected_teams = [{ id: "t1", name: "a" }, { id: "t2", name: "A" }];
  t.deepEqual(expected_teams, ordered_teams);
});
