<?php
/**
 * Functions Create Js
 * Plugin Blogging Dashboard
 * Version 1.0
 * Author: Wcanvas.com
 * Footer Scripts
*/
add_action( 'wp_footer', 'wpdd_load_plugin_js' );
function wpdd_load_plugin_js() { ?>
    <!-- <script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.min.js"></script> -->
	<script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ) . '../assets/dist/vendor_scripts.1.0.min.js'; ?>"></script>
	<script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ) . '../assets/dist/app_scripts.1.0.min.js'; ?>"></script>
 	<script type='text/javascript'>
	/* <![CDATA[ */
	var dms_vars = {"ajaxurl":"<?php echo bloginfo('url');?>\/wp-admin\/admin-ajax.php"};
	var bms_vars = {"ajaxurl":"<?php echo bloginfo('url');?>\/wp-admin\/admin-ajax.php"};
	var ddb_vars = {"ajaxurl":"<?php echo bloginfo('url');?>\/wp-admin\/admin-ajax.php"};
	var bb_vars  = {"ajaxurl":"<?php echo bloginfo('url');?>\/wp-admin\/admin-ajax.php"};
	var dd_vars  = {"ajaxurl":"<?php echo bloginfo('url');?>\/wp-admin\/admin-ajax.php"};
	var dd_var   = {"ajaxurl":"<?php echo bloginfo('url');?>\/wp-admin\/admin-ajax.php"};
	/* ]]> */
	</script>
<?php }