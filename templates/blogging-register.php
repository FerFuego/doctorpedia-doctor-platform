<?php get_header('2021'); ?>

<?php
	if (is_user_logged_in()) {
		wp_redirect( get_user_blog_data()['link'] );
		exit;
	}
?>

	<div class="doctors-register">

		<div class="register_block">

			<h3 class="register_block__title">Already have an account?</h3>

			<p class="register_block__copy">If you have a Doctorpedia account you can login.</p>

			<a href="/platform-login" class="register_block__cta">Login Now</a>

		</div>
		
		<form id="js-blogging-register" class="doctorsform" action="<?php echo admin_url( 'admin-ajax.php' ); ?>" autocomplete="off">

			<div class="body-form">

				<h3>Register</h3>

				<p class="body-form__copy">Doctorpedia is building a community of physician specialists. Once we have confirmed your qualifications, we will email you that your profile is live.</p>
				
				<input type="hidden" name="user_invite_control" id="user_invite_control" value="">

				<div class="form-group d-flex">
                	<input type="text" name="log" id="user_fistname" class="input" placeholder="First Name" autocomplete="off">
					<input type="text" name="log" id="user_lastname" class="input" placeholder="Last Name" autocomplete="off">
				</div>

                <input type="text" name="log" id="user_email" class="input" placeholder="Email" onchange="doctorsVerifyEmail();" autocomplete="off">

				<div class="form-group d-flex">

					<div class="passwordForm">
						<input type="password" name="pwd" id="user_pass" class="input" placeholder="Password" autocomplete="off">
						<i class="fa fa-eye" onclick="showPassword(this, 'user_pass')"></i>
					</div>

					<div class="passwordForm">
						<input type="password" name="re_pwd" id="user_repass" class="input" placeholder="Confirm Password" autocomplete="off">
						<i class="fa fa-eye" onclick="showPassword(this, 'user_repass')"></i>
					</div>

				</div>

				<div class="passwordForm">
					<input type="text" name="how_to" id="how_to" class="input" placeholder="How did you hear about Doctorpedia?" autocomplete="off">
                </div>

				<!-- <div class="passwordForm">
					<input type="text" name="user_npi" id="user_npi" class="input" placeholder="NPI# (If N/A, please provide alternative verification)" autocomplete="off">
                </div> -->

				<!-- <div class="passwordForm">
					<input type="password" name="user_invite" id="user_invite" class="input" placeholder="Invite Code" onchange="doctorsVerifyCode();">
					<i class="fa fa-eye" onclick="showPassword(this, 'user_invite')"></i>
                </div> 
				
				<label for="preregist" class="mb-4">Registration on Doctorpedia requires an invite code, if you don't have one you can <a href="javascript:;" class="register-terms-conditions js-pre-register-modal">Request one using this link</a></label> -->
				
				<label for="terms"><input type="checkbox" name="terms" id="terms" value="accept"> I agree to the <a href="javascript:;" class="register-terms-conditions" onclick="open_modal_terms()">Terms & Conditions</a></label>
				
				<div class="messageform" id="js-register-messageForm"></div>
				
				<input type="submit" name="wp-submit" id="js-register-submit" class="button button-primary" value="Register Now">
	
			</div>
			
		</form>

	</div>

	<?php //get_template_part('template-parts/modules/module','pre-register'); ?>

	<?php require_once( __DIR__ .'/parts/modal-terms&conditions.php' ); ?>
	
<?php get_footer(); ?>