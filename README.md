Base App
=======

## Requirements

* [Composer](https://getcomposer.org/)
* [Gulp](http://gulpjs.com/)
* [Bower](http://bower.io/)

## Setup

1. Point the domain to the public directory.
2. Install dependencies:

  ```shell
  $ composer install
  $ npm install
  $ bower install
  ```

3. Copy .env.dist file to .env and set your needed environment variables, like database
credentials:

  ```shell
  $ cp .env.dist .env
  $ vi .env
  ```

  If you don't set the `APP_ENV` variable it will be "production" by default.

4. Edit the file `src/routes.php` and set your app routes.

## Compiling assets

Your assets sources are in the `resources/assets` directory.

There's a few gulp tasks to work with assets, this tasks uses the `resources/assets/manifest.js` file to define the compiled assets.

As an example, given the following definition:

```json
{
  "dependencies": {
    "app.css": {
      "files": [
        "less/grid.less",
        "less/app.less"
      ],
      "bower": [
        "normalize"
      ]
    },
    "app.js": {
      "files": [
        "js/core.js"
      ],
      "bower": [
        "jquery",
        "bootstrap"
      ]
    }
  }
}
```

the resulting assets are compiled to:

* **`public/assets/css/app.css`:** it will have the CSS from the [normalize.css](https://github.com/necolas/normalize.css) bower dependency and the files `resources/less/grid.less` and `resources/less/app.less` compiled to CSS.
* **`public/assets/js/app.js`:** it will have the JS files from the jquery and bootstrap bower dependencies and the file `reources/js/core.js`.

### Tasks

There's a few gulp tasks for work with assets:

* `gulp clean`: deletes the assets destination path.
* `gulp lint:js`: lints the JS code with [ESLint](http://eslint.org/) using the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/).
* `compile:js`: compiles the JS files defined in the manifest.json file.
* `compile:css`: compiles the CSS files defined in the manifes.json file.
* `gulp publish:img`: optimize the project images with [imagemin](https://github.com/imagemin/imagemin) and places it in the public assets directory.
* `gulp publish:fonts`: publish the project fonts in the public assets directory.
* `gulp publish:misc`: dump stuff that isn't supported by the asset-builder module (like flash files) to the public directory.
* `gulp build`: clean the public assets directory and publish the CSS, JS, images, fonts and other assets stuff.
* `gulp watch`: run [Browsersync](http://www.browsersync.io/).

## RTFM

This app depends on various projects if you are having some troubles read the project's docs and if you can't fix it  [leave an issue](https://github.com/sebacruz/baseapp/issues).

* [Composer](https://getcomposer.org/): used to handle the php dependencies.
* [Bower](http://bower.io/): used to handle the frontend dependencies.
* [Gulp](http://gulpjs.com/): used to run automated tasks.
* [Browsersync](http://www.browsersync.io/): synchronizes file changes and interactions across multiple devices
* [Babel](https://babeljs.io/): ECMAScript 6 to ECMAScript 5 compiler.
* [Slim Framework](http://www.slimframework.com/): the core of this app.
* [ESLint](http://eslint.org/): lints the JS code using the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/).
* [asset-builder](https://github.com/austinpray/asset-builder): assembles and orchestrates your dependencies so you can run them through your asset pipeline.
* [Monolog](https://github.com/Seldaek/monolog): used for log stuff.
* [Symfony's VarDumper](http://symfony.com/doc/current/components/var_dumper/introduction.html): provides a better dump() function that you can use instead of var_dump.
