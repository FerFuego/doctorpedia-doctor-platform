<?php

class Blog_Login {

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
            self::$instance = new Blog_Login();
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
            add_filter( 'page_attributes_dropdown_pages_args', array( $this, 'register_project_templates' ) );

        } else {

            // Add a filter to the wp 4.7 version attributes metabox
            add_filter( 'theme_page_templates', array( $this, 'add_new_template' ) );

        }

        // Add a filter to the save post to inject out template into the page cache
        add_filter( 'wp_insert_post_data', array( $this, 'register_project_templates' ) );


        // Add a filter to the template include to determine if the page has our 
        // template assigned and return it's path
        add_filter( 'template_include', array( $this, 'view_project_template') );

        $this->templates = array(
            '../templates/blogging-login.php' => 'Blogging Login',
        );

        // Make template and insert into DB
        $this->make_login_page();

        //Redirect after login
        add_filter( 'login_redirect', array( $this, 'login_redirect' ), 10, 3 );
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
     * Create Login page
     */
    public function make_login_page() {
        
        $post_id = -1;

        // Setup custom vars
        $author_id = 1;
        $slug = 'platform-login';
        $title = 'Platform Login';

        // Check if page exists, if not create it
        if ( null == get_page_by_title( $title ) && get_current_blog_id() == 1 ) {

            $uploader_page = array(
                'comment_status'        => 'closed',
                'ping_status'           => 'closed',
                'post_author'           => $author_id,
                'post_name'             => $slug,
                'post_title'            => $title,
                'post_status'           => 'publish',
                'post_type'             => 'page',
                'page_template'         => '../templates/blogging-login.php'
            );

            $post_id = wp_insert_post( $uploader_page );

            if ( !$post_id ) {

                wp_die( 'Error creating template page' );

            } else {

                update_post_meta( $post_id, '_wp_page_template', '../templates/blogging-login.php' );

            }

        } // end check if

    }

    /**
     * Redirect only 'Doctors' users
     */
    public function login_redirect( $redirect_to, $request, $user ) {

        if( isset( $user->roles ) && $user->roles[0] == 'blogger' ) {
            return esc_url( home_url( '/doctor-profile/' . $user->user_nicename ) );
        } 
        
        if( isset( $user->roles ) && $user->roles[0] == 'administrator' ) {
            return esc_url( home_url( '/wp-admin' ) );
        }

        return home_url();
    }

    /**
     * Login with Ajax
     */
    public static function blogging_login() {
        try{
            // First check the nonce, if it fails the function will break
            check_ajax_referer( 'ajax-login-nonce', 'security' );
    
            // Nonce is checked, get the POST data and sign user on
            $info = array();
            $info['user_login'] = $_POST['user_login'];
            $info['user_password'] = $_POST['user_pass'];
            $info['remember'] = true;
    
            $user_signon = wp_signon( $info, false );
    
            if ( is_wp_error($user_signon) ){
                wp_send_json_error(array(
                    'loggedin'=>false, 
                    'user_nicename' => false,
                    'message'=>__('Wrong email or password.')
                ));
            } else {
                wp_send_json_success(array(
                    'loggedin' =>true,
                    'user_nicename' => $user_signon->user_nicename,
                    'message' =>__('Login successful, redirecting...')
                ));
            }

        } catch (Exception $e) {
            wp_send_json_success(array(
                'loggedin' =>false,
                'user_nicename' => false,
                'message' =>__('Error, please refresh page and try again')
            ));
        }
    }

}

add_action( 'wp_loaded', array( 'Blog_Login', 'get_instance' ) );

add_action('wp_ajax_nopriv_blogging_login', array( 'Blog_Login', 'blogging_login' ) );

add_action('wp_ajax_blogging_login', array( 'Blog_Login', 'blogging_login' ) );