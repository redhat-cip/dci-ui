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
  .factory('entities', [
    'messages', 'api', 'utils', 'user', function(msg, api, utils, user) {
      function Entity(name, endpoint) {
        utils.Entity.call(this, name, endpoint);
        this.tplt = _.template('<%= key %> "<%= value %>" <%= msg %>');
      }

      Entity.prototype = _.create(utils.Entity.prototype, {
        constructor: Entity,
        submit: function() {
          var promise = utils.Entity.prototype.submit.call(this);
          var v = {key: this.name, value: this.input.name};
          var addMsg = this.tplt(_.assign({msg: 'has been created'}, v));
          var errMsg = this.tplt(_.assign({msg: 'already exists'}, v));

          if (_.hasIn(promise, 'then')) {
            promise.then(
              _.bind(msg.alert, msg, addMsg, 'success'),
              function(err) {
                if (err.status === 409) {
                  msg.alert(errMsg, 'danger');
                } else {
                  msg.alert(err.data.message, 'danger');
                }
              }
            );
          }
          return promise;
        },
        remove: function(index) {
          var message = this.tplt({
            key: this.name, value: this.data[index].name, msg: 'has been removed'
          });
          utils.Entity.prototype.remove.call(this, index).then(
            _.bind(msg.alert, msg, message, 'success'),
            function(err) {
              msg.danger(err.data.message);
            }
          );
        }
      });

      function RemoteCIEntity() {
        Entity.call(this, 'remote CI', api.remotecis);
      }

      RemoteCIEntity.prototype = _.create(Entity.prototype, {
        constructor: RemoteCIEntity,
        retrieve: function() {
          var that = this;
          Entity.prototype.retrieve.call(this).then(function() {
            that.input.team_id = user.team.id;
          });
        },
        lock: function(remoteci) {
          if (remoteci.state == 'active') {
            remoteci.state = 'inactive';
          } else {
            remoteci.state = 'active';
          }
          api.remotecis.update(remoteci);
        }
      });

      function UserEntity() {
        Entity.call(this, 'user', api.users);
      }

      UserEntity.prototype = _.create(Entity.prototype, {
        constructor: UserEntity,
        retrieve: function() {
          var that = this;
          Entity.prototype.retrieve.call(this).then(function(data) {
            if (data.length) {
              that.input.team_id = data[0].id;
            }
            that.input.team_id = user.team.id;
          });
        }
      });
      return {
        'users': new UserEntity(),
        'teams': new Entity('team', api.teams),
        'topics': new Entity('topic', api.topics),
        'remotecis': new RemoteCIEntity(),
        'audits': new Entity('audit', api.audits)
      };
    }
  ])
  .controller('AdminCtrl', [
    '$scope', '$state', 'entities', function($scope, $state, entities) {
      _.assign($scope, {active: {}, go: $state.go, user: {role: 'user'}});

      _.each(entities, function(entity, id) {
        $scope.active[id] = $state.is('administrate.' + id);
        $scope[id] = entity;
      });

      $scope.role = function(value) {
        if (arguments.length) {
          return $scope.users.input.role = value ? 'admin' : 'user';
        } else {
          return $scope.users.input.role === 'admin';
        }
      };
      $scope.showError = function(form, field) {
        return field.$invalid && (field.$dirty || form.$submitted);
      };
    }
  ])
  .controller('EditMixinCtrl', [
    '$scope', '$state', 'obj', 'messages',
    function($scope, $state, obj, messages) {
      _.assign($scope, {obj: obj, objForm: {}});

      $scope.cancel = _.partial($state.go, obj.meta.redirect);

      $scope.showError = function(form, field) {
        return field.$invalid && (field.$dirty || form.$submitted);
      };

      $scope.update = function() {
        if ($scope.objForm.$invalid) {
          return;
        }
        $state.go(obj.meta.redirect);
        obj.meta.method($scope.obj).then(
          function() {
            messages.alert(obj.meta.msg.success, 'success');
          },
          function(err) {
            if (err.status === 409) {
              messages.alert(obj.meta.msg.error);
            } else {
              messages.alert(err.data.message, 'danger');
            }
          }
        );
      };
    }
  ])
  .controller('EditTopicCtrl', [
    '$scope', '$q', '$state', 'messages', 'api',
    function($scope, $q, messages, api, $state) {
      var obj = $scope.obj;
      var old_teams = _.map(obj.teams, function(elt) {
        return _.get(elt, 'id');
      });
      _.pullAllWith(obj.meta.teams, obj.teams, _.isEqual);

      $scope.add = function(i, team) {
        obj.teams.push(team);
        _.pullAt(obj.meta.teams, i);
      };

      $scope.remove = function(i, team) {
        obj.meta.teams.push(team);
        _.pullAt(obj.teams, i);
      };

      $scope.update = function() {
        if ($scope.objForm.$invalid) {
          return;
        }
        $q.all(_.map(old_teams, _.partial(api.topics.teams.remove, obj.id)))
          .then(function() {
            return $q.all(_.concat(
              api.topics.update(_.omit(obj, ['meta', 'teams'])),
              _.map(obj.teams, function(team) {
                return api.topics.teams.post(obj.id, team.id);
              })
            ));
          })
          .then(
            function() {
              $state.go(obj.meta.redirect);
              messages.alert(obj.meta.msg.success, 'success');
            },
            function(errs) {
              _.each(errs, function(err) {
                if (err.status === 409) {
                  messages.alert(obj.meta.msg.error);
                } else {
                  messages.alert(err.data.message, 'danger');
                }
              });
            }
          );
      };
    }
  ]);
