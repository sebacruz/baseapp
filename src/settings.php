<?php

return [
    'settings' => [
        'displayErrorDetails' => getenv('APP_ENV') === 'development',

        // Renderer settings
        'renderer' => [
            'template_path' => __DIR__ . '/../resources/views/',
        ],

        // Monolog settings
        'logger' => [
            'name' => 'slim-app',
            'path' => __DIR__ . '/../logs/app.log',
        ],
    ]
];
