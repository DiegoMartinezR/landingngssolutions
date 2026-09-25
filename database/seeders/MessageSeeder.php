<?php
  
namespace Database\Seeders;

use App\Models\Message;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Message::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '123456789',
            'address' => '123 Main St',
            'city' => 'Los Angeles',
            'zip' => '90001',
            'property_type' => 'Residential',
            'sqft' => '1500',
            'floors' => '2',
            'frequency' => 'One time',
            'pets' => 'No',
            'work_type' => 'Post-Construction',
            'residue_level' => 'High',
            'date' => '2026-04-15',
            'subject' => 'Quote Request',
            'description' => 'I need a deep cleaning for my new house.',
            'seen' => false,
            'status' => true
        ]);
    }
}
