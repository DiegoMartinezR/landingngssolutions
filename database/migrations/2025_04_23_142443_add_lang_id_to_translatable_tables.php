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
        /*Schema::table('services', function (Blueprint $table) {
            $table->dropForeign('services_lang_id_foreign'); // elimina la foreign key
            $table->dropColumn('lang_id'); // ahora sí puedes borrar la columna
        });*/

        Schema::table('services', function (Blueprint $table) {
            $table->uuid('lang_id')->nullable()->after('id');
            $table->foreign('lang_id')->references('id')->on('langs')->onDelete('cascade');
        });
        //specialities, facilities, staff,indicators,strengths,testimonies,categories,posts
        Schema::table('specialties', function (Blueprint $table) {
            $table->uuid('lang_id')->nullable()->after('id');
            $table->foreign('lang_id')->references('id')->on('langs')->onDelete('cascade');
        });
        Schema::table('facilities', function (Blueprint $table) {
            $table->uuid('lang_id')->nullable()->after('id');
            $table->foreign('lang_id')->references('id')->on('langs')->onDelete('cascade');
        });
        Schema::table('staff', function (Blueprint $table) {
            $table->uuid('lang_id')->nullable()->after('id');
            $table->foreign('lang_id')->references('id')->on('langs')->onDelete('cascade');
        });
        Schema::table('indicators', function (Blueprint $table) {
            $table->uuid('lang_id')->nullable()->after('id');
            $table->foreign('lang_id')->references('id')->on('langs')->onDelete('cascade');
        });
        Schema::table('strengths', function (Blueprint $table) {
            $table->uuid('lang_id')->nullable()->after('id');
            $table->foreign('lang_id')->references('id')->on('langs')->onDelete('cascade');
        });
        Schema::table('testimonies', function (Blueprint $table) {
            $table->uuid('lang_id')->nullable()->after('id');
            $table->foreign('lang_id')->references('id')->on('langs')->onDelete('cascade');
        });
        Schema::table('categories', function (Blueprint $table) {
            $table->uuid('lang_id')->nullable()->after('id');
            $table->foreign('lang_id')->references('id')->on('langs')->onDelete('cascade');
        });
        Schema::table('posts', function (Blueprint $table) {
            $table->uuid('lang_id')->nullable()->after('id');
            $table->foreign('lang_id')->references('id')->on('langs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
