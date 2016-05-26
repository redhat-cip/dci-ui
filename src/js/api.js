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

  // Initialize an API object which consists into a simple javascript
  // object, containing all the endpoints and then the methods associated
  // Here is a quick example:
  //
  // api = {
  //  jobs: {
  //    url: "an/endpoint/url"
  //    get: function... ,
  //    create: function... ,
  //    list: function... ,
  //    remove: function... ,
  //    update: function...
  //  },
  //  remotecis: {
  //    ...
  //  }
  // }
  _.each([
    'jobs', 'remotecis', 'jobstates', 'files', 'users', 'teams',
    'components', 'jobdefinitions', 'audits', 'topics'
  ], function(endpoint) {
    api[endpoint] = {
      get: function(id) {
        // remove the trailing "s"
        var extract = 'data.' + endpoint.slice(0, endpoint.length - 1);
        var conf = this.embed ? {'embed': this.embed} : {};
        return $http.get(urlize(this.url, id), conf).then(_.property(extract));
      },
      remove: function(id, etag) {
        var conf = {'headers': {'If-Match': etag}};
        return $http.delete(urlize(this.url, id), conf);
      },
      create: function(obj) {
        // remove the trailing "s"
        var extract = 'data.' + endpoint.slice(0, endpoint.length - 1);
        return $http.post(this.url, obj).then(_.property(extract));
      },
      list: function(page, extract) {
        var params = _.assign(
          {'sort': '-updated_at'},
          page ? {'limit': 20, 'offset': 20 * (page - 1)} : null,
          this.embed ? {'embed': this.embed} : null
        );
        extract = extract ? 'data.' + endpoint : 'data';
        return $http.get(this.url, {params: params}).then(_.property(extract));
      },
      update: function(obj) {
        var url = urlize(this.url, obj.id);
        var headers = {'headers': {'If-Match': obj.etag}};
        // parse method call is a bit crapy but it is more expressive
        if (_.isEmpty(obj = this.update.parse(obj))) {
          return $q.reject('empty');
        } else {
          return $http.put(url, obj, headers);
        }
      }
    };
  });

  config.promise.then(function() {
    _.each(api, function(endpoint, name) {
      endpoint.url = urlize(config.apiURL, 'api', 'v1', name);
    });
  });

  /*                              JOBDEFINITIONS                              */
  api.jobdefinitions.components = function(jobdef) {
    var url = urlize(this.url, jobdef, 'components');
    return $http.get(url).then(_.property('data.components'));
  };

  /*                                  AUDITS                                  */
  api.audits.list = function(page, extract) {
    // Audits does not provide the common api features, so we make a
    // simple call here.
    extract = extract ? 'data.audits' : 'data';
    return $http.get(this.url).then(_.property(extract));
  };

  /*                                REMOTE CIS                                */
  api.remotecis.update.parse = _.partialRight(_.pick, ['name']);
  api.remotecis.create = function(remoteci) {
    return $http.post(
      this.url, _.merge(remoteci, {'team_id': user.team.id})
    )
    .then(_.property('data.remoteci'));
  };

  /*                                  TEAMS                                   */
  api.teams.update.parse = _.partialRight(_.pick, ['name']);

  /*                                  USERS                                   */
  api.users.embed = 'team';
  api.users.get = function(name, withoutTeam) {
    var conf = withoutTeam ? {} : {'params': {'embed': 'team'}};
    return $http.get(urlize(this.url, name), conf)
    .then(_.property('data.user'));
  };
  api.users.update.parse = function(user) {
    return _.assign(
      {'role': user.role ? 'admin' : 'user'},
      _.pick(user, ['name', 'team_id', 'password'])
    );
  };

  /*                                  TOPICS                                  */
  api.topics.update.parse = _.partialRight(_.pick, ['name']);
  api.topics.teams = function(id) {
    var url = urlize(api.topics.url, id, 'teams');
    return $http.get(url).then(_.property('data.teams'));
  };
  api.topics.teams.post = function(id, team) {
    var url = urlize(api.topics.url, id, 'teams');
    return $http.post(url, {'team_id': team});
  };
  api.topics.teams.remove = function(id, team) {
    var url = urlize(api.topics.url, id, 'teams', team);
    return $http.delete(url);
  };
  api.topics.components = function(topic) {
    var url = urlize(api.topics.url, topic, 'components');
    return $http.get(url).then(_.property('data.components'));;
  };

  /*                                JOBSTATES                                 */
  api.jobstates.list = function(page, extract) {
    var conf = {'params': {'embed': 'job'}};
    extract = extract ? 'data.jobstates' : 'data';
    return $http.get(this.url, conf).then(_.property(extract));
  };

  api.jobstates.files = function(jobstate) {
    var conf = {'params': {'where': 'jobstate_id:' + jobstate}};
    return $http.get(api.files.url, conf)
    .then(_.property('data.files'))
    .then(_.partialRight(_.map, function(elt) {
      // build link in the form of
      // http(s)://username:password@apiURL/files/file_id/content
      elt.dl_link = api.files.url.replace(urlPttrn, function(_, g1, g2) {
        return urlize(
          g1 + $window.atob(user.token) + '@' + g2, elt.id, 'content'
        );
      });
      return elt;
    }));
  };

  /*                                   JOBS                                   */
  api.jobs.embed = 'remoteci,jobdefinition';
  api.jobs.update.parse = _.partialRight(_.pick, ['status', 'comment']);

  api.jobs.recheck = function(id) {
    var url = urlize(this.url, id, 'recheck');
    return $http.post(url).then(_.property('data.job'));
  };
  api.jobs.files = function(job) {
    var url = urlize(this.url, job, 'files');
    return $http.get(url).then(_.property('data.files'));
  };
  api.jobs.get = function(job) {
    var confJ = {'params': {'embed': 'remoteci,jobdefinition'}};
    var confJS = {'params': {'sort': 'created_at', 'embed': 'files'}};
    return $q.all([
      $http.get(urlize(this.url, job), confJ),
      $http.get(urlize(this.url, job, 'jobstates'), confJS)
    ])
    .then(function(results) {
      var job = _.first(results).data.job;
      var jobstates = _.last(results).data.jobstates;
      job.jobstates = jobstates;
      _.each(jobstates, function(jobstate) {
        _.each(jobstate.files, function(file) {
          file.dl_link = api.files.url.replace(urlPttrn, function(_, g1, g2) {
            return urlize(
              g1 + $window.atob(user.token) + '@' + g2, file.id, 'content'
            );
          });
        });
      });
      return job;
    });
  };
  api.jobs.search = function(remotecis, statuses) {
    function retrieveRCIs(remoteci) {
      var conf = {'params': {'where': 'name:' + remoteci}};
      return $http.get(api.remotecis.url, conf);
    };

    function retrieveJobs(status) {
      var conf = {'params': {
        'where': 'status:' + status,
        'embed': 'remoteci,jobdefinition',
        'sort': '-created_at'
      }};
      return $http.get(api.jobs.url, conf);
    };

    function retrieveJsRCI(remoteciResps) {
      return _(remoteciResps)
      .map(_.property('data.remotecis'))
      .flatten()
      .map(_.property('id'))
      .map(function(remoteci) {
        var conf = {'params': {
          'embed': 'remoteci,jobdefinition',
          'where': 'remoteci_id:' + remoteci
        }};
        return $http.get(api.jobs.url, conf);
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

  /*                                  FILES                                  */
  api.files.content = function(file) {
    return $http.get(urlize(this.url, file, 'content'));
  };

  return api;
}]);
