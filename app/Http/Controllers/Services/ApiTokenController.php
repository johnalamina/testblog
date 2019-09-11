<?php

namespace App\Http\Controllers\Services;

use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\RegistersUsers;

class ApiTokenController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles Api Token Refresh action
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('guest');
    }

    /**
     * Update the authenticated user's API token.
     * used in 'hash'=>true  token authentication for sha-256 key encryption
     *
     * @param  \Illuminate\Http\Request $request
     * @return array
     */
    protected function update(Request $request)
    {
        $token = Str::random(60);
        $request->user()->forceFill([
            'api_token' => $token, //hash('sha256',$token),
        ])->save();
        return ['password' => $token];
    }
}
