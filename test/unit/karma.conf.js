module.exports = function(config) {
  config.set({
    basePath: '../..',
    frameworks: ['mocha', 'chai'],
    files: [
      'static/js/app.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'test/unit/**/*.spec.js'
    ],
    exclude: [],
    preprocessors: {},
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: Infinity
  });
};
