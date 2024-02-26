<?php

use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;

class VideosEdit
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
            self::$instance = new VideosEdit();
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
                'theme_page_templates',
                array($this, 'add_new_template')
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
            '../templates/blogging-video-edit.php' => 'Blogging Videos Edit',
        );

        $this->make_videosEdit_page();
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
            $post->ID,
            '_wp_page_template',
            true
        )])) {
            return $template;
        }

        $file = plugin_dir_path(__FILE__) . get_post_meta(
            $post->ID,
            '_wp_page_template',
            true
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
     * Create VideosEdit page
     */
    public function make_videosEdit_page()
    {

        $post_id = -1;

        // Setup custom vars
        $author_id = 1;
        $slug = 'video-edit';
        $title = 'My Video Edit';

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
                'page_template' => '../templates/blogging-video-edit.php',
            );

            $post_id = wp_insert_post($uploader_page);

            if (!$post_id) {

                wp_die('Error creating template page');
            } else {

                update_post_meta($post_id, '_wp_page_template', '../templates/blogging-video-edit.php');
            }
        } // end check if

    }

    /**
     * Clean all inputs
     */
    public static function clean_input($str)
    {
        $str = trim($str);
        $str = stripslashes($str);
        $str = htmlspecialchars($str);
        return $str;
    }

    /**
     * Return videos html
     */
    public static function get_content($post_id)
    {

        $data = array(
            'post' => get_post($post_id),
            'video' => get_post_meta($post_id, 'video_link_premium', true),
            'transcript' => get_post_meta($post_id, 'transcript', true)
        );

        return $data;
    }

    /**
     * Save video into WP
     */
    public function save_video()
    {

        $result = '';
        $status = '';
        $data = [];
        $S3location = ($_POST['location']) ? $_POST['location'] : null;
        $project_id = ($_POST['project_id']) ? $_POST['project_id'] : null;
        $file_id = ($_POST['file_id']) ? $_POST['file_id'] : null;
        $message = 'An error is ocurred, please try again.';
        $current_user = wp_get_current_user();
        $fileName = ($_POST['fileName'] ? $_POST['fileName'] : 'Doctorpedia');
        $fileMimeType = ($_POST['fileMimeType'] ? $_POST['fileMimeType'] : 'video/mp4');
        $method = ($_POST['method'] ? $_POST['method'] : null);


        // insert article
        $data = array(
            'comment_status' => 'closed',
            'ping_status'    => 'closed',
            'post_author'    => get_current_user_id(),
            'post_name'      => sanitize_title($_POST['title']),
            'post_title'     => $_POST['title'],
            'post_status'    => 'pending',
            'post_type'      => 'videos',
            'post_content'   => $_POST['content']
        );

        $postId = wp_insert_post(sanitize_post($data));

        if (!$postId)
            wp_die('Error creating article');

        try {

            if ($method == 'urlife') {
                $file = self::update_file_uploaded($project_id, $file_id, $fileMimeType);
                $location = ($file['cdnUrl']) ? $file['cdnUrl'] : $S3location;
                update_post_meta($postId, 'transcript', $_POST['content']);
                update_post_meta($postId, 'video_link_premium', $location);
                self::admins_notification($postId, $location);
            } else {
                $file_id = self::upload_files($_FILES['featuredImage'], $postId);
                update_post_meta($postId, 'transcript', $_POST['content']);
                update_post_meta($postId, 'video_link_premium', wp_get_attachment_url($file_id));
                self::admins_notification($postId, $file_id);
            }

            $message = 'Thanks for uploading your video.';
        } catch (Exception $e) {
            wp_send_json_error($e->getMessage());
        }

        $result = array(
            'status'    => '',
            'goback'    => '/doctor-platform/videos',
            'message'   => $message
        );

        wp_reset_postdata();

        wp_send_json_success($result);
    }

    /**
     * Get Tokens
     */
    public function get_tokens()
    {

        $result = 'fails';

        $make_call = new ClientURLife;

        if ($make_call->getStatus() !== 'connected')
            wp_send_json_error($result);

        $result = $make_call->cognitoAPI();

        wp_send_json_success($result);
    }

    /**
     * Get Projects
     */
    public function get_projects()
    {

        $user_id = wp_get_current_user()->ID;

        $project = get_field('vimeo_folder_id',  'user_' . $user_id);

        if ($project == '') {

            $title = wp_get_current_user()->user_nicename;
            $description = wp_get_current_user()->user_firstname . ' ' . wp_get_current_user()->user_lastname;

            $project = new ClientURLife;

            if ($project->getStatus() !== 'connected')
                wp_send_json_error('fail');

            $result = $project->setProject($title, $description);

            if (!isset($result['id']))
                wp_send_json_error('fail');

            $project = $result['id'];

            update_user_meta($user_id, 'vimeo_folder_id', $project, false);
        }

        wp_send_json_success($project);
    }

    /**
     * Create ProjectSKU
     */
    public function create_project_sku()
    {
        $project_id = $_POST['project_id'];
        try {
            $project = new ClientURlife;
            $result = $project->callcURL('POST', '/projects/' . $project_id . '/skus', [
                'packageSku' => PACKAGE_SKU
            ]);
            wp_send_json_success($result);
        } catch (Exeption $e) {
            wp_send_json_error($e->getMessage());
        }
    }

    /**
     * Create fileURLife
     */
    public function createFileURLife()
    {
        $result = 'fails';
        $project_id = $_POST['project_id'];
        $title = $_POST['title'];
        $description = $_POST['description'];
        $project_id = $_POST['project_id'];
        $fileName = $_POST['fileName'];
        $fileMimeType = $_POST['fileMimeType'];
        //$file = $_FILES['fileVideo'];
        //$mimeType = wp_check_filetype( basename( $file['name'] ), null );

        try {
            $complete = new ClientURLife;
            $result = $complete->callcURL('POST', '/projects/' . $project_id . '/files', [
                "type" => "file",
                "files" => [
                    [
                        "originalName" => $fileName,
                        "lastModified" => date('Y-m-d'),
                        "mimeType" => $fileMimeType,
                        "title" => $title,
                        "description" => strip_tags($description)
                    ]
                ]
            ]);
            wp_send_json_success($result);
        } catch (Exeption $e) {
            wp_send_json_error($e->getMessage());
        }
    }

    /**
     * Upload File Video WP
     * Not in use
     */
    public function upload_files($upload, $post_id)
    {

        $upload_file = wp_upload_bits(basename($upload['name']), null, file_get_contents($upload['tmp_name']));

        if (!$upload_file['error']) {
            // if succesfull insert the new file into the media library (create a new attachment post type).
            $wp_filetype = wp_check_filetype(basename($upload['name']), null);

            $attachment = array(
                'post_mime_type' => $wp_filetype['type'],
                'post_parent'    => '',
                'post_title'     => preg_replace('/\.[^.]+$/', '', basename($upload['name'])),
                'post_content'   => '',
                'post_status'    => 'inherit'
            );

            $attachment_id = wp_insert_attachment($attachment, $upload_file['file'], $post_id);

            if (!is_wp_error($attachment_id)) {
                // if attachment post was successfully created, insert it as a thumbnail to the post $post_id.
                require_once(ABSPATH . 'wp-admin/includes/image.php');
                require_once(ABSPATH . 'wp-admin/includes/file.php');
                require_once(ABSPATH . 'wp-admin/includes/media.php');

                $attachment_data = wp_generate_attachment_metadata($attachment_id, $upload_file['file']);

                wp_update_attachment_metadata($attachment_id,  $attachment_data);

                return $attachment_id;
            } else {
                wp_delete_attachment($post_id, true);
            }
        } else {
            wp_delete_attachment($post_id, true);
        }
    }

    /**
     * Upload File Video AWS S3
     * Not in use
     */
    public function upload_files_aws($upload)
    {

        $folder = sanitize_title(wp_get_current_user()->display_name);

        //upload to aws s3
        $s3 = new awsCli();
        $file_uri = $s3->uploadFile($upload, $folder);
        return $file_uri;
    }

    /**
     * Notification to Admin
     */
    public function admins_notification($post_id, $file_uri)
    {

        $post = get_post($post_id);
        $user = new WP_User($post->post_author);

        $post_title = stripslashes($post->post_title);
        $post_author = stripslashes($user->display_name);
        $post_date = stripslashes($post->post_date);
        //$video_link = wp_get_attachment_url( $attachment_id ); // Full path;

        $headers = array('Content-Type: text/html; charset=UTF-8');
        $message  = '<p><strong>New video awaits review on ' . get_option('blogname') . '</strong></p>';
        $message .= '<p><strong>Post:</strong> ' . $post_title . '</p>';
        $message .= '<p><strong>Video Link:</strong> ' . $file_uri . '</p>';
        $message .= '<p><strong>Author:</strong> ' . $post_author . '</p>';
        $message .= '<p><strong>Date:</strong> ' . $post_date . '</p>';

        foreach (get_field('admins_notification', 'option') as $item) {

            @wp_mail($item['admin_notification'], sprintf(__('[%s] New video uploaded'), get_option('blogname')), $message, $headers);
        }
    }

    /**
     * Update File Uploaded
     */
    public function update_file_uploaded($project_id, $file_id, $fileExt)
    {
        try {
            $complete = new ClientURLife;
            $identityId = $complete->identityId;
            $result = $complete->callcURL('PUT', '/projects/' . $project_id . '/files/' . $file_id . '?identityId=' . $identityId, [
                "id" => $file_id,
                "status" => 3,
                "thumbnail" => false,
                "webview" => false,
                "file_ext" => $fileExt
            ]);
            return $result;
        } catch (Exception $e) {
            wp_send_json_error($e->getMessage());
        }
    }


    public function edit_video()
    {

        $result = '';
        $data = [];
        $current_user = wp_get_current_user();

        if (!$_POST['post_id'])
            wp_die('Error creating article');

        $data = array(
            'ID'            => self::clean_input($_POST['post_id']),
            'post_title'    => self::clean_input($_POST['title']),
            'post_content'  => $_POST['content']
        );

        wp_update_post($data);

        update_post_meta($_POST['post_id'], 'transcript', $_POST['content']);

        $result = array(
            'goback'    => '/doctor-platform/videos',
            'message'   => 'Data Saved'
        );

        wp_send_json_success($result);
    }

    /**
     * Delete last video cancel
     */
    public function delete_cancel_video()
    {

        $recent_posts = query_posts([
            'post_type' => 'videos',
            'post_status' => 'pending',
            'author' => get_current_user_id(),
            'order' => 'DESC',
            'orderby' => 'ID',
            'nopaging' => true,
            'posts_per_page' => '1',
        ]);

        while (have_posts()) : the_post();
            wp_delete_attachment(get_the_ID(), true);
            wp_delete_post(get_the_ID(), true);
        endwhile;

        wp_reset_postdata();

        /* foreach($recent_posts as $post) : 
        endforeach; */

        wp_send_json_success('deleted cancel video');
    }

    /**
     * Delete Video
     */
    public function delete_video()
    {

        if ($_POST['status'] == 'delete') {

            wp_delete_post($_POST['post_id'], true);

            wp_send_json_success('Video Deleted');
        }
    }
}

