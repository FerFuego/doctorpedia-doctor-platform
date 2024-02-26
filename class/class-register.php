<?php

class Blog_Register {

    private static $instance;

    protected $templates;

    public static function get_instance() {

        if ( null == self::$instance ) {
            self::$instance = new Blog_Register();
        } 

        return self::$instance;

    } 

    private function __construct() {

        $this->templates = array();
        
        if ( version_compare( floatval( get_bloginfo( 'version' ) ), '4.7', '<' ) ) {

            add_filter( 'page_attributes_dropdown_pages_args', array( $this, 'register_project_templates' ) );

        } else {
            
            add_filter( 'theme_page_templates', array( $this, 'add_new_template' ) );

        }

        add_filter( 'wp_insert_post_data', array( $this, 'register_project_templates' ) );

        add_filter( 'template_include', array( $this, 'view_project_template') );

        $this->templates = array(
            '../templates/blogging-register.php' => 'Blogging Register',
        );

        $this->make_register_page();
    } 

    public function add_new_template( $posts_templates ) {
        $posts_templates = array_merge( $posts_templates, $this->templates );
        return $posts_templates;
    }

    public function register_project_templates( $atts ) {

        $cache_key = 'page_templates-' . md5( get_theme_root() . '/' . get_stylesheet() );

        $templates = wp_get_theme()->get_page_templates();

        if ( empty( $templates ) ) {
            $templates = array();
        } 

        wp_cache_delete( $cache_key , 'themes');

        $templates = array_merge( $templates, $this->templates );

        wp_cache_add( $cache_key, $templates, 'themes', 1800 );

        return $atts;

    } 

    public function view_project_template( $template ) {
        
        global $post;

        if ( ! $post ) {
            return $template;
        }

        if ( ! isset( $this->templates[ get_post_meta( $post->ID, '_wp_page_template', true ) ] ) ) {
            return $template;
        } 

        $file = plugin_dir_path( __FILE__ ). get_post_meta( 
            $post->ID, '_wp_page_template', true
        );

        if ( file_exists( $file ) ) {
            return $file;
        } else {
            echo $file;
        }

        return $template;
    }

    public function make_register_page() {
        
        $post_id = -1;

        $author_id = 1;

        $slug = 'platform-register';

        $title = 'Platform Register';

        if ( null == get_page_by_title( $title ) && get_current_blog_id() == 1 ) {

            $uploader_page = array(
                'comment_status'        => 'closed',
                'ping_status'           => 'closed',
                'post_author'           => $author_id,
                'post_name'             => $slug,
                'post_title'            => $title,
                'post_status'           => 'publish',
                'post_type'             => 'page',
                'page_template'         => '../templates/blogging-register.php'
            );

            $post_id = wp_insert_post( $uploader_page );

            if ( !$post_id ) {

                wp_die( 'Error creating template page' );

            } else {

                update_post_meta( $post_id, '_wp_page_template', '../templates/blogging-register.php' );

            }

        } // end check if

    }

    public static function clean_input( $str ) {
        $str = trim($str);
        $str = stripslashes($str);
        $str = htmlspecialchars($str);
    
        return $str;
    }

