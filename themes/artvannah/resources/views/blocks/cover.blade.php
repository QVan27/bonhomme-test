{{--
  Title: Cover
  Description: A simple cover block with a background image and some content.
  Category: template-blocks
  Icon: cover-image
  Post-Type: page
  Keywords: cover image content
--}}

@php
    $data = Block::cover($block['data']);
@endphp

<section class="b-cover">
    <div class="container-fluid">
        <div class="row">
            <div class="col-18 offset-3 col-md-14 offset-md-5 col-xl-10 offset-xl-7">
                <div class="b-cover__content u-col-center">
                    <span class="b-cover__suptitle">{{ $data['suptitle'] }}</span>
                    <h1 class="b-cover__title u-upper u-center">{{ $data['title'] }}</h1>
                </div>
            </div>
        </div>
    </div>
    <div class="b-cover__bg">
        @include('elements/image', ['data' => $data['image']])
    </div>
</section>
