<?php

namespace Tests;
use App\User;


 class AppTestCase extends TestCase
{

    protected $users;

    function __construct()
    {
        parent::__construct();
        $this->users = factory(User::class, 3)->create();
        $this->assertTrue(User::all()->count()>0);
    }
//    public function tearDown() {
//        //$this->http = null;
//    }
}
