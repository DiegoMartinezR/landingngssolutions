<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();

            // Datos del consumidor
            $table->string('nombre');
            $table->string('apellido')->nullable();
            $table->enum('tipo_documento', ['dni', 'ce', 'pasaporte', 'ruc']);
            $table->string('numero_documento')->nullable();
            $table->string('telefono')->nullable();
            $table->string('email')->nullable();
            $table->string('direccion')->nullable();
            $table->string('departamento')->nullable();
            $table->string('provincia')->nullable();
            $table->string('distrito')->nullable();

            // Datos del reclamo
            $table->string('sede')->nullable();
            $table->string('servicio')->nullable();
            $table->enum('tipo_reclamo', ['queja', 'reclamo']);
            $table->date('fecha_incidente')->nullable();
            $table->time('hora_incidente')->nullable();
            $table->text('detalle_reclamo')->nullable();
            $table->text('pedido')->nullable();

            // Datos adicionales
            $table->boolean('autoriza_notificacion')->default(true);
            $table->boolean('acepta_terminos')->default(false);

            // Estado y seguimiento
            $table->string('numero_reclamo')->unique();
            $table->enum('estado', ['pendiente', 'en_proceso', 'resuelto', 'rechazado'])->default('pendiente');
            $table->text('respuesta')->nullable();
            $table->dateTime('fecha_respuesta')->nullable();

            // Auditoría
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();

            $table->timestamps();
        });

        Schema::create('complaint_attachments', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->foreignUuid('complaint_id')->constrained()->onDelete('cascade');
            $table->string('nombre_archivo')->nullable();
            $table->string('ruta_archivo')->nullable();
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('tamanio')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('complaint_attachments');
        Schema::dropIfExists('complaints');
    }
};
