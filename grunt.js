/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    watch: {},

    server: {
      port: 4000,
      base: '.'
    },

    dependencygraph: {
      path: '/Users/auchenberg/Development/example-multipage/www',
      outputPath: './graph/',
      format: 'amd'
    }

  });

  grunt.loadTasks('tasks');


};
