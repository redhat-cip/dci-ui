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

function createResourcesActionsTypes(resource) {
  return ["REQUEST", "SUCCESS", "FAILURE"].reduce((accumulator, type) => {
    accumulator[`FETCH_${type}`] = `FETCH_${resource}_${type}`;
    return accumulator;
  }, {});
}

export function createActionsTypes(resource) {
  let RESOURCE = resource.toUpperCase();
  return ["REQUEST", "SUCCESS", "FAILURE"].reduce((accumulator, type) => {
    accumulator[`FETCH_ALL_${type}`] = `FETCH_${RESOURCE}S_${type}`;
    accumulator[`FETCH_${type}`] = `FETCH_${RESOURCE}_${type}`;
    accumulator[`CREATE_${type}`] = `CREATE_${RESOURCE}_${type}`;
    accumulator[`UPDATE_${type}`] = `UPDATE_${RESOURCE}_${type}`;
    accumulator[`DELETE_${type}`] = `DELETE_${RESOURCE}_${type}`;
    return accumulator;
  }, {});
}

export const jobs = createResourcesActionsTypes("JOBS");
export const users = createResourcesActionsTypes("USERS");
export const job = createActionsTypes("JOB");
export const user = createActionsTypes("USER");
