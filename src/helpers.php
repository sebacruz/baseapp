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

        if (starts_with($path, '/')) {
            $path = ltrim($path, '');
        }

        if ($manifestDirectory && !starts_with($manifestDirectory, '/')) {
            $manifestDirectory = "/{$manifestDirectory}";
        }

        if (!$manifest) {
            if (!file_exists($manifestPath = PUBLICPATH . '/assets/manifest.json')) {
                throw new Exception('The assets manifest does not exist.');
            }

            $manifest = json_decode(file_get_contents($manifestPath), true);
        }

        if (!array_key_exists($path, $manifest)) {
            throw new Exception(
                "Unable to locate asset file: {$path}. Please check your ".
                'webpack output paths and try again.'
            );
        }

        return $manifestDirectory . $manifest[$path];
    }
}
