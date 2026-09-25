@php
    $component = Route::currentRouteName();
@endphp


<!DOCTYPE html>
<html lang="es">

<head>
    {{-- Google Tag Manager --}}
    @if(!empty($gtmId))
        <script>(function (w, d, s, l, i) {
                w[l] = w[l] || []; w[l].push({
                    'gtm.start':
                        new Date().getTime(), event: 'gtm.js'
                }); var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
                        'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', '{{ $gtmId }}');</script>
    @endif

    {{-- Google Analytics (GA4) --}}
    @if(!empty($gaId))
        <script async src="https://www.googletagmanager.com/gtag/js?id={{ $gaId }}"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', '{{ $gaId }}');
        </script>
    @endif

    {{-- Facebook Pixel --}}
    @if(!empty($facebookPixel))
        <script>
            !function (f, b, e, v, n, t, s) {
                if (f.fbq) return; n = f.fbq = function () {
                    n.callMethod ?
                        n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                };
                if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
                n.queue = []; t = b.createElement(e); t.async = !0;
                t.src = v; s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s)
            }(window, document, 'script',
                'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '{{ $facebookPixel }}');
            fbq('track', 'PageView');
        </script>
        <noscript><img height="1" width="1" style="display:none"
                src="https://www.facebook.com/tr?id={{ $facebookPixel }}&ev=PageView&noscript=1" /></noscript>
    @endif

    {{-- TikTok Pixel --}}
    @if(!empty($tiktokPixel))
        <script>
            !function (w, d, t) {
                w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || []; ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"], ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } }; for (var i = 0; i < ttq.methods.length; i++)ttq.setAndDefer(ttq, ttq.methods[i]); ttq.instance = function (t) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)ttq.setAndDefer(e, ttq.methods[n]); return e }, ttq.load = function (e, n) { var i = "https://analytics.tiktok.com/i18n/pixel/events.js"; ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = i, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {}; var o = d.createElement("script"); o.type = "text/javascript", o.async = !0, o.src = i + "?sdkid=" + e + "&lib=" + t; var a = d.getElementsByTagName("script")[0]; a.parentNode.insertBefore(o, a) };
                ttq.load('{{ $tiktokPixel }}');
                ttq.page();
            }(window, document, 'ttq');
        </script>
    @endif






    @viteReactRefresh
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{ $seoTitle ?? env('APP_NAME') }}</title>

    <meta name="description" content="{{ $seoDescription ?? '' }}" />
    <meta name="keywords" content="{{ $seoKeywords ?? '' }}" />
    <meta name="author" content="{{ $companyName ?? env('APP_NAME') }}">
    <meta name="robots" content="index, follow">

    {{-- Verification --}}
    @if(!empty($googleVerification))
        <meta name="google-site-verification" content="{{ $googleVerification }}" />
    @endif
    @if(!empty($bingVerification))
        <meta name="msvalidate.01" content="{{ $bingVerification }}" />
    @endif

    {{-- Open Graph --}}
    <meta property="og:title" content="{{ !empty($seoTitle) ? $seoTitle : env('APP_NAME') }}" />
    <meta property="og:description" content="{{ !empty($seoDescription) ? $seoDescription : '' }}" />
    <meta property="og:image"
        content="{{ !empty($ogImageDefault) ? (str_starts_with($ogImageDefault, 'http') ? $ogImageDefault : url($ogImageDefault)) : asset('assets/img/logo.png') }}" />
    <meta property="og:url" content="{{ url()->current() }}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="{{ !empty($companyName) ? $companyName : env('APP_NAME') }}" />

    {{-- Twitter --}}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ !empty($seoTitle) ? $seoTitle : env('APP_NAME') }}">
    <meta name="twitter:description" content="{{ !empty($seoDescription) ? $seoDescription : '' }}">
    <meta name="twitter:image"
        content="{{ !empty($ogImageDefault) ? (str_starts_with($ogImageDefault, 'http') ? $ogImageDefault : url($ogImageDefault)) : asset('assets/img/logo.png') }}">
    @if(!empty($twitterSite))
        <meta name="twitter:site" content="{{ $twitterSite }}">
    @endif

    <link rel="canonical" href="{{ url()->current() }}">
    <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml">
    <link rel="shortcut icon" href="/assets/img/favicon.png" type="image/png">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- JSON-LD Schema --}}
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "{{ $companyName }}",
      "description": "{{ $companyDescription }}",
      "url": "{{ $companyUrl }}",
      "logo": "{{ $companyLogo }}",
      "image": "{{ $ogImageDefault }}",
      "telephone": "{{ $companyPhone }}",
      "email": "{{ $companyEmail }}",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "{{ $companyAddress }}",
        "addressLocality": "{{ $companyLocality }}",
        "addressRegion": "{{ $companyRegion }}",
        "addressCountry": "{{ $companyCountry }}"
      },
      "sameAs": [
        "{{ $facebookPage }}",
        "{{ $instagramProfile }}",
        "{{ $linkedinProfile }}"
      ]
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "{{ $companyName ?? env('APP_NAME') }}",
      "url": "{{ url()->current() }}",
      "logo": "{{ $companyLogo ?? asset('assets/img/logo.png') }}",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "{{ $companyPhone ?? '' }}",
        "contactType": "customer service"
      }
    }
    </script>

    <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "headline": "{{ $companyName }}",
  "description": "{{ $companyDescription }}",
  "datePublished": "2026-07-00T08:00:00-05:00",
  "dateModified": "{{ now()->toIso8601String() }}",
  "author": {
    "@type": "Organization",
    "name": "{{ $companyName }}",
    "url": "{{ $companyUrl }}",
    "logo": "{{ $companyLogo }}",
    "sameAs": [
      "{{ $facebookPage }}",
      "{{ $instagramProfile }}",
      "{{ $linkedinProfile }}"
    ]
  },
  "publisher": {
    "@type": "Organization",
    "name": "{{ $companyName }}",
    "logo": {
      "@type": "ImageObject",
      "url": "{{ $companyLogo }}"
    }
  },
  "creator": {
    "@type": "Organization",
    "name": "Mundo Web",
    "url": "https://www.mundoweb.pe/"
  },
  "provider": {
    "@type": "Organization",
    "name": "Mundo Web",
    "url": "https://www.mundoweb.pe/"
  }
}
</script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link rel="preload" href="/lte/assets/css/icons.min.css" as="style"
        onload="this.onload=null;this.rel='stylesheet'" />
    <noscript>
        <link rel="stylesheet" href="/lte/assets/css/icons.min.css" />
    </noscript>

    <link rel="preload" href="https://unpkg.com/aos@2.3.1/dist/aos.css" as="style"
        onload="this.onload=null;this.rel='stylesheet'" />
    <noscript>
        <link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css" />
    </noscript>

    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Kanit:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Quicksand:wght@300;400;500;600;700&family=Bebas+Neue&display=swap"
        rel="stylesheet">

    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" as="style"
        onload="this.onload=null;this.rel='stylesheet'"
        integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <noscript>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
            integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
            crossorigin="anonymous" referrerpolicy="no-referrer" />
    </noscript>

    <!-- Añadido para traducir -->
    <script>
        function loadGoogleTranslate() {
            new google.translate.TranslateElement({
                pageLanguage: 'es',
                includedLanguages: 'es,en',
                autoDisplay: false
            }, 'google_translate_element');
        }
    </script>
    <script defer src="https://translate.google.com/translate_a/element.js?cb=loadGoogleTranslate"></script>

    <style>
        * {
            font-family: 'Quicksand', sans-serif;
            box-sizing: border-box;
        }
    </style>

    @if ($component == 'Checkout.jsx')
        <script type="application/javascript" src="https://checkout.culqi.com/js/v4"></script>
    @elseif ($component == 'MyAccount.jsx')
        <link href="/lte/assets/libs/dxdatagrid/css/dx.light.compact.css?v=06d3ebc8-645c-4d80-a600-c9652743c425"
            rel="stylesheet" type="text/css" id="dg-default-stylesheet" />
        <link href="/lte/assets/libs/dxdatagrid/css/dx.dark.compact.css?v=06d3ebc8-645c-4d80-a600-c9652743c425"
            rel="stylesheet" type="text/css" id="dg-dark-stylesheet" disabled="disabled" />
    @endif

    @vite(['resources/css/app.css', 'resources/js/' . Route::currentRouteName()])
    @inertiaHead





    <!-- End Meta Pixel Code -->
    <link rel="preload" href="/assets/fonts/aspekta/font-face.css" as="style"
        onload="this.onload=null;this.rel='stylesheet'" />
    <noscript>
        <link rel="stylesheet" href="/assets/fonts/aspekta/font-face.css" />
    </noscript>

    {!! $headScripts !!}
