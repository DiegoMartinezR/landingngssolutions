<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('langs', function (Blueprint $table) {
            $table->boolean('is_default')->default(false)->after('visible');
        });

        // Asegúrate de que solo un idioma sea el predeterminado
        DB::table('langs')->update(['is_default' => false]);

        $firstLangId = DB::table('langs')->value('id');
        if ($firstLangId) {
            DB::table('langs')->where('id', $firstLangId)->update(['is_default' => true]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('langs', function (Blueprint $table) {
            $table->dropColumn('is_default');
        });
    }
};
