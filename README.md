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

## Local Development Server

If you have PHP installed locally and you would like to use PHP's built-in development server to serve your application you may use the npm `serve` command. This command will start a development server at `http://0.0.0.0:8080`:

```shell
$ npm run serve
```

## Environment configuration

Copy .env.dist file to .env and set your needed environment variables, like database
credentials:

```shell
$ cp .env.dist .env
$ vi .env
```

If you don't set the `APP_ENV` variable it will be "production" by default.

## App routing

All routes are defined in `src/routes.php`.

## RTFM

This app depends on various projects, if you are having some troubles read the project's docs and if you can't solve it [leave an issue](https://github.com/sebacruz/baseapp/issues).

* [Composer](https://getcomposer.org/): used to handle the php dependencies.
* [webpack](https://webpack.js.org/): used to compile frontend assets.
* [Babel](https://babeljs.io/): ECMAScript 6 to ECMAScript 5 compiler.
* [Slim Framework](http://www.slimframework.com/): the core of this app.
* [Monolog](https://github.com/Seldaek/monolog): used for log stuff.
* [Symfony's VarDumper](http://symfony.com/doc/current/components/var_dumper/introduction.html): provides a better dump() function that you can use instead of var_dump.
