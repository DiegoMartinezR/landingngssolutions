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
        Schema::create('zones', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->uuid('lang_id')->nullable();
            $table->foreign('lang_id')->references('id')->on('langs')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->text('description')->nullable();
            $table->json('gallery')->nullable();
            $table->text('map')->nullable();
            $table->boolean('status')->default(true);
            $table->boolean('visible')->default(true);
            $table->text('slug')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('zones');
    }
};
