<?php get_header('2021'); ?>

	<div class="blogging-login">
		
		<form name="forgotPassword" id="js-forgot-password" class="doctorsform" action="<?php echo admin_url( 'admin-ajax.php' ); ?>">

			<div class="body-form">

				<h3>Password Recovery</h3>
				
				<input type="text" name="user_email" id="user_email" class="input" onchange="doctorsForgotVerifyEmail()" placeholder="Email">

				<div class="messageform" id="js-forgot-messageForm"></div>
				
				<input type="submit" name="wp-submit" id="js-forgot-submit" class="button button-primary" value="Get New Password">

			</div>

			<div class="form-footer">

				<p>Please enter your email address. 

                    <br> You will receive a temporary password 

                    <br> to access your account.

                </p>

			</div>
			
		</form>

	</div>

<?php get_footer(); ?>