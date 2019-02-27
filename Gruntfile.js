/**
 * Created by bantonides on 11/27/13.
 */
module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          'public/assets/css/app.css': 'public/assets/css/app.scss'
        }
      }
    },
    watch: {
      css: {
        files: '**/*.scss',
        tasks: ['sass'],
        options: {
          livereload: true
        }
      },
      html: {
        files: '**/*.html',
        options: {
          livereload: true
        }
      },
      js: {
        files: 'public/**/*.js'
      }

    },
    gjslint: {
      options: {
        flags: [
          '--disable 220', //ignore error code 220 from gjslint
          '--max_line_length 120'//,
          //'--jslint_error all'
        ],
        reporter: {
          name: 'console'
        }
      },
      all: {
        src: ['*.js',
          'public/assets/js/app/**/*.js']
      }
    },
    // start the app, instead of typing `node app.js`
    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          ignoredFiles: ['public/**', '.sass-cache/**', '.git/**', 'newrelic_agent.log', 'sessions/*']
        }
      },
      prod_like: {
        options: {
          file: 'app.js',
          ignoredFiles: ['*']
        }
      }
    },
    bower: {
      install: {
        // copy dependent packages from bower.json
      }
    },
    replace: {
      auth0: {
        src: ['public/assets/js/app/config.js.template'],
        dest: 'public/assets/js/app/config.js',
        replacements: [{
          from: 'AUTH0_CLIENT_ID_DASHBOARD',
          to: process.env.AUTH0_CLIENT_ID_DASHBOARD
        },
        {
          from: 'AUTH0_DOMAIN_DASHBOARD',
          to: process.env.AUTH0_DOMAIN_DASHBOARD
        },
        {
          from: 'AUTH0_REDIRECT_URI_DASHBOARD',
          to: process.env.AUTH0_REDIRECT_URI_DASHBOARD
        },
        {
          from: 'AUTH0_AUDIENCE_DASHBOARD',
          to: process.env.AUTH0_AUDIENCE_DASHBOARD
        }]
      }
    },
    run: {
      production: {
        cmd: 'node',
        args: ['-u', '"node"', 'app.js']
      },
      migrate: {
        cmd: 'node_modules/.bin/db-migrate',
        args: ['up']
      }
    },
    // Run blocking grunt tasks concurrently
    concurrent: {
      dev_configure: {
        options: {
          logConcurrentOutput: true
        },
        tasks: ['bower:install', 'replace:auth0']
      },
      dev_run: {
        options: {
          logConcurrentOutput: true
        },
        tasks: ['watch', 'nodemon:dev']
      },
      migrate: {
        options: {
          logConcurrentOutput: true
        },
        tasks: ['run:migrate']
      },
      prod_like_configure: {
        options: {
          logConcurrentOutput: true
        },
        tasks: ['sass', 'replace:auth0']
      },
      prod_like_run: {
        options: {
          logConcurrentOutput: true
        },
        tasks: ['run:production']
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');

  grunt.registerTask('default', ['concurrent:dev_configure', 'concurrent:migrate', 'concurrent:dev_run']);
  grunt.registerTask('staging', ['concurrent:prod_like_configure','concurrent:migrate','concurrent:prod_like_run'])
  grunt.registerTask('production', ['concurrent:prod_like_configure','concurrent:migrate','concurrent:prod_like_run'])
};
