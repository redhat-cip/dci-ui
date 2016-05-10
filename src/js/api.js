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

require('app')

.factory('api', ['$injector', function($injector) {
  var $q = $injector.get('$q');
  var $http = $injector.get('$http');
  var $window = $injector.get('$window');
  var config = $injector.get('config');
  var user = $injector.get('user');
  var api = {urls: {}};
  var urlize = _.rest(_.partialRight(_.join, '/'));
  var urlPttrn = new RegExp('(https?://)(.*)');

  config.promise.then(function() {
    _.each([
      'jobs', 'remotecis', 'jobstates', 'files', 'users', 'teams',
      'components', 'jobdefinitions', 'audits', 'topics'
    ], function(endpoint) {
      api.urls[endpoint] = urlize(config.apiURL, 'api', 'v1', endpoint);
    });
  });

  api.getJobs = function(page) {
    var offset = 20 * (page - 1);
    var conf = {'params': {
      'limit': 20, 'offset': offset, 'sort': '-updated_at',
      'embed': 'remoteci,jobdefinition'
    }};
    return $http.get(api.urls.jobs, conf).then(_.property('data'));
  };

  api.getJobStates = function(job) {
    url = urlize(api.urls.jobs, job, 'jobstates');
    return $http.get(url).then(_.property('data.jobstates'));
  };

  api.searchJobs = function(remotecis, statuses) {
    function retrieveRCIs(remoteci) {
      var conf = {'params': {'where': 'name:' + remoteci}};
      return $http.get(api.urls.remotecis, conf);
    };

    function retrieveJobs(status) {
      var conf = {'params': {
        'where': 'status:' + status, 'embed': 'remoteci,jobdefinition'
      }};
      return $http.get(api.urls.jobs, conf);
    };

    api.getJobStates = function(job) {
      url = urlize(api.urls.jobs, job, 'jobstates');
      return $http.get(url).then(_.property('data.jobstates'));
    };

    function retrieveJsRCI(remoteciResps) {
      return _(remoteciResps)
      .map(_.property('data.remotecis'))
      .flatten()
      .map(_.property('id'))
      .map(function(remoteci) {
        var conf = {'params': {
          'embed': 'remoteci,jobdefinition',
          'where': 'remoteci_id:' + remoteci,
        }};
        return $http.get(api.urls.jobs, conf);
      })
      .thru($q.all)
      .value();
    }
    return $q.all([
      _(remotecis).map(retrieveRCIs).thru($q.all).value().then(retrieveJsRCI),
      _(statuses).map(retrieveJobs).thru($q.all).value()
    ])
    .then(function(data) {
      var getJobs = _().map(_.property('data.jobs')).flatten();
      var RCISJobs = getJobs.plant(_.first(data)).value();
      var SSJobs = getJobs.plant(_.last(data)).value();

      if (SSJobs.length && RCISJobs.length) {
        var RCISJobsIds = _.map(RCISJobs, 'id');
        return _.filter(SSJobs, function(job) {
          return _.includes(RCISJobsIds, job.id);
        });
      } else {
        return SSJobs.concat(RCISJobs);
      }
    })
    .then(function(jobs) {
      return {'jobs': jobs};
    });
  };
  api.updateJob = function(job_id, etag, data) {
    var conf = {'headers': {'If-Match': etag}};
    return $http.put(urlize(api.urls.jobs, job_id), data, conf);
  };

  api.getJob = function(job) {
    var retrieveFiles = function(data) {
      return _.assign(
        _.first(data).data.job,
        {'jobstates': _.last(data).data.jobstates}
      );
    };

    var parseFiles = function(data) {
      _(data)
      .initial()
      .map(_.property('data.files'))
      .zip(_.last(data).jobstates)
      .map(function(elt) {
        return _.assign(_.last(elt), {'files': _.first(elt)});
      })
      .value();

      return _.last(data);
    };
    var conf = {'params': {'embed': 'remoteci,jobdefinition'}};
    var JSconf = {'params': {'sort': '-created_at'}};

    return $q.all([
      $http.get(urlize(api.urls.jobs, job), conf),
      $http.get(urlize(api.urls.jobs, job, 'jobstates'), JSconf)
    ])
    .then(retrieveFiles);
  };

  api.getComponents = function(jobDef) {
    var url = (
      jobDef ? urlize(api.urls.jobdefinitions, jobDef, 'components') :
        api.url.components
    );

    return $http.get(url).then(_.property('data.components'));
  };

  api.getJobFiles = function(job) {
    var url = urlize(api.urls.jobs, job, 'files');
    return $http.get(url).then(_.property('data.files'));
  };

  api.getFiles = function(jobstateID) {
    var conf = {'params': {'where': 'jobstate_id:' + jobstateID}};
    return $http.get(api.urls.files, conf)
    .then(_.property('data.files'))
    .then(_.partialRight(_.map, function(elt) {
      // build link in the form of
      // http(s)://username:password@apiURL/files/file_id/content
      elt.dl_link = api.urls.files.replace(urlPttrn, function(_, g1, g2) {
        return urlize(
          g1 + $window.atob(user.token) + '@' + g2, elt.id, 'content'
        );
      });
      return elt;
    }));
  };

  api.getRemoteCI = function(name) {
    var url = urlize(api.urls.remotecis, name);
    return $http.get(url).then(_.property('data.remoteci'));
  };

  api.getRemoteCIS = function() {
    var extractRemoteCIS = _.partialRight(_.get, 'data.remotecis');
    return $http.get(api.urls.remotecis).then(extractRemoteCIS);
  };

  api.postRemoteCI = function(remoteci) {
    return $http.post(
      api.urls.remotecis, _.merge(remoteci, {'team_id': user.team.id})
    )
    .then(_.property('data.remoteci'));
  };

  api.putRemoteCI = function(remoteci) {
    var url = urlize(api.urls.remotecis, remoteci.id);
    var headers = {'headers': {'If-Match': remoteci.etag}};
    return $http.put(url, {'name': remoteci.name}, headers);
  };

  api.removeRemoteCI = function(remoteciID, remoteciEtag) {
    var url = urlize(api.urls.remotecis, remoteciID);
    return $http.delete(url, {'headers': {'If-Match': remoteciEtag}});
  };

  api.recheckJob = function(jobID) {
    var url = urlize(api.urls.jobs, jobID, 'recheck');
    return $http.post(url).then(_.property('data.job'));
  };

  api.removeJob = function(jobID, jobEtag) {
    var url = urlize(api.urls.jobs, jobID);
    return $http.delete(url, {'headers': {'If-Match': jobEtag}});
  };

  api.getUser = function(name, withoutTeam) {
    var url = urlize(api.urls.users, name);
    var conf = withoutTeam ? {} : {'params': {'embed': 'team'}};
    return $http.get(url, conf).then(_.property('data.user'));
  };

  api.getUsers = function() {
    return $http.get(api.urls.users).then(_.property('data.users'));
  };

  api.postUser = function(user) {
    return $http.post(api.urls.users, user).then(_.property('data.user'));
  };

  api.removeUser = function(userID, userEtag) {
    var url = urlize(api.urls.users, userID);
    return $http.delete(url, {'headers': {'If-Match': userEtag}});
  };

  api.putUser = function(user) {
    var url = urlize(api.urls.users, user.id);
    var headers = {'headers': {'If-Match': user.etag}};
    var data = {
      'name': user.name, 'team_id': user.team_id,
      'role': user.role ? 'admin' : 'user',
    };
    if (user.password) { data.password = user.password; }
    return $http.put(url, data, headers);
  };

  api.getTopic = function(id) {
    var url = urlize(api.urls.topics, id);
    return $http.get(url).then(_.property('data.topic'));
  };

  api.getTopicTeams = function(id) {
    var url = urlize(api.urls.topics, id, 'teams');
    return $http.get(url).then(_.property('data.teams'));
  };

  api.removeTopicTeam = function(topicId, teamId) {
    var url = urlize(api.urls.topics, topicId, 'teams', teamId);
    return $http.delete(url);
  };

  api.postTopicTeam = function(topicId, teamId) {
    var url = urlize(api.urls.topics, topicId, 'teams');
    return $http.post(url, {'team_id': teamId});
  };

  api.getTopics = function() {
    return $http.get(api.urls.topics).then(_.property('data.topics'));
  };

  api.postTopic = function(topic) {
    return $http.post(api.urls.topics, topic).then(_.property('data.topic'));
  };

  api.putTopic = function(topic) {
    var url = urlize(api.urls.topics, topic.id);
    var headers = {'headers': {'If-Match': topic.etag}};
    return $http.put(url, {'name': topic.name}, headers);
  };

  api.removeTopic = function(topicID, topicEtag) {
    var url = urlize(api.urls.topics, topicID);
    return $http.delete(url, {'headers': {'If-Match': topicEtag}});
  };

  api.getTeam = function(name) {
    var url = urlize(api.urls.teams, name);
    return $http.get(url).then(_.property('data.team'));
  };

  api.getTeams = function() {
    return $http.get(api.urls.teams).then(_.property('data.teams'));
  };

  api.postTeam = function(team) {
    return $http.post(api.urls.teams, team).then(_.property('data.team'));
  };

  api.putTeam = function(team) {
    var url = urlize(api.urls.teams, team.id);
    var headers = {'headers': {'If-Match': team.etag}};
    return $http.put(url, {'name': team.name}, headers);
  };

  api.removeTeam = function(teamID, teamEtag) {
    var url = urlize(api.urls.teams, teamID);
    return $http.delete(url, {'headers': {'If-Match': teamEtag}});
  };

  api.getAudits = function() {
    return $http.get(api.urls.audits).then(_.property('data.audits'));
  };

  return api;
}]);
