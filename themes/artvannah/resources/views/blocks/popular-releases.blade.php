{{--
  Title: Popular Releases
  Description: Popular Releases
  Category: template-blocks
  Icon: slides
  Post-Type: page
  Keywords: popular releases
--}}

@php
    $data = Block::popularReleases($block['data']);
@endphp

<section class="b-popular-releases">
    <div class="container-fluid">
        <div class="row">
            <div class="offset-1 col-22 col-lg-18 offset-lg-3">
                <div class="b-popular-releases__heading">
                    <h2 class="b-popular-releases__title u-upper">{{ $data['title'] }}</h2>
                    <p class="b-popular-releases__subtitle">{{ $data['subtitle'] }}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="b-popular-releases__slider">
        <div class="b-popular-releases__slider-wrapper">
            @foreach ($data['items'] as $i => $item)
                <div class="b-popular-releases__slider-slide">
                    <div class="b-popular-releases__slider-slide__image">
                        @include('elements/image', ['data' => $item['image']])
                    </div>
                    <div class="b-popular-releases__slider-slide__content">
                        <h3 class="b-popular-releases__slider-slide__title u-upper">{{ $item['title'] }}</h3>
                        <span class="b-popular-releases__slider-slide__date">{{ $item['date'] }}
                        </span>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</section>
