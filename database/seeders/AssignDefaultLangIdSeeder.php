<?php

namespace Database\Seeders;

use App\Models\Lang;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AssignDefaultLangIdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //create a new lang default
        $lang = new Lang();
        $lang->name = 'Español';
        $lang->description = 'Idioma por defecto';
        $lang->image = "";
        $lang->is_default = true;
        $lang->status = true;
        $lang->visible = true;
        $lang->save();


        //services, specialties, facilities, staff,indicators,strengths,testimonies,categories,posts
        $defaultLang = DB::table('langs')->where('is_default', true)->first();

        // Si no hay idioma por defecto, detenerse
        if (!$defaultLang) {
            $this->command->info("No se ha encontrado un idioma por defecto.");
            return;
        }
        DB::table('services')->whereNull('lang_id')->update(['lang_id' => $defaultLang->id]);
        DB::table('specialties')->whereNull('lang_id')->update(['lang_id' => $defaultLang->id]);
        DB::table('facilities')->whereNull('lang_id')->update(['lang_id' => $defaultLang->id]);
        DB::table('staff')->whereNull('lang_id')->update(['lang_id' => $defaultLang->id]);
        DB::table('indicators')->whereNull('lang_id')->update(['lang_id' => $defaultLang->id]);
        DB::table('strengths')->whereNull('lang_id')->update(['lang_id' => $defaultLang->id]);
        DB::table('testimonies')->whereNull('lang_id')->update(['lang_id' => $defaultLang->id]);
        DB::table('categories')->whereNull('lang_id')->update(['lang_id' => $defaultLang->id]);
        DB::table('posts')->whereNull('lang_id')->update(['lang_id' => $defaultLang->id]);
        DB::table('landing_homes')->whereNull('lang_id')->update(['lang_id' => $defaultLang->id]);
        DB::table('generals')->whereNull('lang_id')->update(['lang_id' => $defaultLang->id]);
    }
}
