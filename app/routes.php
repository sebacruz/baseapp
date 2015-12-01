<?php

/**
 * App routes
 *
 * @link http://docs.slimframework.com/routing/overview/
 */

// Sample routes
// @todo TODO: replace this dummy routes for the real ones

// Home
$app->get('/', function() use ($app) {
    \App\Utils::returnTrue();

    $info = new \App\Model\Info();

    $app->render('index.html', [
        'app'     => $app,
        'info'    => $info,
        'section' => 'home'
    ]);
})->name('home');

// dump $_GET or $_POST, $_GET by default
$app->get('/request/:type', function($type) use ($app) {
    $section = 'get';

    if ($type === 'post') {
        $section = 'post';
    }

    $info = new \App\Model\Info($section);

    $app->render('index.html', [
        'app'     => $app,
        'info'    => $info,
        'section' => $section
    ]);
})
->name('request');
