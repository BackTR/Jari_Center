<?php

namespace App\Application\Patient;

class FingerprintSimulationService
{
    /**
     * SIMULASI — bukan biometric matching sungguhan.
     * Template asli dari sensor bervariasi tiap scan dan butuh fuzzy matching.
     * Di sini kita hash persis, cukup untuk prototype alur identifikasi.
     */
    public function hashTemplate(string $template): string
    {
        return hash_hmac('sha256', trim($template), config('app.key'));
    }
}