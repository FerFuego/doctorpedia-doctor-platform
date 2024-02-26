<?php

class Blog_Bio {

    /**
     * A reference to an instance of this class.
     */
    private static $instance;

    /**
     * The array of templates that this plugin tracks.
     */
    protected $templates;

    /**
     * Returns an instance of this class. 
     */
    public static function get_instance() {

        if ( null == self::$instance ) {
            self::$instance = new Blog_Bio();
        } 

        return self::$instance;

    } 

    /**
     * Initializes the plugin by setting filters and administration functions.
     */
    private function __construct() {

        $this->templates = array();


        // Add a filter to the attributes metabox to inject template into the cache.
        if ( version_compare( floatval( get_bloginfo( 'version' ) ), '4.7', '<' ) ) {

            // 4.6 and older
            add_filter(
                'page_attributes_dropdown_pages_args',
                array( $this, 'register_project_templates' )
            );

        } else {

            // Add a filter to the wp 4.7 version attributes metabox
            add_filter(
                'theme_page_templates', array( $this, 'add_new_template' )
            );

        }

        // Add a filter to the save post to inject out template into the page cache
        add_filter(
            'wp_insert_post_data', 
            array( $this, 'register_project_templates' ) 
        );


        // Add a filter to the template include to determine if the page has our 
        // template assigned and return it's path
        add_filter(
            'template_include', 
            array( $this, 'view_project_template') 
        );


        // Add your templates to this array.
        $this->templates = array(
            '../templates/blogging-bio.php' => 'Blogging Bio',
        );

        $this->make_bio_page();
    } 

    /**
     * Adds our template to the page dropdown for v4.7+
     *
     */
    public function add_new_template( $posts_templates ) {
        $posts_templates = array_merge( $posts_templates, $this->templates );
        return $posts_templates;
    }

    /**
     * Adds our template to the pages cache in order to trick WordPress
     * into thinking the template file exists where it doens't really exist.
     */
    public function register_project_templates( $atts ) {

        // Create the key used for the themes cache
        $cache_key = 'page_templates-' . md5( get_theme_root() . '/' . get_stylesheet() );

        // Retrieve the cache list. 
        // If it doesn't exist, or it's empty prepare an array
        $templates = wp_get_theme()->get_page_templates();
        if ( empty( $templates ) ) {
            $templates = array();
        } 

        // New cache, therefore remove the old one
        wp_cache_delete( $cache_key , 'themes');

        // Now add our template to the list of templates by merging our templates
        // with the existing templates array from the cache.
        $templates = array_merge( $templates, $this->templates );

        // Add the modified cache to allow WordPress to pick it up for listing
        // available templates
        wp_cache_add( $cache_key, $templates, 'themes', 1800 );

        return $atts;

    } 

    /**
     * Checks if the template is assigned to the page
     */
    public function view_project_template( $template ) {
        
        // Get global post
        global $post;

        // Return template if post is empty
        if ( ! $post ) {
            return $template;
        }

        // Return default template if we don't have a custom one defined
        if ( ! isset( $this->templates[get_post_meta( 
            $post->ID, '_wp_page_template', true 
        )] ) ) {
            return $template;
        } 

        $file = plugin_dir_path( __FILE__ ). get_post_meta( 
            $post->ID, '_wp_page_template', true
        );

        // Just to be safe, we check if the file exist first
        if ( file_exists( $file ) ) {
            return $file;
        } else {
            echo $file;
        }

        // Return template
        return $template;

    }

    /**
     * Create Bio page
     */
    public function make_bio_page() {
        
        $post_id = -1;

        // Setup custom vars
        $author_id = 1;
        $slug = 'bio';
        $title = 'Blog Bio';

        // Check if page exists, if not create it
        if ( null == get_page_by_title( $title ) && get_current_blog_id() == 1) {

            $uploader_page = array(
                'comment_status'        => 'closed',
                'ping_status'           => 'closed',
                'post_author'           => $author_id,
                'post_name'             => $slug,
                'post_title'            => $title,
                'post_status'           => 'publish',
                'post_type'             => 'page',
                'post_parent'           => get_page_by_title( 'Doctor Platform' )->ID,
                'hierarchical '         => true,
                'page_template'         => '../templates/blogging-bio.php'
            );

            $post_id = wp_insert_post( $uploader_page );

            
            if ( !$post_id ) {
                
                wp_die( 'Error creating template page' );
                
            } else {

                update_post_meta( $post_id, '_wp_page_template', '../templates/blogging-bio.php' );

            }

        } // end check if

    }

    /**
     * Get content Bios page
     * @return html content
     */
    public static function get_content( $page = null ) {
        
        switch ( $page ) {
            case 'bio':
                require plugin_dir_path( __FILE__ ) . '../templates/parts/body-bio.php';
            break;
            case 'clinic':
                require plugin_dir_path( __FILE__ ) . '../templates/parts/body-clinic.php';
            break;
            case 'plans':
                echo "<h2>Nothing around here</h2>";
            break;
            case 'video':
                echo "<h2>Nothing around here</h2>";
            break;
            default:
                require plugin_dir_path( __FILE__ ) . '../templates/parts/body-bio.php';
        }

    }

} 

add_action( 'wp_loaded', array( 'Blog_Bio', 'get_instance' ) );