<?php

namespace App\Helpers;

use PHPMailer\PHPMailer\PHPMailer;

class EmailConfig
{
    static function config(): PHPMailer
    {
        $mail = new PHPMailer(true);
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER;
        $mail->isSMTP();
        
        $host = config('mail.mailers.smtp.host') ?? env('MAIL_HOST');
        $username = config('mail.mailers.smtp.username') ?? env('MAIL_USERNAME');
        $password = config('mail.mailers.smtp.password') ?? env('MAIL_PASSWORD');
        $port = config('mail.mailers.smtp.port') ?? env('MAIL_PORT');
        $encryption = strtolower(config('mail.mailers.smtp.encryption') ?? env('MAIL_ENCRYPTION', ''));
        
        $mail->Host = $host;
        $mail->SMTPAuth = true;
        $mail->Username = $username;
        $mail->Password = $password;
        
        if ($encryption === 'ssl' || $encryption === 'smtps') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        } elseif ($encryption === 'tls' || $encryption === 'starttls') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        } else {
            // Fallback based on port if encryption not specified
            if ($port == 465) {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            } elseif ($port == 587) {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            } else {
                $mail->SMTPSecure = '';
            }
        }
        
        $mail->Port = $port;
        $mail->Subject = 'Notificación de ' . (config('app.name') ?? env('APP_NAME'));
        $mail->CharSet = 'UTF-8';
        
        $fromAddress = config('mail.from.address') ?? env('MAIL_FROM_ADDRESS');
        $fromName = config('mail.from.name') ?? env('MAIL_FROM_NAME');
        $mail->setFrom($fromAddress, $fromName);
        
        return $mail;
    }
}