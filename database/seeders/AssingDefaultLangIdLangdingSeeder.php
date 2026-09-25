<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AssingDefaultLangIdLangdingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultLang = DB::table('langs')->where('is_default', true)->first();
        DB::table('landing_homes')->whereNull('lang_id')->update(['lang_id' => $defaultLang->id]);
        DB::table('landing_homes')->whereNull('lang_id')->update(['lang_id' => $defaultLang->id]);
    }
}
