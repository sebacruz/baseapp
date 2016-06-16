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
