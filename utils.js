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

var config       = require('./config');
var connect      = require('connect');
var http         = require('http');
var url          = require('url');
var path         = require('path');
var Q            = require('q');
var gutil        = require('gulp-util');
var serveStatic  = require('serve-static');
var childProcess = require('child_process');
var through      = require('through2');
var browserify   = require('browserify');

module.exports.rev = function(cb) {
  childProcess.exec(
    'git rev-parse --short HEAD', {cwd: __dirname}, function(err, stdout) {
      if (err) { return cb(err); }
      cb(false, stdout.split('\n').join(''));
    }
  );
};

module.exports.revPKG = function(cb) {
  cb(false, __dirname.split('git')[1].slice(0,8));
};

module.exports.apiURL = function() {
  var api = process.env.API_PORT_5000_TCP;
  if (!api) { return; }
  api = url.parse(api);
  api.protocol = 'http';
  return url.format(api);
};

/*
 * The close function is async, so we wrap it in order
 * to make it return a promise
 */
function closePromise(obj) {
  var oldClose = obj.close;
  obj.close = function() {
    var d = Q.defer();
    obj.on('close', d.resolve);
    oldClose.call(obj);
    return d.promise;
  };
}

module.exports.browserify = function(options) {
  var b = browserify(options || {debug: true});
  var s = through.obj(
    function(file, _, cb) {
      b.add(file.path);
      cb();
    },
    function() {
      b
      .require('./src/js/app.js', {'expose': 'app'})
      .require(
        './src/js/directives/jsonformatter.js', {'expose': 'jsonformatter'}
      )
      .bundle()
      .on('error', function(err) {
        var message = new gutil.PluginError('browserify', err.toString());
        gutil.log(message.toString());
        s.emit('end');
      })
      .on('data', function(chunk) { s.push(chunk); })
      .on('end', function() { s.emit('end'); });
    }
  );

  return s;
};

module.exports.source = function(filename) {
  var ins = through();

  return through.obj(function(chunk, _, cb) {
    if (!this._ins) {
      this._ins = ins;
      this.push(new gutil.File({contents: ins, path: filename}));
    }

    ins.push(chunk);
    cb();
  }, function() {
    ins.push(null);
    this.push(null);
  });
};

module.exports.merge = function(/* streams... */) {
  var sources = [];
  var output  = gutil.noop();

  function remove(source) {
    sources = sources.filter(function(it) { return it !== source; });
    if (!sources.length && output.readable) { output.end(); }
  }

  output.on('unpipe', remove);

  Array.prototype.slice.call(arguments).forEach(function(source) {
    sources.push(source);
    source.once('end', remove.bind(null, source));
    source.pipe(output, {end: false});
  });

  return output;
};

module.exports.buffer = function() {
  return through.obj(function(file, _, cb) {
    var that = this;
    var bufs = [];

    if (file.isNull() || file.isBuffer()) {
      that.push(file);
      return cb();
    }

    file.contents.pipe(through.obj(
      function(data, _, cb) {
        bufs.push(Buffer.isBuffer(data) ? data : new Buffer(buf));
        cb();
      },
      function() {
        file = file.clone();
        file.contents = Buffer.concat(bufs);
        that.push(file);
        cb();
      }
    ));
  });
};

module.exports.server = function(root, port, livereload) {
  var d = Q.defer();
  var app = connect();

  if (livereload) {
    var options = {host: config.host, port: 35729};
    require('gulp-livereload').listen(options, function() {
      gutil.log('Livereload started on port:',
                gutil.colors.green(options.port));
    });
    app.use(require('connect-livereload')({port: options.port}));
  }
  app.use(serveStatic(root));

  var server = http.createServer(app);
  closePromise(server);
  server
  .on('listening', function() {
    var connection = server._connectionKey.split(':');
    var address = {
      protocol: 'http',
      hostname: connection[1],
      port: connection[2]
    };
    gutil.log('Server started at:', gutil.colors.green(url.format(address)));
    server.address = address;
    d.resolve(server);
  })
  .on('close', function() {
    gutil.log('Server', gutil.colors.blue('stopped'));
  });

  server.listen(port, config.host);

  return d.promise;
};

module.exports.phantom = function() {
  var d = Q.defer();

  var child = childProcess.execFile(
    require('phantomjs').path, ['--webdriver=9515']
  );

  //convenient alias
  child.close = child.kill;
  closePromise(child);

  child.stdout
  .on('data', function(chunk) {
    if (chunk.indexOf('GhostDriver') > -1 && chunk.indexOf('running') > -1) {
      gutil.log('Phantomjs started');
      d.resolve(child);
    }
  })
  .on('close', function() {
    gutil.log('Phantomjs', gutil.colors.blue('stopped'));
  });

  process.on('SIGINT', child.kill);

  return d.promise;
};

module.exports.protractor = function(address, configFile, debug) {
  var args = [configFile, '--baseUrl', url.format(address)];
  var d = Q.defer();

  if (debug) {
    args = ['debug'].concat(args);
  }

  var child = childProcess
  .fork(path.join(__dirname, 'node_modules/protractor/lib/cli'), args)
  .on('close', function(errorCode) {
    gutil.log('Protractor', gutil.colors.blue('stopped'));
    if (errorCode === 0) {
      d.resolve();
    } else {
      d.reject(new gutil.PluginError(
        'protractor', 'exited with non 0 status code'
      ));
    }
  });

  process.on('SIGINT', child.kill);

  return d.promise;
};
