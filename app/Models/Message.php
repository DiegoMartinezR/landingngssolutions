<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'company',
        'name',
        'email',
        'phone',
        'address',
        'city',
        'zip',
        'property_type',
        'business_type',
        'sqft',
        'floors',
        'frequency',
        'pets',
        'work_type',
        'residue_level',
        'date',
        'preferred_time',
        'service_id',
        'subject',
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
        'seen',
        'status',
        'facility_id',
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

    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }
}
