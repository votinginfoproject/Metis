// Karma configuration
// Generated on Wed Dec 11 2013 15:05:12 GMT-0500 (EST)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'public/assets/js/lib/angular/angular.js',
      "public/assets/js/lib/angular-route/angular-route.js",
      'public/assets/js/lib/angular-resource/angular-resource.js',
      'public/assets/js/lib/angular-mocks/angular-mocks.js',
      'public/assets/js/lib/angular-cookies/angular-cookies.min.js',
      'public/assets/js/lib/jquery/jquery.min.js',
      'public/assets/js/lib/javascript-debug/ba-debug.min.js',
      'public/assets/js/lib/ng-table/ng-table.js',
      'public/assets/js/lib/leaflet/0.7.2/leaflet.js',
      'public/test/Mocking.js',
      'public/assets/js/app/utils.js',
      'public/assets/js/app/app.js',
      'public/assets/js/app/services/*.js',
      'public/assets/js/app/controllers/*.js',
      'public/test/unit/KarmaUtil.js',
      'public/test/unit/*.js'
    ],


    // list of files to exclude
    exclude: [
      
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 8000,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Firefox'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
