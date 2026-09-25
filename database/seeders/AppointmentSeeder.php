<?php

namespace Database\Seeders;

use App\Models\Appointment;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Appointment::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'number' => '987654321',
            'address' => '456 Oak Ave',
            'city' => 'Santa Monica',
            'zip' => '90401',
            'property_type' => 'Commercial',
            'sqft' => '5000',
            'floors' => '3',
            'frequency' => 'Monthly',
            'pets' => 'No',
            'date' => '2026-05-10',
            'time' => '10:00 AM',
            'description' => 'Recurring commercial cleaning for our main office.',
            'seen' => false,
            'status' => true
        ]);
    }
}
