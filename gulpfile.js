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

var fs = require('fs');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var through = require('through2');

var jsonfile = require('jsonfile');
var config = require('./config');
var utils = require('./utils');

var DIST = 'static';
var JS = ['src/js/**/*.js'];
var configFile = 'src/config.json';

gulp.task('lint', function() {
  return gulp.src(['src/**/*.js'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

function copy() {
  return gulp.src([
    'src/**/*',
    '!src/**/*.js',
    '!src/**/*.scss',
    configFile
  ]).pipe(gulp.dest(DIST));
}

gulp.task('copy', ['rev'], copy);
gulp.task('copy:pkg', ['rev:pkg'], copy);

gulp.task('build', ['js', 'css', 'fonts', 'images', 'favicon', 'copy', 'rev']);
gulp.task('build:pkg', ['js', 'css', 'fonts', 'images', 'favicon', 'copy:pkg', 'rev:pkg']);

gulp.task('test', ['lint', 'test:e2e']);

gulp.task('clean', function() {
  var entries = [DIST + '/**/*', '!' + DIST + '/.gitkeep'];
  return del(entries);
});

gulp.task('reload', ['build'], function() {
  return $.livereload.reload();
});

gulp.task('watch', function() {
  gulp.watch('src/**', ['reload']);
});

gulp.task('js', function() {
  // https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-multiple-destination.md
  var bundledStream = through();
  bundledStream
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(DIST + '/js/'));

  globby(JS).then(function(entries) {
    var b = browserify({
      entries: entries,
      debug: true,
      paths: ['./node_modules', './src/js/']
    });
    b.bundle().pipe(bundledStream);
  }).catch(function(err) {
    bundledStream.emit('error', err);
  });

  return bundledStream;
});

gulp.task('css', function() {
  var conf = {
    includePaths: [
      'node_modules/bootstrap-sass/assets/stylesheets/',
      'node_modules/'
    ]
  };
  return gulp.src(['src/css/**/*.scss'])
    .pipe($.sass(conf).on('error', $.sass.logError))
    .pipe($.concat('dashboard.css'))
    .pipe(gulp.dest(DIST + '/css/'));
});

gulp.task('images', [], function() {
  return gulp.src(['node_modules/rcue/dist/img/bg-login.jpg'])
    .pipe(gulp.dest(DIST + '/images/'));
});

gulp.task('favicon', [], function() {
  return gulp.src(['node_modules/rcue/dist/img/favicon.ico'])
    .pipe(gulp.dest(DIST));
});

gulp.task('fonts', function() {
  var entries = [
    'node_modules/rcue/dist/fonts/**'
  ];

  return gulp.src(entries)
    .pipe(gulp.dest(DIST + '/fonts/'));
});

gulp.task('serve', ['build'], function() {
  return utils.server(DIST, config.port);
});

gulp.task('serve:dev', ['build', 'watch'], function() {
  return utils.server(DIST, config.port, true);
});

gulp.task('webdriver_standalone', $.protractor.webdriver_standalone);

gulp.task('e2e:webdriver_manager_update', $.protractor.webdriver_update);

gulp.task('test:e2e', ['build', 'e2e:webdriver_manager_update'], function(cb) {
  gulp.src(["./test/e2e/**/*.spec.js"])
    .pipe($.protractor.protractor({
      configFile: "test/e2e/protractor.conf.js",
      args: ['--baseUrl', 'http://127.0.0.1:8000']
    }))
    .on('error', function(e) {
      throw e
    })
    .on('end', cb);
});

function setConf(revFn, cb) {
  revFn(function(err, rev) {
    if (err) {
      return cb(err);
    }

    var version = rev;
    var apiURL = utils.apiURL() || 'http://localhost:5000';
    var template = `{"apiURL": "${apiURL}","version": "${version}"}`;
    fs.writeFileSync(configFile, template);
    cb();
  });
}

gulp.task('rev', function(cb) {
  setConf(utils.rev, cb);
});

gulp.task('rev:pkg', function(cb) {
  setConf(utils.revPKG, cb);
});
