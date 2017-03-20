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
  .factory('api', ['' +
  '$q', '$http', '$window', 'config', 'moment', 'user',
    function($q, $http, $window, config, moment, user) {
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
            var conf = this.embed ? {'params': {'embed': this.embed}} : {};
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
      // add the search endpoint
      api.search = {};
      // add the issues endpoint
      api.issues = {};

      config.promise.then(function() {
        _.each(api, function(endpoint, name) {
          endpoint.url = urlize(config.apiURL, 'api', 'v1', name);
        });
        api.search.url = urlize(config.apiURL, 'api', 'v1', 'search');
      });

      /*                                COMPONENTS                                */
      api.components.update.parse = _.partialRight(_.pick, ['export_control']);

      api.components.files = function(component) {
        var url = urlize(this.url, component, 'files');
        return $http.get(url).then(_.property('data.component_files'));
      };

      /*                              JOBDEFINITIONS                              */
      api.jobdefinitions.components = function(jobdef) {
        var url = urlize(this.url, jobdef, 'components');
        return $http.get(url).then(_.property('data.components'));
      };
      api.jobdefinitions.tests = function(jobdef) {
        var url = urlize(this.url, jobdef, 'tests');
        return $http.get(url).then(_.property('data.tests'));
      };

      /*                                  AUDITS                                  */
      api.audits.list = function(page, extract) {
        // Audits does not provide the common api features, so we make a
        // simple call here.
        extract = extract ? 'data.audits' : 'data';
        return $http.get(this.url).then(_.property(extract));
      };

      /*                                REMOTE CIS                                */
      api.remotecis.update.parse = _.partialRight(_.pick, ['name', 'data']);
      api.remotecis.create = function(remoteci) {
        return $http.post(
          this.url, _.merge(remoteci, {'team_id': user.team.id})
        )
          .then(_.property('data.remoteci'));
      };
      api.remotecis.tests = function(remoteci) {
        var url = urlize(api.remotecis.url, remoteci, 'tests');
        return $http.get(url).then(_.property('data.tests'));
      };

      /*                                  TEAMS                                   */
      api.teams.update.parse = _.partialRight(_.pick, ['name',
        'email',
        'notification']);

      /*                                  USERS                                   */
      api.users.embed = 'team';
      api.users.get = function(name, withoutTeam) {
        var conf = withoutTeam ? {} : {'params': {'embed': 'team'}};
        conf.params.where = 'name:' + name;
        return $http.get(urlize(this.url), conf)
          .then(_.property('data.users[0]'));
      };
      api.users.get2 = function(user) {
        var params = {'params': {'embed': 'team'}};
        return $http.get(urlize(this.url, user.id), params)
          .then(_.property('data'));
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

        return $http.get(url)
          .then(_.property('data.components'))
          .then(function(results) {
            _.each(results, function(component) {
              api.components.files(component.id).then(function(components) {
                component.files = components;
                _.each(component.files, function(file) {
                  file.dl_link = api.components.url.replace(
                    urlPttrn, function(_, g1, g2) {
                      var token = $window.atob(user.token);
                      var tkn_index = token.indexOf(':');
                      var tkn_username = token.substring(0, tkn_index);
                      var tkn_password = encodeURIComponent(
                        token.substring(tkn_index + 1)
                      );
                      return urlize(
                        g1 + tkn_username + ':' + tkn_password + '@' + g2,
                        component.id, 'files', file.id, 'content'
                      );
                    });
                });
              });
            });
            return results;
          });
      };
      api.topics.components.jobs = function(topic, component) {
        var url = urlize(api.topics.url, topic, 'components', component, 'jobs');
        return $http.get(url).then(_.property('data.jobs'));
      };
      api.topics.jobdefinitions = function(topic) {
        var url = urlize(api.topics.url, topic, 'jobdefinitions');
        return $http.get(url).then(_.property('data.jobdefinitions'));
      };
      api.topics.status = function(topic) {
        var url = urlize(api.topics.url, topic.id, 'type/' + topic.jobdefinition_type + '/status');
        return $http.get(url).then(_.property('data.jobs'));
      };

      /*                                JOBSTATES                                 */
      api.jobstates.list = function(page, extract) {
        var conf = {'params': {'embed': 'job'}};
        extract = extract ? 'data.jobstates' : 'data';
        return $http.get(this.url, conf).then(_.property(extract));
      };

      /*                                   JOBS                                   */
      api.jobs.embed = 'remoteci,jobdefinition,jobdefinition.tests';
      api.jobs.update.parse = _.partialRight(_.pick, ['status', 'comment']);

      api.jobs.recheck = function(id) {
        var url = urlize(this.url, id, 'recheck');
        return $http.post(url).then(_.property('data.job'));
      };
      api.jobs.results = function(job) {
        var url = urlize(this.url, job, 'results');
        return $http.get(url).then(_.property('data.results'));
      };
      api.jobs.files = function(job) {
        var url = urlize(this.url, job, 'files');
        return $http.get(url).then(_.property('data.files'));
      };
      api.jobs.metas = function(job) {
        var url = urlize(api.jobs.url, job, 'metas');
        return $http.get(url).then(_.property('data.metas'));
      };
      api.jobs.metas.post = function(job, data) {
        var url = urlize(api.jobs.url, job.id, 'metas');
        return $http.post(url, data);
      };
      api.jobs.metas.delete = function(job, id) {
        var url = urlize(api.jobs.url, job, 'metas', id);
        return $http.delete(url);
      };
      api.issues.list = function(job) {
        var url = urlize(api.jobs.url, job, 'issues');
        return $http.get(url).then(_.property('data.issues'));
      };

      api.issues.create = function(job, issue) {
        var url = urlize(api.jobs.url, job, 'issues');
        return $http.post(url, {'url': issue})
          .then(_.partial(api.issues.list, job));
      };

      api.issues.remove = function(job, id, etag) {
        var url = urlize(api.jobs.url, job, 'issues', id);
        return $http.delete(url, {'headers': {'If-Match': etag}});
      };

      api.jobs.get = function(job, partial) {
        if (partial) {
          return $http.get(urlize(this.url, job)).then(_.property('data.job'));
        }

        var confJ = {'params': {'embed': 'remoteci,jobdefinition'}};
        var confJS = {
          'params': {
            'sort': 'created_at,files.created_at',
            'embed': 'files'
          }
        };
        return $q.all([
          $http.get(urlize(this.url, job), confJ),
          $http.get(urlize(this.url, job, 'components')),
          $http.get(urlize(this.url, job, 'files')),
          $http.get(urlize(this.url, job, 'jobstates'), confJS),
        ])
          .then(function(results) {
            var job = _.first(results).data.job;
            var components = results[1].data.components;
            job.components = components;
            _.each(components, function(component) {
              component.created_at_formatted = moment(component.created_at)
                .local()
                .format();
              component.updated_at_formatted = moment(component.updated_at)
                .local()
                .format();
            });
            var files = results[2].data.files;
            job.files = files;
            _.each(files, function(file) {
              file.dl_link = api.files.url.replace(urlPttrn, function(_, g1, g2) {
                var token = $window.atob(user.token);
                var tkn_index = token.indexOf(':');
                var tkn_username = token.substring(0, tkn_index);
                var tkn_password = encodeURIComponent(token.substring(tkn_index + 1));

                return urlize(
                  g1 + tkn_username + ':' + tkn_password + '@' + g2,
                  file.id, 'content'
                );
              });
            });
            var jobstates = _.last(results).data.jobstates;
            job.jobstates = jobstates;
            return job;
          });
      };
      api.jobs.search = function(remotecis, statuses, params) {
        function retrieveRCIs(remoteci) {
          var conf = {
            params: {
              where: 'name:' + remoteci,
              limit: params.limit,
              offset: params.offset
            }
          };
          return $http.get(api.remotecis.url, conf);
        }

        function retrieveJobs(status) {
          var conf = {
            params: {
              where: 'status:' + status,
              embed: 'remoteci,jobdefinition,jobdefinition.tests',
              limit: params.limit,
              offset: params.offset
            }
          };
          return $http.get(api.jobs.url, conf);
        }

        function retrieveJsRCI(remoteciResps) {
          return _(remoteciResps)
            .map(_.property('data.remotecis'))
            .flatten()
            .map(_.property('id'))
            .map(function(remoteci) {
              var conf = {
                params: {
                  embed: 'remoteci,jobdefinition,jobdefinition.tests',
                  where: 'remoteci_id:' + remoteci,
                  limit: params.limit,
                  offset: params.offset
                }
              };
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
          .then(function(jobs) {
            return {'jobs': jobs};
          });
      };

      /*                                JOBSTATES                                */
      api.jobstates.embed = 'job';

      /*                                  FILES                                  */
      api.files.content = function(file) {
        return $http.get(urlize(this.url, file, 'content'));
      };

      /*                                  SEARCH                                 */
      api.search.create = function(pattern) {
        return $http.post(this.url, {pattern: pattern}).then(_.property('data'));
      };

      return api;
    }]);
