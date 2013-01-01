/*
 * Grunt Task File
 * ---------------
 *
 * Task: Grapher
 * Description: AMD Grapher.
 *
 */

module.exports = function(grunt) {

  var _ = grunt.utils._;
  // Shorthand Grunt functions
  var log = grunt.log;

  grunt.registerTask("grapher", "Generate AMD graph", function(prop) {
    var options;
    var args = this.args;

    // Run the server
    grunt.helper("grapher", options);

    // Fail task if errors were logged
    if (grunt.errors) { return false; }

    log.writeln("Generated graph. Yeeha.");
  });

  grunt.registerHelper("grapher", function(options) {
    // Require libraries.
    var fs = require("fs");
    var path = require("path");

    // Read data
    var data =  grunt.file.readJSON('data.json');

    var components = _.uniq(_.flatten(_.map(data, function(values, item) {
      var data = [];
      data.push(item);
      data = data.concat(values);

      return data;
    })));

    // Mapped nodes
    var nodes = _.map(components, function(component) {

      var size = 0;
      var color = '';

      return {
        size: size,
        color: color,
        id: component.split('/').pop()
      }
    });

    // Figure out links
    var links = [];
    _.each(data, function(dependencies, component, index) {
      _.each(dependencies, function(dependency) {

        var sourceIndex = _.indexOf(components, dependency);
        var targetIndex = _.indexOf(components, component);

        var link = {
          source:  _.indexOf(components, component),
          target:  _.indexOf(components, dependency),
        };

        if(sourceIndex > -1 && targetIndex > -1) {
          links.push(link);
        }
      })
    });

    // // Calculate sizes
    // _.each(nodes, function(node) {

    //   var nodeIndex = _.indexOf(components, node.id);
    //   var nodeLinks = _.filter(links, function(link) {
    //     return link.source == nodeIndex;
    //   });

    //   // node.size = nodeLinks.length;

    // });


    var graph = {
      "directed"    : true,
      "multigraph"  : false,
      "graph"       : [],
      "nodes"       : nodes,
      "links"       : links
    }

    // Finished, write up
    grunt.file.write('graph-result.json', JSON.stringify(graph, null, "\t") );

  });

};
