<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       
        User::updateOrCreate([
            'email' => 'admin@wefem.pe'
        ], [
            'name' => 'Admin',
            'lastname' => 'WeFem',
            'password' => 'wefem0001'
        ])->assignRole('Admin');

        User::updateOrCreate([
            'email' => 'customer@mundoweb.pe'
        ], [
            'name' => 'Usuario',
            'lastname' => 'Customer',
            'password' => 'abcd1234'
        ])->assignRole('Customer');


             User::updateOrCreate([
            'email' => 'admin@quiroinnova.com'
        ], [
            'name' => 'Admin',
            'lastname' => 'Admin',
            'password' => 'Qu1r01nn0va#2026'
        ])->assignRole('Admin');
    }
}
