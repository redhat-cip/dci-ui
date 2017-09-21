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

export default function(resourceString) {
  const uppercaseString = resourceString.toUpperCase();
  return {
    GET: `GET_${uppercaseString}`,
    GET_SUCCESS: `GET_${uppercaseString}_SUCCESS`,
    GET_FAILURE: `GET_${uppercaseString}_FAILURE`,
    POST: `POST_${uppercaseString}`,
    POST_SUCCESS: `POST_${uppercaseString}_SUCCESS`,
    POST_FAILURE: `POST_${uppercaseString}_FAILURE`,
    PUT: `PUT_${uppercaseString}`,
    PUT_SUCCESS: `PUT_${uppercaseString}_SUCCESS`,
    PUT_FAILURE: `PUT_${uppercaseString}_FAILURE`,
    DELETE: `DELETE_${uppercaseString}`,
    DELETE_SUCCESS: `DELETE_${uppercaseString}_SUCCESS`,
    DELETE_FAILURE: `DELETE_${uppercaseString}_FAILURE`,
    SET: `SET_${uppercaseString}`,
    CREATE: `CREATE_${uppercaseString}`,
    UPDATE: `UPDATE_${uppercaseString}`,
    REMOVE: `REMOVE_${uppercaseString}`
  };
}
