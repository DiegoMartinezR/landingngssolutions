<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    use HasFactory, HasUuids;
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'description',
        'gallery',
        'map',
        'latitude',
        'longitude',
        'radius',
        'status',
        'visible',
        'slug',
        'lang_id',
        'order_index'
    ];

    protected $casts = [
        'gallery' => 'array'
    ];

    public function lang()
    {
        return $this->belongsTo(Lang::class);
    }

    public function facilities()
    {
        return $this->hasMany(Facility::class);
    }
}
