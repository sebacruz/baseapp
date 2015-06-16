<?php

require 'vendor/autoload.php';

// App paths definitions
define('ROOTPATH', __DIR__);
define('APPPATH',  __DIR__ . '/app');

// Init sessions
session_cache_limiter(FALSE);
session_start();

// Error reporting
error_reporting(E_ALL);

// Loding the app core
$app = require_once __DIR__ . '/app/bootstrap/start.php';

$app->run();
