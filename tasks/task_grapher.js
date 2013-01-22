/*
 * Grunt Task File
 * ---------------
 *
 * Task: dependencygraph
 * Description: Generate graph for CommonJS or AMD module dependencies.
 *
 */

module.exports = function(grunt) {

  var config = this.config.get('dependencygraph');

  var _ = grunt.utils._;
  var log = grunt.log;

  grunt.registerTask("dependencygraph", "Generate graph for CommonJS or AMD module dependencies.", function(prop) {
    var options;
    var args = this.args;

    // Find dependencies
    var dependencies = findDependencies();

    // Convert data
    var graphData = generateGraphOutput(dependencies);

    // Template
    writeHtml(graphData);

    // Fail task if errors were logged
    if (grunt.errors) { return false; }

    log.writeln("Generated graph into " + config.outputPath + " - Check.");
    log.ok();
    log.writeln("Booya.");

  });

  function findDependencies() {

    var madge = require('madge');
    var res = madge(config.targetPath, {
      format : config.format
    });

    log.writeln("Extracted dependencies. Check");
    log.ok();

    return res.obj();
  }

  function generateGraphOutput(dependencies) {

    // Read data
    var components = _.uniq(_.flatten(_.map(dependencies, function(values, item) {
      var data = [];
      data.push(item);
      data = data.concat(values);

      return data;
    })));

    // Mapped nodes
    var nodes = _.map(components, function(component) {
      return {
        id: component
      }
    });

    // Figure out links
    var links = [];
    _.each(dependencies, function(dependencies, component, index) {
      _.each(dependencies, function(dependency) {

        var sourceIndex = _.indexOf(components, dependency);
        var targetIndex = _.indexOf(components, component);

        var link = {
          source: _.indexOf(components, component),
          target: _.indexOf(components, dependency),
        };

        if(sourceIndex > -1 && targetIndex > -1) {
          links.push(link);
        }
      })
    });

    var graph = {
      "directed" : true,
      "multigraph" : false,
      "graph" : [],
      "nodes" : nodes,
      "links" : links
    }

    return graph;

  };

  function writeHtml(graphData) {

    var template = grunt.file.read(__dirname + '/lib/template.html');
    var css = grunt.file.read(__dirname + '/lib/style.css');
    var js = grunt.file.read(__dirname + '/lib/d3-graph.js');

    var html = grunt.template.process(template, {
      css : css,
      js : js,
      title : 'dependencyGraph',
      graphData: JSON.stringify(graphData, null)
    })

    grunt.file.write(config.outputPath + 'index.html', html);

  }

};
