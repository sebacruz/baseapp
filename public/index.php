<?php

// App paths definitions
define('ROOTPATH', realpath(__DIR__ . '/..'));
define('APPPATH',  ROOTPATH . '/app');
define('PUBLICPATH',  __DIR__);

require ROOTPATH . '/vendor/autoload.php';

// Init sessions
session_cache_limiter(FALSE);
session_start();

// Error reporting
error_reporting(E_ALL);

// Loding the app core
$app = require_once APPPATH . '/bootstrap/app.php';

$app->run();
