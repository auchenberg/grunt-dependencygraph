grunt-dependencygraph
===========

Visualize your CommonJS or AMD module dependencies in a force directed graph using D3.js.

Introduction
-------------

You can read the full introduction to the project in my [blog post](http://blog.kenneth.io/blog/2013/01/23/visualize-your-javaScript-dependencies-with-grunt-dependencygraph/).

Features
-------------
- Draw a graph of nodes, where each module is represented as a node. 
- Google Maps's like zooming, dragging and panning.
- Connect nodes with it's dependencies via lines.
- Hovering a node will highlight it's direct dependencies.
- It's possible to drag a node to a specific position, to re-layout the graph.

Example
-------
The best way to show something is by example, so here I generated a dependencygraph of the offical [RequireJS multipage-example](https://github.com/requirejs/example-multipage)

http://auchenberg.github.com/grunt-dependencygraph/example

Installation
-------------

From the same directory as your Gruntfile, run

```
npm install grunt-dependencygraph
```

Then add some configuration for the plugin like so:

    grunt.initConfig({
        ...
        dependencygraph: {
          targetPath: './app/assets/javascript',
          outputPath: './public/graph',
          format: 'amd'
        },
        ...
    });


Then add the following line to your Gruntfile **after** the initConfig-section:

```js
grunt.loadNpmTasks('grunt-dependencygraph');
```

Then just run `grunt dependencygraph`, go to your `outputPath`-folder, and open `index.html`.

Enjoy.

Options
-------
grunt-dependencygraph supports a few options.

```text                 
targetPath              Path for the target source to extract dependencies (supports absolute/relative paths)
outputPath              Path for where to output the graph (supports absolute/relative paths)
format                  Dependency-format to parse, either 'cjs' (common-js), or 'amd' (AMD)
exclude                 A regular expression for excluding modules
```

TODO
-------
grunt-dependencygraph is still very much in progress, so here is the todo-list:

- Proper label positioning: Avoid label collisions and make the graph more readable.
- Arrows on lines between nodes.
- Better highlighting of dependencies when hovering nodes.
- Testing! Unit tests of D3 render logic, and the grunt-task itself



