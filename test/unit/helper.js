// Copyright 2015 Red Hat, Inc.
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

var $httpBackend;

beforeEach(module('app'));

beforeEach(module('templates'));


var users = [{
  "created_at": "2017-02-20T17:32:48.744939",
  "updated_at": "2017-02-20T17:32:48.828440",
  "etag": "59b891ba3e97763da40b797c1638ee7f",
  "id": "4bdddeb3-ce9f-4590-b715-e1b21ed257d3",
  "name": "admin",
  "role": "admin",
  "state": "active",
  "team": {
    "country": null,
    "created_at": "2017-02-20T17:32:48.200667",
    "email": "admin@example.org",
    "etag": "da40b797c1638ee7f59b891ba3e97763",
    "id": "ac654db0-c6ff-40e8-82c7-9bc49989cb86",
    "name": "admins",
    "notification": true,
    "state": "active",
    "updated_at": "2017-02-20T17:32:48.081616"
  }
}, {
  "created_at": "2017-02-22T12:32:48.469453",
  "updated_at": "2017-02-22T12:32:48.469465",
  "etag": "7f59b891ba3e97763da40b797c1638ee",
  "id": "ac654db0-ce9f-4c3c-b715-c4bdddeb7e61",
  "name": "user",
  "role": "user",
  "state": "active",
  "team": {
    "country": null,
    "created_at": "2017-02-22T12:32:48.744939",
    "email": "user@example.org",
    "etag": "a3e97763da40b797c1638ee7f59b891b",
    "id": "4db0ac65-3c4c-4d09-a8fa-257d3e1b21ed",
    "name": "users",
    "notification": null,
    "state": "active",
    "updated_at": "2017-02-22T12:32:48.744946"
  }
}];

var teams = [{
  "country": null,
  "created_at": "2017-02-20T17:32:48.200667",
  "email": "admin@example.org",
  "etag": "da40b797c1638ee7f59b891ba3e97763",
  "id": "ac654db0-c6ff-40e8-82c7-9bc49989cb86",
  "name": "admin",
  "notification": true,
  "state": "active",
  "updated_at": "2017-02-20T17:32:48.081616"
}, {
  "country": null,
  "created_at": "2017-02-22T12:32:48.744939",
  "email": "user@example.org",
  "etag": "a3e97763da40b797c1638ee7f59b891b",
  "id": "4db0ac65-3c4c-4d09-a8fa-257d3e1b21ed",
  "name": "user",
  "notification": null,
  "state": "active",
  "updated_at": "2017-02-22T12:32:48.744946"
}];

var admin = users[0];
var adminTeam = teams[0];

var topics = [{
  "created_at": "2016-11-24T08:56:04.539457",
  "etag": "c27003f5a518e0c57fb97c39afb41baf",
  "id": "d95c065a-fbc9-984c-8e9d-454d1a9171a7",
  "label": null,
  "name": "OSP10",
  "next_topic": null,
  "state": "active",
  "updated_at": "2017-01-09T15:29:27.830690"
}, {
  "created_at": "2016-12-18T14:36:14.202376",
  "etag": "5f356f608ffc94fdcebb6f5c4ee8af29",
  "id": "68135ce1-38ef-42ab-ac07-4045627cbe11",
  "label": null,
  "name": "RDO-Ocata",
  "next_topic": null,
  "state": "active",
  "updated_at": "2016-12-18T14:37:04.858387"
}];
var osp10 = topics[0];
var osp10Teams = [teams[0]];

var audits = [{
  "action": "create_teams",
  "created_at": "2017-03-22T18:50:00.373988",
  "id": "4db0ac65-3c4c-4d09-a8fa-257d3e1b21ed",
  "team_id": "73de0e1f-6904-a849-82c7-e1b21ed257d3",
  "user_id": "5e3688e5-98ac-4590--9bc49989cb86"
}, {
  "action": "create_teams",
  "created_at": "2017-03-22T18:49:38.209233",
  "id": "0ac654db-3c4c-4d09-faa8-e1b21ed257d3",
  "team_id": "7e1f3de0-6904-a849-82c7-e257d31b21ed",
  "user_id": "688e55e3-6049-49a8-c782-e21ed251b7d3"
}];

beforeEach(module(function($provide) {
  $provide.value('user', admin);
}));

beforeEach(inject(function($injector) {
  $httpBackend = $injector.get('$httpBackend');
  $httpBackend
    .when('GET', '/config.json')
    .respond({apiURL: 'https://api.example.org', version: '7489734'});
  $httpBackend.flush();
}));


afterEach(function() {
  $httpBackend.verifyNoOutstandingExpectation();
  $httpBackend.verifyNoOutstandingRequest();
});
