<?php
/*
Plugin Name: Blogging Platform
Plugin URI: 
Description: This plugin activate Blogging Platform environment.
Version: 1.0
Author: Nico Pisani, Fer Catalano - White Canvas
Author URI: 
License: 
License URI: 
*/

global $wpdb;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define('PLUGIN_BASEPATH', plugin_dir_path( __FILE__ ));
define('WPBD_FOLDER', basename(dirname(__FILE__)));
define('WPBD_DIR', plugin_dir_path(__FILE__));
define('WPBD_URL', plugin_dir_url(WPBD_FOLDER).WPBD_FOLDER.'/');


//Sessions
/* function bd_session_start() {
    if( ! session_id() ) {
        session_start();   
    }
}
add_action( 'init', 'bd_session_start', 1 );

function bd_session_end() {
    session_destroy();
}
add_action( 'wp_logout', 'bd_session_end' );
add_action( 'wp_login', 'bd_session_end' ); */


//Hide Admin bar for authors
function bld_ocultar_admin_bar() {
    
    $user = wp_get_current_user();
    $roles = ( array ) $user->roles;
    
    if ( in_array( 'blogger', $roles, true ) || in_array( 'author', $roles, true ) ) {
        add_filter( 'show_admin_bar', '__return_false' );   
    }
}
add_action('after_setup_theme', 'bld_ocultar_admin_bar');

/**
 * Get Data Current User
 * @return array
 */
function get_user_blog_data() {

    if ( ! is_user_logged_in() ) die('Unable to access');
    
    $current_user = wp_get_current_user();

    $user = [
        'profile'   => $current_user,
        'meta'      => (object) get_user_meta( $current_user->ID ),
        'avatar'    => get_avatar_url($current_user->ID, '32'),
        'link'      => esc_url( home_url( '/doctor-profile/' . $current_user->user_nicename ) ),
        'api_vimeo' => [
            'client_id'     => get_field('client_id', 'option'),
            'client_secret' => get_field('client_secret', 'option'),
            'access_token'  => get_field('access_token', 'option'),
            'vimeo_folder_id'  => get_field( 'vimeo_folder_id', 'user_' . $current_user->ID )
        ],
        'acf' => [
            'biography'         => get_field( 'biography', 'user_' . $current_user->ID ),
            'biography_link'    => get_field( 'biography_link', 'user_' . $current_user->ID ),
            'specialty'         => get_field( 'bb_specialties', 'user_' . $current_user->ID ),
            'certification'     => get_field( 'bb_certification', 'user_' . $current_user->ID ),
            'education'         => get_field( 'bb_education', 'user_' . $current_user->ID ),
            'expertise'         => get_field( 'bb_expertise', 'user_' . $current_user->ID ),
            'residency'         => get_field( 'residency', 'user_' . $current_user->ID ),
            'credential'        => get_field( 'credential', 'user_' . $current_user->ID ),
            'clinic_location'   => get_field( 'location', 'user_' . $current_user->ID ),
            'city'              => get_field( 'city', 'user_' . $current_user->ID ),
            'state'             => get_field( 'state', 'user_' . $current_user->ID ),
            'country'           => get_field( 'country', 'user_' . $current_user->ID ),
            'clinic_name'       => get_field( 'clinic_name', 'user_' . $current_user->ID ),
            'clinic_phone'      => get_field( 'clinic_phone', 'user_' . $current_user->ID ),
            'clinic_appointment'=> get_field( 'clinic_appointment', 'user_' . $current_user->ID ),
            'clinic_open'       => get_field( 'clinic_open', 'user_' . $current_user->ID ),
            'clinic_website'    => get_field( 'clinic_web', 'user_' . $current_user->ID ),
            'clinic_email'      => get_field( 'clinic_email', 'user_' . $current_user->ID ),
            'doctor_method'      => get_field( 'upload_doctor_method', 'user_' . $current_user->ID )
        ]
    ];

    return $user;
}

require_once( ABSPATH . 'wp-includes/pluggable.php' );
require_once( ABSPATH . '/wp-load.php' );
require_once( 'registers/register-role.php' );
require_once( 'registers/register-styles.php' );
require_once( 'registers/register-scripts.php' );
require_once( 'registers/register-posttype.php' );
require_once( 'registers/register-acf.php');
require_once( 'class/class-dashboard.php' );
require_once( 'class/class-login.php' );
require_once( 'class/class-register.php' );
require_once( 'class/class-forgot-password.php' );
require_once( 'inc/custom-functions.php' );
require_once( 'class/class-blog.php' );
require_once( 'class/class-blog-edit.php' );
require_once( 'class/class-article.php' );
require_once( 'class/class-article-edit.php' );
require_once( 'class/class-bio.php' );
require_once( 'class/class-bio-edit.php' );
require_once( 'class/class-bio-edit-preview.php' );
require_once( 'class/class-preview.php' );
require_once( 'class/class-app-reviews.php' );
require_once( 'class/class-client-vimeo.php' );
require_once( 'class/class-video.php' );
require_once( 'class/class-video-edit.php' );
require_once( 'class/class-preview-video.php' );
require_once( 'class/class-client-urlife.php' );
require_once( 'class/class-aws.php' );