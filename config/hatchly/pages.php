<?php

return [

    'page-model' => Hatchly\Pages\Page::class,

    'templates' => [
        Hatchly\Pages\Templates\GenericContentPage::class,
        Hatchly\Pages\Templates\HatchlyFolder::class,
    ],
    'attributes' => [
        'attributes' => [
            Hatchly\Pages\Attributes\Types\FloatValue::class,
            Hatchly\Pages\Attributes\Types\IntegerValue::class,
            Hatchly\Pages\Attributes\Types\PageLink::class,
            Hatchly\Pages\Attributes\Types\Url::class,
            Hatchly\Pages\Attributes\Types\StringValue::class,
            Hatchly\Pages\Attributes\Types\Wysiwyg::class,
            Hatchly\Pages\Attributes\Types\Checkbox::class,
            Hatchly\Pages\Attributes\Types\Dropdown::class,
            Hatchly\Pages\Attributes\Types\Radio::class,
            Hatchly\Pages\Attributes\Types\Text::class,
            Hatchly\Pages\Attributes\Types\Date::class,
            Hatchly\Pages\Attributes\Types\LatLngValue::class,
        ],
        'formatters' => [
            Hatchly\Pages\Attributes\Formatters\Fallback::class,
            Hatchly\Pages\Attributes\Formatters\StripHtml::class,
            Hatchly\Pages\Attributes\Formatters\StringLimit::class,
        ],
    ],

    /**
     * Load the public routes. You will probably never touch this.
     */
    'load-public-routes' => true,

    /**
     * Controls whether new child pages are placed at the top or bottom of the list.
     * When set to false, any new pages will be added in the normal place at the bottom of the list of children.
     * When set to true, any new pages will be added as the first child of a page.
     */
    'add-children-to-top' => false,
];
