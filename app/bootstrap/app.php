<?php

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

$app = new \Slim\Slim([
    'mode'           => $env,
    'debug'          => TRUE,
    'templates.path' => ROOTPATH . '/resources/views',
    'log.enabled'    => true,
    'log.level'      => \Slim\Log::DEBUG
]);

/**
 * Environment configurations
 *
 * @link http://docs.slimframework.com/configuration/modes/
 */

$app->configureMode('production', function () use ($app) {
    ini_set('display_errors', FALSE);
    ini_set('error_log', ROOTPATH . '/logs/production.log');

    $app->config('debug', FALSE);
});

$app->configureMode('development', function () use ($app) {
    ini_set('display_errors', TRUE);
    ini_set('error_log', ROOTPATH . '/logs/development.log');

    $app->config('debug', TRUE);
});

/**
 * Loading hook, filter and stuff
 */
require_once __DIR__ . '/hooks.php';

/**
 * Loading app routes
 */
require_once APPPATH . '/routes.php';

return $app;