    public static function blogging_Register () {  
        
        if ( $_SERVER["REQUEST_METHOD"] == "POST" ):
            
            if ( ! email_exists( $_POST['user_email'] ) ) {
                
                $how_to = self::clean_input( $_POST['how_to'] );
                $username_tocheck = self::clean_input( $_POST['user_fistname'] );

                $i = 1;

                while ( username_exists( $username_tocheck ) ) {

                    $username_tocheck = self::clean_input( $_POST['user_fistname'] ) . $i++;

                }

                // Create the user
                $userdata = array(
                    'user_login'    => $username_tocheck,
                    'user_pass'     => self::clean_input( $_POST['user_pass'] ),
                    'user_email'    => self::clean_input( $_POST['user_email'] ),
                    'nickname'      => $username_tocheck,
                    'display_name'  => self::clean_input( $_POST['user_fistname'] ) . ' ' . self::clean_input( $_POST['user_lastname'] ),
                    'first_name'    => self::clean_input( $_POST['user_fistname'] ),
                    'last_name'     => self::clean_input( $_POST['user_lastname'] ),
                    'role'          => 'blogger',
                    'user_order'    => 0
                );
                            
                $user_id = wp_insert_user( $userdata );

                // verify errors
                if ( is_wp_error( $user_id ) )
                    wp_send_json_error( 'Ups! something went wrong, please try again.' );

                // set meta values
                add_user_meta( $user_id, 'hide_dd', 'check' ); // hide DD
                update_user_meta( $user_id, 'hide_dd', 'check' ); // hide DD
                add_user_meta( $user_id, 'user_npi', 0 );
                //update_user_meta( $user_id, 'user_npi', $_POST['user_npi'] );

                // set meta counters
                add_user_meta($user_id, 'c_blogs', 0);
                add_user_meta($user_id, 'c_videos', 0);
                add_user_meta($user_id, 'c_reviews', 0);
                add_user_meta($user_id, 'c_articles', 0);
                add_user_meta($user_id, 'c_activity', 0);

                //update user order
                global $wpdb;
                $table = $wpdb->users;
                $where = ['ID' => $user_id];
                $data = ['user_order' => (int) $user_id];
                $wpdb->update( $table, $data, $where, $format = null, $where_format = null );

                
                // send notification
                self::admins_notification( $user_id, $how_to );
                self::sendNotification( $userdata );

                $creds = array(
                    'user_login'    =>  $username_tocheck,
                    'user_password' => self::clean_input( $_POST['user_pass'] ),
                    'remember'      => true
                );

                setcookie('wp_doctorpedia', 'register', (time()+600), "/");
             
                wp_signon( $creds, false ); // Log In
                
                wp_send_json_success ( "Your registration has been successful!</p>" );
            
            } else {

                wp_send_json_error( 'Email already exists, please enter a new one.' );
            }
        
        else :

            wp_send_json_error( 'Ups! something went wrong, please try again.' );
            
        endif;
        
    }


    /**
     * Notification to Admin
     */
    function admins_notification ( $user_id, $how_to ) {

        $user = new WP_User($user_id);
        $user_login = stripslashes($user->user_login);
        $user_email = stripslashes($user->user_email);

        $headers = array('Content-Type: text/html; charset=UTF-8');
        $message  = '<p><strong>New user registered on '.get_option('blogname').'</strong></p>';
        $message .= '<p><strong>Username:</strong> '.$user_login.'</p>';
        $message .= '<p><strong>E-mail:</strong> '.$user_email.'</p>';
        $message .= '<p><strong>How did you hear about Doctorpedia?</strong> '.$how_to.'</p>';

        foreach ( get_field('admins_notification','option') as $item) {
  
            @wp_mail($item['admin_notification'], sprintf(__('[%s] New User Registration'), get_option('blogname')), $message, $headers);

        }

        return true;
    }


    /**
     * Send Notification Email
     */
    public function sendNotification( $userdata ) {
        // Email login details to user
        $to = $userdata['user_email'];

        $subject  = 'Welcome to Doctorpedia!';

        $message ='<p>Welcome to Doctorpedia\'s platform!</p>';
        $message .="<p>You are now registered and can begin updating and uploading content to your innovative profile. <br> To log in to your account, please visit: <a href='https://www.doctorpedia.com/platform-login/'>https://www.doctorpedia.com/platform-login/</a></p>";
        $message .="<p>Once you enter in your username and password, you will be prompted to fill in your information. <br> You can publish articles and blogs, upload videos, review apps, and share your content with your patients,<br> the Doctorpedia community, and the world.</p>";
        
        $body = self::getHtmlWelcomeMail( $message );

        $headers = array('Content-Type: text/html; charset=UTF-8', 'From: Doctorpedia <no-reply@doctorpedia.com>');

        @wp_mail( $to, $subject, $body, $headers );

        return true;
    }

