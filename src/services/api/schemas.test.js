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
import schemas from "./schemas";

test("user schema", t => {
  t.deepEqual(schemas.user, [
    "name",
    "fullname",
    "email",
    "team_id",
    "password",
    "role_id"
  ]);
  t.deepEqual(schemas.users, [
    "name",
    "fullname",
    "email",
    "team_id",
    "password",
    "role_id"
  ]);
});

test("team schema", t => {
  t.deepEqual(schemas.team, ["name", "parent_id", "external"]);
  t.deepEqual(schemas.teams, ["name", "parent_id", "external"]);
});

test("topic schema", t => {
  t.deepEqual(schemas.topic, [
    "name",
    "next_topic_id",
    "product_id",
    "component_types"
  ]);
  t.deepEqual(schemas.topics, [
    "name",
    "next_topic_id",
    "product_id",
    "component_types"
  ]);
});

test("job schema", t => {
  t.deepEqual(schemas.job, ["comment", "status"]);
  t.deepEqual(schemas.jobs, ["comment"]);
});

test("remoteci schema", t => {
  t.deepEqual(schemas.remoteci, [
    "name",
    "state",
    "data",
    "team_id"
  ]);
  t.deepEqual(schemas.remotecis, [
    "name",
    "state",
    "data",
    "team_id"
  ]);
});

test("feeder schema", t => {
  t.deepEqual(schemas.feeder, ["name", "state", "data", "team_id"]);
  t.deepEqual(schemas.feeders, ["name", "state", "data", "team_id"]);
});

test("product schema", t => {
  t.deepEqual(schemas.product, ["name", "team_id", "description"]);
  t.deepEqual(schemas.products, ["name", "team_id", "description", "label"]);
});

test("currentUser schema", t => {
  t.deepEqual(schemas.currentUser, [
    "fullname",
    "email",
    "timezone",
    "current_password",
    "new_password"
  ]);
});
