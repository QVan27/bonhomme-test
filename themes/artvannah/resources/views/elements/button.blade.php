@php
  $is_link = isset($is_link) ? $is_link : true;
@endphp

@if ($is_link)
  <a class="button" href="{{$data['url']}}" @if($data['target']) target="_blank" rel="noopener" @endif>{{ $data['title'] }}</a>
@else
  <div class="button">{{ $data['title'] }}</div>
@endif
