<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" X-Content-Type-Options="nosniff">
  <link rel="icon" type="image/x-icon" href="@asset('images/favicons/favicon.ico')">
  <link rel="icon" type="image/png" sizes="16x16" href="@asset('images/favicons/favicon-16x16.png')">
  <link rel="icon" type="image/png" sizes="32x32" href="@asset('images/favicons/favicon-32x32.png')">
  <link rel="icon" type="image/png" sizes="48x48" href="@asset('images/favicons/favicon-48x48.png')">
  <link rel="manifest" href="@asset('images/favicons/manifest.webmanifest')">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#fff">
  <link rel="apple-touch-icon" sizes="57x57" href="@asset('images/favicons/apple-touch-icon-57x57.png')">
  <link rel="apple-touch-icon" sizes="60x60" href="@asset('images/favicons/apple-touch-icon-60x60.png')">
  <link rel="apple-touch-icon" sizes="72x72" href="@asset('images/favicons/apple-touch-icon-72x72.png')">
  <link rel="apple-touch-icon" sizes="76x76" href="@asset('images/favicons/apple-touch-icon-76x76.png')">
  <link rel="apple-touch-icon" sizes="114x114" href="@asset('images/favicons/apple-touch-icon-114x114.png')">
  <link rel="apple-touch-icon" sizes="120x120" href="@asset('images/favicons/apple-touch-icon-120x120.png')">
  <link rel="apple-touch-icon" sizes="144x144" href="@asset('images/favicons/apple-touch-icon-144x144.png')">
  <link rel="apple-touch-icon" sizes="152x152" href="@asset('images/favicons/apple-touch-icon-152x152.png')">
  <link rel="apple-touch-icon" sizes="167x167" href="@asset('images/favicons/apple-touch-icon-167x167.png')">
  <link rel="apple-touch-icon" sizes="180x180" href="@asset('images/favicons/apple-touch-icon-180x180.png')">
  <link rel="apple-touch-icon" sizes="1024x1024" href="@asset('images/favicons/apple-touch-icon-1024x1024.png')">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title">
  <meta name="msapplication-TileColor" content="#fff">
  <meta name="msapplication-TileImage" content="@asset('images/favicons/mstile-144x144.png')">
  <meta name="msapplication-config" content="@asset('images/favicons/browserconfig.xml')">
  <script>window.App = {!! json_encode($GLOBALS['App']) !!}</script>
  <script>
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('{{ get_home_url() }}/wp-content/themes/artvannah/service-worker.js');
  </script>

  @php wp_head() @endphp
</head>
