<?php

if (is_admin()) {
  include "admin/tinymce-insert-li/insert-lorem-ipsum.php";
}

if (function_exists('acf_add_options_page')) {
  acf_add_options_page();
}

if (function_exists('acf_add_local_field_group')) {
  acf_add_local_field_group([
    'key' => 'options',
    'title' => 'Options pour les développeurs',
    'fields' => [
      [
        'key' => 'debug_tab',
        'label' => 'Debug',
        'name' => '',
        'type' => 'tab',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'placement' => 'left',
        'endpoint' => 0
      ],
      [
        'key' => 'debug',
        'label' => 'Activer le mode debug',
        'name' => 'debug',
        'type' => 'true_false',
        'instructions' => 'Ce mode est réservé aux développeurs. Ne pas toucher.',
        'required' => 0,
        'conditional_logic' => 0,
        'message' => '',
        'default_value' => 0,
        'ui' => 1,
        'ui_on_text' => '',
        'ui_off_text' => ''
      ],
    ],
    'location' => [
      [
        [
          'param' => 'options_page',
          'operator' => '==',
          'value' => 'acf-options',
        ]
      ]
    ]
  ]);
}

require_once dirname(__DIR__) . '/resources/blocs-setup.php';
require_once dirname(__DIR__) . '/resources/sync-acf.php';

function remove_gutenberg_styles() {
  wp_dequeue_style( 'wp-block-library' );
}

add_action( 'wp_enqueue_scripts', 'remove_gutenberg_styles', 100 );

/**
* Display svg function
*/
function display_svg($svg, $getUrl = false) {
  $uri = $getUrl ? get_template_directory_uri() . "/assets/images/svg" : get_template_directory() . "/assets/images/svg";
  $path = "$uri/$svg.svg";

  if ($getUrl) return $path;
  else if (file_exists($path)) include($path);
  else throw new Exception("SVG name doesn't exist in /images/svg folder", 1);
}

/**
* Create all image sizes
*/
add_image_size('xs', 240, 0, true);
add_image_size('sm', 480, 0, true);
add_image_size('md', 768, 0, true);
add_image_size('lg', 1024, 0, true);
add_image_size('xl', 1200, 0, true);
add_image_size('xxl', 1400, 0, true);
add_image_size('xxxl', 1600, 0, true);
add_image_size('hd', 1920, 1080, true);

remove_image_size('1536x1536');
remove_image_size('2048x2048');
update_option('medium_large_size_w', '0');

/**
* Populate ACF select field options with Gravity Forms forms
*/
function acf_populate_gf_forms_ids( $field ) {
  if ( class_exists( 'GFFormsModel' ) ) {
    $choices = [];

    foreach ( \GFFormsModel::get_forms() as $form ) {
      $choices[ $form->id ] = $form->title;
    }

    $field['choices'] = $choices;
  }

  return $field;
}
add_filter( 'acf/load_field/name=id-form', 'acf_populate_gf_forms_ids' );

/**
* Hide unwanted Gutenberg Blocks
*/
function dc_allowed_block_types ($allowed_block_types, $editor_context) {
  $acf_blocks = array_column(acf_get_block_types(), 'name');
  $allowed_core_blocks = [
    'core/paragraph',
    'core/heading',
    'core/list',
    'core/image',
    'core/columns'
  ];

  return array_merge($allowed_core_blocks, $acf_blocks);
}
add_filter( 'allowed_block_types_all', 'dc_allowed_block_types', 10, 2 );

/**
* Change slug to camel case
*/
function toCamelCase($string) {
  return preg_replace_callback(
    '/[-_](.)/',
    function($matches) {
      return strtoupper($matches[1]);
    }, $string);
}

/**
* Add menu location
*/
function wpb_custom_new_menu() {
  register_nav_menu('footer_navigation',__( 'Footer' ));
}
add_action( 'init', 'wpb_custom_new_menu' );


/**
* Change GravityForms submit button
*/
add_filter( 'gform_submit_button', 'input_to_button', 10, 2 );

function input_to_button( $button, $form ) {
  $dom = new DOMDocument();
  $dom->loadHTML( '<?xml encoding="utf-8" ?>' . $button );
  $input = $dom->getElementsByTagName( 'input' )->item(0);
  $new_button = $dom->createElement( 'button' );

  foreach( $input->attributes as $attribute ) {
    if ($attribute->name === 'class') $new_button->setAttribute('class', 'gform_button');
    else $new_button->setAttribute($attribute->name, $attribute->value);
  }

  $new_button->setAttribute('aria-label', 'Form submit button');

  $buttonComponent = \App\template('elements/button', [
    'data' => [
      'title' => $input->getAttribute( 'value' ),
      'url' => FALSE,
      'target' => NULL,
    ],
    'is_link' => FALSE
  ]);

  $d = new DOMDocument();
  libxml_use_internal_errors(true);
  $d->loadHTML("<html>" . $buttonComponent . "</html>");
  libxml_clear_errors();

  $node = $dom->importNode($d->documentElement->firstChild, true);
  $new_button->appendChild($node);

  return $dom->saveHtml( $new_button );
}


function dc_enable_gutenberg_post_ids($can_edit, $post) {
  if (get_option('page_for_posts') === $post->ID) return true;

  return $can_edit;
}

add_filter('use_block_editor_for_post', 'dc_enable_gutenberg_post_ids', 10, 2);

/**
* Remove the subpages or submenu for editor
*/
add_action( 'admin_menu', function() {
  $user = wp_get_current_user();

  if ($user->roles[0] === 'editor') {
    global $menu, $submenu;

    unset($menu[25]); // Commentaires
    unset($menu[75]); // Outils
    unset($menu[80]); // Réglages
    unset($menu['80.3496']); // ACF
    unset($menu['99.39787']); // Yoast
    unset($menu[100]); // CPT UI

    unset($submenu['themes.php'][6]); // Apparances -> Personnaliser
    unset($submenu['themes.php'][7]); // Apparances -> Widgets
    unset($submenu['themes.php'][5]); // Apparances -> Thèmes
  }
}, 999 );

/**
* Allow editors to access Gravity Forms
*/
function wd_gravity_forms_roles() {
  $role = get_role('editor');
  $role->add_cap('gform_full_access');
}
add_action('admin_init', 'wd_gravity_forms_roles');

/* Remove H2 tag from error validation text */
add_filter('gform_validation_message', 'change_message', 10, 2);
function change_message($message, $form)
{

    return '<div class="gform_submission_error hide_summary">
    <span class="gform-icon gform-icon--close"></span>
    ' . __('Une erreur s’est produite lors de votre envoi. veuillez vérifier les champs ci-dessous.') . '
</div>';
}