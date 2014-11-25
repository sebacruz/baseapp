<?php

use Slim\Slim;

/**
 * This app is PSR-4 compatible.
 * Store all your classes in the "app/src" folder and use the App namespace.
 */
use App\Utils;
use App\Model\Info;

require 'vendor/autoload.php';

/**
 * Init sessions
 */

session_cache_limiter(FALSE);
session_start();

/**
 * Load environment config
 */

Dotenv::load(__DIR__);

/**
 * Database configuration
 *
 * @todo Uncomment this if you will use a database or remove it and use the orm or class or whatever you want
 * @link http://idiorm.readthedocs.org/en/latest/configuration.html
 */

// ORM::configure([
//     'connection_string' => getenv('DB_DSN'),
//     'username'          => getenv('DB_USER'),
//     'password'          => getenv('DB_PASS')
// ]);

/**
 * App core configuration
 *
 * See the "Configure for a Specific Mode" in the Slim's documentation
 * for environment-specific configs
 *
 * @link http://docs.slimframework.com/#Configuration-Overview
 */

$app = new Slim([
    'mode'           => getenv('ENVIRONMENT'),
    'debug'          => TRUE,
    'templates.path' => __DIR__ . '/app/views'
]);

/**
 * App routes definition
 */

// dump $_SERVER
$app->get('/', function() use ($app) {
    Utils::returnTrue();

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
