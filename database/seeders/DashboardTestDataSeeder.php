<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Visit;
use App\Models\Message;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardTestDataSeeder extends Seeder
{
    public function run()
    {
        // Optional: Clear existing data
        // DB::table('visits')->truncate();
        // DB::table('messages')->truncate();

        $sources = ['google', 'facebook', 'instagram', 'directo', 'newsletter'];
        $mediums = ['cpc', 'social', 'organic', 'email', 'referral'];
        $campaigns = ['verano_2024', 'promo_quiro', 'leads_mayo', 'branding', null];

        $now = Carbon::now();

        // Generate Visits for the last 30 days
        for ($i = 0; $i < 30; $i++) {
            $date = $now->copy()->subDays($i);
            $visitsCount = rand(50, 150); // Random visits per day

            for ($j = 0; $j < $visitsCount; $j++) {
                $source = $sources[array_rand($sources)];
                Visit::create([
                    'ip' => '192.168.1.' . rand(1, 255),
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'url' => 'http://quiroinnova.test/',
                    'utm_source' => $source,
                    'utm_medium' => $mediums[array_rand($mediums)],
                    'utm_campaign' => $campaigns[array_rand($campaigns)],
                    'device' => rand(0, 10) > 3 ? 'desktop' : 'mobile',
                    'created_at' => $date->copy()->subHours(rand(0, 23))->subMinutes(rand(0, 59)),
                ]);
            }

            // Generate Leads (Messages) for that day
            $leadsCount = rand(2, 10); // Random leads per day
            for ($k = 0; $k < $leadsCount; $k++) {
                $source = $sources[array_rand($sources)];
                Message::create([
                    'name' => 'Cliente de Prueba ' . rand(100, 999),
                    'email' => 'cliente' . rand(1, 1000) . '@example.com',
                    'phone' => '9' . rand(10000000, 99999999),
                    'subject' => 'Consulta de Prueba - ' . $date->toDateString(),
                    'description' => 'Este es un mensaje de prueba generado para el dashboard.',
                    'utm_source' => $source,
                    'utm_medium' => $mediums[array_rand($mediums)],
                    'utm_campaign' => $campaigns[array_rand($campaigns)],
                    'status' => rand(0, 1),
                    'created_at' => $date->copy()->subHours(rand(0, 23))->subMinutes(rand(0, 59)),
                ]);
            }
        }

        $this->command->info('Test data generated successfully for the last 30 days.');
    }
}
