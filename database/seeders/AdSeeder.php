<?php

namespace Database\Seeders;

use App\Models\Ad;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Ad::updateOrCreate([
            'id' => '9be7db9b-0945-4977-95d8-a0bc7be723fc'
        ], [
            'image' => '10p-off.png',
            'link' => '/test?coupon=1ER_VUA',
            'seconds' => 5
        ]);
    }
}
