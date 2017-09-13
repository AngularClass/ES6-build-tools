<p align="center">
  <a href="http://courses.angularclass.com/courses/angular-2-fundamentals" target="_blank">
    <img width="438" alt="Angular 2 Fundamentals" src="https://cloud.githubusercontent.com/assets/1016365/17200649/085798c6-543c-11e6-8ad0-2484f0641624.png">
  </a>
</p>

---
# ES6 Build tools

Learn how to set up an ES6 environment with Webpack, Gulp and Babel and practice building your own. You can use this environment with Angular or any other framework.

Read through the comprehensive introduction and then hit the [exercises](#exercises).

# Introduction

Before we can start building our application, we have to make sure our environment is ready to handle ES6. Even though the ES6 spec has officially been approved, it is [far from standard](http://kangax.github.io/compat-table/es6/) in most browsers today. 
ES6 brings a ton of new stuff, and it's going to take quite some time for all the different JavaScript environments to implement the new standard. But that doesn't mean we have to wait for them to write ES6 today!

With the help of _transpilers_ like [Babel](http://babeljs.io/) and [Traceur](https://google.github.io/traceur-compiler/demo/repl.html), we can write ES6 code that gets compiled down to the widely implemented ES5 that you are already comfortable with.

ES6 is awesome and we want to write our apps with it. Babel has a [sweet REPL](https://babeljs.io/repl/) that you can play around with, but of course we can't write applications in a REPL. What are we to do?

The goal of this section is to not only learn how we can use these transpilers to write ES6 code today, but also how to use build tools to entirely automate this book keeping process.

## Webpack
[Webpack](http://webpack.github.io/docs/tutorials/getting-started/) is really convenient because it not only lets us transpile from ES6 to ES5 with Babel, but it also lets us organize our client-side code in modules.

Organizing our code in modules is a bit different than the traditional style. Gone are the days of endless `<script>` tags in our `index.html` that must be carefully ordered. Instead, we can break our app into small components and `import` them as needed. If you've ever used node, Webpack basically allows us to bring `require` to the client (or ES6's `import`, or even AMD's `define`)

Webpack allows us to:
* Transpile from ES6 to ES5 with Babel
* Load HTML files as modules
* Load CSS (along with your favorite preprocessor) append the styles to the DOM
* Bundle our app into a single script to transfer over the wire
* Load any and all modules (ES6, CommonJS, AMD)

Many of these things you might have done with another build tool like Gulp or Grunt. It's recommended that you leave any task that touch files (transpilation, minification, etc) to Webpack and use your other build system to orchastrate other automation.

### Using Webpack

#### Install Webpack
Install Webpack with `npm install -g webpack`
Create a `client` folder to hold our app: `mkdir client`

#### Bundle your first app
Create `client/app.js`
```js
var greeting = 'It works!';
alert(greeting);
```

Create `client/index.html`
```html
<html>
  <head>
    <meta charset="UTF-8">
  </head>
  <body>
    <script src="./client/bundle.js"></script>
  </body>
</html>
```

Run the following:
`webpack ./client/app.js ./client/bundle.js`

Open `index.html` in your browser. It should alert `It works!`

#### Add another file to our app
Create `client/content.js`
```js
// This is Node's module syntax
module.exports = 'It works from content.js';
```

Update `client/app.js`
```diff
- var greeting = 'Hello world!';
+ var greeting = require('./content');
alert(greeting);
```
Recompile with:
`webpack ./client/app.js ./client/bundle.js`

Update your browser window and you should see the alert `It works from content.js`

#### Add ES6 to our app
We want to add ES6 to our application. Webpack can only handle ES5 natively, so we need the babel-loader to process js files written with ES6 down to ES5. We can install [any of the webpack loaders](http://webpack.github.io/docs/list-of-loaders.html) through `npm`.

Run `npm init`. Default options are fine. Just repeatedly hit enter.

Run `npm install babel-core babel-loader --save-dev`

ES6ify `client/content.js`
```js
// This is ES6 module syntax now
export default 'It works from content.js'
```

ES6ify `client/app.js`
```js
import greeting from './content'
// We can use any ES6 syntax supported by Babel here now!
alert(`${greeting} and with ES6!!`)
```

Now, we can use a special flag in our CLI to send all `.js` files through babel. Recompile your beautiful new ES6 app:
`webpack ./client/app.js ./client/bundle.js --module-bind 'js=babel-loader'`

Update your browser window and you should see the alert `It works from content.js`

We now have a totally working, modular, ES6 app!!

## Gulp
Gulp is a generic JavaScript task runner that goes well beyond bundling. Gulp can handle many aspects of development. It can serve our files, watch our files and run commands if any of them change, create directories with boilerplate code, and even deploy our app.

Webpack can do a lot of tasks Gulp can. For our ES6 environment, we're going to a basic Gulpfile to serve our app and reload when a file changes.

**Gulp runs on plugins.** If you want to automate anything, run an `npm search` for `gulp-whatever` and chances are you'll find it.

We're going to focus on a couple of basics: serving and watching.

### Set Up Gulp
1. Install gulp globally: `npm install -g gulp`.
1. Install gulp locally also: `npm install gulp --save-dev`
1. Create a `gulpfile.js` at the root of your project:
```js
var gulp = require('gulp');

gulp.task('default', function() {
  // This task will execute when you run `gulp`
});
```
1. Run gulp
`$ gulp`

The default task will run and do nothing! To run individual tasks, use `gulp <task>`

### Serve our client
We're going to use [Browsersync](http://www.browsersync.io/) to serve our client (not actually a gulp specific plugin).

Install Browsersync: `npm install browser-sync --save-dev`

Update `gulpfile.js`
```js
var gulp = require('gulp');
var serve = require('browser-sync');

gulp.task('serve', function() {
  // This will serve our client folder on localhost:3000
  serve({
    port: 3000,
    open: false,
    server: {
      baseDir: 'client'
    }
  });
});
```
We've defined a new task so when we run `gulp serve`, our client folder will be served on `localhost:3000`

This is only semi useful, because right now if we make any changes to our app we have to run our webpack command: `webpack ./client/app.js ./client/bundle.js --module-bind 'js=babel'` to update our `bundle.js` and then run `gulp serve` again. This section was meant to just introduce you to creating new gulp tasks. You'll unlock Gulp's full potential in the exercises.

### Watching files
Gulp also has the power to watch your files for any changes, and run a command whenever it notices one of these changes. It doesn't even need a plugin. Let's do it!

Update `gulpfile.js`
```js
var gulp = require('gulp');
var serve = require('browser-sync');

// ... previously defined tasks

gulp.task('watch', function() {
  gulp.watch('client/**/*.{js,css,html}', [serve.reload])
});
```

This 'glob' notation is a nice wildcard notation for pathnames that is common in gulp tasks. This task says: watch for any .js, .css, or .html file at any level in our 'client' directory and run the array of commands that follows - in this case, just reload our server.

### Combine tasks together
A gulp task can consist of many other gulp tasks. By default, tasks passed in using array notation (like `[serve.reload]` above) run in series, causing a race condition and not guaranteeing any order of completion. 

Sometimes this is not wanted. For example, if we wanted to do something crazy like _fully transpile all our ES6 code into ES5_ before it is served, we need to guarantee the entire build step is completed before the serve task.

`run-sequence` is a nice plugin that lets us run gulp tasks in series instead of parallel.

Install run-sequence: `npm install run-sequence --save-dev`

Update `gulpfile.js`
```js
var gulp = require('gulp');
var serve = require('browser-sync');
var sync = require('run-sequence');

// ... previously defined tasks

// new default task
gulp.task('default', function(done) {
  sync('serve', 'watch', done);
});
```

Now whenever we run `gulp`, it will run the `serve` command in its entirety, then `watch` in its entirety, and then invoke the `done` callback to let gulp know all asyncronous tasks have been completed.

# Exercises

It's your turn! We've only just scratched the surface of what our build tools can do. Complete the following tasks to make your build tools even more useful.

Solutions to the Basic Requirements are on the [solution branch](https://github.com/angular-class/ES6-build-tools/tree/solution). There are no solutions for the Extra Credit or Nightmare Mode challenges. Use the lessons learned from the Basic Requirements to figure these out on your own!

## Basic Requirements
- [ ] Get a copy of this repo. It starts in the state that the introduction left off.
  - [ ] Fork it
  - [ ] Clone it
  - [ ] Run `npm install`
- [ ] Make sure Webpack and Gulp are installed globally.
  - [ ] `npm install -g gulp`
  - [ ] `npm install -g webpack`
- [ ] Make our Webpack build step more convenient by transforming our CLI command into a `webpack.config.js` file so that running just `webpack` will build our app.
  - Hint: [Webpack Configuration](http://webpack.github.io/docs/configuration.html)
- [ ] Add a `build` task to Gulp that uses this config and runs webpack in it's entirety before it serves the client.
  - It would suck if we had to run the `webpack` command by hand all the time, right?
  - Hint: check out the npm package `gulp-webpack`
  - Hint: Some properties that are needed to run `webpack` are unnecessary when paired with gulp

## Extra Credit
- [ ] Get HTML and CSS imports working with Webpack loaders
- [ ] Add a CSS Preprocessor to Webpack (Stylus, LESS)
- [ ] Sourcemaps are invaluable when debugging transpiled code. Add them to Webpack 
- [ ] Add a `deploy` task to Gulp that deploys your bundle to Heroku

## Nightmare Mode
- [ ] Refactor the build system to use [JSPM](jspm.io) instead of Webpack

# Support and Questions
> Contact us anytime for anything about this repo

* [GitHub: Issues](https://github.com/angular-class/ES6-build-tools/issues)
* [Twitter: @AngularClass](https://twitter.com/AngularClass)

___

enjoy -- **AngularClass** 


<br><br>

[![AngularClass](https://cloud.githubusercontent.com/assets/1016365/9863770/cb0620fc-5af7-11e5-89df-d4b0b2cdfc43.png  "Angular Class")](https://angularclass.com)
##[AngularClass](https://angularclass.com)
> Learn Angular in 2 days from the best
