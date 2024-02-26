<?php

class Articles
{

    /**
     * A reference to an instance of this class.
     */
    private static $instance;

    protected $templates;

    /**
     * Returns an instance of this class.
     */
    public static function get_instance()
    {

        if (null == self::$instance) {
            self::$instance = new Articles();
        }

        return self::$instance;

    }

    /**
     * Initializes the plugin by setting filters and administration functions.
     */
    private function __construct()
    {

        $this->templates = array();

        // Add a filter to the attributes metabox to inject template into the cache.
        if (version_compare(floatval(get_bloginfo('version')), '4.7', '<')) {

            // 4.6 and older
            add_filter(
                'page_attributes_dropdown_pages_args',
                array($this, 'register_project_templates')
            );

        } else {

            // Add a filter to the wp 4.7 version attributes metabox
            add_filter(
                'theme_page_templates', array($this, 'add_new_template')
            );

        }

        // Add a filter to the save post to inject out template into the page cache
        add_filter(
            'wp_insert_post_data',
            array($this, 'register_project_templates')
        );

        // Add a filter to the template include to determine if the page has our
        // template assigned and return it's path
        add_filter(
            'template_include',
            array($this, 'view_project_template')
        );

        // Add your templates to this array.
        $this->templates = array(
            '../templates/blogging-article.php' => 'Blogging Articles',
        );

        $this->make_articles_page();
    }

    /**
     * Adds our template to the page dropdown for v4.7+
     *
     */
    public function add_new_template($posts_templates)
    {
        $posts_templates = array_merge($posts_templates, $this->templates);
        return $posts_templates;
    }

    /**
     * Adds our template to the pages cache in order to trick WordPress
     * into thinking the template file exists where it doens't really exist.
     */
    public function register_project_templates($atts)
    {

        // Create the key used for the themes cache
        $cache_key = 'page_templates-' . md5(get_theme_root() . '/' . get_stylesheet());

        // Retrieve the cache list.
        // If it doesn't exist, or it's empty prepare an array
        $templates = wp_get_theme()->get_page_templates();
        if (empty($templates)) {
            $templates = array();
        }

        // New cache, therefore remove the old one
        wp_cache_delete($cache_key, 'themes');

        // Now add our template to the list of templates by merging our templates
        // with the existing templates array from the cache.
        $templates = array_merge($templates, $this->templates);

        // Add the modified cache to allow WordPress to pick it up for listing
        // available templates
        wp_cache_add($cache_key, $templates, 'themes', 1800);

        return $atts;

    }

