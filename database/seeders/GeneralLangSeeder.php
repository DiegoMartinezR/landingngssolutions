<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GeneralLangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultLang = DB::table('langs')->where('is_default', true)->first();
        DB::table('generals')->whereNull('lang_id')->update(['lang_id' => $defaultLang->id]);
    }
}
