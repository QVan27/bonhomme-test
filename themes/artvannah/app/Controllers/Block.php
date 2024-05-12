<?php

namespace App\Controllers;

use Sober\Controller\Controller;

class Block extends Controller
{
  // public static function example($data) {
  //     return [
  //         'title' => Element::title($data),
  //         'image' => Element::image($data['image'], '1920px')
  //     ];
  // }

  public static function flexibleContent($data)
  {
    $fields = get_field($data['_blocks']);
    $index = 0;
    $components = [];

    foreach ($fields as $block) {
      $component_function = toCamelCase($block['acf_fc_layout']);
      $components[$block['acf_fc_layout'] . '_' . $index] = Component::$component_function($block);
      $components[$block['acf_fc_layout'] . '_' . $index]['name'] = $block['acf_fc_layout'];
      $index++;
    }

    return [
      'components' => $components
    ];
  }

  public static function form($data)
  {
    return [
      'id' => $data['id-form']
    ];
  }
  // generated function here
  public static function cover($data)
  {
    return [
      'title' => $data['title'],
      'suptitle' => $data['suptitle'],
      'image' => Element::image($data['image'], '100vw', null, null),
    ];
  }

  public static function popularReleases($data)
  {
    $items = [];

    for ($i = 0; $i < $data['items']; $i++) {
      $items[] = [
        'title' => $data['items_' . $i . '_title'],
        'date' => $data['items_' . $i . '_date'],
        'image' => Element::image($data['items_' . $i . '_image'], '25vw', null, true),
      ];
    }

    return [
      'title' => $data['title'],
      'subtitle' => $data['subtitle'],
      'items' => $items,
    ];
  }
}
