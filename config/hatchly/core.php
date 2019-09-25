<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Site Configuration
    |--------------------------------------------------------------------------
    |
    | The name key is used to reference the "site" as an entity, you would
    | usually set this to the company's name. The namespace is the javascript
    | namespace (same as JavaScriptServiceProvider's config).
    |
    */
    'site' => [
        'name' => 'Hatchly',
        'namespace' => 'Hatchly',
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Language
    |--------------------------------------------------------------------------
    |
    | Set this if you wish to change the default language.
    | Warning: setting this after content has been added will likely cause
    | many issues, make sure you set it before!
    |
    */
    'default-language' => 'en',

    /*
    |--------------------------------------------------------------------------
    | Admin Route Prefix
    |--------------------------------------------------------------------------
    |
    | This will determine how you access the admin area, you should change
    | this if you want to add a bit more security through obscurity.
    |
    */
    'admin-url' => 'admin',

    /*
    |--------------------------------------------------------------------------
    | Admin Logo
    |--------------------------------------------------------------------------
    |
    | This will determine where the admin logo is loaded from
    | by default, we look for the shipped logo (make sure you publish assets!)
    |
    */
    'admin-logo' => '/hatchly-core/images/admin-logo.png',

    /*
    |--------------------------------------------------------------------------
    | Auth Controller
    |--------------------------------------------------------------------------
    |
    | In most cases you will subclass Hatchly's AuthenticationController
    | so that you can add custom functionality or change the auth views,
    | you can specify your class here.
    |
    */
    'auth-controller' => Hatchly\Core\Authentication\AuthenticationController::class,

    /*
    |--------------------------------------------------------------------------
    | Auth Routes
    |--------------------------------------------------------------------------
    |
    | If you want a complete bespoke authentication routine, you can disable
    | Hatchly's default auth routes all together. This includes:
    | login, logout and forgotten-password
    |
    */
    'auth-routes' => true,

    /*
    |--------------------------------------------------------------------------
    | Auth Guest Redirect
    |--------------------------------------------------------------------------
    |
    | To avoid subclassing the AuthenticationController if you simply want
    | to change where the user ends up when they are not logged in,
    | you can set this here (used when a "intended" destination can't be found).
    |
    */
    'auth-redirect-dest' => '/',

    /*
    |--------------------------------------------------------------------------
    | Email templates
    |--------------------------------------------------------------------------
    |
    | This value overrides the auth.php config provided by laravel.
    |
    */
    'auth' => [
        'password-reset' => [
            'notification' => \Hatchly\Core\Notifications\ResetPassword::class,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Base Models
    |--------------------------------------------------------------------------
    |
    | If you subclass the Hatchly models, make sure you set your class here.
    | This will make sure Hatchly uses the correct models when logging people
    | in and returning from the relevant repository.
    |
    */
    'models' => [
        'user' => Hatchly\Core\User::class,
        'group' => Hatchly\Core\Group::class,
        'language' => Hatchly\Core\Language::class,
        'domain' => Hatchly\Core\Domain::class,
        'domain-alias' => Hatchly\Core\DomainAlias::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Modules
    |--------------------------------------------------------------------------
    |
    | The core of Hatchly. Place any modules in here to have them loaded
    | during the boot process.
    |
    */
    'modules' => [
         Hatchly\Users\UserModule::class,
         Hatchly\Pages\PageModule::class,
         Hatchly\Files\FileModule::class,
         Hatchly\Meta\MetaModule::class,
         Hatchly\Redirects\RedirectModule::class,
         Hatchly\Settings\SettingModule::class,
         Hatchly\Developer\DeveloperModule::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Dashboard Widgets
    |--------------------------------------------------------------------------
    |
    | Similar to modules, place any classes that extend the Widget class to
    | render them on the dashboard.
    |
    */
    'dashboard-widgets' => [
        Hatchly\Core\Dashboard\Widgets\Welcome::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Loading Hatchly Migrations
    |--------------------------------------------------------------------------
    |
    | By default, migrations will be loaded from all modules, you may disable this
    | behaviour if you need to customise or rebuild these tables
    */
    'migrations' => [
        'core' => true,
        'files' => true,
        'meta' => true,
        'navigation' => true,
        'pages' => true,
        'redirects' => true,
        'settings' => true,
        'snippets' => true,
    ]

];
