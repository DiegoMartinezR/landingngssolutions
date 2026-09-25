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
        Schema::create('translations', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->uuid('lang_id')->nullable();
            $table->string('group'); // Ej: sidebar, header, footer
            $table->string('key');   // Ej: home, logout, privacy
            $table->text('value');   // Ej: Inicio, Cerrar sesión, Política de privacidad
            $table->boolean('status')->default(true);
            $table->boolean('visible')->default(true);
            $table->timestamps();
            $table->foreign('lang_id')->references('id')->on('langs')->onDelete('cascade');
            $table->unique(['lang_id', 'group', 'key']); // Para evitar duplicados
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('translations');
    }
};
