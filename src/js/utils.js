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
.constant('utils', {
  'Edit': (function() {
    function Edit(title) {
      this.title = title;
      this.plural = title.toLowerCase() + 's';
      this.injecting = ['$stateParams','$injector', 'conf'];
      this.meta = {
        redirect: 'administrate.' + this.plural,
        msg: {
          success: title + ' has been updated',
          errorr:  title + ' has failed updating'
        }
      };
    }

    _.assign(Edit.prototype, {
      successCb: function($injector) {
        return _.bind(function(res) {
          return _.merge(
            res, {meta: this.meta},
            {meta: {method: $injector.get('api')['put' + this.title]}}
          );
        }, this);
      },
      errorCb: function($injector) {
        return function(err) {
          $injector.get('messages').alert(
            err.data && err.data.message || 'Something went wrong', 'danger'
          );
        };
      },
      cb: function($stateParams, $injector) {
        return $injector.get('api')['get' + this.title]($stateParams.id).then(
          this.successCb($injector), this.errorCb($injector)
        );
      },
      genState: function() {
        return {
          url: '/administrate/' + this.plural + '/:id',
          templateUrl: '/partials/admin/' + this.plural + 'Edit.html',
          controller: 'EditMixinCtrl',
          resolve: {obj: this.injecting.concat(_.bind(this.cb, this))}
        };
      }
    });

    return Edit;
  })(),
  'Entity': (function() {
    function Entity(name, get, del, post) {
      this.name = name;
      this.get = get;
      this.del = del;
      this.post = post;
      this.data = [];
      this.input = {};

      this.retrieve();
    }
    _.assign(Entity.prototype, {
      retrieve: function() {
        var that = this;
        return this.get().then(function(data) {
          _.each(data, function(d) { that.data.push(d); });
          return data;
        });
      },
      remove: function(index) {
        var value = this.data[index];
        var that = this;
        return this.del(value.id, value.etag).then(function() {
          that.data.splice(index, 1);
        });
      },
      submit: function() {
        var that = this;
        if (this.form.$invalid) { return; }
        return this.post(this.input).then(function(res) {
            that.data.push(res);
            return res;
          }
        );
      }
    });
    return Entity;
  })()
});
