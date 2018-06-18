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
import { schema } from "normalizr";

const component = new schema.Entity("components");
const jobstate = new schema.Entity("jobstates");
const remoteci = new schema.Entity("remotecis");
const result = new schema.Entity("results");
const topic = new schema.Entity("topics");
const rconfiguration = new schema.Entity("rconfigurations");
export const job = new schema.Entity("jobs", {
  components: [component],
  jobstates: [jobstate],
  results: [result],
  remoteci: remoteci,
  topic: topic,
  rconfiguration: rconfiguration
});
export const jobs = [job];

export const user = new schema.Entity("users");
export const users = [user];

export const product = new schema.Entity("products");
export const products = [product];
