<?php
/**
 * Functions Create Css Styles
 * Plugin Blogging Dashboard
 * Version 1.0
 * Author: Wcanvas.com
 */

function wpdd_load_plugin_css() {

    $plugin_url = plugin_dir_url( __FILE__ );

    //wp_enqueue_style( 'fontawesome_doctors', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/css/font-awesome.min.css' );
    wp_enqueue_style( 'styles_doctors', $plugin_url . '../assets/dist/main.min.css' );

}

add_action( 'wp_enqueue_scripts', 'wpdd_load_plugin_css', 100 );