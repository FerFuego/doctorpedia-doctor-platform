<?php

class Blog_ForgotPassword {

    private static $instance;

    protected $templates;

    public static function get_instance() {

        if ( null == self::$instance ) {
            self::$instance = new Blog_ForgotPassword();
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
            '../templates/blogging-forgot-password.php' => 'Blogging Forgot Password',
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

        if ( ! isset( $this->templates[get_post_meta( 

            $post->ID, '_wp_page_template', true 

        )] ) ) {

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

        $slug = 'platform-forgot-password';

        $title = 'Platform Forgot Password';

        if ( null == get_page_by_title( $title ) ) {

            $uploader_page = array(
                'comment_status'        => 'closed',
                'ping_status'           => 'closed',
                'post_author'           => $author_id,
                'post_name'             => $slug,
                'post_title'            => $title,
                'post_status'           => 'publish',
                'post_type'             => 'page',
                'page_template'         => '../templates/blogging-forgot-password.php'
            );

            $post_id = wp_insert_post( $uploader_page );

            if ( !$post_id ) {

                wp_die( 'Error creating template page' );

            } else {

                update_post_meta( $post_id, '_wp_page_template', '../templates/blogging-forgot-password.php' );

            }

        } // end check if

    }

    public static function clean_input( $str ) {

        $str = trim($str);
    
        $str = stripslashes($str);
    
        $str = htmlspecialchars($str);
    
        return $str;
    
    }

    public static function verifyUserEmail () {

        if ( $_SERVER["REQUEST_METHOD"] == "POST" ) :

            if ( email_exists( $_POST['user_email'] ) ) {

                try {

                    $user_email = self::clean_input( $_POST['user_email'] );
    
                    //Search user by email
                    $user = get_user_by( 'email', $user_email );

                    if (!$user || !$user->ID) {
                        wp_send_json_error( "User not found");
                    }

                    //Generate temp password
                    $password = wp_generate_password( 8, false );

                    //Set temp password
                    wp_set_password( $password, $user->ID);

                    $userdata = [
                        'user_email' => $user_email,
                        'user_pass'  => $password
                    ];
                                
                    $info = self::sendNotification( $userdata );
    
                    wp_send_json_success ( $info . "<br> <a href='/platform-login'>Log In</a>" );

                } catch ( Exception $e ) {
                    
                    wp_send_json_error( 'Exception captured: ',  $e->getMessage(), "\n" );

                }

            } else {

                wp_send_json_error( "Email doesn't exist");

            }
        
        else :

            wp_send_json_error( 'Ups! something went wrong, please try again.' );
            
        endif;

    }

    /**
     * Send Notification Email
     */
    public function sendNotification( $userdata ) {

        $to = $userdata['user_email'];

        $subject  = 'Password Recovery';

        $message  = '<p>Password Recovery</p>';
        $message .= "<p>Here's your data to get on the platform:</p>";
        $message .= '<p>Email: ' . $userdata['user_email'] . '</p>';
        $message .= '<p>Password: ' . $userdata['user_pass'] . '</p>';
        
        $body = self::getHtmlWelcomeMail( $message );

        $headers = array('Content-Type: text/html; charset=UTF-8');

        /* if( @wp_mail( $to, $subject, $body, $headers ) )
            return 'Check your mail account!'; */
        @wp_mail( $to, $subject, $body, $headers );
        
        return 'Check your mail account!';
        //return 'Error sending mail';
    }

    /**
     * Render Email Notification
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

add_action( 'wp_loaded', array( 'Blog_ForgotPassword', 'get_instance' ) );

add_action('wp_ajax_nopriv_verifyUserEmail', array( 'Blog_ForgotPassword', 'verifyUserEmail' ) );

add_action('wp_ajax_verifyUserEmail', array( 'Blog_ForgotPassword', 'verifyUserEmail' ) );