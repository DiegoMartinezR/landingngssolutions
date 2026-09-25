<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends BasicController
{
    public $model = Appointment::class;

    public function beforeSave(Request $request): array
    {
        if ($request->has('phone') && !$request->has('number')) {
            $request->merge(['number' => $request->phone]);
        }
        if ($request->has('city_zip') && !$request->has('zip')) {
            $request->merge(['zip' => $request->city_zip]);
        }

        if ($request->has('extra_services') && is_array($request->extra_services)) {
            $request->merge(['extra_services' => implode(', ', $request->extra_services)]);
        }

        $messages = [
            'name.required' => 'The name is required.',
            'email.required' => 'The email is required.',
            'email.email' => 'The email must be a valid email address.',
            'number.required' => 'The phone number is required.',
            'description.required' => 'The reason for inquiry is required.'
        ];

        $validatedData = $request->validate([
            'company' => 'nullable|string',
            'name' => 'required|string',
            'email' => 'required|email|max:320',
            'number' => 'required|string',
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
            'time' => 'nullable|string',
            'service_id' => 'nullable|string',
            'description' => 'nullable|string',
            'utm_source' => 'nullable|string',
            'utm_medium' => 'nullable|string',
            'utm_campaign' => 'nullable|string',
            'utm_term' => 'nullable|string',
            'utm_content' => 'nullable|string',
        ], $messages);

        return $validatedData;
    }

    public function getOccupiedSlots(Request $request)
    {
        $date = $request->query('date');
        if (!$date) return response()->json([]);

        $occupied = Appointment::where('date', $date)
            ->pluck('time')
            ->toArray();

        return response()->json($occupied);
    }

    public function afterSave(Request $request, object $jpa, bool $isNew)
    {
        $jpa->load('service');
        MailingController::notifyContact($jpa);
    }
}
