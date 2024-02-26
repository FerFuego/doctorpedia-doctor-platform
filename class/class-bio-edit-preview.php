<?php

class Blog_BioEditPreview {

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
            self::$instance = new Blog_BioEditPreview();
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
            '../templates/blogging-bio-edit-preview.php' => 'Complete Bio',
        );

        $this->make_bioedit_page();
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
     * Create bioedit page
     */
    public function make_bioedit_page() {
        
        $post_id = -1;

        // Setup custom vars
        $author_id = 1;
        $slug = 'complete-bio';
        $title = 'Complete Bio';

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
                'post_parent'           => get_page_by_title( 'Doctor Platform' )->ID,
                'hierarchical '         => true,
                'page_template'         => '../templates/blogging-bio-edit-preview.php'
            );

            $post_id = wp_insert_post( $uploader_page );

            
            if ( !$post_id ) {
                
                wp_die( 'Error creating template page' );
                
            } else {

                update_post_meta( $post_id, '_wp_page_template', '../templates/blogging-bio-edit-preview.php' );

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
     * Get content Bio-Edit page
     * @return html
     */
    public static function get_content( $page ) {

        require plugin_dir_path( __FILE__ ) . '../templates/parts/body-complete-bio.php';

    }

    public static function corta( $string, $max ) {

		return substr($string, 0, $max);

	}

    /**
     * Update user data
     * @return string
     */
    public static function save_pre_bio() {

        if ( ! empty( $_POST['user_control'] ) ) {
            wp_send_json_error( 'Error control' );
        }
        
        if ( $_POST['user_id'] != wp_get_current_user()->ID ) {
            wp_send_json_error( 'Error user' );
        }

        
        try {
            
            $user_id = wp_get_current_user()->ID;
            
            wp_update_user( [ 'ID' => $user_id, 'user_url' => self::clean_input( $_POST['user_website'] ) ] );
            update_user_meta( $user_id, 'first_name', self::clean_input( $_POST['user_firstname'] ) );
            update_user_meta( $user_id, 'last_name', self::clean_input( $_POST['user_lastname'] ) );
            update_user_meta( $user_id, 'linkedin', self::clean_input( $_POST['user_linkedin'] ) );
            update_user_meta( $user_id, 'facebook', self::clean_input( $_POST['user_facebook'] ) );
            update_user_meta( $user_id, 'instagram', self::clean_input( $_POST['user_instagram'] ) );
            update_user_meta( $user_id, 'twitter', self::clean_input( $_POST['user_twitter'] ) );

            update_user_meta( $user_id, 'clinic_name', self::clean_input( $_POST['clinic_name'] ) );
            update_user_meta( $user_id, 'clinic_phone', self::clean_input( $_POST['clinic_phone'] ) );
            update_user_meta( $user_id, 'clinic_appointment', self::clean_input( $_POST['clinic_appointment'] ) );
            update_user_meta( $user_id, 'clinic_email', self::clean_input( $_POST['clinic_email'] ) );
            update_user_meta( $user_id, 'clinic_open', self::clean_input( $_POST['clinic_open'] ) );
            update_user_meta( $user_id, 'clinic_web', self::clean_input( $_POST['clinic_web'] ) );
            update_user_meta( $user_id, 'city', self::clean_input( $_POST['city'] ) );
            update_user_meta( $user_id, 'state', self::clean_input( $_POST['state'] ) );
            update_user_meta( $user_id, 'country', self::clean_input( $_POST['country'] ) );
            update_user_meta( $user_id, 'user_npi', self::clean_input( $_POST['user_npi'] ) );

            $value = array(
                "address" => $_POST['clinic_location'], 
                "lat" => $_POST['clinic_lat'], 
                "lng" => $_POST['clinic_lng'], 
                "zoom" => 16
            );
            
            update_user_meta($user_id, 'field_5e33292cb4321', $value);
            update_user_meta($user_id, 'location', $value);
            update_user_meta($user_id, '_location', 'field_5e33292cb4321');

            $z = 0;

            $bb_certification = json_decode(stripslashes($_POST['user_certification']));

            update_user_meta($user_id, '_bb_certification', 'field_5ee32323ewe51bf38b', false);
            update_user_meta($user_id, 'bb_certification', count( $bb_certification ), false);

            foreach( $bb_certification as $bb_cert ) {

                update_user_meta($user_id, '_bb_certification_'.$z.'_certification', 'field_5e332324a6bbf38c', false );
                update_user_meta($user_id, '_bb_certification_'.$z.'_subcertification', 'field_5e332324a675bf38c', false);
                update_user_meta($user_id, 'bb_certification_'.$z.'_certification', $bb_cert->certification, false );
                update_user_meta($user_id, 'bb_certification_'.$z.'_subcertification', $bb_cert->subcertification, false);
                $z++;
            }

            update_user_meta( $user_id, 'biography', self::corta($_POST['user_description'], 500 ) );
            update_user_meta( $user_id, 'biography_link', $_POST['user_description_link'] );
            update_user_meta( $user_id, 'residency', $_POST['user_residency'] );
            update_user_meta( $user_id, 'credential', $_POST['user_credential'] );
            update_user_meta( $user_id, 'is_doctor_premium', 'check' ); //mark default premium
            
            $i = 0;

            $bb_specialties = json_decode(stripslashes($_POST['user_specialty']));
            
            update_user_meta($user_id, '_bb_specialties', 'field_5eea8a51bf38b', false);
            update_user_meta($user_id, 'bb_specialties', count( $bb_specialties ), false);
            
            foreach( $bb_specialties as $bb_sp) {
                
                update_user_meta($user_id, '_bb_specialties_'.$i.'_specialty', 'field_5eea8a6bbf38c', false);
                update_user_meta($user_id, '_bb_specialties_'.$i.'_subspecialty', 'field_5eea8a75bf38d', false);
                update_user_meta($user_id, 'bb_specialties_'.$i.'_specialty', $bb_sp->specialty, false);
                update_user_meta($user_id, 'bb_specialties_'.$i.'_subspecialty', $bb_sp->subspecialty, false);
                $i++;
            }

            $x = 0;

            $bb_education = json_decode(stripslashes($_POST['user_education']));
            
            update_user_meta($user_id, '_bb_education', 'field_00102e51bf38b', false);
            update_user_meta($user_id, 'bb_education', count( $bb_education ), false);
            
            foreach( $bb_education as $bb_edu) {
                
                update_user_meta($user_id, '_bb_education_'.$x.'_education', 'field_5e39980911b0', false);
                update_user_meta($user_id, 'bb_education_'.$x.'_education', $bb_edu, false);
                $x++;
            }

            $y = 0;

            $bb_expertise = json_decode(stripslashes($_POST['user_expertise']));
            
            update_user_meta($user_id, '_bb_expertise', 'field_00102e51bareaf38b', false);
            update_user_meta($user_id, 'bb_expertise', count( $bb_expertise ), false);
            
            foreach( $bb_expertise as $bb_exp) {
                
                update_user_meta($user_id, '_bb_expertise_'.$y.'_expertise', 'field_5e39980area911b0', false);
                update_user_meta($user_id, 'bb_expertise_'.$y.'_expertise', $bb_exp, false);
                $y++;
            }

            //self::add_doctorDirectory( $_POST );

            if( $_FILES ) {

                if ( self::upload_files( $_FILES['featuredImage'], $user_id ) ) 
                    wp_die( 'Error uploading image' );
            }
            
            wp_send_json_success( 'Profile updated' );
        
        } catch ( Exception $e ) {

            wp_send_json_error( 'Exception captured: ', $e->getMessage(), "\n" );

        }

    }

    /**
     * Add Doctor to DoctorDirectory
     * unused since 01/2021
     */
    public function add_doctorDirectory( $post ) {

        $author_id = wp_get_current_user()->ID;
        $title = $post['user_firstname'] . ' ' . $post['user_lastname'];
        $slug = sanitize_title(sanitize_title($title, '', 'save'), '', 'query');
        $bb_specialties = json_decode(stripslashes($post['user_specialty']));
        $field_name = "field_5ca791bb0bbf7";
        $value = array(
            "address" => $post['clinic_location'], 
            "lat" => $post['clinic_lat'], 
            "lng" => $post['clinic_lng'], 
            "zoom" => 16
        );

        $data = array(
            'comment_status'        => 'closed',
            'ping_status'           => 'closed',
            'post_author'           => $author_id,
            'post_name'             => $slug,
            'post_title'            => $title,
            'post_status'           => 'publish',
            'post_type'             => 'doctors',
            'hierarchical '         => true
        );

        $post_exist = get_page_by_title( $title, OBJECT, 'doctors' );


        if ( ! $post_exist ) {
            
            $post_id = wp_insert_post( $data );

            add_post_meta( $post_id, 'clinic_name', $post['clinic_name'] );
            add_post_meta( $post_id, 'secondary_speciality', $bb_specialties[0]->subspecialty );
            add_post_meta( $post_id, 'phone', $post['clinic_phone'] );
            add_post_meta( $post_id, 'clinic_appointment', $post['clinic_appointment'] );
            add_post_meta( $post_id, 'email', $post['clinic_email'] );
            add_post_meta( $post_id, 'website', $post['clinic_web'] );
            add_post_meta( $post_id, 'facebook_url', $post['user_facebook'] );
            add_post_meta( $post_id, 'twitter_url', $post['user_instagram'] );
            add_post_meta( $post_id, 'linkedin_url', $post['user_linkedin'] );
            add_post_meta( $post_id, 'profile', 'premium' );
            add_post_meta( $post_id, 'is_featured_doctor', 'true' );
            add_post_meta( $post_id, $field_name, $value );
            add_post_meta( $post_id, 'location', $value );
            add_post_meta( $post_id, '_location', $field_name );

        } else {

            $post_id = $post_exist->ID;

            update_post_meta( $post_id, 'clinic_name', $post['clinic_name'] );
            update_post_meta( $post_id, 'secondary_speciality', $bb_specialties[0]->subspecialty );
            update_post_meta( $post_id, 'phone', $post['clinic_phone'] );
            update_post_meta( $post_id, 'clinic_appointment', $post['clinic_appointment'] );
            update_post_meta( $post_id, 'email', $post['clinic_email'] );
            update_post_meta( $post_id, 'website', $post['clinic_web'] );
            update_post_meta( $post_id, 'facebook_url', $post['user_facebook'] );
            update_post_meta( $post_id, 'twitter_url', $post['user_instagram'] );
            update_post_meta( $post_id, 'linkedin_url', $post['user_linkedin'] );
            update_post_meta( $post_id, 'profile', 'premium' );
            update_post_meta( $post_id, 'is_featured_doctor', 'true' );
            update_post_meta( $post_id, $field_name, $value );
            update_post_meta( $post_id, 'location', $value );
            update_post_meta( $post_id, '_location', $field_name );
        }

        $cat = get_term_by('name', $bb_specialties[0]->specialty, 'doctor', OBJECT );
        if( !$cat ){
            $cat = wp_insert_term($bb_specialties[0]->specialty, 'doctor' );
        }
        wp_set_post_terms($post_id, $cat->term_id, 'doctor' , true ); // Set Team

        return $post_id;
    }

    /**
     * Upload File images
     */
    public function upload_files ( $upload, $user_id ) {

        global $wpdb;

        try {

            $upload_file = wp_upload_bits( basename( $upload['name'] ), null, file_get_contents( $upload['tmp_name'] ) );

        } catch ( Exception $e ) {
            wp_send_json_error( 'Exception captured: ', $e->getMessage(), "\n" );
        }
 

        if ( ! $upload_file['error'] ) {
            // if succesfull insert the new file into the media library (create a new attachment post type).
            $wp_filetype = wp_check_filetype( basename( $upload['name'] ), null );
            
            $attachment = array(
                'guiid'          => $upload_file['url'],
                'post_mime_type' => $wp_filetype['type'],
                'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $upload['name'] ) ),
                'post_content'   => '',
                'post_status'    => 'inherit'
            );
            
            $attachment_id = wp_insert_attachment( $attachment, $upload_file['file'] );
            
            if ( ! is_wp_error( $attachment_id ) ) {
                // if attachment post was successfully created, insert it as a thumbnail to the post $post_id.
                require_once( ABSPATH . 'wp-admin/includes/image.php');
            
                $attachment_data = wp_generate_attachment_metadata( $attachment_id, $upload_file['file'] );
            
                wp_update_attachment_metadata( $attachment_id,  $attachment_data );

                update_user_meta($user_id, $wpdb->get_blog_prefix() . 'user_avatar', $attachment_id);
            }
        }

    }

} 

add_action( 'wp_loaded', array( 'Blog_BioEditPreview', 'get_instance' ) );

add_action('wp_ajax_nopriv_save_pre_bio', array( 'Blog_BioEditPreview', 'save_pre_bio' ) );

add_action('wp_ajax_save_pre_bio', array( 'Blog_BioEditPreview', 'save_pre_bio' ) );