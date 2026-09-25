<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory, HasUuids;
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'company',
        'name',
        'lastname_father',
        'lastname_mother',
        'document',
        'email',
        'number',
        'address',
        'city',
        'zip',
        'property_type',
        'sqft',
        'floors',
        'frequency',
        'pets',
        'date',
        'time',
        'service_id',
        'description',
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
        'work_type',
        'seen',
        'status',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
    ];
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
