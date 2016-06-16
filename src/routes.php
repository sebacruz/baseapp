<?php

/**
 * App routes
 *
 * @link http://www.slimframework.com/docs/objects/router.html
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

// Sample routes
// @todo TODO: replace this dummy routes with the real ones

// Home
$app->get('/', function(Request $request, Response $response, $args) use ($app) {
    return $this->renderer->render($response, 'index.html', $args);
})->setName('home');

$app->get('/json', function(Request $request, Response $response) use ($app) {
    return $response->withJson([
        [
            'id' => '1',
            'title' => 'Hogfather',
            'yr' => '1998',
            'author_name' => 'Philip K Dick',
            'author_email' => 'philip@example.org',
        ],
        [
            'id' => '2',
            'title' => 'Game Of Kill Everyone',
            'yr' => '2014',
            'author_name' => 'George R. R. Satan',
            'author_email' => 'george@example.org',
        ]
    ]);
})->setName('json');
