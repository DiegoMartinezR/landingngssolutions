<!DOCTYPE html>
<html lang="es">
@php
    $support_phone = $generals->where('correlative', 'support_phone')->first()->description ?? '';
    $support_email = $generals->where('correlative', 'support_email')->first()->description ?? '';
    $address = $generals->where('correlative', 'address')->first()->description ?? '';
    $copyright_notice = $generals->where('correlative', 'copyright_notice')->first()->description ?? ('© ' . date('Y') . ' STF Water. Todos los derechos reservados.');
@endphp

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>STF Water - Confirmación de Contacto</title>
    <style>
        /* Reset and base styles */
        body,
        html {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f0f2f5;
            color: #2c3e50;
            line-height: 1.5;
        }

        /* Main wrapper */
        .email-wrapper {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), 0 6px 12px rgba(0, 0, 0, 0.05);
        }

        /* Header with logo and primary background */
        .email-header {
            background-color: #046BAF;
            /* primary brand-main */
            padding: 30px 30px 20px;
            text-align: center;
        }

        .email-header img {
            max-width: 160px;
            height: auto;
            margin-bottom: 10px;
        }

        .email-header h1 {
            color: #ffffff;
            margin: 10px 0 0;
            font-weight: 400;
            font-size: 24px;
            letter-spacing: 0.5px;
            opacity: 0.95;
        }

        /* Email body */
        .email-body {
            padding: 40px 35px;
        }

        /* Typography */
        h2 {
            color: #046BAF;
            /* primary brand-main */
            font-size: 28px;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 10px;
        }

        .greeting {
            font-size: 18px;
            color: #4a5568;
            margin-bottom: 25px;
        }

        .highlight {
            color: #046BAF;
            /* primary brand-main */
            font-weight: 600;
        }

        hr {
            border: none;
            border-top: 2px solid #e9eef2;
            margin: 30px 0;
        }

        h3 {
            color: #046BAF;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        h3:before {
            content: '';
            display: inline-block;
            width: 6px;
            height: 24px;
            background-color: #8BC05B;
            /* accent brand-accent */
            border-radius: 12px;
            margin-right: 10px;
        }

        /* Table styles */
        .details-table {
            width: 100%;
            border-collapse: collapse;
            background-color: #f9fafc;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
        }

        .details-table tr {
            border-bottom: 1px solid #e2e8f0;
        }

        .details-table tr:last-child {
            border-bottom: none;
        }

        .details-table td {
            padding: 14px 18px;
            vertical-align: top;
        }

        .details-table td:first-child {
            width: 38%;
            font-weight: 600;
            color: #046BAF;
            background-color: #f1f5f9;
            letter-spacing: 0.3px;
        }

        .details-table td:last-child {
            color: #1e293b;
            background-color: #ffffff;
        }

        /* Additional comments */
        .comment-box {
            margin-top: 30px;
            padding: 20px 25px;
            background-color: #F0F7FC;
            /* brand-light */
            border-left: 6px solid #8BC05B;
            /* accent brand-accent */
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }

        .comment-box strong {
            color: #046BAF;
            font-size: 16px;
            display: block;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .comment-box p {
            margin: 0;
            font-size: 16px;
            color: #2d3748;
        }

        /* Footer */
        .email-footer {
            background-color: #f8fafc;
            padding: 25px;
            text-align: center;
            font-size: 14px;
            color: #5f6b7a;
            border-top: 1px solid #e2e8f0;
        }

        .email-footer p {
            margin: 5px 0;
        }

        .email-footer a {
            color: #046BAF;
            text-decoration: none;
            font-weight: 500;
        }

        .email-footer a:hover {
            text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 600px) {
            .email-body {
                padding: 30px 20px;
            }

            .details-table td {
                display: block;
                width: 100% !important;
                box-sizing: border-box;
            }

            .details-table td:first-child {
                background-color: #f1f5f9;
                border-bottom: none;
                padding-bottom: 8px;
            }

            .details-table td:last-child {
                padding-top: 8px;
                border-bottom: 1px solid #e2e8f0;
            }

            .details-table tr:last-child td:last-child {
                border-bottom: none;
            }
        }
    </style>
</head>

<body>
    <div class="email-wrapper">
        <!-- Header with logo -->
        <div class="email-header">
            <img src="{{ $domain }}/assets/img/logo-white.png" alt="STF Water" style="display: block; margin: 0 auto; max-height: 60px;">
            <h1>STF Water</h1>
        </div>

        <!-- Email body -->
        <div class="email-body">
            <h2>¡Hola, {{ $contact['name'] }}!</h2>
            <p class="greeting">Gracias por contactar con nosotros. Hemos recibido tu solicitud para una evaluación técnica y nuestro equipo se contactará contigo <span class="highlight">en un plazo máximo de 24 horas</span>.</p>

            <hr>

            <h3>Detalles de la solicitud</h3>

            <table class="details-table">
                <tr>
                    <td>Nombre completo</td>
                    <td>{{ $contact['name'] }}</td>
                </tr>
                @if(!empty($contact['company']))
                <tr>
                    <td>Empresa</td>
                    <td>{{ $contact['company'] }}</td>
                </tr>
                @endif
                @if(!empty($contact['email']))
                <tr>
                    <td>Correo electrónico</td>
                    <td>{{ $contact['email'] }}</td>
                </tr>
                @endif
                @if(!empty($contact['phone']) || !empty($contact['number']))
                <tr>
                    <td>Teléfono</td>
                    <td>{{ $contact['phone'] ?? ($contact['number'] ?? '') }}</td>
                </tr>
                @endif
            </table>

            @if(!empty($contact['description']))
            <div class="comment-box">
                <strong>Detalles y Requerimientos</strong>
                <p>{{ $contact['description'] }}</p>
            </div>
            @endif

            <!-- Optional follow-up message -->
            <div style="margin-top: 35px; text-align: center;">
                <p style="color: #5f6b7a;">Si necesitas modificar algún detalle, no dudes en responder directamente a este correo.</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p>{{ $copyright_notice }}</p>
            <p>
                @if($support_email)
                <a href="mailto:{{ $support_email }}">Escríbenos</a> |
                @endif
                @if($support_phone)
                <a href="tel:{{ $support_phone }}">Llámanos</a>
                @endif
            </p>
            @if($address)
            <p style="font-size: 12px; margin-top: 15px;">{{ $address }}</p>
            @endif
        </div>
    </div>
</body>

</html>