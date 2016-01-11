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

.factory('api', ['_', '$q', '$http', 'config', function(_, $q, $http, config) {
  var api = {
    url: config.url.then(function(url) {
      return {
        jobs: url + '/api/v1/jobs/',
        remotecis: url + '/api/v1/remotecis/',
        jobstates: url + '/api/v1/jobstates/',
        files: url + '/api/v1/files/',
        users: url + '/api/v1/users/',
        teams: url + '/api/v1/teams/',
        components: url + '/api/v1/components/'
      };
    })
  };

  api.getJobs = function(page) {
    var offset = 20 * (page - 1);
    var config = {'params': {
      'limit': 20, 'offset': offset, 'sort': '-updated_at',
      'embed': 'remoteci,jobdefinition,jobdefinition.test'
    }};
    return api.url.then(function(url) {
      return $http.get(url.jobs, config).then(_.property('data'));
    });
  };

  api.getJobStates = function(job) {
    return api.url.then(function(url) {
      url = url.jobs + job + '/jobstates';
      return $http.get(url).then(_.property('data.jobstates'));
    });
  };

  api.searchJobs = function(remotecis, statuses) {

    function retrieveRCIs(remoteci) {
      var conf = {'params': {'where': 'name:' + remoteci}};
      return api.url.then(function(url) {
        return $http.get(url.remotecis, conf);
      });
    };

    function retrieveJobs(status) {
      var conf = {'params': {
        'where': 'status:' + status,
        'embed': 'remoteci,jobdefinition,jobdefinition.test'
      }};
      return api.url.then(function(url) {
        return $http.get(url.jobs, conf);
      });
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
        return api.url.then(function(url) {
          return $http.get(url.jobs, conf);
        });
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
          return _.contains(RCISJobsIds, job.id);
        });
      } else {
        return SSJobs.concat(RCISJobs);
      }
    })
    .then(function(jobs) {
      return {'jobs': jobs};
    });
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
      api.url.then(function(url) {
        return $http.get(url.jobs + job, conf);
      }),
      api.url.then(function(url) {
        return $http.get(url.jobs + job + '/jobstates', JSconf);
      })
    ])
    .then(retrieveFiles);
  };

  api.getComponents = function(jobDef) {
    return api.url.then(function(url) {
      return $http.get(url.components).then(_.property('data.components'));
    });
  };

  api.getFiles = function(jobstateID) {
    var conf = {'params': {'where': 'jobstate_id:' + jobstateID}};
    return api.url.then(function(url) {
      return $http.get(url.files, conf).then(_.property('data.files'));
    });
  };

  api.getRemoteCIS = function() {
    var extractRemoteCIS = _.partialRight(_.get, 'data.remotecis');
    return api.url.then(function(url) {
      return $http.get(url.remotecis).then(extractRemoteCIS);
    });
  };

  api.recheckJob = function(jobID) {
    return api.url.then(function(url) {
      url = url.jobs + jobID + '/recheck';
      return $http.post(url).then(_.property('data.job'));
    });
  };

  api.getUser = function(name) {
    var conf = {'params': {'embed': 'team'}};
    return api.url.then(function(url) {
      return $http.get(url.users + name, conf).then(_.property('data.user'));
    });
  };

  api.getTeams = function() {
    return api.url.then(function(url) {
      return $http.get(url.teams).then(_.property('data.teams'));
    });
  };

  api.postTeam = function(team) {
    return api.url.then(function(url) {
      return $http.post(url.teams, team).then(_.property('data.team'));
    });
  };

  api.postUser = function(user) {
    return api.url.then(function(url) {
      return $http.post(url.users, user).then(_.property('data.user'));
    });
  };

  return api;
}]);
