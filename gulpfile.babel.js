/* eslint-env node, es6 */

'use strict';

import gulp from 'gulp';
import merge from 'merge-stream';
import lazypipe from 'lazypipe';
import runSequence from 'run-sequence';
import gulpif from 'gulp-if';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import eslint from 'gulp-eslint';
import less from 'gulp-less';
import sass from 'gulp-sass';
import cssnano from 'gulp-cssnano';
import imagemin from 'gulp-imagemin';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync'; // require('browser-sync').create();

let manifest = require('asset-builder')('./manifest.json');

const argv = require('yargs')
  .default('production', false)
  .boolean('production', 'disable-fail')
  .argv;


// CLI options
const enabled = {
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
  stripJSDebug: argv.production,
};


/**
 * CSS processing pipeline
 *
 * @param  {string} filename
 * @return {object}
 */
function cssTasks(filename) {
  return lazypipe()
    .pipe(function() {
      return gulpif(enabled.maps, sourcemaps.init());
    })
    .pipe(function() {
      return gulpif('*.less', less({
        paths: ['bower_components'],
      }));
    })
    .pipe(function() {
      return gulpif('*.scss', sass());
    })
    .pipe(concat, filename)
    .pipe(function() {
      return gulpif(enabled.minify, cssnano({
        discardComments: {
          removeAllButFirst: true,
        },
        autoprefixer: {
          browsers: ['last 3 versions'],
          cascade: false,
        },
      }));
    })
    .pipe(function() {
      return gulpif(enabled.maps, sourcemaps.write('.', {
        sourceMappingURLPrefix: '/assets/css/',
      }));
    })();
}

/**
 * JS processing pipeline
 *
 * @param  {string} filename
 * @return {object}
 */
function jsTasks(filename) {
  return lazypipe()
    .pipe(function() {
      return gulpif(enabled.maps, sourcemaps.init());
    })
    .pipe(concat, filename)
    .pipe(uglify, {
      compress: {
        drop_console: enabled.stripJSDebug,
      },
      output: {
        beautify: !enabled.minify,
        ascii_only: true,
      },
    })
    .pipe(function() {
      return gulpif(enabled.maps, sourcemaps.write('.', {
        sourceMappingURLPrefix: '/assets/js/',
      }));
    })();
}

/**
 * Run lossless compression on images
 */
function imgTasks() {
  return lazypipe()
    .pipe(imagemin, {
      progressive: true,
      interlaced: true,
      svgoPlugins: [
        {removeUnknownsAndDefaults: false},
        {cleanupIDs: false},
      ],
    })();
}

/**
 * Write file
 *
 * @param  {string} directory
 * @return {object}
 */
function writeFile(directory) {
  return lazypipe()
    .pipe(gulp.dest, manifest.paths.dist + directory)();
}


/**
 * Lints configuration JSON and project JS
 */
gulp.task('lint:js', function() {
  return gulp.src(manifest.getProjectGlobs().js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulpif(enabled.failJSLint, eslint.failOnError()));
});

/**
 * Deletes the build folder entirely
 */
gulp.task('clean', require('del').bind(null, [manifest.paths.dist]));

/**
 * Scripts compilation
 *
 * Run the JS taks for each javascript file specified in the manifest file
 */
gulp.task('compile:js', ['lint:js'], function() {
  const merged = merge();

  manifest.forEachDependency('js', function(dep) {
    merged.add(
      gulp.src(dep.globs)
        .pipe(jsTasks(dep.name))
    );
  });

  return merged
    .pipe(writeFile('js'))
    .pipe(browserSync.stream());
});

/**
 * CSS compilation
 *
 * Run the CSS taks for each css file specified in the manifest file
 */
gulp.task('compile:css', function() {
  const merged = merge();

  manifest.forEachDependency('css', function(dep) {
    const cssTasksInstance = cssTasks(dep.name);

    if (!enabled.failStyleTask) {
      cssTasksInstance.on('error', function(err) {
        console.error(err.message);
        this.emit('end');
      });
    }

    merged.add(
      gulp.src(dep.globs)
        .pipe(cssTasks(dep.name))
    );
  });

  return merged
    .pipe(writeFile('css'))
    .pipe(browserSync.stream());
});

/**
 * Images optimization
 */
gulp.task('publish:img', function() {
  return gulp.src(manifest.globs.images)
    .pipe(imgTasks())
    .pipe(writeFile('img'))
    .pipe(browserSync.stream());
});

/**
 * Fonts publishing
 */
gulp.task('publish:fonts', function() {
  const merged = merge();

  manifest.globs.fonts.map(function(file) {
    let base = manifest.paths.source;

    if (file.indexOf('bower_components') >= 0) {
      base = 'bower_components';
    }

    merged.add(
      gulp.src([file], {base: base})
    );
  });

  return merged
    .pipe(writeFile('fonts'))
    .pipe(browserSync.stream());
});

/**
 * Random vendor stuff publising
 *
 * This task dumps stuff that isn't suported by the asset-builder module,
 * like flash files, to an public directory.
 *
 * @todo TODO find a better way to do this in the same way as the font files
 */
gulp.task('publish:misc', function() {
  // we put the file list here because if you put them in the manifest.json file
  // the asset-builder module automatically adds the paths.source to each path
  const files = [
  ];

  return gulp.src(files, {base: 'bower_components'})
    .pipe(writeFile('vendor'));
});

/**
 * Run all the build tasks with an clean up beforehand
 */
gulp.task('build', ['clean'], function(callback) {
  manifest = require('asset-builder')('./manifest.json');

  runSequence('compile:js', 'compile:css', ['publish:img', 'publish:fonts'], callback);
});

/**
 * Use BrowserSync to proxy your dev server and synchronize code changes
 * across devices.
 *
 * When a modification is made to an asset, run the build step for that asset
 * and inject the changes into the page.
 *
 * See: http://www.browsersync.io
 */
gulp.task('watch', function() {
  browserSync.init({
    proxy: manifest.config.devUrl,
  });

  gulp.watch([
    manifest.paths.source + 'css/**/*',
    manifest.paths.source + 'less/**/*',
    manifest.paths.source + 'scss/**/*',
    manifest.paths.source + 'sass/**/*',
  ], ['compile:css']);

  gulp.watch([
    manifest.paths.source + 'js/**/*',
  ], ['compile:js']);

  gulp.watch([
    manifest.paths.source + 'img/**/*',
  ], ['publish:img']);

  gulp.watch([
    manifest.paths.source + 'fonts/**/*',
  ], ['publish:fonts']);

  gulp.watch(['./manifest.json'], ['build']);
});

/**
 * Alias of build taks
 */
gulp.task('default', function() {
  gulp.start('build');
});
