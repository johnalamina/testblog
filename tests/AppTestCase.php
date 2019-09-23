<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase, CreatesApplication;

    protected users;

    public function setUp()
    {
        this->super();
        $this->users = factory(App\User::class, 3)->create();
        $this->assertTrue(App\User::all()->count()>0);
    }
    public function tearDown() {
        //$this->http = null;
    }
}
