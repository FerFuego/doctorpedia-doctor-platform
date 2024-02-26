<?php

/*------------------------------------*\
            Custom Post Type
\*------------------------------------*/
function register_bp_post_type() {

    // Blog
	register_post_type( 'blog',
        array(
            'labels'        => array(
                'name'          => __( 'Platform Blogs' ),
                'singular_name' => __( 'Blog' )
            ),
            'public'        => true,
            'has_archive'   => true,
            'taxonomies'    => array('post_tag'),
            'supports'      => array( 'thumbnail', 'title', 'editor', 'author'),
            'menu_icon'     => 'dashicons-smartphone'
        )
    );

    // Article
    register_post_type( 'article',
        array(
            'labels' => array(
                'name' => __( 'Platform Articles' ),
                'singular_name' => __( 'Articles' )
            ),
            'public' => true,
            'has_archive' => true,
            'supports' => array( 'title','editor','thumbnail','author' ),
            'menu_icon' => 'dashicons-smartphone'
        )
    );

    // Repost
    register_post_type( 'repost',
        array(
            'labels' => array(
                'name' => __( 'Platform Repost' ),
                'singular_name' => __( 'Repost' )
            ),
            'public' => true,
            'has_archive' => false,
            'publicly_queryable'  => false, // disable single and archive and search
            'supports' => array( 'title','editor','thumbnail','author' ),
            'menu_icon' => 'dashicons-editor-quote'
        )
    );

}
add_action( 'init', 'register_bp_post_type' );