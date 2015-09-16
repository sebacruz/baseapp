<?php
/**
 * Hook, filter, etc should goes here
 *
 * @link http://docs.slimframework.com/hooks/overview/
 * @link http://docs.slimframework.com/errors/overview/
 */

/**
 * error handling sample
 *
 * $app->error(function() use ($app){
 *     $app->render('error.html');
 * });
 */

$app->hook('slim.before', function() use ($app) {
    $app->view()->appendData([
        'app'     => $app,
        'baseUrl' => rtrim($app->request->getRootUri(), '/')
    ]);
});
