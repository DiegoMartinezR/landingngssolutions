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
        Schema::table('appointments', function (Blueprint $table) {
            $table->string('address')->nullable()->after('number');
            $table->string('city')->nullable()->after('address');
            $table->string('zip')->nullable()->after('city');
            $table->string('property_type')->nullable()->after('zip');
            $table->string('sqft')->nullable()->after('property_type');
            $table->string('floors')->nullable()->after('sqft');
            $table->string('frequency')->nullable()->after('floors');
            $table->string('pets')->nullable()->after('frequency');
            $table->string('date')->nullable()->after('pets');
            $table->string('time')->nullable()->after('date');
            $table->string('service_id')->nullable()->after('time');
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->string('address')->nullable()->after('email');
            $table->string('city')->nullable()->after('address');
            $table->string('zip')->nullable()->after('city');
            $table->string('property_type')->nullable()->after('zip');
            $table->string('sqft')->nullable()->after('property_type');
            $table->string('floors')->nullable()->after('sqft');
            $table->string('frequency')->nullable()->after('floors');
            $table->string('pets')->nullable()->after('frequency');
            $table->string('work_type')->nullable()->after('pets');
            $table->string('residue_level')->nullable()->after('work_type');
            $table->string('date')->nullable()->after('residue_level');
            $table->string('service_id')->nullable()->after('date');
            $table->string('phone')->nullable()->after('service_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn(['address', 'city', 'zip', 'property_type', 'sqft', 'floors', 'frequency', 'pets', 'date', 'time', 'service_id']);
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn(['address', 'city', 'zip', 'property_type', 'sqft', 'floors', 'frequency', 'pets', 'work_type', 'residue_level', 'date', 'service_id', 'phone']);
        });
    }
};
