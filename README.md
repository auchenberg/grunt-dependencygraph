grunt-dependencygraph
===========

Visualize your CommonJS or AMD module dependencies in a force directed graph using D3.js.

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
          format: 'amd' // 'amd' or 'cjs'
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
format                  Dependency-format to parse, either cjs (common-js), or amd
exclude                 A regular expression for excluding modules
```

TODO
-------
grunt-dependencygraph is still very much in progress, so here is the todo-list:

- Proper label positioning: Avoid label collisions and make the graph more readable.
- Arrows on lines between nodes.
- Better highlighting of dependencies when hovering nodes.



