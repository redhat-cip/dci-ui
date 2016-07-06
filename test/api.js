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

function remove(endpoint, object) {
  var options = {method: 'DELETE', headers: {'If-match': object.etag}};
  return _.partial(utils.req, urlize(endpoint, object.id), options);
}

module.exports.team = _.memoize(function() {
  return utils.req(urlize('teams', 'admin'))
    .then(_.property('body.team'));
});

module.exports.remoteci = _.memoize(function() {
  return module.exports.team()
    .then(function(team) {
      var params = {team_id: team.id, name: 'foo'};
      return utils.req(urlize('remotecis'), {method: 'POST', params: params});
    })
    .then(_.property('body.remoteci'))
    .then(function(remoteci) {
      remoteci.remove = remove('remotecis', remoteci);
      return remoteci;
    });
});

module.exports.topic = _.memoize(function() {
  var topic;
  var req = utils.req(
    urlize('topics'), {method: 'POST', params: {name: 'foo'}}
  );

  return Q.all([module.exports.team(), req])
    .then(_.spread(function(team, topicReq) {
      topic = topicReq.body.topic;

      return utils.req(
        urlize('topics', topic.id, 'teams'),
        {method: 'POST', params: {team_id: team.id}}
      );
    }))
    .then(function() {
      topic.remove = remove('topics', topic);
      return topic;
    });
});

module.exports.component = _.memoize(function() {
  return module.exports.topic()
    .then(function(topic) {
      var params = {topic_id: topic.id, name: 'foo', type: 'bar'};
      return utils.req(urlize('components'), {method: 'POST', params: params});
    })
    .then(_.property('body.component'))
    .then(function(component) {
      component.remove = remove('components', component);
      return component;
    });
});

module.exports.jobdefinition = _.memoize(function() {
  return Q.all([module.exports.topic(), module.exports.component()])
    .then(_.spread(function(topic) {
      var params = {name: 'foo', topic_id: topic.id, component_types: ['bar']};
      return utils.req(
        urlize('jobdefinitions'), {method: 'POST', params: params}
      );
    }))
    .then(_.property('body.jobdefinition'))
    .then(function(jobdefinition) {
      jobdefinition.remove = remove('jobdefinitions', jobdefinition);
      return jobdefinition;
    });
});

module.exports.job = _.memoize(function() {
  return Q.all([
    module.exports.remoteci(), module.exports.topic(),
    module.exports.jobdefinition()
  ])
    .then(_.spread(function(remoteci, topic) {
      var params = {remoteci_id: remoteci.id, topic_id: topic.id};

      return utils.req(
        urlize('jobs', 'schedule'), {method: 'POST', params: params}
      );
    }))
    .then(_.property('body.job'))
    .then(function(job) {
      job.remove = remove('job', job);
      return job;
    })
    .fail(function(res) {
      console.log('something went wrong');
      console.log(res.url);
      console.log(res.body);
      console.log();
    });
});
