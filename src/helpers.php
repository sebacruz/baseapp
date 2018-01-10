<?php

if (!function_exists('starts_with')) {
    /**
     * Determine if a given string starts with a given substring.
     *
     * @param  string  $haystack
     * @param  string|array  $needles
     * @return bool
     */
    function starts_with($haystack, $needles)
    {
        foreach ((array) $needles as $needle) {
            if ($needle != '' && substr($haystack, 0, strlen($needle)) === (string) $needle) {
                return true;
            }
        }

        return false;
    }
}

if (!file_exists('asset')) {
    /**
     * Get the path to a versioned asset file.
     *
     * @param  string  $path
     * @param  string  $manifestDirectory
     * @return string
     *
     * @throws \Exception
     */
    function asset($path, $manifestDirectory = '/assets/')
    {
        static $manifest;

        $assetPath = $path;
        $manifestPath = realpath(PUBLICPATH . $manifestDirectory) . '/manifest.json';

        if (!$manifest && file_exists($manifestPath)) {
            $manifest = json_decode(file_get_contents($manifestPath), true);
        }

        if ($manifest && array_key_exists($path, $manifest)) {
            $assetPath = $manifest[$path];
        }

        return $manifestDirectory . $assetPath;
    }
}
