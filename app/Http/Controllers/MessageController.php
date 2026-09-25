<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Requests\UpdateMessageRequest;
use Illuminate\Http\Request;

class MessageController extends BasicController
{
    public $model = Message::class;

    public function beforeSave(Request $request): array
    {
        if ($request->has('city_zip') && !$request->has('zip')) {
            $request->merge(['zip' => $request->city_zip]);
        }
        if ($request->has('extra_services') && is_array($request->extra_services)) {
            $request->merge(['extra_services' => implode(', ', $request->extra_services)]);
        }
        if (!$request->has('description') || empty($request->description)) {
            $request->merge(['description' => 'Contacto iniciado desde botón flotante de WhatsApp']);
        }
        if (!$request->has('subject') || empty($request->subject)) {
            $request->merge(['subject' => 'Contacto WhatsApp']);
        }

        $messages = [
            'name.required' => 'The name is required.',
            'email.required' => 'The email is required.',
            'email.email' => 'The email must be a valid email address.',
            'phone.required' => 'The phone number is required.',
            'description.required' => 'The message is required.'
        ];

        // Validación de los datos
        $validatedData = $request->validate([
            'company' => 'nullable|string',
            'name' => 'required|string',
            'email' => 'required|email|max:320',
            'phone' => 'required|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'zip' => 'nullable|string',
            'property_type' => 'nullable|string',
            'business_type' => 'nullable|string',
            'sqft' => 'nullable|string',
            'floors' => 'nullable|string',
            'rooms' => 'nullable|string',
            'bathrooms' => 'nullable|string',
            'frequency' => 'nullable|string',
            'pets' => 'nullable|string',
            'has_pets' => 'nullable|string',
            'pet_type' => 'nullable|string',
            'pet_count' => 'nullable|string',
            'pet_details' => 'nullable|string',
            'cleaning_type' => 'nullable|string',
            'move_type' => 'nullable|string',
            'service_mode' => 'nullable|string',
            'rental_frequency' => 'nullable|string',
            'is_empty' => 'nullable|string',
            'work_type' => 'nullable|string',
            'residue_level' => 'nullable|string',
            'project_category' => 'nullable|string',
            'current_stage' => 'nullable|string',
            'operational_window' => 'nullable|string',
            'extra_services' => 'nullable|string',
            'access_method' => 'nullable|string',
            'date' => 'nullable|string',
            'preferred_time' => 'nullable|string',
            'service_id' => 'nullable|string',
            'facility_id' => 'nullable|string',
            'subject' => 'nullable|string',
            'description' => 'required|string',
            'utm_source' => 'nullable|string',
            'utm_medium' => 'nullable|string',
            'utm_campaign' => 'nullable|string',
            'utm_term' => 'nullable|string',
            'utm_content' => 'nullable|string',
            'web_url' => 'nullable|string',
            'referrer' => 'nullable|string',
            'x_breakdown_id' => 'nullable|string',
            'triggered_by' => 'nullable|string',
            'contact_position' => 'nullable|string',
            'workers' => 'nullable|string',
        ], $messages);

        return $validatedData;
    }

    public function afterSave(Request $request, object $jpa, bool $isNew)
    {
        $jpa->load('service', 'facility');
        
        // No bloquear con correos pesados para leads rápidos de WhatsApp
        if ($request->input('triggered_by') !== 'WhatsApp Flotante') {
            try {
                MailingController::notifyContact($jpa);
            } catch (\Throwable $th) {
                \Illuminate\Support\Facades\Log::error('Error en MailingController: ' . $th->getMessage());
            }
        }

        // Enviar a Atalaya CRM si la API Key está configurada (con timeout rápido para no demorar la respuesta)
        $atalayaApiKey = \App\Models\General::where('correlative', 'atalaya_apikey')->value('description');
        if (!empty($atalayaApiKey)) {
            try {
                $payload = [
                    'contact_name'     => $jpa->name,
                    'contact_phone'    => $jpa->phone,
                    'contact_email'    => $jpa->email,
                    'message'          => $jpa->description ?? 'Lead capturado desde formulario web',
                    'tradename'        => $jpa->company ?? '',
                    'contact_position' => $request->input('contact_position', ''),
                    'workers'          => $request->input('workers', ''),
                    'origin'           => 'Landing Page',
                    'source'           => 'Landing',
                    'triggered_by'     => $request->input('triggered_by') ?: 'Formulario Landing',
                    'web_url'          => $request->input('web_url') ?: ($request->header('referer') ?: url()->previous()),
                    'referrer'         => $request->input('referrer') ?: ($request->header('referer') ?: ''),
                    'x_breakdown_id'   => $request->input('x_breakdown_id', ''),
                ];

                // Solo adjuntar UTMs si tienen un valor asignado.
                if (!empty($jpa->utm_source))   $payload['utm_source']   = $jpa->utm_source;
                if (!empty($jpa->utm_medium))   $payload['utm_medium']   = $jpa->utm_medium;
                if (!empty($jpa->utm_campaign)) $payload['utm_campaign'] = $jpa->utm_campaign;
                if (!empty($jpa->utm_term))     $payload['utm_term']     = $jpa->utm_term;
                if (!empty($jpa->utm_content))  $payload['utm_content']  = $jpa->utm_content;

                \Illuminate\Support\Facades\Http::timeout(3)->connectTimeout(2)->withHeaders([
                    'Content-Type'  => 'application/json',
                    'Authorization' => 'Bearer ' . trim($atalayaApiKey),
                ])->post('https://crm.skalaya.com/free/leads', $payload);
            } catch (\Throwable $th) {
                \Illuminate\Support\Facades\Log::error('Excepción enviando lead a Atalaya: ' . $th->getMessage());
            }
        }
    }
}