add_action('wp_loaded', array('VideosEdit', 'get_instance'));

add_action('wp_ajax_nopriv_save_video', array('VideosEdit', 'save_video'));

add_action('wp_ajax_save_video', array('VideosEdit', 'save_video'));

add_action('wp_ajax_nopriv_get_tokens', array('VideosEdit', 'get_tokens'));

add_action('wp_ajax_get_tokens', array('VideosEdit', 'get_tokens'));

add_action('wp_ajax_nopriv_edit_video', array('VideosEdit', 'edit_video'));

add_action('wp_ajax_edit_video', array('VideosEdit', 'edit_video'));

add_action('wp_ajax_nopriv_delete_video', array('VideosEdit', 'delete_video'));

add_action('wp_ajax_delete_video', array('VideosEdit', 'delete_video'));

add_action('wp_ajax_nopriv_delete_cancel_video', array('VideosEdit', 'delete_cancel_video'));

add_action('wp_ajax_delete_cancel_video', array('VideosEdit', 'delete_cancel_video'));

add_action('wp_ajax_nopriv_get_projects', array('VideosEdit', 'get_projects'));

add_action('wp_ajax_get_projects', array('VideosEdit', 'get_projects'));

add_action('wp_ajax_nopriv_createFileURLife', array('VideosEdit', 'createFileURLife'));

add_action('wp_ajax_createFileURLife', array('VideosEdit', 'createFileURLife'));

add_action('wp_ajax_nopriv_create_project_sku', array('VideosEdit', 'create_project_sku'));

add_action('wp_ajax_create_project_sku', array('VideosEdit', 'create_project_sku'));
