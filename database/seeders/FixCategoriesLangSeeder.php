<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Lang;
use Illuminate\Database\Seeder;

class FixCategoriesLangSeeder extends Seeder
{
    /**
     * Run the database seeds to fix category language associations
     * without deleting or modifying any existing user entries.
     */
    public function run(): void
    {
        // 1. Get default language
        $lang = Lang::where('is_default', true)->first() ?? Lang::first();

        if (!$lang) {
            $this->command->error('No default language found in the database.');
            return;
        }

        // 2. Fix existing categories that have lang_id as null
        $updated = Category::whereNull('lang_id')->update([
            'lang_id' => $lang->id
        ]);

        $this->command->info("Successfully linked {$updated} categories to language: {$lang->name} ({$lang->id}).");

        // 3. Ensure the core B2B EAS categories exist for this language
        $easCategories = [
            [
                'name' => 'Antenas AM',
                'slug' => 'antenas-am',
                'description' => 'Sistemas antihurto acustomagnéticos de alta sensibilidad',
            ],
            [
                'name' => 'Antenas RF',
                'slug' => 'antenas-rf',
                'description' => 'Sistemas antihurto por radiofrecuencia tradicionales',
            ],
            [
                'name' => 'Tags Rígidos',
                'slug' => 'tags-rigidos',
                'description' => 'Sensores plásticos reutilizables de alta resistencia',
            ],
            [
                'name' => 'Desactivadores',
                'slug' => 'desactivadores',
                'description' => 'Equipos para neutralizar o retirar sensores en caja',
            ],
            [
                'name' => 'Desacopladores',
                'slug' => 'desacopladores',
                'description' => 'Equipos para neutralizar o retirar sensores en caja',
            ]
        ];

        $createdCount = 0;
        foreach ($easCategories as $catData) {
            $exists = Category::where('slug', $catData['slug'])
                ->where('lang_id', $lang->id)
                ->exists();

            if (!$exists) {
                Category::create([
                    'name' => $catData['name'],
                    'slug' => $catData['slug'],
                    'description' => $catData['description'],
                    'lang_id' => $lang->id,
                    'status' => true,
                    'visible' => true,
                ]);
                $createdCount++;
            }
        }

        if ($createdCount > 0) {
            $this->command->info("Created {$createdCount} missing EAS categories.");
        } else {
            $this->command->info("All core EAS categories are already present.");
        }
    }
}
