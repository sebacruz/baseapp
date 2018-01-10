Base App
=======

## Requirements

* [Composer](https://getcomposer.org/)
* [node](https://nodejs.org/)

## Setup

```shell
$ composer create-project sebacruz/baseapp app
$ npm install
```

Copy .env.dist file to .env and set your needed environment variables, like database credentials:

```shell
$ cp .env.dist .env
$ vi .env
```

If you don't set the `APP_ENV` variable it will be "production" by default.

## Local Development Server

If you have PHP installed locally and you would like to use PHP's built-in development server to serve your application you may use the composer `start` command. This command will start a development server at `http://0.0.0.0:8080`:

```shell
$ composer run-script start
```

## App routing

All routes are defined in `src/routes.php`.

## App structure

The app is divided in a few directories:

* `public`: public directory where you have to point your the domain. This is where you put public stuff, like the `robots.txt`, google verification files, etc.
* `src`: php stuff goes here. The PHP autoloader will look here for the `App` namespace, for example: if you call the `\App\Example\Class` the autoloader will try to load the file `src/Example/Class.php`.
* `resources`: contains assets sources and views. **DO NOT PUT DEPENDENCIES (LIKE `jQuery` OR `bootstrap`) HERE, USE NPM FOR THAT.**
* `vendor`: php dependencies managed by `composer`.
* `node_modules`: node dependencies managed by `npm`.

## RTFM

This app depends on various projects, if you are having some troubles read the project's docs and if you can't solve it [leave an issue](https://github.com/sebacruz/baseapp/issues).

* [Composer](https://getcomposer.org/): used to handle the php dependencies.
* [webpack](https://webpack.js.org/): used to compile frontend assets.
* [Babel](https://babeljs.io/): ECMAScript 6 to ECMAScript 5 compiler.
* [Slim Framework](http://www.slimframework.com/): the core of this app.
* [Monolog](https://github.com/Seldaek/monolog): used for log stuff.
* [Symfony's VarDumper](http://symfony.com/doc/current/components/var_dumper/introduction.html): provides a better dump() function that you can use instead of var_dump.
