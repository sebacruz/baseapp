<?php

// App paths definitions
define('ROOTPATH', realpath(__DIR__ . '/..'));
define('APPPATH',  ROOTPATH . '/app');
define('PUBLICPATH',  __DIR__);

require ROOTPATH . '/vendor/autoload.php';

// Init sessions
session_start();

// Error reporting
error_reporting(E_ALL);

/**
 * Load environment config file
 *
 * @link https://github.com/vlucas/phpdotenv/blob/master/README.md
 */
Dotenv::load(ROOTPATH);

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
        'username' => getenv('DB_USER'),
        'password' => getenv('DB_PASS')
    ]);
endif;

// Instantiate the app
$settings = require ROOTPATH . '/src/settings.php';
$app = new \Slim\App($settings);

// Set up dependencies
require ROOTPATH . '/src/dependencies.php';

// Register middleware
require ROOTPATH . '/src/middleware.php';

// Register routes
require ROOTPATH . '/src/routes.php';

$app->run();
