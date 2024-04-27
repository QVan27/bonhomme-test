<!doctype html>
<html @php language_attributes() @endphp>
  @include('partials.head')

  <body class="{{ App::formSubmit() }}">

    <div class="app">
      @php do_action('get_header') @endphp

      @include('partials.header')

      @if ($GLOBALS['options']['debug'])
        @include('partials.grid')
      @endif

      <div class="content" data-taxi role="document">
        @yield('content')
      </div>

      <div class="panel"></div>

      @include('partials.footer')

      @php wp_footer() @endphp
    </div>
  </body>
</html>
