{{--
  Template Name: Conteneur
--}}

@extends('layouts.app')

@section('content')
  @while(have_posts()) @php the_post() @endphp
    <div data-taxi-view>
      <div class="template-container">
        <section class="b-gutenberg">
          <div class="container-fluid">
            <div class="row">
              <div class="offset-2 col-20 offset-md-4 col-md-16">
                {!! the_content() !!}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  @endwhile
@endsection
