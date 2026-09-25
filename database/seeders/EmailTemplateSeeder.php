<?php

namespace Database\Seeders;

use App\Models\General;
use Illuminate\Database\Seeder;

class EmailTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $template = <<<'HTML'
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f0f4f8">
<tr>
<td align="center" style="padding:40px 15px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border:1px solid #dde3ea;font-family:Arial,Helvetica,sans-serif;">

  <!-- HEADER -->
  <tr>
    <td align="center" bgcolor="#046BAF" style="padding:32px 40px 28px 40px;">
      <p style="margin:0;font-size:24px;font-weight:bold;color:#ffffff;letter-spacing:1px;">NGS Solutions</p>
      <p style="margin:6px 0 0 0;font-size:13px;color:#b8d9f0;letter-spacing:2px;text-transform:uppercase;">Sistemas Antihurto EAS</p>
    </td>
  </tr>

  <!-- GREETING -->
  <tr>
    <td style="padding:36px 40px 10px 40px;">
      <p style="margin:0;font-size:20px;font-weight:bold;color:#046BAF;">Hola, {{ name }}!</p>
      <p style="margin:12px 0 0 0;font-size:15px;color:#4a5568;line-height:1.6;">
        Hemos recibido tu solicitud de asesoria comercial. Nuestro equipo especializado se pondra en contacto contigo en menos de <strong>24 horas habiles</strong>.
      </p>
    </td>
  </tr>

  <!-- DIVIDER -->
  <tr>
    <td style="padding:24px 40px 0 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="border-top:2px solid #e2e8f0;font-size:0;">&nbsp;</td></tr>
      </table>
    </td>
  </tr>

  <!-- SECTION TITLE -->
  <tr>
    <td style="padding:24px 40px 16px 40px;">
      <p style="margin:0;font-size:13px;font-weight:bold;color:#046BAF;text-transform:uppercase;letter-spacing:1px;">Datos de tu solicitud</p>
    </td>
  </tr>

  <!-- DATA TABLE -->
  <tr>
    <td style="padding:0 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;">

        <!-- Nombre -->
        <tr>
          <td width="38%" bgcolor="#EBF4FB" style="padding:12px 16px;font-size:13px;font-weight:bold;color:#046BAF;border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
            Nombre
          </td>
          <td bgcolor="#ffffff" style="padding:12px 16px;font-size:14px;color:#1a202c;border-bottom:1px solid #e2e8f0;">
            {{ name }}
          </td>
        </tr>

        <!-- Empresa (solo si viene) -->
        {{#company}}
        <tr>
          <td width="38%" bgcolor="#EBF4FB" style="padding:12px 16px;font-size:13px;font-weight:bold;color:#046BAF;border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
            Empresa / Negocio
          </td>
          <td bgcolor="#ffffff" style="padding:12px 16px;font-size:14px;color:#1a202c;border-bottom:1px solid #e2e8f0;">
            {{ company }}
          </td>
        </tr>
        {{/company}}

        <!-- Correo -->
        {{#email}}
        <tr>
          <td width="38%" bgcolor="#EBF4FB" style="padding:12px 16px;font-size:13px;font-weight:bold;color:#046BAF;border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
            Correo electronico
          </td>
          <td bgcolor="#ffffff" style="padding:12px 16px;font-size:14px;color:#1a202c;border-bottom:1px solid #e2e8f0;">
            {{ email }}
          </td>
        </tr>
        {{/email}}

        <!-- Telefono -->
        {{#number}}
        <tr>
          <td width="38%" bgcolor="#EBF4FB" style="padding:12px 16px;font-size:13px;font-weight:bold;color:#046BAF;border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
            Telefono / WhatsApp
          </td>
          <td bgcolor="#ffffff" style="padding:12px 16px;font-size:14px;color:#1a202c;border-bottom:1px solid #e2e8f0;">
            {{ number }}
          </td>
        </tr>
        {{/number}}

        <!-- Mensaje -->
        {{#description}}
        <tr>
          <td width="38%" bgcolor="#EBF4FB" style="padding:12px 16px;font-size:13px;font-weight:bold;color:#046BAF;border-right:1px solid #e2e8f0;vertical-align:top;">
            Proyecto / Mensaje
          </td>
          <td bgcolor="#ffffff" style="padding:12px 16px;font-size:14px;color:#1a202c;line-height:1.5;">
            {{ description }}
          </td>
        </tr>
        {{/description}}

      </table>
    </td>
  </tr>

  <!-- NOTE -->
  <tr>
    <td style="padding:28px 40px 0 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f7fbff" style="border-left:4px solid #046BAF;">
        <tr>
          <td style="padding:14px 18px;font-size:13px;color:#4a5568;line-height:1.6;">
            Puedes responder directamente a este correo si deseas agregar mas detalles sobre tu requerimiento.
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- DIVIDER -->
  <tr>
    <td style="padding:28px 40px 0 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="border-top:1px solid #e2e8f0;font-size:0;">&nbsp;</td></tr>
      </table>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td align="center" bgcolor="#f8fafc" style="padding:24px 40px;border-top:1px solid #e2e8f0;">
      <p style="margin:0;font-size:13px;font-weight:bold;color:#046BAF;">NGS Solutions</p>
      <p style="margin:4px 0 0 0;font-size:12px;color:#718096;">Sistemas Antihurto EAS &mdash; Peru</p>
      {{#support_phone}}
      <p style="margin:8px 0 0 0;font-size:12px;color:#718096;">Tel: <a href="tel:{{ support_phone }}" style="color:#046BAF;text-decoration:none;">{{ support_phone }}</a></p>
      {{/support_phone}}
      {{#support_email}}
      <p style="margin:4px 0 0 0;font-size:12px;color:#718096;"><a href="mailto:{{ support_email }}" style="color:#046BAF;text-decoration:none;">{{ support_email }}</a></p>
      {{/support_email}}
      <p style="margin:16px 0 0 0;font-size:11px;color:#a0aec0;">&copy; 2026 NGS Solutions. Todos los derechos reservados.</p>
    </td>
  </tr>

</table>
</td>
</tr>
</table>
HTML;

        General::updateOrCreate([
            'correlative' => 'email_template',
        ], [
            'name'        => 'NGS Solutions Email Template',
            'description' => $template,
        ]);
    }
}
