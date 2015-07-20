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
/* START SOLUTION */
    webpack = require('gulp-webpack');
/* END SOLUTION */

/*
 * A convenience object to hold different paths we care about.
 * 
 * This 'glob' notation is a nice wildcard notation for paths that is common in gulp tasks.
 * This glob says: watch for any .js, .css, or .html file at any level in our 'client' directory
 */
var paths = {
  app: ['client/**/*.{js,css,html}']
};

/* START SOLUTION */
/*
 * Gulp is built ontop of node's powerful 'stream' concepts.
 * You can think of a stream as faucet of water that flows through different 'pipes'
 * We open the gulp faucet by passing a glob of files into gulp.src.
 * Then we can 'pipe' these files through all sorts of different transformations,
 * each one returning its own stream that can continue to be piped into more transformations.
 *
 * Here, we're grabbing the entry point to our (making the `entry` property in webpack.config.js unnecessary),
 * piping the entry into webpack plugin, bundling our app, and piping that into the client folder designated by gulp.dest
 *
 * NOTE: gulp.dest defines our webpack's output folder. Webpack will get mad if it finds an output.path property 
 * in webpack.config.js. We still need `filename` though.
*/
gulp.task('build', function() {
  return gulp.src('./client/app.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('client'));
});
/* END SOLUTION */

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
  sync(/*START SOLUTION*/'build'/*END SOLUTION*/, 'serve', 'watch', done);
});
