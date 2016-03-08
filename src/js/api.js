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
  var _ = $injector.get('_');
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
    var config = {'params': {
      'limit': 20, 'offset': offset, 'sort': '-updated_at',
      'embed': 'remoteci,jobdefinition,jobdefinition.test'
    }};
    return $http.get(api.urls.jobs, config).then(_.property('data'));
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
        'where': 'status:' + status,
        'embed': 'remoteci,jobdefinition,jobdefinition.test'
      }};
      return $http.get(api.urls.jobs, config).then(_.property('data'));
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
          'embed': 'remoteci,jobdefinition,jobdefinition.test',
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
        var RCISJobsIds = _.pluck(RCISJobs, 'id');
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
    config = {'headers': {'If-Match': etag}};
    return $http.put(urlize(api.urls.jobs, job_id), data, config);
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
    var conf = {'params': {
      'embed': 'remoteci,jobdefinition,jobdefinition.test'
    }};
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

  api.getRemoteCIS = function() {
    var extractRemoteCIS = _.partialRight(_.get, 'data.remotecis');
    return $http.get(api.urls.remotecis).then(extractRemoteCIS);
  };

  api.postRemoteCI = function(remoteci, team) {
    return $http.post(api.urls.remotecis, _.merge(remoteci, {'team_id': team}))
    .then(_.property('data.remoteci'));
  };

  api.removeRemoteCI = function(remoteciID, remoteciEtag) {
    var url = urlize(api.urls.remotecis, remoteciID);
    config = {'headers': {'If-Match': remoteciEtag}};
    return $http.delete(url, config);
  };

  api.recheckJob = function(jobID) {
    var url = urlize(api.urls.jobs, jobID, 'recheck');
    return $http.post(url).then(_.property('data.job'));
  };

  api.removeJob = function(jobID, jobEtag) {
    var url = urlize(api.urls.jobs, jobID);
    config = {'headers': {'If-Match': jobEtag}};
    return $http.delete(url, config);
  };

  api.getUser = function(name) {
    var url = urlize(api.urls.users, name);
    var conf = {'params': {'embed': 'team'}};
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
    config = {'headers': {'If-Match': userEtag}};
    return $http.delete(url, config);
  };

  api.getTopics = function() {
    return $http.get(api.urls.topics).then(_.property('data.topics'));
  };

  api.postTopic = function(topic) {
    return $http.post(api.urls.topics, topic).then(_.property('data.topic'));
  };

  api.removeTopic = function(topicID, topicEtag) {
    var url = urlize(api.urls.topics, topicID);
    config = {'headers': {'If-Match': topicEtag}};
    return $http.delete(url, config);
  };

  api.getTeams = function() {
    return $http.get(api.urls.teams).then(_.property('data.teams'));
  };

  api.postTeam = function(team) {
    return $http.post(api.urls.teams, team).then(_.property('data.team'));
  };

  api.removeTeam = function(teamID, teamEtag) {
    var url = urlize(api.urls.teams, teamID);
    config = {'headers': {'If-Match': teamEtag}};
    return $http.delete(url, config);
  };

  api.getAudits = function() {
    return $http.get(api.urls.audits).then(_.property('data.audits'));
  };

  return api;
}]);
