<?php

namespace App\Http\Controllers;

use App\Helpers\EmailConfig;
use App\Models\General;
use App\Models\Message;

use App\Models\Ordenes;
use App\Models\Social;
use App\Models\User;
use SoDe\Extend\File;
use SoDe\Extend\JSON;
use SoDe\Extend\Text;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Log;

class MailingController extends BasicController
{
    public $model = 'Mailing';
    static function notifyContact(object $jpa)
    {
        try {
            $general = General::where('correlative', 'email_template')->first();
            $template = $general ? $general->description : null;

            $generals = General::all();
            $corporativeEmail = $generals->where('correlative', 'email_corporative')->first()->description ?? null;

            $dni = $jpa->dni ?? $jpa->document ?? '';
            $age = $jpa->age ?? '';

            if (empty($dni) && !empty($jpa->description)) {
                if (preg_match('/DNI:\s*([^,.]+)/i', $jpa->description, $matches)) {
                    $dni = trim($matches[1]);
                }
            }
            if (empty($age) && !empty($jpa->description)) {
                if (preg_match('/Edad:\s*([^,.]+)/i', $jpa->description, $matches)) {
                    $age = trim($matches[1]);
                }
            }

            $data = [
                'company' => $jpa->company,
                'name' => $jpa->name,
                'lastname_father' => $jpa->lastname_father ?? '',
                'lastname_mother' => $jpa->lastname_mother ?? '',
                'email' => $jpa->email,
                'number' => $jpa->number ?? $jpa->phone ?? '',
                'address' => $jpa->address,
                'city' => $jpa->city,
                'zip' => $jpa->zip,
                'property_type' => $jpa->property_type,
                'business_type' => $jpa->business_type,
                'sqft' => $jpa->sqft,
                'floors' => $jpa->floors,
                'rooms' => $jpa->rooms,
                'bathrooms' => $jpa->bathrooms,
                'frequency' => $jpa->frequency,
                'pets' => $jpa->pets,
                'has_pets' => $jpa->has_pets,
                'pet_type' => $jpa->pet_type,
                'pet_count' => $jpa->pet_count,
                'pet_details' => $jpa->pet_details,
                'cleaning_type' => $jpa->cleaning_type,
                'move_type' => $jpa->move_type,
                'service_mode' => $jpa->service_mode,
                'rental_frequency' => $jpa->rental_frequency,
                'is_empty' => $jpa->is_empty,
                'work_type' => $jpa->work_type,
                'residue_level' => $jpa->residue_level,
                'project_category' => $jpa->project_category,
                'current_stage' => $jpa->current_stage,
                'operational_window' => $jpa->operational_window,
                'extra_services' => $jpa->extra_services,
                'access_method' => $jpa->access_method,
                'date' => $jpa->date,
                'time' => $jpa->time ?? $jpa->preferred_time ?? '',
                'service_title' => $jpa->service ? $jpa->service->title : (str_contains($jpa->subject ?? '', 'Evaluación Capilar - ') ? str_replace('Evaluación Capilar - ', '', $jpa->subject) : 'General'),
                'facility_title' => $jpa->facility ? $jpa->facility->title : 'N/A',
                'description' => $jpa->description,
                'domain' => env('APP_DOMAIN'),
                'support_phone' => $generals->where('correlative', 'support_phone')->first()->description ?? '',
                'support_email' => $generals->where('correlative', 'support_email')->first()->description ?? '',
                'address_contact' => $generals->where('correlative', 'address')->first()->description ?? '',
                'utm_source' => $jpa->utm_source ?? '',
                'utm_medium' => $jpa->utm_medium ?? '',
                'utm_campaign' => $jpa->utm_campaign ?? '',
                'utm_term' => $jpa->utm_term ?? '',
                'utm_content' => $jpa->utm_content ?? '',
                'dni' => $dni,
                'age' => $age,
            ];


            if ($template) {
                $m = new \Mustache\Engine(['entity_flags' => ENT_QUOTES]);
                $content = $m->render($template, $data);
            } else {
                $content = View::make('mailing.contact', ['contact' => $jpa->toArray(), 'domain' => env('APP_DOMAIN')])->render();
            }

            $mail = EmailConfig::config();
            $mail->Subject = $jpa->subject ?? '¡Gracias por contactar con STF Water!';
            $mail->isHTML(true);
            $mail->Body = $content;
            $mail->addAddress($jpa->email, $jpa->name);
            $mail->send();
            Log::info("MailingController: Correo al usuario ({$jpa->email}) enviado correctamente.");

            if ($corporativeEmail) {
                $adminTemplate = <<<'HTML'
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0f2f5; margin: 0; padding: 0;">
    <tr>
        <td align="center" style="padding: 30px 0;">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; border-collapse: separate;">
                <!-- Header -->
                <tr>
                    <td align="center" style="background-color: #046BAF; padding: 30px 30px 20px;">
                        <img src="{{domain}}/assets/img/logo-white.png" alt="STF Water" width="160" style="display: block; margin: 0 auto; max-height: 60px;">
                        <h1 style="color: #ffffff; margin: 10px 0 0; font-family: 'Segoe UI', Arial, sans-serif; font-weight: 400; font-size: 24px;">Administración</h1>
                    </td>
                </tr>
                <!-- Body -->
                <tr>
                    <td style="padding: 40px 35px; font-family: 'Segoe UI', Arial, sans-serif; color: #2c3e50;">
                        <h2 style="color: #046BAF; font-size: 24px; font-weight: 600; margin: 0 0 10px 0;">¡Hola, Administrador!</h2>
                        <p style="font-size: 16px; color: #4a5568; margin: 0 0 25px 0;"><strong>{{ name }}</strong> se ha contactado. A continuación se detallan los datos recibidos:</p>
                        <hr style="border: none; border-top: 2px solid #e9eef2; margin: 30px 0;">
                        <h3 style="color: #046BAF; font-size: 18px; font-weight: 600; margin: 0 0 20px 0;">Datos de la Solicitud</h3>
                        
                        <!-- Details Container -->
                        <div style="background-color: #f9fafc; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                                <tr>
                                    <td width="38%" style="padding: 14px 18px; font-weight: 600; color: #046BAF; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif;">Nombre</td>
                                    <td style="padding: 14px 18px; color: #1e293b; background-color: #ffffff; border-bottom: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif;">{{ name }}</td>
                                </tr>
                                {{#company}}
                                <tr>
                                    <td width="38%" style="padding: 14px 18px; font-weight: 600; color: #046BAF; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif;">Empresa</td>
                                    <td style="padding: 14px 18px; color: #1e293b; background-color: #ffffff; border-bottom: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif;">{{ company }}</td>
                                </tr>
                                {{/company}}
                                {{#email}}
                                <tr>
                                    <td width="38%" style="padding: 14px 18px; font-weight: 600; color: #046BAF; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif;">Correo electrónico</td>
                                    <td style="padding: 14px 18px; color: #1e293b; background-color: #ffffff; border-bottom: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif;">{{ email }}</td>
                                </tr>
                                {{/email}}
                                {{#number}}
                                <tr>
                                    <td width="38%" style="padding: 14px 18px; font-weight: 600; color: #046BAF; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif;">Teléfono / WhatsApp</td>
                                    <td style="padding: 14px 18px; color: #1e293b; background-color: #ffffff; border-bottom: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif;">{{ number }}</td>
                                </tr>
                                {{/number}}
                                {{#service_title}}
                                <tr>
                                    <td width="38%" style="padding: 14px 18px; font-weight: 600; color: #046BAF; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif;">Motivo</td>
                                    <td style="padding: 14px 18px; color: #1e293b; background-color: #ffffff; border-bottom: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif;">{{ service_title }}</td>
                                </tr>
                                {{/service_title}}
                                {{#utm_source}}
                                <tr>
                                    <td width="38%" style="padding: 14px 18px; font-weight: 600; color: #046BAF; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif;">UTM Source</td>
                                    <td style="padding: 14px 18px; color: #1e293b; background-color: #ffffff; border-bottom: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif;">{{ utm_source }}</td>
                                </tr>
                                {{/utm_source}}
                                {{#utm_medium}}
                                <tr>
                                    <td width="38%" style="padding: 14px 18px; font-weight: 600; color: #046BAF; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif;">UTM Medium</td>
                                    <td style="padding: 14px 18px; color: #1e293b; background-color: #ffffff; border-bottom: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif;">{{ utm_medium }}</td>
                                </tr>
                                {{/utm_medium}}
                                {{#utm_campaign}}
                                <tr>
                                    <td width="38%" style="padding: 14px 18px; font-weight: 600; color: #046BAF; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif;">UTM Campaign</td>
                                    <td style="padding: 14px 18px; color: #1e293b; background-color: #ffffff; border-bottom: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif;">{{ utm_campaign }}</td>
                                </tr>
                                {{/utm_campaign}}
                            </table>
                        </div>

                        {{#description}}
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px; background-color: #FAF9F6; border-left: 6px solid #046BAF; border-radius: 12px; border-collapse: separate;">
                            <tr>
                                <td style="padding: 20px 25px; font-family: 'Segoe UI', Arial, sans-serif;">
                                    <strong style="color: #046BAF; font-size: 14px; display: block; margin-bottom: 10px; text-transform: uppercase;">Detalles y Requerimientos</strong>
                                    <p style="margin: 0; font-size: 15px; color: #2d3748;">{{ description }}</p>
                                </td>
                            </tr>
                        </table>
                        {{/description}}
                    </td>
                </tr>
                <!-- Footer -->
                <tr>
                    <td align="center" style="background-color: #f8fafc; padding: 25px; border-top: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #5f6b7a;">
                        <p style="margin: 5px 0;">© 2026 NGS Solutions. Todos los derechos reservados.</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
HTML;

                $m = new \Mustache\Engine(['entity_flags' => ENT_QUOTES]);
                $adminContent = $m->render($adminTemplate, $data);

                $adminMail = EmailConfig::config();
                $adminMail->Subject = "{$jpa->name} se ha contactado contigo";
                $adminMail->isHTML(true);
                $adminMail->Body = $adminContent;
                $adminMail->addAddress($corporativeEmail, 'STF Water Admin');
                $adminMail->send();
                Log::info("MailingController: Correo administrativo ({$corporativeEmail}) enviado correctamente.");
            }
        } catch (\Throwable $th) {
            Log::error('Error enviando correo de contacto: ' . $th->getMessage(), [
                'exception' => $th,
                'data' => $jpa->toArray()
            ]);
            if (\env('APP_ENV') == 'local') {
                dump($th->getMessage());
            }
        }
    }


    static function simpleNotify(string $view, string $email, array $data, array $ccs = [])
    {
        try {

            $socials = Social::where('visible', true)->where('status', true)->get();
            $data =  \array_merge(
                ['socials' => $socials->toArray()],
                $data
            );
            $content = View::make($view, $data)->render();

            $mail = EmailConfig::config();
            $mail->Subject = $data['title'] ?? 'Hola que tal?';
            $mail->isHTML(true);
            $mail->Body = $content;
            $mail->addAddress($email);
            foreach ($ccs as $cc) {
                $mail->addCC($cc);
            }
            $mail->send();
        } catch (\Throwable $th) {
            Log::error('Error en simpleNotify: ' . $th->getMessage(), [
                'exception' => $th,
                'email' => $email,
                'data' => $data
            ]);
            if (\env('APP_ENV') == 'local') {
                dump($th->getMessage());
            }
        }
    }
}
