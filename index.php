<?php

require 'vendor/autoload.php';

use Slim\Slim;

/**
 * This app is PSR-4 compatible.
 * Store all your classes in the "app/src" folder and use the App namespace.
 */
use App\Utils;
use App\Model\Info;

/**
 * Init sessions
 */

session_cache_limiter(FALSE);
session_start();

/**
 * Load environment config file
 *
 * @link https://github.com/vlucas/phpdotenv/blob/master/README.md
 */

Dotenv::load(__DIR__);

/**
 * Database configuration
 *
 * We are using Idiorm as a default ORM, RTFM!!!
 *
 * @link http://idiorm.readthedocs.org/en/latest/configuration.html
 */

if (getenv('DB_DSN')) :
     ORM::configure([
         'connection_string' => getenv('DB_DSN'),
         'username'          => getenv('DB_USER'),
         'password'          => getenv('DB_PASS')
     ]);
endif;

/**
 * App core configuration
 *
 * See the "Configure for a Specific Mode" in the Slim's documentation
 * for environment-specific configs
 *
 * @link http://docs.slimframework.com/#Configuration-Overview
 */

$env = getenv('ENVIRONMENT') ? getenv('ENVIRONMENT') : 'production';

$app = new Slim([
    'mode'           => $env,
    'debug'          => TRUE,
    'templates.path' => __DIR__ . '/app/views',
    'log.enabled'    => true,
    'log.level'      => \Slim\Log::DEBUG
]);

error_reporting(E_ALL);

$app->configureMode('production', function () use ($app) {
    ini_set('display_errors', FALSE);
    ini_set('error_log',      __DIR__ . '/app/logs/production.log');

    $app->config([
        'debug' => FALSE
    ]);
});

$app->configureMode('development', function () use ($app) {
    ini_set('display_errors', TRUE);
    ini_set('error_log',      __DIR__ . '/app/logs/development.log');

    $app->config([
        'debug' => TRUE
    ]);
});

/**
 * App routes definition
 *
 * @todo Delete this routes and set the real ones
 * @link http://docs.slimframework.com/#Routing-Overview
 */

// dump $_SERVER
$app->get('/', function() use ($app) {
    Utils::returnTrue();
foo();
    $info = new Info();

    $app->render('index.html', [
        'app'     => $app,
        'info'    => $info,
        'section' => 'home'
    ]);
})
->name('home');

// dump $_GET or $_POST, $_GET by default
$app->get('/request/:type', function($type) use ($app) {
    $section = 'get';

    if ($type === 'post') {
        $section = 'post';
    }

    $info = new Info($section);

    $app->render('index.html', [
        'app'     => $app,
        'info'    => $info,
        'section' => $section
    ]);
})
->name('request');

/**
 * RAN!
 */

$app->run();
