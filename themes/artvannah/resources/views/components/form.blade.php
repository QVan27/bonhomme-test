@php
  $description = isset($description) ? 'true' : 'false';
@endphp

<div class="c-form">
  {!! do_shortcode('[gravityform id="' . $id . '" title="false" description="'. $description .'" ajax="false"]') !!}
</div>
