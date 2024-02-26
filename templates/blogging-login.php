<?php get_header('2021'); ?>

<?php
	if (is_user_logged_in()) {
		wp_redirect( get_user_blog_data()['link'] );
		exit;
	}
?>

	<div class="blogging-login d-flex">
		
		<form name="loginform" id="js-blogging-login" class="doctorsform" action="<?php echo admin_url( 'admin-ajax.php' ); ?>">

			<div class="body-form">

				<h3>LOG IN</h3>
				
				<input type="text" name="log" id="user_login" class="input" placeholder="Email">

				<div class="passwordForm">

					<input type="password" name="pwd" id="user_pass" class="input input--password" placeholder="Password">
	
					<i class="fa fa-eye" id="js-actionEye" onclick="showPassword(this, 'user_pass')"></i>

				</div>
				
				<div class="forgot">

					<a href="<?php echo esc_url( home_url('/platform-forgot-password')); ?>">Forgot your password?</a>

				</div>

				<div class="messageform" id="js-messageForm"></div>
				
				<input type="submit" name="wp-submit" id="js-login-submit" class="button button-primary" value="Log In">

				<?php wp_nonce_field( 'ajax-login-nonce', 'security' ); ?>

			</div>
			
		</form>

		<div class="register_block">

			<h3 class="register_block__title">Don't have an account?</h3>

			<p class="register_block__copy">Create your account.<br> Join the largest network of doctor-led health websites.</p>

			<a href="/platform-register" class="register_block__cta">Register Now</a>

		</div>

	</div>

<?php get_footer(); ?>