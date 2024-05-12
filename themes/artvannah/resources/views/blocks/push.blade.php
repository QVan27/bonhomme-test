{{--
  Title: Push
  Description: Push
  Category: template-blocks
  Icon: visibility
  Post-Type: page
  Keywords: push
--}}

@php
    $data = Block::push($block['data']);
@endphp

<section class="b-push">
    <div class="container-fluid">
        <div class="row">
            <div class="col-14 offset-5 col-md-14 offset-md-5">
                <div class="b-push__content u-col-center">
                    <span class="b-push__suptitle">{{ $data['suptitle'] }}</span>
                    <h2 class="b-push__title u-upper u-center">{{ $data['title'] }}</h2>
                    @include('elements/button', ['data' => $data['cta']])
                </div>
            </div>
        </div>
    </div>
    <div class="b-push__bg">
        @include('elements/image', ['data' => $data['image']])
    </div>
</section>