</head>
<style>
    body {
        /*background-image: url('/assets/img/maqueta/Blog.png');*/
        width: 100%;
        height: auto;
        background-size: 100% auto;
        background-repeat: no-repeat;
        /* Asegura que la imagen no se repita */
        background-position: top center;
        /* Centra la imagen en la parte superior */
        overflow-x: hidden;
    }
</style>

<body class="antialiased overflow-x-hidden">
    {!! $bodyScripts !!}
    {{-- Google Tag Manager (noscript) --}}
    @if(!empty($gtmId))
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ $gtmId }}" height="0" width="0"
                style="display:none;visibility:hidden"></iframe></noscript>
    @endif
    @inertia

    <script defer src="/lte/assets/js/vendor.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.js"></script>
    <script defer src="/lte/assets/libs/moment/min/moment.min.js"></script>
    <script defer src="/lte/assets/libs/moment/moment-timezone.js"></script>
    <script defer src="/lte/assets/libs/moment/locale/es.js"></script>

    @if ($component == 'MyAccount.jsx')
        <script defer src="/lte/assets/libs/dxdatagrid/js/dx.all.js"></script>
        <script defer src="/lte/assets/libs/dxdatagrid/js/localization/dx.messages.es.js"></script>
        <script defer src="/lte/assets/libs/dxdatagrid/js/localization/dx.messages.en.js"></script>
    @endif

    <script defer src="/lte/assets/libs/tippy.js/tippy.all.min.js"></script>

    <script>
        (function () {
            function getUTMParams() {
                const urlParams = new URLSearchParams(window.location.search);
                const utms = {};
                ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
                    const value = urlParams.get(param);
                    if (value) utms[param] = value;
                });
                return utms;
            }

            const utms = getUTMParams();
            if (Object.keys(utms).length > 0) {
                // Store in sessionStorage to persist across page navigations in the same session
                Object.keys(utms).forEach(key => {
                    sessionStorage.setItem(key, utms[key]);
                });
            }

            // Track visit once per session
            if (!sessionStorage.getItem('visit_tracked')) {
                const storedUtms = {};
                ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
                    const val = sessionStorage.getItem(key);
                    if (val) storedUtms[key] = val;
                });

                fetch('/api/track-visit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify({
                        url: window.location.href,
                        ...storedUtms
                    })
                })
                    .then(res => {
                        if (res.ok) sessionStorage.setItem('visit_tracked', 'true');
                    })
                    .catch(err => console.error('Tracking error:', err));
            }
        })();

        document.addEventListener('click', function (event) {
            const target = event.target;

            if (target.tagName === 'BUTTON' && target.hasAttribute('href')) {
                const href = target.getAttribute('href');

                if (target.getAttribute('target') === '_blank') {
                    window.open(href, '_blank');
                } else {
                    window.location.href = href;
                }
            }
        });
    </script>
</body>

</html>