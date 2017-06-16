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

"use strict";

const browserify = require("browserify");
const childProcess = require("child_process");
const fs = require("fs");
const globby = require("globby");
const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const through = require("through2");
const sourceStream = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");

const host = '127.0.0.1';
const port = 8000;
const destination = "./static";
const source = "./src";
const files = {
  js: {
    src: [source + "/js/**/*.js"],
    dest: destination + "/js"
  },
  css: {
    src: [source + "/css/**/*.scss"],
    dest: destination + "/css",
    includePaths: [
      "node_modules/bootstrap-sass/assets/stylesheets/",
      "node_modules/"
    ]
  },
  fonts: {
    src: ["node_modules/rcue/dist/fonts/**"],
    dest: destination + "/fonts"
  },
  images: {
    src: [source + "/images/**/*", "node_modules/rcue/dist/img/bg-login.jpg"],
    dest: destination + "/images"
  },
  html: {
    src: [source + "/partials/**/*.html"],
    dest: destination + "/partials"
  },
  rootFiles: {
    src: ["./src/index.html", "node_modules/rcue/dist/img/favicon.ico"],
    dest: destination
  },
  configFile: destination + "/config.json"
};

gulp.task("js", function() {
  // https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-multiple-destination.md
  const bundledStream = through();
  bundledStream
    .pipe(sourceStream("app.js"))
    .pipe(buffer())
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.uglify())
    .pipe($.sourcemaps.write("./"))
    .pipe(gulp.dest(files.js.dest))
    .pipe($.connect.reload());

  globby(files.js.src)
    .then(function(entries) {
      const b = browserify({
        entries: entries,
        debug: true,
        paths: ["./node_modules", "./src/js/"]
      });
      b.bundle().pipe(bundledStream);
    })
    .catch(function(err) {
      bundledStream.emit("error", err);
    });

  return bundledStream;
});

gulp.task("css", function() {
  gulp.task("css", function() {
    return gulp
      .src(files.css.src)
      .pipe(
        $.sass({ includePaths: files.css.includePaths }).on(
          "error",
          $.sass.logError
        )
      )
      .pipe($.concat("dashboard.min.css"))
      .pipe($.sourcemaps.init())
      .pipe($.cleanCss())
      .pipe($.sourcemaps.write("./"))
      .pipe(gulp.dest(files.css.dest));
  });
});

gulp.task("fonts", function() {
  gulp.src(files.fonts.src).pipe(gulp.dest(files.fonts.dest));
});

gulp.task("images", function() {
  gulp.src(files.images.src).pipe(gulp.dest(files.images.dest));
});

gulp.task("html", function() {
  gulp.src(files.html.src).pipe(gulp.dest(files.html.dest));
});

gulp.task("files", function() {
  gulp.src(files.rootFiles.src).pipe(gulp.dest(files.rootFiles.dest));
});

gulp.task("build", ["js", "css", "fonts", "images", "html", "files"]);

function writeConfigFile(version) {
  const template = `{
  "apiURL": "http://${host}:5000",
  "version": "${version}"
}`;
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }
  fs.writeFileSync(files.configFile, template);
}

gulp.task("config:dev", function() {
  childProcess.exec("git rev-parse --short HEAD", { cwd: __dirname }, function(
    err,
    stdout
  ) {
    const version = stdout.split("\n").join("");
    writeConfigFile(version);
  });
});

gulp.task("watch", function() {
  gulp.watch(files.js.src, ["js"]);
  gulp.watch(files.css.src, ["css"]);
  gulp.watch(files.html.src, ["html"]);
});

gulp.task("build:dev", ["build", "config:dev"]);

gulp.task("serve:dev", ["build:dev", "watch"], function() {
  $.connect.server({
    root: "static",
    livereload: true,
    port
  });
});

gulp.task("config:prod", function() {
  const version = __dirname.split("git")[1].slice(0, 8);
  writeConfigFile(version);
});

gulp.task("build:pkg", ["build", "config:prod"]);

// Tests

gulp.task("lint", function() {
  return gulp
    .src(files.js.src)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});
