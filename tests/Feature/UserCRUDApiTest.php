<?php

namespace Tests\Feature;

use Tests\AppTestCase;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserCRUDApiTest extends AppTestCase
{
    /**
     * List users test.
     *
     * @return void
     */
    public function testGetUsers()
    {
        $response = $this->json('GET','http://testblog.localhost/api/users');

        $response->assertStatus(200);
    }
    /**
     * Create User Test.
     *
     * @return void
     */
    public function createUserTest()
    {
        $response = $this->json('POST', 'http://testblog.localhost/users', ['name' => 'Sally']);

        $response
            ->assertStatus(201)
            ->assertJson([
                'created' => true,
            ]);
    }
    /**
     * Show User Test.
     *
     * @return void
     */
    public function showUserTest()
    {
        $resonse = $this->json('GET', '/user/{userId}', ['name' => 'Sally']);

        $response
            ->assertStatus(201)
            ->assertJson([
                'created' => true,
            ]);
    }
    /**
     * Show User Test.
     *
     * @return void
     */
    public function updateUserTest()
    {
        $response = $this->json('POST', '/api/users', ['name' => 'Sally']);

        $response
            ->assertStatus(201)
            ->assertJson([
                'created' => true,
            ]);
    }
    /**
     * Show User Test.
     *
     * @return void
     */
    public function deleteUserTest()
    {
        $response = $this->json('POST', '/users', ['name' => 'Sally']);

        $response
            ->assertStatus(201)
            ->assertJson([
                'created' => true,
            ]);
    }

}
