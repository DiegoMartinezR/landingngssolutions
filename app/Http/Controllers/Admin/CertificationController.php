<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Certification;

class CertificationController extends BasicController
{
    public $model = Certification::class;
    public $reactView = 'Certifications';
    public $imageFields = ['image'];
}
