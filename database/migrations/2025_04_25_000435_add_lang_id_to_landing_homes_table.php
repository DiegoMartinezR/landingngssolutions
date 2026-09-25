<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('landing_homes', function (Blueprint $table) {
            $table->uuid('lang_id')->nullable();
            $table->foreign('lang_id')->references('id')->on('langs')->onDelete('cascade');
            $table->string('original_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('landing_homes', function (Blueprint $table) {
            //
            $table->dropColumn('lang_id');
            $table->dropColumn('original_id');
        });
    }
};
