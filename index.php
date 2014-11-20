<?php

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

$app = new \Slim\Slim([
    'mode'           => getenv('ENVIRONMENT'),
    'debug'          => TRUE,
    'templates.path' => __DIR__ . '/views'
]);

/**
 * App routes definition
 */

// dump $_SERVER
$app->get('/', function() use ($app) {
    $app->render('index.html', [
        'app'     => $app,
        'info'    => $_SERVER,
        'section' => 'home'
    ]);
})
->name('home');

// dump $_GET or $_POST, $_GET by default
$app->get('/request/:type', function($type) use ($app) {
    $info    = $_GET;
    $section = 'get';

    if ($type === 'post') {
        $info    = $_POST;
        $section = 'post';
    }

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