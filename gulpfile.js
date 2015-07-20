/*
 * This is the heart of Gulp. Here we define and compost tasks together
 *
 * Gulp runs on plugins!
 * If you want to automate anything, run an `npm search` 
 * for `gulp-whatever` and chances are you'll find it.
 */

var gulp    = require('gulp'),
    sync    = require('run-sequence'),
    serve   = require('browser-sync'),

/*
 * A convenience object to hold different paths we care about.
 * 
 * This 'glob' notation is a nice wildcard notation for paths that is common in gulp tasks.
 * This glob says: watch for any .js, .css, or .html file at any level in our 'client' directory
 */
var paths = {
  app: ['client/**/*.{js,css,html}']
};

// TODO: Write a `gulp build` task that uses webpack to build your app and output it to `client/bundle.js`
// HINT: Some properties that are needed to run `webpack` from the CLI are unnecessary when paired with gulp

/*
 * Browsersync manages a server that plays nicely with gulp (see serve.reload below)
 * NOTE: server.baseDir should be a directory that contains `index.html`
 */
gulp.task('serve', function() {
  serve({
    port: 3000,
    open: false,
    server: {
      baseDir: 'client'
    }
  });
});

/*
 * Gulp also has the power to watch your files for any changes, and run a command whenever one changes.
 * It doesn't even need a plugin. Let's do it!
 * 
 * This task says: If any files in our app glob change, re-build the whole thing, and then reload the server
 */
gulp.task('watch', function() {
  gulp.watch(paths.app, ['build', serve.reload]);
});

/*
 * A gulp task can consist of many other gulp tasks. 
 * By default, tasks passed in using array notation (like `[serve.reload]` above) run in series,
 * not guaranteeing any order of completion, and causing a race condition.
 * 
 * Sometimes this is not wanted. For example, if we want to fully transpile all our ES6 code into ES5
 * before it is served, we need to guarantee the entire build step is completed before the serve task.
 * 
 * `run-sequence` is a nice plugin that lets us run gulp tasks in series instead of parallel.
 * 
 * Now whenever we run `gulp`, it will run the `build` command in its entirety, 
 * the `serve` command in its entirety, then `watch` in its entirety,
 * and then invoke the `done` callback to let gulp know all asyncronous tasks have been completed.
 */
gulp.task('default', function(done) {
  sync('serve', 'watch', done);
});