    /**
     * Render Email Notification
     * unused since 12/2020
     */
    public function getHtmlWelcomeMail( $message ) {
        ob_start();
        ?>
        <!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        
            <head>
                <title> </title>
                <!--[if !mso]><!-- -->
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <!--<![endif]-->
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style type="text/css">
                    #outlook a {
                    padding: 0;
                    }
                
                    .ReadMsgBody {
                    width: 100%;
                    }
                
                    .ExternalClass {
                    width: 100%;
                    }
                
                    .ExternalClass * {
                    line-height: 100%;
                    }
                
                    body {
                    margin: 0;
                    padding: 0;
                    -webkit-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                    }
                
                    table,
                    td {
                    border-collapse: collapse;
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    }
                
                    img {
                    border: 0;
                    height: auto;
                    line-height: 100%;
                    outline: none;
                    text-decoration: none;
                    -ms-interpolation-mode: bicubic;
                    }
                
                    p {
                    display: block;
                    margin: 13px 0;
                    }
                </style>
                <!--[if !mso]><!-->
                <style type="text/css">
                    @media only screen and (max-width:480px) {
                    @-ms-viewport {
                        width: 320px;
                    }
                    @viewport {
                        width: 320px;
                    }
                    }
                </style>
                <!--<![endif]-->
                <!--[if mso]>
                        <xml>
                        <o:OfficeDocumentSettings>
                        <o:AllowPNG/>
                        <o:PixelsPerInch>96</o:PixelsPerInch>
                        </o:OfficeDocumentSettings>
                        </xml>
                        <![endif]-->
                <!--[if lte mso 11]>
                        <style type="text/css">
                        .outlook-group-fix { width:100% !important; }
                        </style>
                        <![endif]-->
                <style type="text/css">
                    @media only screen and (min-width:480px) {
                    .mj-column-per-100 {
                        width: 100% !important;
                        max-width: 100%;
                    }
                    }
                </style>
                <style type="text/css">
                    @media only screen and (max-width:480px) {
                    table.full-width-mobile {
                        width: 100% !important;
                    }
                    td.full-width-mobile {
                        width: auto !important;
                    }
                    }
                </style>
            </head>
            
            <body>
                <div style="">
                    <!--[if mso | IE]>
                    <table
                        align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
                    >
                        <tr>
                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                    <div style="Margin:0px auto;max-width:600px;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                        <tbody>
                        <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                            <!--[if mso | IE]>
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                
                        <tr>
                    
                            <td
                            class="" style="vertical-align:top;width:600px;"
                            >
                        <![endif]-->
                            <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                <tr>
                                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                        <tbody>
                                        <tr>
                                            <td style="width:230px;"> <img height="auto" src="https://www.doctorpedia.com/wp-content/uploads/2020/04/Logo.svg" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;" width="100" /> </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                    <p style="border-top:solid 4px #f08d92;font-size:1;margin:0px auto;width:100%;"> </p>
                                    <!--[if mso | IE]>
                        <table
                        align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #f08d92;font-size:1;margin:0px auto;width:550px;" role="presentation" width="550px"
                        >
                        <tr>
                            <td style="height:0;line-height:0;">
                            &nbsp;
                            </td>
                        </tr>
                        </table>
                    <![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                        <div style="font-family:helvetica;font-size:20px;font-weight:300;line-height:1;text-align:left;color:#111111;">
                                            <?php echo $message ?>
                                        </div>
                                    </td>
                                </tr>
                                </table>
                            <!--[if mso | IE]>
                            </td>
                        
                        </tr>
                    
                                </table>
                                <![endif]-->
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                    <!--[if mso | IE]>
                        </td>
                        </tr>
                    </table>
                    <![endif]-->
                </div>
            </body>
        
        </html>
        <?php 
    
        return ob_get_clean(); 
        
    }
    
}

add_action( 'wp_loaded', array( 'Blog_Register', 'get_instance' ) );

add_action('wp_ajax_nopriv_blogging_Register', array( 'Blog_Register', 'blogging_Register' ) );

add_action('wp_ajax_blogging_Register', array( 'Blog_Register', 'blogging_Register' ) );