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
  "role_id": "63eb47d5-0395-4cbb-ab19-738a2f7633d9",
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
  "role_id": "5695bf02-771d-4720-b0e9-82b4e4cb2479",
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

var roles = [{
  "created_at": "2017-04-25T08:33:18.394231",
  "description": "Admin of the platform",
  "etag": "169b20cd33997a518edb55b53c70ee79",
  "id": "63eb47d5-0395-4cbb-ab19-738a2f7633d9",
  "label": "SUPER_ADMIN",
  "name": "Super Admin",
  "state": "active",
  "team_id": "c66f4ef6-88a8-4a97-bc78-74d7c03d69b9",
  "updated_at": "2017-04-25T08:33:18.394237",
  "user_id": null
}, {
  "created_at": "2017-04-25T08:33:18.393274",
  "description": "Regular User",
  "etag": "37e8b8e705d807639fe05da1fbfc2276",
  "id": "5695bf02-771d-4720-b0e9-82b4e4cb2479",
  "label": "USER",
  "name": "User",
  "state": "active",
  "team_id": "c66f4ef6-88a8-4a97-bc78-74d7c03d69b9",
  "updated_at": "2017-04-25T08:33:18.393283",
  "user_id": null
}, {
  "created_at": "2017-04-25T08:33:18.391924",
  "description": "Admin of a team",
  "etag": "b2b910bdbe51c649f299067e55131b94",
  "id": "f02bc912-86fe-4e98-99ee-18ecc32222cc",
  "label": "ADMIN",
  "name": "Admin",
  "state": "active",
  "team_id": "c66f4ef6-88a8-4a97-bc78-74d7c03d69b9",
  "updated_at": "2017-04-25T08:33:18.391935",
  "user_id": null
}];

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

var remotecis = [{
  "active": true,
  "allow_upgrade_job": false,
  "created_at": "2017-01-27T21:42:06.655716",
  "data": {"certification_id": "85637-bxKlGODovR1dKAU8yJFn6y2Fs/FNAdFtQNJN9ncjovDtWwWWo319V6ul3FxSEyWPjdbtfPRuf74dekyTT+Vz3y7g9gEDGu11nyDoKPMxEUerXcxyhnU37KlwbQlKnehLmFKgl8UzNj5dfYdcZAh2pMJA7rASscKVekXa0ZiECgrk9PI0tmILhYESk6QPX5a0tuqK1XVXRXW+C38WCWSLQwIpvFONOD6uK4Zb1S4pQNU="},
  "etag": "48db63266779736d3c54d96946954a29",
  "id": "c76c40a2-82c7-40e8-959b-0883d32edda8",
  "name": "Admin Remote CI",
  "state": "active",
  "team_id": "ac654db0-c6ff-40e8-82c7-9bc49989cb86",
  "updated_at": "2017-01-27T21:46:24.594604"
}, {
  "active": true,
  "allow_upgrade_job": null,
  "created_at": "2017-01-13T16:26:34.956399",
  "data": {},
  "etag": "0fdd7a8713f336c15dbe213dcc92b4b5",
  "id": "f38d1835-af1d-82c7-1dcb-48f34439ece6",
  "name": "Test RDO",
  "state": "active",
  "team_id": "ac654db0-c6ff-40e8-82c7-9bc49989cb86",
  "updated_at": "2017-01-13T16:26:34.956399"
}];
var remoteci = remotecis[0];

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