    /**
     * Checks if the template is assigned to the page
     */
    public function view_project_template($template)
    {

        // Get global post
        global $post;

        // Return template if post is empty
        if (!$post) {
            return $template;
        }

        // Return default template if we don't have a custom one defined
        if (!isset($this->templates[get_post_meta(
            $post->ID, '_wp_page_template', true
        )])) {
            return $template;
        }

        $file = plugin_dir_path(__FILE__) . get_post_meta(
            $post->ID, '_wp_page_template', true
        );

        // Just to be safe, we check if the file exist first
        if (file_exists($file)) {
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
    public function make_articles_page()
    {

        $post_id = -1;

        // Setup custom vars
        $author_id = 1;
        $slug = 'my-articles';
        $title = 'Articles';

        // Check if page exists, if not create it
        if (null == get_page_by_title($title)) {

            $uploader_page = array(
                'comment_status' => 'closed',
                'ping_status' => 'closed',
                'post_author' => $author_id,
                'post_name' => $slug,
                'post_title' => $title,
                'post_status' => 'publish',
                'post_type' => 'page',
                'post_parent' => get_page_by_title('Doctor Platform')->ID,
                'hierarchical ' => true,
                'page_template' => '../templates/blogging-article.php',
            );

            $post_id = wp_insert_post($uploader_page);

            if (!$post_id) {

                wp_die('Error creating template page');

            } else {

                update_post_meta($post_id, '_wp_page_template', '../templates/blogging-article.php');

            }

        } // end check if

    }

    /**
     * Return articles html
     */
    public static function get_content($blog, $posttype, $status = null)
    {

        $avatar = get_avatar_url(get_the_author_meta('ID', get_current_user_id()), '32');

        $args = [
            'post_type' => $posttype,
            'author' => get_current_user_id(),
            'post_status' => $status,
            'posts_per_page' => -1,
            'nopaging' => true,
        ];

        $results = new WP_Query($args);

        if ( $results->have_posts() ) : ?>

            <div class="no-posts-content d-flex justify-content-between">

                <div class="no-posts-content__text-container">

                    <h2 class="no-posts-content__title">My Articles</h2>

                    <div class="no-posts-content__img-container custom-hidden-lg">
                        <img src="<?php echo plugin_dir_url(dirname(__FILE__)) . 'assets/img/doctor-dashboard-articles.svg'; ?>" alt="" class="no-posts-content__img">
                    </div>

                    <p class="no-posts-content__copy">What constitutes an article (rather than a blog)?<br><br>
                        Doctorpedia articles:<br>
                        -Are sourced, objective, and evidence-based <br>
                        -Cover specific health and wellness topics <br>
                        -Could feature seamlessly on one of our websites or channels
                    </p>

                </div>

                <div class="no-posts-content__img-container no-posts-content-mobile">
                    <img src="<?php echo plugin_dir_url(dirname(__FILE__)) . 'assets/img/doctor-dashboard-articles.svg'; ?>" alt="">
                </div>

            </div>

            <?php if ( $status == 'pending' ) : ?>

                <div class="doctors-app-reviewed custom-large-container">

                    <div class="no-posts-content pt-0 pb-0 d-flex justify-content-between">

                        <div class="no-posts-content__text-container">

                            <h2 class="no-posts-content__title">Pending Articles</h2>

                            <p class="no-posts-content__copy">Your articles are being reviewed by professional experts, this will take a few hours. We will let you know when it's ready, thank you. </p>
                        
                        </div>
                    
                    </div>
                
                </div>

            <?php endif; ?>

            <div class="d-flex flex-row flex-wrap w-100 <?php echo ( $results->found_posts > 0 && $status != 'pending' ) ? 'mt-5' : ''; ?>">
            
                <?php while ( $results->have_posts()): $results->the_post(); ob_start();
                
                    require plugin_dir_path(__FILE__) . '../templates/parts/body-articles.php';
                    
                endwhile; ?>

            </div>

            <?php wp_reset_postdata();

        else:

            $args1 = [
                'post_type' => $posttype,
                'author' => get_current_user_id(),
                'post_status' => 'pending',
                'posts_per_page' => -1,
                'nopaging' => true,
            ];
    
            $result1 = new WP_Query($args1);
            
            $args2 = [
                'post_type' => $posttype,
                'author' => get_current_user_id(),
                'post_status' => 'draft',
                'posts_per_page' => -1,
                'nopaging' => true,
            ];
    
            $result2 = new WP_Query($args2); ?>

                <div class="no-posts-content d-flex justify-content-between">

                    <div class="no-posts-content__text-container">

                        <h2 class="no-posts-content__title">My Articles</h2>

                        <div class="no-posts-content__img-container">
                            <img src="<?php echo plugin_dir_url(dirname(__FILE__)) . 'assets/img/doctor-dashboard-articles.svg'; ?>" alt="" class="no-posts-content__img custom-hidden-lg">
                        </div>

                        <p class="no-posts-content__copy">What constitutes an article (rather than a blog)?<br><br>
                            Doctorpedia articles:<br>
                            -Are sourced, objective, and evidence-based <br>
                            -Cover specific health and wellness topics <br>
                            -Could feature seamlessly on one of our websites or channels
                        </p>

                        <?php if ( $result1->found_posts < 1 && $result2->found_posts < 1 ) : ?>

                            <p class="no-posts-content__copy">
                                This is where you are going to see all of your
                                published articles.  Write articles about your
                                specialty, share news and much more.
                                Write an article today to boost your online presence. 
                            </p>

                        <?php elseif ( $result1->found_posts < 1 && $result2->found_posts >= 1 && $status !== 'pending') : ?>

                            <p class="no-posts-content__copy">We'll save them for you until you're ready to edit and publish them. </p>

                        <?php elseif ( $result1->found_posts >= 1 && $status !== 'draft' ) : ?>

                            <p class="no-posts-content__copy">Once your articles have been approved, they will appear on your
                            public profile and selected relevant condition websites.</p>

                        <?php elseif ( $result1->found_posts < 1 && $status == 'pending' ) : ?>

                            <p class="no-posts-content__copy">You don't have any articles pending approval.</p>

                        <?php else : ?>

                            <p class="no-posts-content__copy">You don't have any unfinished drafts.</p>

                        <?php endif; ?>

                        <a href="<?php echo esc_url(home_url('doctors-dashboard/article-edit')); ?>" class="no-posts-content__cta <?php echo (wp_is_mobile())? 'mx-auto':'';?>">Write Your Article</a>

                    </div>

                    <div class="no-posts-content__img-container no-posts-content-mobile">
                        <img src="<?php echo plugin_dir_url(dirname(__FILE__)) . 'assets/img/doctor-dashboard-articles.svg'; ?>" alt="" class="no-posts-content__img">
                    </div>

                </div>

            <?php wp_reset_postdata();

        endif;

        return ob_get_clean();

    }

    /**
     * Return Cant Post per type
     */
    public static function get_cant_posts($posttype, $status)
    {

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

add_action('wp_loaded', array('Articles', 'get_instance'));