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
          targetPath: '<project path>',
          outputPath: './graph/',
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

