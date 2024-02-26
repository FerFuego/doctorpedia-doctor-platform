<?php

class AppReviews {

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
            self::$instance = new AppReviews();
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
            '../templates/blogging-app-reviews.php' => 'Blogging AppReviews',
        );

        $this->make_appReviews_page();
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
     * Create AppReviews page
     */
    public function make_appReviews_page() {
        
        $post_id = -1;

        // Setup custom vars
        $author_id = 1;
        $slug = 'app-reviews';
        $title = 'My App Reviews';

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
                'page_template'         => '../templates/blogging-app-reviews.php'
            );

            $post_id = wp_insert_post( $uploader_page );

            
            if ( !$post_id ) {
                
                wp_die( 'Error creating template page' );
                
            } else {

                update_post_meta( $post_id, '_wp_page_template', '../templates/blogging-app-reviews.php' );

            }

        } // end check if

    }

    /**
     * Return appReviews html
     */
    public static function get_content( $blog, $posttype, $status = null ) {

        ob_start();
        
        switch ($status) {

            case 'all':
                require plugin_dir_path( __FILE__ ) . '../templates/parts/list-apps.php';
            break;

            case 'publish':
                query_posts([
                    'post_type'     => $posttype,
                    'author'        => get_current_user_id(),
                    'post_status'   => 'publish'
                ]); 
            break;

            case 'pending':
                query_posts([
                    'post_type'     => $posttype,
                    'author'        => get_current_user_id(),
                    'post_status'   => 'pending'
                ]); 
            break;
            
            default:
                require plugin_dir_path( __FILE__ ) . '../templates/parts/list-apps.php';
            break;

        }
    
        if ( have_posts() ) : ?>

            <?php if ($status == 'pending') : ?> 

                <div class="doctor-app-reviews__container__header">

                    <div class="doctor-app-reviews__container__header__content">

                        <h2>My Reviews</h2>

                        <p>Once your reviews are approved, they will be added to the apps and your public profile.</p>

                        <a href="#" onclick="showDoctorModal('<?php echo wp_get_current_user()->first_name . ' ' . wp_get_current_user()->last_name; ?>','<?php echo wp_get_current_user()->display_name; ?>', '<?php echo wp_get_current_user()->user_email; ?>')" class="btn btn-primary mt-4">Write A Review</a>

                    </div>

                    <div class="doctor-app-reviews__container__header__img">
                        <img src="<?php echo WPBD_URL . '/assets/img/doctor-dashboard-reviews.svg'; ?>" alt="">
                    </div>

                </div>

            <?php endif;?>
    
            <?php while( have_posts() ) : the_post(); 

                // Get Taxonomy data. 
                $taxonomy = wp_get_post_terms( get_the_ID(), 'user-reviews-category' )[0];
                
                if ( ! $taxonomy ) {
                    $taxonomy = get_term_by('name', get_field('which_app_are_you_reviewing'), 'user-reviews-category'); 
                }

                $taxonomytype = $taxonomy->taxonomy . '_' . $taxonomy->term_id;
                $name         = $taxonomy->name;
                $image        = get_field( 'image', $taxonomytype );
                $rating       = get_field( 'ratings' ); 
                $rows         = get_field( 'personal' ); ?>
            
                <div class="container doctors-appreviewed">

                    <!-- Start Header User Reviews  -->
                    <?php require plugin_dir_path( __FILE__ ) . '../templates/parts/header-app.php'; ?>
                    <!-- End Header User Reviews  -->

                    <!-- Start loop User Reviews -->
                    <?php require  plugin_dir_path( __FILE__ ) . '../templates/parts/body-reviews.php'; ?>
                    <!-- End loop User Reviews -->

                </div>
        
            <?php endwhile;
        
        else :

            if ( $status == 'publish' || $status == 'pending' ) : ?>

                <div class="doctor-app-reviews__container__header">

                    <div class="doctor-app-reviews__container__header__content">

                        <h2>My Reviews</h2>

                        <p>You don't have any reviews<?php echo ( $status == 'pending' ) ? ' pending approval' : '';?>.</p>

                        <a href="#" onclick="showDoctorModal('<?php echo wp_get_current_user()->first_name . ' ' . wp_get_current_user()->last_name; ?>','<?php echo wp_get_current_user()->display_name; ?>', '<?php echo wp_get_current_user()->user_email; ?>')" class="btn btn-primary mt-4">Write A Review</a>

                    </div>

                    <div class="doctor-app-reviews__container__header__img">

                        <img src="<?php echo WPBD_URL . '/assets/img/doctor-dashboard-reviews.svg'; ?>" alt="">

                    </div>

                </div>

            <?php endif;
            
        endif;
    
        wp_reset_postdata();
    
        return ob_get_clean();
    
    }

    /**
     * Calculate Gral Rating
     */
    public function calc_gral_rating( $categoryID ){

        $rating = array();
        $ease   = array();
        $money  = array();
        $features = array();
        $support = array();

        $args = array(
            'post_type' => 'user-reviews',
            'tax_query' => array(
                array(
                    'taxonomy' => 'user-reviews-category',
                    'field' => 'term_id',
                    'terms' => $categoryID
                )
            ), 
            'orderby'   => 'date',
            'order'     => 'DESC',
        );

        $loop = new WP_Query( $args );

        if ( $loop->have_posts() ) : 
            while ( $loop->have_posts() ) : $loop->the_post();

                $rows = get_field('ratings');

                $rating[]   = $rows['overall_ranking'];
                $ease[]     = $rows['ease_use'];
                $money[]    = $rows['value_money'];
                $features[] = $rows['features'];
                $support[] = $rows['support'];

            endwhile;
        endif;

        if( !$rating )
            return 0;

        $total = array(
            'rating'    => array_sum( $rating ) / count( $rating ),
            'ease'      => array_sum( $ease )   / count( $ease ),
            'money'     => array_sum( $money )  / count( $money ),
            'features'  => array_sum( $features ) / count( $features ),
            'support'   => array_sum( $support ) / count( $support ),
        );

        return $total;
    }

    /**
     * Delete AppReview
     */
    public function delete_reviews () {

        if ( $_POST['status'] == 'delete') {

            wp_delete_post( $_POST['post_id'], true );

            wp_send_json_success( 'Review Deleted' );
            
        }
    }

    /**
     * Return Cant Post per type
     */
    public static function get_cant_posts( $posttype, $status ) {

        global $wpdb;
        
        $user_id = get_current_user_id();

        $query = "SELECT count($wpdb->posts.ID ) as count_post
                FROM $wpdb->posts
                WHERE  $wpdb->posts.post_type = '$posttype'
                AND $wpdb->posts.post_status = '$status'
                AND $wpdb->posts.post_author = '$user_id'";

        $result = $wpdb->get_results($query);

        return $result[0]->count_post;
    }

} 

add_action( 'wp_loaded', array( 'AppReviews', 'get_instance' ) );

add_action('wp_ajax_nopriv_delete_reviews', array( 'AppReviews', 'delete_reviews' ) );

add_action('wp_ajax_delete_reviews', array( 'AppReviews', 'delete_reviews' ) );