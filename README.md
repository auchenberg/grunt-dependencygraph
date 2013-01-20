grunt-dependencygraph
===========

Visualize your CommonJS or AMD module dependencies.

Installation
-------------

From the same directory as your Gruntfile, run

```
npm install grunt-dependencygraph
```

Then add the following line to your Gruntfile:

```js
grunt.loadNpmTasks('grunt-dependencygraph');
```

You can verify that the task is available by running `grunt --help` and
checking that "dist" is under "Available tasks".

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

Then just run `grunt dependencygraph` and enjoy!
