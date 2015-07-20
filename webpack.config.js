/* START SOLUTION */
/*
 * This is where we tell Webpack exactly what we want it to do.
 *
 * We need to define three options to make our Webpack work:
 *   1) Where our app starts (entry)
 *   2) Where our bundle should be created (output)
 *   3) What we want to do with the files in our app (module.loaders)
 */

module.exports = {
  /*
   * Organizing our code in modules is a bit different than the traditional style.
   * Gone are the days of endless <script> tags in index.html that must be carefully ordered.
   * Instead, our `entry` point defines where our app starts. It's here where we'll import
   * all other files as needed, and Webpack manages the tree of dependencies automagically.
   * 
   * If you've ever used node, your app's entry point is conventionally `index.js`
   */
  // entry: './client/app.js', (unnecessary with gulp - gulp.src does this for us)

  /*
   * Not only will Webpack gracefully manage the tree of dependencies for us, it can also
   * smash all the dependencies into one convenient file that we can send over the wire.
   * This is similar to minification. The `output` object defines where this minified file should live
   */
  output: {
    // path: __dirname + '/client', // Absolute (!) path for our output file (unnecessary with gulp - gulp.dest does this for us)
    filename: 'bundle.js', // `bundle.js` is a typical convention for Webpack
  },

  /*
   * Bundles are all fun and games until you have to debug them. It's not easy
   * sorting through one giant file of transpiled ES5 code to see where you went wrong.
   * 
   * Sourcemaps are an invaluable tool when debugging. They map your bundle to your
   * source files and allow you to trace errors in your bundle back to the code you
   * actually wrote. You should always use source maps when developing with a transpiler.
   */
  devtool: 'sourcemap', // Will be created at './client/app/bundle.js.map'

  /*
   * This is where most of magic happens. Webpack loaders allow you to preprocess files as you import them.
   * They are kind of like 'tasks' in other build tools. In fact, if you are using another build tool
   * like gulp or grunt along with Webpack, you should leave any task that touch files
   * (transpilation, minification, etc) to Webpack and use your other build system to orchastrate other automation.
   *
   * Loaders can tranform files from a different language (TypeScript to JavaScript or ES6 to ES5!)
   * Loaders even allow you to do things like import css files right in your JavaScript!

   * Each loader is just an object that defines (1) a collection of files (2) the transformation.
   * Here's how the properties work: 
   *   test: A condition that must be met (regex)
   *   loader: A string of "!" separated loaders (these are executed from right to left)
   *   include: A condition that must be met (not included, but reges)
   *   exclude: A condition that must not be met (regex)
   */
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: [/node_modules/]}, // Transpile our .js from ES6 to ES5
      { test: /\.html$/, loader: 'raw' }, // 'raw' will import our html as a string - great for Angular templates!
      { test: /\.css$/, loader: 'style!css' } // 'css' loader will parse our stylesheets, and 'style' loader will inject it into the <head> of our index.html
    ]
  }
};
/* END SOLUTION */
