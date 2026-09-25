<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    use HasFactory, HasUuids;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'image',
        'banner',
        'job',
        'name',
        'description',
        'visible',
        'status',
        'slug',
        'characteristics',
        'socials',
        'lang_id'
    ];
    protected $casts = [
        'characteristics' => 'array',
        'socials' => 'array'
    ];

    public function lang()
    {
        return $this->belongsTo(Lang::class);
    }
}
