<?php

/**
 * App Middleware
 *
 * @link http://www.slimframework.com/docs/concepts/middleware.html
 */

$app->add(function ($request, $response, $next) use ($app) {
    $this->renderer->setAttributes([
        'app' => $app,
        'basePath' => $request->getUri()->getBasePath()
    ]);

    $response = $next($request, $response);

    return $response;
});
