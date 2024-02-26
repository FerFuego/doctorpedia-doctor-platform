<?php

class ArticleEdit {

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
            self::$instance = new ArticleEdit();
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
            '../templates/blogging-article-edit.php' => 'Blogging Article Edit',
        );

        $this->make_article_edit_page();
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
     * Create Articles page
     */
    public function make_article_edit_page () {
        
        $post_id = -1;

        // Setup custom vars
        $author_id = 1;
        $slug = 'article-edit';
        $title = 'Edit Article';

        // Check if page exists, if not create it
        if ( null == get_page_by_title( $title ) ) {

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
                'page_template'         => '../templates/blogging-article-edit.php'
            );

            $post_id = wp_insert_post( $uploader_page );

            
            if ( !$post_id ) {
                
                wp_die( 'Error creating template page' );
                
            } else {

                update_post_meta( $post_id, '_wp_page_template', '../templates/blogging-article-edit.php' );

            }

        } // end check if

    }

    /**
     * Clean all inputs
     */
    public static function clean_input ( $str ) {

        $str = trim($str);
    
        $str = stripslashes($str);
    
        $str = htmlspecialchars($str);
    
        return $str;
    
    }

    /**
     * Return articles html
     */
    public function get_article ( $blog, $post_id ) {

        //switch_to_blog( $blog ); 

        $data = array( 
            'basic' => get_post( $post_id ), 
            'subtitle' => get_post_meta( $post_id, 'subtitle', true ),
            'feature' => get_post_meta( $post_id, 'feature', true ),
            'thumbnail' => get_the_post_thumbnail_url( $post_id, 'full')
        );
        
        //restore_current_blog(); 
    
        return $data;
    
    }

    /**
     * Save Articles in DB
     */
    public function save_article () {

        $result = '';
        $status = '';

        if ( $_POST['post_id'] ) {

            // update article
            $data = array (
                'ID'            => self::clean_input( $_POST['post_id'] ),
                'post_title'    => self::clean_input( $_POST['title'] ),
                'post_content'  => $_POST['content'],
                'post_status'   => $_POST['status'],
            );

            wp_update_post( $data );

            update_post_meta( $_POST['post_id'], 'subtitle', self::clean_input( $_POST['subtitle'] ) );
            update_post_meta( $_POST['post_id'], 'feature', $_POST['feature'] );
            //update_post_meta( $_POST['post_id'], 'relevantList', $_POST['relevantList'] );
            //update_post_meta( $_POST['post_id'], 'keywords', $_POST['keywordList'] );
            wp_set_post_tags( $_POST['post_id'], $_POST['keywordList'], false ); //Tags - false = replace list of tags

            $user_id = wp_get_current_user()->ID;
            update_user_meta($user_id, 'feature_article', clean_input( $_POST['post_id'] ) );
            
            if( $_POST['featuredImage'] ) {

                wp_delete_attachment( $_POST['post_id'], true );

                if ( self::store_images( $_POST['featuredImage'], $_POST['post_id'] ) ) 
                    wp_die( 'Error uploading image' );
            }

            $postId = $_POST['post_id'];

        } else {

            // insert article
            $data = array(
                'comment_status' => 'closed',
                'ping_status'    => 'closed',
                'post_author'    => get_current_user_id(),
                'post_name'      => sanitize_title( $_POST['title'] ),
                'post_title'     => $_POST['title'],
                'post_status'    => $_POST['status'],
                'post_type'      => 'article',
                'post_content'   => $_POST['content']
            );

            $postId = wp_insert_post( sanitize_post( $data ) );

            add_post_meta( $postId, 'subtitle', self::clean_input( $_POST['subtitle'] ) );
            add_post_meta( $postId, 'feature', $_POST['feature'] );
            add_post_meta( $postId, 'relevantList', $_POST['relevantList'] );
            //add_post_meta( $postId, 'keywords', $_POST['keywordList'] );
            wp_set_post_tags( $postId, $_POST['keywordList'], false ); //Tags - false = replace list of tags

            $user_id = wp_get_current_user()->ID;
            update_user_meta($user_id, 'feature_article', $postId );

            if ( ! $postId ) 
                wp_die( 'Error creating article' );

            if( $_POST['featuredImage'] ) {
                if ( self::store_images( $_POST['featuredImage'], $postId ) ) 
                    wp_die( 'Error uploading image' );
            }
            
        }
            
        $result = array(
            'status'    => $_POST['status'],
            'redirect'  => '/doctor-platform/article-edit?post_id=' . $postId,
            'preview'  =>  '/doctor-platform/preview/?post=' . $postId . '&preview=true&pt=article',
            'goback'    => '/doctor-platform/my-articles',
            'message'   => ( $_POST['status'] == 'draft' ) ? 'Saved Article!' : 'Published article! Article pending approval' 
        );

        wp_reset_postdata();

        wp_send_json_success( $result );

    }

    /**
     * Save Articles in DB
     */
    public function save_link_article () {

        if ( $_POST['post_id'] ) {

            // update article
            $data = array (
                'ID'            => self::clean_input( $_POST['post_id'] ),
                'post_status'   => $_POST['status'],
            );

            wp_update_post( $data );

            $result = array(
                'status'    => $_POST['status'],
                'redirect'  => '/doctor-platform/my-articles',
                'message'   => 'Article Pending Approval!' 
            );
    
            wp_send_json_success( $result );
        }
        return false;
    }

    /**
     * Save and Preview Articles in DB
     */
    public function preview_article () {

        $result = '';

        if ( $_POST['post_id'] ) {
            
            // update article
            $data = array (
                'ID'            => self::clean_input( $_POST['post_id'] ),
                'post_title'    => self::clean_input( $_POST['title'] ),
                'post_content'  => $_POST['content'],
                'post_status'   => 'draft',
            );

            wp_update_post( $data );

            update_post_meta( $_POST['post_id'], 'subtitle', self::clean_input( $_POST['subtitle'] ) );
            
            if( $_POST['featuredImage'] ) {

                wp_delete_attachment( $_POST['post_id'], true );

                if ( self::store_images( $_POST['featuredImage'], $_POST['post_id'] ) ) 
                    wp_die( 'Error uploading image' );
            }

            $result = [ 'p' => $_POST['post_id'], 'blog' => $_POST['blog_id'] ];

        }
        
        wp_send_json_success( $result );

    }
    

    /**
     * Use Store of Images
     */
    public function store_images ( $upload, $postId ) {

        global $wpdb;

        // if succesfull insert the new file into the media library (create a new attachment post type).
        $wp_filetype = wp_check_filetype( basename( $upload ), null );
        $parcial_link = explode( '/wp-content', $upload );
        $thumb_link = '..' . $parcial_link[1];
        
        $attachment = array(
            'guid'           => $thumb_link,
            'post_mime_type' => $wp_filetype['type'],
            'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $upload ) ),
            'post_content'   => '',
            'post_status'    => 'inherit'
        );
        
        $attachment_id = wp_insert_attachment( $attachment, $thumb_link );
        
        set_post_thumbnail( $postId, $attachment_id );

    }

    /**
     * Upload File images
     */
    public function upload_files ( $upload, $postId ) {
 
        $upload_file = wp_upload_bits( basename( $upload['name'] ), null, file_get_contents( $upload['tmp_name'] ) );

        if ( ! $upload_file['error'] ) {
            // if succesfull insert the new file into the media library (create a new attachment post type).
            $wp_filetype = wp_check_filetype( basename( $upload['name'] ), null );
            
            $attachment = array(
                'post_mime_type' => $wp_filetype['type'],
                'post_parent'    => $post_id,
                'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $upload['name'] ) ),
                'post_content'   => '',
                'post_status'    => 'inherit'
            );
            
            $attachment_id = wp_insert_attachment( $attachment, $upload_file['file'], $post_id );
            
            if ( ! is_wp_error( $attachment_id ) ) {
                // if attachment post was successfully created, insert it as a thumbnail to the post $post_id.
                require_once(ABSPATH . "wp-admin" . '/includes/image.php');
            
                $attachment_data = wp_generate_attachment_metadata( $attachment_id, $upload_file['file'] );
            
                wp_update_attachment_metadata( $attachment_id,  $attachment_data );

                set_post_thumbnail( $postId, $attachment_id );
            }
        }

    }

    /**
     * Choose random image
     */
    public function choose_random_image () {

        //$dir = PLUGIN_BASEPATH . 'gallery/';

        //$images = glob("$dir{*.gif,*.JPG,*.jpg,*.jpeg,*.png}", GLOB_BRACE); 
        
        //$rand = array_rand( $images, 1);
       
        //$link = plugin_dir_url( dirname( __FILE__ ) ) . 'gallery/' . end( explode('/', $images[$rand] ) );

        $link = plugin_dir_url( dirname( __FILE__ ) ) . 'assets/img/choose_article.png'; 

        wp_send_json_success( $link );

    }

    /**
     * Delete Article
     */
    public function delete_article () {

        if ( $_POST['status'] == 'delete') {

            wp_delete_post( $_POST['post_id'], true );

            wp_send_json_success( 'Article Deleted' );
            
        }
    }

} 

add_action( 'wp_loaded', array( 'ArticleEdit', 'get_instance' ) );

add_action('wp_ajax_nopriv_choose_random_image', array( 'ArticleEdit', 'choose_random_image' ) );

add_action('wp_ajax_choose_random_image', array( 'ArticleEdit', 'choose_random_image' ) );

add_action('wp_ajax_nopriv_save_article', array( 'ArticleEdit', 'save_article' ) );

add_action('wp_ajax_save_article', array( 'ArticleEdit', 'save_article' ) );

add_action('wp_ajax_nopriv_preview_article', array( 'ArticleEdit', 'preview_article' ) );

add_action('wp_ajax_preview_article', array( 'ArticleEdit', 'preview_article' ) );

add_action('wp_ajax_nopriv_save_link_article', array( 'ArticleEdit', 'save_link_article' ) );

add_action('wp_ajax_save_link_article', array( 'ArticleEdit', 'save_link_article' ) );

add_action('wp_ajax_nopriv_delete_article', array( 'ArticleEdit', 'delete_article' ) );

add_action('wp_ajax_delete_article', array( 'ArticleEdit', 'delete_article' ) );