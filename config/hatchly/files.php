<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Reduce large images on upload
    |--------------------------------------------------------------------------
    |
    | By default, we will reduce all images to a max of 1920 on upload
    | to preserve disk space
    |
    */
    'reduce-to-hd-on-upload' => true,

    /*
    |--------------------------------------------------------------------------
    | Optimiser Paths
    |--------------------------------------------------------------------------
    |
    | If for some reason Hatchly is unable to automatically find the
    | required optimisers, it will look in the below locations
    |
    */
    'optimiser_paths' => [
        'optipng' => env('OPTIMISER_PATH_OPTIPNG', '/usr/local/bin/optipng'),
        'jpegoptim' => env('OPTIMISER_PATH_JPEGOPTIM', '/usr/local/bin/jpegoptim'),
    ],
];
