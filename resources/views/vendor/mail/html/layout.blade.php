# 1. Publish Laravel's mail views + CSS scaffold (if not already done)
php artisan vendor:publish --tag=laravel-mail

# 2. Make sure the directories exist (harmless if they already do)
mkdir -p resources/views/vendor/mail/html/themes

# 3. Write the theme CSS
cat > resources/views/vendor/mail/html/themes/default.css <<'EOF'
/* Base */

body,
body *:not(html):not(style):not(br):not(tr):not(code) {
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    position: relative;
}

body {
    -webkit-text-size-adjust: none;
    background-color: #F8FAFC;
    color: #334155;
    height: 100%;
    line-height: 1.5;
    margin: 0;
    padding: 0;
    width: 100% !important;
}

p,
ul,
ol,
blockquote {
    line-height: 1.5;
    text-align: start;
}

a {
    color: #0B1E3D;
}

a img {
    border: none;
}

/* Typography */

h1 {
    color: #0B1E3D;
    font-size: 19px;
    font-weight: 700;
    margin-top: 0;
    text-align: start;
}

h2 {
    font-size: 16px;
    font-weight: 700;
    margin-top: 0;
    text-align: start;
}

h3 {
    font-size: 14px;
    font-weight: 700;
    margin-top: 0;
    text-align: left;
}

p {
    font-size: 15px;
    line-height: 1.6em;
    margin-top: 0;
    text-align: left;
}

p.sub {
    font-size: 12px;
}

img {
    max-width: 100%;
}

/* Layout */

.wrapper {
    -premailer-cellpadding: 0;
    -premailer-cellspacing: 0;
    -premailer-width: 100%;
    background-color: #F8FAFC;
    margin: 0;
    padding: 0;
    width: 100%;
}

.content {
    -premailer-cellpadding: 0;
    -premailer-cellspacing: 0;
    -premailer-width: 100%;
    margin: 0;
    padding: 0;
    width: 100%;
}

/* Header */

.header {
    background-color: #0B1E3D;
    padding: 30px 0;
    text-align: center;
    border-radius: 12px 12px 0 0;
}

.header a {
    color: #ffffff;
    font-size: 19px;
    font-weight: 700;
    text-decoration: none;
    letter-spacing: 0.01em;
}

/* Logo */

.logo {
    height: 42px;
    max-height: 42px;
    width: auto;
}

/* Body */

.body {
    -premailer-cellpadding: 0;
    -premailer-cellspacing: 0;
    -premailer-width: 100%;
    background-color: #F8FAFC;
    margin: 0;
    padding: 0;
    width: 100%;
}

.inner-body {
    -premailer-cellpadding: 0;
    -premailer-cellspacing: 0;
    -premailer-width: 570px;
    background-color: #ffffff;
    border-color: #E2E8F0;
    border-radius: 0 0 12px 12px;
    border-width: 1px;
    border-top: none;
    box-shadow: 0 1px 3px 0 rgba(11, 30, 61, 0.06), 0 1px 2px -1px rgba(11, 30, 61, 0.06);
    margin: 0 auto;
    padding: 0;
    width: 570px;
}

.inner-body a {
    word-break: break-all;
    color: #1D4ED8;
}

/* Subcopy */

.subcopy {
    border-top: 1px solid #E2E8F0;
    margin-top: 25px;
    padding-top: 25px;
}

.subcopy p {
    font-size: 13px;
    color: #64748B;
}

/* Footer */

.footer {
    -premailer-cellpadding: 0;
    -premailer-cellspacing: 0;
    -premailer-width: 570px;
    margin: 0 auto;
    padding: 24px 0 0;
    text-align: center;
    width: 570px;
}

.footer p {
    color: #94A3B8;
    font-size: 12px;
    text-align: center;
}

.footer a {
    color: #94A3B8;
    text-decoration: underline;
}

/* Tables */

.table table {
    -premailer-cellpadding: 0;
    -premailer-cellspacing: 0;
    -premailer-width: 100%;
    margin: 30px auto;
    width: 100%;
}

.table th {
    border-bottom: 1px solid #E2E8F0;
    margin: 0;
    padding-bottom: 8px;
}

.table td {
    color: #334155;
    font-size: 15px;
    line-height: 18px;
    margin: 0;
    padding: 10px 0;
}

.content-cell {
    max-width: 100vw;
    padding: 32px;
}

/* Buttons — signal amber, matching the site's primary CTA */

.action {
    -premailer-cellpadding: 0;
    -premailer-cellspacing: 0;
    -premailer-width: 100%;
    margin: 30px auto;
    padding: 0;
    text-align: center;
    width: 100%;
    float: unset;
}

.button {
    -webkit-text-size-adjust: none;
    border-radius: 8px;
    display: inline-block;
    overflow: hidden;
    text-decoration: none;
    font-weight: 600;
}

.button-blue,
.button-primary {
    background-color: #FFC738;
    border-bottom: 8px solid #FFC738;
    border-left: 18px solid #FFC738;
    border-right: 18px solid #FFC738;
    border-top: 8px solid #FFC738;
    color: #0B1E3D !important;
}

.button-green,
.button-success {
    background-color: #16A34A;
    border-bottom: 8px solid #16A34A;
    border-left: 18px solid #16A34A;
    border-right: 18px solid #16A34A;
    border-top: 8px solid #16A34A;
    color: #ffffff !important;
}

.button-red,
.button-error {
    background-color: #DC2626;
    border-bottom: 8px solid #DC2626;
    border-left: 18px solid #DC2626;
    border-right: 18px solid #DC2626;
    border-top: 8px solid #DC2626;
    color: #ffffff !important;
}

/* Panels */

.panel {
    border-left: #0B1E3D solid 4px;
    margin: 21px 0;
}

.panel-content {
    background-color: #F8FAFC;
    color: #334155;
    padding: 16px;
}

.panel-content p {
    color: #334155;
}

.panel-item {
    padding: 0;
}

.panel-item p:last-of-type {
    margin-bottom: 0;
    padding-bottom: 0;
}

/* Utilities */

.break-all {
    word-break: break-all;
}
EOF

# 4. Write the layout Blade file
cat > resources/views/vendor/mail/html/layout.blade.php <<'EOF'
@php
    // Pulls from the same Settings the public site and admin panel use, so
    // changing the company name or uploading a logo in Admin → Settings is
    // reflected in every outgoing email automatically — no code change,
    // no redeploy. Falls back to config('app.name') only if nothing has
    // ever been saved in Settings yet.
    $brandName = \App\Models\Setting::get('company_name') ?: config('app.name');
    $logoPath = \App\Models\Setting::get('logo_path');
    $logoUrl = $logoPath ? asset('storage/' . $logoPath) : null;
@endphp
<x-mail::layout>
{{-- Header --}}
<x-slot:header>
<x-mail::header :url="config('app.url')">
@if ($logoUrl)
<img src="{{ $logoUrl }}" class="logo" alt="{{ $brandName }}">
@else
{{ $brandName }}
@endif
</x-mail::header>
</x-slot:header>
{{-- Body --}}
{!! $slot !!}
{{-- Subcopy --}}
@isset($subcopy)
<x-slot:subcopy>
<x-mail::subcopy>
{!! $subcopy !!}
</x-mail::subcopy>
</x-slot:subcopy>
@endisset
{{-- Footer --}}
<x-slot:footer>
<x-mail::footer>
© {{ date('Y') }} {{ $brandName }}. {{ __('All rights reserved.') }}
</x-mail::footer>
</x-slot:footer>
</x-mail::layout>
EOF

echo "Done. Files written to resources/views/vendor/mail/html/"