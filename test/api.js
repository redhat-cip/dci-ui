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

'use strict';

var utils  = require('./utils');
var config = require('../src/config');
var Q      = require('q');
var _      = require('lodash');

var urlize = _.partial(utils.urlize, utils.urlize(config.apiURL, 'api', 'v1'));

//avoid redundant calls by caching some informations
var cache = {};

function memoize(name) {
  var d = Q.defer();
  cache[name] = d.promise;
  return d;
}

module.exports.team = function() {
  if (cache.team) { return cache.team; }
  var d = memoize('team');

  return utils.req(urlize('teams', 'admin'))
    .then(_.property('body.team'))
    .then(function(team) {
      d.resolve(team);
      return team;
    });
};

module.exports.remoteci = function() {
  return module.exports.team()
    .then(function(team) {
      var options = {method: 'POST', params: {team_id: team.id, name: 'foo'}};
      return utils.req(urlize('remotecis'), options);
    })
    .then(_.property('body.remoteci'))
    .then(function(remoteci) {
      remoteci.remove = function() {
        return utils.req(
          urlize('remotecis', remoteci.id),
          {method: 'DELETE', headers: {'If-match': remoteci.etag}}
        );
      };
      return remoteci;
    });
};

module.exports.topic = function() {
  if (cache.topic) { return cache.topic; }
  var d = memoize('topic');

  var req = utils.req(
    urlize('topics'), {method: 'POST', params: {name: 'foo'}}
  );

  return Q.all([module.exports.team(), req])
    .then(function(res) {
      var team = res[0];
      var topic = res[1].body.topic;

      return utils.req(
        urlize('topics', topic.id, 'teams'),
        {method: 'POST', params: {team_id: team.id}}
      ).then(function() {
        d.resolve(topic);
        return topic;
      });
    });
};

module.exports.jobdefinition = function() {
  return module.exports.topic()
    .then(function(topic) {
      return utils.req(
        urlize('jobdefinitions'),
        {method: 'POST', params: {name: 'foo', topic_id: topic.id}}
      ).then(_.property('body.jobdefinition'));
    });
};

module.exports.job = function() {
  return Q.all([
    module.exports.team(), module.exports.remoteci(),
    module.exports.jobdefinition()
  ])
    .then(function(res) {
      var params = {
        team_id: res[0].id, remoteci_id: res[1].id, jobdefinition_id: res[2].id
      };
      return utils.req(urlize('jobs'), {method: 'POST', params: params})
        .then(_.property('body.job'));
    });
};
