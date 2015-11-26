var pkg  = require('./package.json'),
    manifest = require('asset-builder')('./manifest.json');

var argv = require('yargs')
  .default('production', false)
  .boolean('production', 'disable-fail')
  .argv;

var gulp = require('gulp'),
    merge = require('merge-stream'),
    lazypipe = require('lazypipe'),
    runSequence = require('run-sequence'),
    gulpif = require('gulp-if'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    eslint = require('gulp-eslint'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create();


// CLI options
var enabled = {
  // Enable static asset revisioning when `--production`
  rev: argv.production,

  // Enable minification when `--production`
  minify: argv.production,

  // Disable source maps when `--production`
  maps: !argv.production,

  // Fail styles task on error when `--production`
  failStyleTask: (argv.disableFail !== undefined) ? argv.disableFail : argv.production,

  // Fail due to ESLint warnings only when `--production`
  failJSLint: (argv.disableFail !== undefined) ? argv.disableFail : argv.production,

  // Strip debug statments from javascript when `--production`
  stripJSDebug: argv.production
}


/**
 * CSS processing pipeline
 *
 * @param  {string} filename
 * @return {object}
 */
function cssTasks(filename){
  return lazypipe()
    .pipe(function(){
      return gulpif(enabled.maps, sourcemaps.init())
    })
    .pipe(function(){
      return gulpif('*.less', less({
        paths: ['bower_components']
      }))
    })
    .pipe(function(){
      return gulpif('*.scss', sass())
    })
    .pipe(concat, filename)
    .pipe(function(){
      return gulpif(enabled.minify, cssnano({
        discardComments: {
          removeAllButFirst: true
        },
        autoprefixer: {
          browsers: ['last 3 versions'],
          cascade: false
        }
      }))
    })
    .pipe(function() {
      return gulpif(enabled.maps, sourcemaps.write('.', {
        sourceMappingURLPrefix: '/assets/css/'
      }))
    })()
}

/**
 * JS processing pipeline
 *
 * @param  {string} filename
 * @return {object}
 */
function jsTasks(filename){
  return lazypipe()
    .pipe(function() {
      return gulpif(enabled.maps, sourcemaps.init())
    })
    .pipe(concat, filename)
    .pipe(uglify, {
      compress: {
        drop_console: enabled.stripJSDebug
      },
      output: {
        beautify: !enabled.minify,
        ascii_only: true
      }
    })
    .pipe(function() {
      return gulpif(enabled.maps, sourcemaps.write('.', {
        sourceMappingURLPrefix: '/assets/js/'
      }))
    })()
}

/**
 * Run lossless compression on images
 */
function imgTasks(){
  return lazypipe()
    .pipe(imagemin, {
      progressive: true,
      interlaced: true,
      svgoPlugins: [
        {removeUnknownsAndDefaults: false},
        {cleanupIDs: false}
      ]
    })()
}

/**
 * Write file
 *
 * @param  {string} directory
 * @return {object}
 */
function writeFile(directory){
  return lazypipe()
    .pipe(gulp.dest, manifest.paths.dist + directory)()
}


/**
 * Lints configuration JSON and project JS
 */
gulp.task('eslint', function(){
  return gulp.src(manifest.getProjectGlobs().js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulpif(enabled.failJSLint, eslint.failOnError()))
})

/**
 * Deletes the build folder entirely
 */
gulp.task('clean', require('del').bind(null, [manifest.paths.dist]))

/**
 * Scripts compilation
 *
 * Run the JS taks for each javascript file specified in the manifest file
 */
gulp.task("compile:js", ['eslint'], function(){
  var merged = merge()

  manifest.forEachDependency('js', function(dep){
    merged.add(
      gulp.src(dep.globs)
        .pipe(jsTasks(dep.name))
    )
  })

  return merged
    .pipe(writeFile('js'))
    .pipe(browserSync.stream())
})

/**
 * CSS compilation
 *
 * Run the CSS taks for each css file specified in the manifest file
 */
gulp.task('compile:css', function(){
  var merged = merge()

  manifest.forEachDependency('css', function(dep){
    var cssTasksInstance = cssTasks(dep.name);

    if (!enabled.failStyleTask) {
      cssTasksInstance.on('error', function(err) {
        console.error(err.message);
        this.emit('end');
      });
    }

    merged.add(
      gulp.src(dep.globs)
        .pipe(cssTasks(dep.name))
    )
  })

  return merged
    .pipe(writeFile('css'))
    .pipe(browserSync.stream())
})

/**
 * Images optimization
 */
gulp.task('publish:img', function(){
  return gulp.src(manifest.globs.images)
    .pipe(imgTasks())
    .pipe(writeFile('img'))
    .pipe(browserSync.stream())
})

/**
 * Fonts publishing
 */
gulp.task('publish:fonts', function(){
  var merged = merge()

  manifest.globs.fonts.map(function(file){
    var base = manifest.paths.source;

    if (file.indexOf('bower_components') >= 0) {
      base = 'bower_components';
    }

    merged.add(
      gulp.src([file], {base: base})
    )
  })

  return merged
    .pipe(writeFile('fonts'))
    .pipe(browserSync.stream())
})

/**
 * Random vendor stuff publising
 *
 * This task dumps stuff that isn't suported by the asset-builder module,
 * like flash files, to an public directory.
 *
 * @todo TODO find a better way to do this in the same way as the font files
 */
gulp.task('publish:misc', function(){
  // we put the file list here because if you put them in the manifest.json file
  // the asset-builder module automatically adds the paths.source to each path
  var files = [
  ];

  return gulp.src(files, {base: 'bower_components'})
    .pipe(writeFile('vendor'))
})

/**
 * Run all the build tasks with an clean up beforehand
 */
gulp.task('build', ['clean'], function(callback){
  runSequence('compile:js', 'compile:css', ['publish:img', 'publish:fonts'], callback)
})

/**
 * Use BrowserSync to proxy your dev server and synchronize code changes
 * across devices.
 *
 * When a modification is made to an asset, run the build step for that asset
 * and inject the changes into the page.
 *
 * See: http://www.browsersync.io
 */
gulp.task('watch', function(){
  browserSync.init({
    proxy: manifest.config.devUrl
  })

  gulp.watch([
      manifest.paths.source + 'backend/css/**/*',
      manifest.paths.source + 'frontend/css/**/*',
      manifest.paths.source + 'backend/less/**/*',
      manifest.paths.source + 'frontnend/less/**/*'
    ], ['compile:css'])

  gulp.watch([
      manifest.paths.source + 'backend/js/**/*',
      manifest.paths.source + 'frontend/js/**/*'
    ], ['compile:js'])

  gulp.watch([
      manifest.paths.source + 'backend/images/**/*',
      manifest.paths.source + 'frontend/images/**/*',
    ], ['publish:img'])

  gulp.watch([
      manifest.paths.source + 'backend/fonts/**/*',
      manifest.paths.source + 'frontend/fonts/**/*'
    ], ['publish:fonts'])

  gulp.watch(['./manifest.json'], ['build'])
})

/**
 * Alias of build taks
 */
gulp.task('default', function(){
  gulp.start('build')
})
