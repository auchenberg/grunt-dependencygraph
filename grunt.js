/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
    },

    qunit: {
      files: ['test/**/*.html']
    },

    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {}
    },

    server: {
      port: 4000,
      base: '.'
    }

  });

  grunt.loadTasks('task');


};
