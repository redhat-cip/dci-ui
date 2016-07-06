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
var fs   = require('fs');
var http = require('http');
var url  = require('url');
var Q    = require('q');
var _    = require('lodash');

module.exports.noop = function() {};

module.exports.urlize = _.rest(_.partialRight(_.join, '/'));
module.exports.tokenize = function() {
  return Buffer(_.join(arguments, ':'), 'binary').toString('base64');
};
module.exports.auth = function(user, passwd) {
  return _.join(['Basic', module.exports.tokenize(user, passwd)], ' ');
};

module.exports.log = function() {
  return browser.manage().logs().get('browser').then(function(browserLog) {
    // Uncomment to actually see the log.
    console.log('log: ' + require('util').inspect(browserLog));
  });
};

module.exports.screenshot = function() {
  browser.takeScreenshot().then(function(png) {
    var stream = fs.createWriteStream('/tmp/screenshot.png');
    stream.write(new Buffer(png, 'base64'));
    stream.end();
  });
};

/**
 * req - Wraps the http.request function making it nice for unit testing APIs.
 *
 * This code come from https://gist.github.com/wilsonpage/1393666, it has been
 * adapted to return promises instead of using callbacks
 *
 * @param  {string}   reqUrl   The required url in any form
 * @param  {object}   options  An options object (this is optional)
 */
exports.req = function(reqUrl, options) {

  options = options || {};

  // initialize defer object
  var d = Q.defer();

  // parse url to chunks
  var parsedUrl = url.parse(reqUrl);

  // http.request settings
  var settings = {
    host: parsedUrl.hostname,
    port: parsedUrl.port || 80,
    path: parsedUrl.pathname,
    headers: _.defaults(
      options.headers,
      {'Authorization': module.exports.auth('admin', 'admin')}
    ),
    method: options.method || 'GET'
  };

  // if there are params:
  if (options.params) {
    options.params = JSON.stringify(options.params);
    settings.headers['Content-Type'] = 'application/json';
    settings.headers['Content-Length'] = options.params.length;

  };

  // MAKE THE REQUEST
  var req = http.request(settings);

  // if there are params: write them to the request
  if (options.params) { req.write(options.params); };

  // when the response comes back
  req.on('response', function(res) {
    res.body = '';
    res.url = reqUrl;
    res.setEncoding('utf-8');

    // concat chunks
    res.on('data', function(chunk) { res.body += chunk; });

    // when the response has finished
    res.on('end', function() {
      if (res.headers['content-type'] == 'application/json') {
        try {
          res.body = JSON.parse(res.body);
        } catch (_) {}
      }
      if (_.indexOf([200, 201], res.statusCode) !== -1) {
        d.resolve(res);
      } else {
        d.reject(res);
      }
    });
  });

  // end the request
  req.end();

  // return a promise
  return d.promise;
};
