<?php

namespace App\Controllers;

use Sober\Controller\Controller;
use WP_Query;

class App extends Controller {
  public function __construct() {
    $GLOBALS['App'] = [];
    $GLOBALS['options'] = $this->options();
    $GLOBALS['navigation'] = $this->menu();
    $GLOBALS['page-for-posts'] = get_option('page_for_posts');

    $GLOBALS['App']['debug'] = $GLOBALS['options']['debug'];
    $GLOBALS['App']['instagram'] = $GLOBALS['options']['instagram'];
  }

  public static function formSubmit() {
    return isset($_REQUEST['gform_submit']) ? 'formsubmit-' . $_REQUEST['gform_submit'] : null;
  }

  public static function menu() {
    $return = [];
    $menus = ['primary_navigation', 'footer_navigation'];
    $menuLocations = get_nav_menu_locations();

    if ($menuLocations) {
      foreach($menus as $menu) {
        $id = $menuLocations[$menu];
        $items = wp_get_nav_menu_items($id);
        $data = [];

        foreach($items as $item) {
          if ($item->menu_item_parent == 0) {
            $itemArray = [
              'id' => $item->object_id,
              'title' => $item->title,
              'url' => $item->url,
              'target' => $item->target,
              'children' => []
            ];

            foreach ($items as $subItem) {
              if ($subItem->menu_item_parent != 0) {
                if (intval($subItem->menu_item_parent) === $item->ID) {
                  $itemArray['children'][] = [
                    'id' => $subItem->ID,
                    'title' => $subItem->title,
                    'url' => $subItem->url,
                    'target' => $subItem->target
                  ];
                }
              }
            }

            $data[] = $itemArray;
          }
        }

        $return[$menu] = $data;
      }
    }

    return $return;
  }

  public static function options() {
    $options = get_fields('options');

    return [
      'debug' => $options['debug'],
      'instagram' => [
        'clientId' => get_option('clientid'),
        'userId' => get_option('userid'),
        'accessToken' => get_option('accesstoken')
      ]
    ];
  }

  public static function getPosts($limit = -1, $post_type = 'post', $exclude = [], $new_args = NULL) {
    $args = [
      'post_type' => $post_type,
      'posts_per_page' => $limit,
      'post__not_in' => $exclude
    ];

    if ($new_args) {
      foreach($new_args as $key => $value) {
        $args[$key] = $value;
      }
    }

    return new WP_Query($args);
  }

  public static function getMainTaxonomy($post_id, $taxonomy = 'category') {
    $terms = get_the_terms($post_id, $taxonomy);
    $main_category = yoast_get_primary_term_id($taxonomy, $post_id);
    $category = count($terms) > 1 ? get_term($main_category) : get_the_terms($post_id, $taxonomy)[0];

    return $category;
  }

}
