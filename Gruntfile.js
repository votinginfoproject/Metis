/**
 * Created by bantonides on 11/27/13.
 */
module.exports = function(grunt) {

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
        tasks: ['sass']
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-gjslint');

  grunt.registerTask('default', ['watch']);
};
