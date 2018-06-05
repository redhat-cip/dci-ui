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

const componentSchema = new schema.Entity("components");
const jobstateSchema = new schema.Entity("jobstates");
const remoteciSchema = new schema.Entity("remotecis");
const resultSchema = new schema.Entity("results");
const topicSchema = new schema.Entity("topics");
const rconfigurationSchema = new schema.Entity("rconfigurations");
const jobSchema = new schema.Entity("jobs", {
  components: [componentSchema],
  jobstates: [jobstateSchema],
  results: [resultSchema],
  remoteci: remoteciSchema,
  topic: topicSchema,
  rconfiguration: rconfigurationSchema
});
export const jobsSchema = [jobSchema];
