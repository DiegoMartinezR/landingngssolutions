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
        $newFields = function (Blueprint $table) {
            $table->string('cleaning_type')->nullable();
            $table->string('move_type')->nullable();
            $table->string('service_mode')->nullable();
            $table->string('rental_frequency')->nullable();
            $table->string('is_empty')->nullable();
            $table->string('rooms')->nullable();
            $table->string('bathrooms')->nullable();
            $table->string('has_pets')->nullable();
            $table->string('pet_type')->nullable();
            $table->string('pet_count')->nullable();
            $table->text('pet_details')->nullable();
            $table->text('extra_services')->nullable();
            $table->string('access_method')->nullable();
            $table->string('project_category')->nullable();
            $table->string('current_stage')->nullable();
            $table->string('operational_window')->nullable();
        };

        Schema::table('messages', function (Blueprint $table) use ($newFields) {
            $newFields($table);
        });

        Schema::table('appointments', function (Blueprint $table) use ($newFields) {
            $newFields($table);
            $table->string('residue_level')->nullable();
            $table->string('work_type')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $fieldsToRemove = [
            'cleaning_type',
            'move_type',
            'service_mode',
            'rental_frequency',
            'is_empty',
            'rooms',
            'bathrooms',
            'has_pets',
            'pet_type',
            'pet_count',
            'pet_details',
            'extra_services',
            'access_method',
            'project_category',
            'current_stage',
            'operational_window',
            'residue_level',
            'work_type'
        ];

        Schema::table('messages', function (Blueprint $table) use ($fieldsToRemove) {
            $table->dropColumn(array_filter($fieldsToRemove, fn($f) => Schema::hasColumn('messages', $f)));
        });

        Schema::table('appointments', function (Blueprint $table) use ($fieldsToRemove) {
            $table->dropColumn(array_filter($fieldsToRemove, fn($f) => Schema::hasColumn('appointments', $f)));
        });
    }
};
