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

const userSchema = {
  post: ["name", "fullname", "email", "team_id", "password", "role_id"],
  put: ["name", "fullname", "email", "team_id", "password", "role_id"]
};

const teamSchema = {
  post: ["name", "external"],
  put: ["name", "external"]
};

const topicSchema = {
  post: ["name", "next_topic", "product_id", "component_types"],
  put: ["name", "next_topic", "product_id", "component_types"]
};

const jobSchema = {
  post: ["comment"],
  put: ["comment", "status"]
};

const remoteciSchema = {
  post: ["name", "state", "allow_upgrade_job", "data", "team_id"],
  put: ["name", "state", "allow_upgrade_job", "data", "team_id"]
};

const feederSchema = {
  post: ["name", "state", "data", "team_id"],
  put: ["name", "state", "data", "team_id"]
};

const productSchema = {
  post: ["name", "team_id", "description", "label"],
  put: ["name", "team_id", "description"]
};

export default {
  users: userSchema.post,
  user: userSchema.put,
  currentUser: [
    "fullname",
    "email",
    "timezone",
    "current_password",
    "new_password"
  ],
  teams: teamSchema.post,
  team: teamSchema.put,
  topics: topicSchema.post,
  topic: topicSchema.put,
  jobs: jobSchema.post,
  job: jobSchema.put,
  remotecis: remoteciSchema.post,
  remoteci: remoteciSchema.put,
  feeders: feederSchema.post,
  feeder: feederSchema.put,
  products: productSchema.post,
  product: productSchema.put
};
