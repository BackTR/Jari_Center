<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],

    // Jangan pakai wildcard: API ini menyimpan data pasien dan memakai
    // Bearer token. Origin dialing dari env FRONTEND_URL (default dev Vite).
    'allowed_origins' => array_filter(explode(',', (string) env('FRONTEND_URL', 'http://localhost:5173'))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
