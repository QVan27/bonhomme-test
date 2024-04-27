{{--
  Title: Formulaire de contact
  Description: Formulaire & informations de contact
  Category: template-blocks
  Icon: welcome-widgets-menus
  Post-Type: page post
  Keywords: form formulaire contact
--}}

@php
  $data = Block::form($block['data']);
@endphp

<section class="b-form">
  <div class="container-fluid">
    <div class="row">
      <div class="col-auto">
        @include('components/form', ['id' => $data['id']])
      </div>
    </div>
  </div>
</section>
