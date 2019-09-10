<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $dates = [
        'published_on',
    ];

    public function postAuthor()
    {
        return $this->belongsTo('App\User');
    }
    public function tags()
    {
        return $this->morphToMany('App\Tag', 'taggable');
    }
}
