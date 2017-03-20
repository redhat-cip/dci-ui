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
    "notification": null,
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
  "notification": null,
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
var user = users[1];
var adminTeam = teams[0];
var userTeam = teams[1];

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
