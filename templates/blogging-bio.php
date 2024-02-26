<?php get_header('2021'); ?>

<?php if ( ! is_user_logged_in() ) {
	wp_redirect( home_url('/platform-login') ); 
	exit;
} ?>

<?php the_post(); ?>

<!-- <div class="background-white"></div> -->

<div class="doctor-dashboard__navbar">

	<?php require( 'blogging-navbar.php' ); ?>

</div>

<div class="doctor-dashboard custom-large-container">
    
  <div class="doctor-dashboard__wrapper">

      <div class="doctor-dashboard__wrapper__header">

            <!-- Tabs -->
            <?php require plugin_dir_path( __FILE__ ) . '../templates/parts/tabs-bio.php'; ?>

            <a href="<?php echo esc_url( home_url( '/doctor-platform/bio-edit') ); ?>" class="btn btn-primary mr-0">Edit Profile</a>

      </div>

      <div class="doctor-dashboard__wrapper__body">

            <div class="doctor-dashboard__bio d-flex flex-row flex-wrap mt-5" id="js-bios-filters">

                <?php echo Blog_Bio::get_content( $_GET['page'] ); ?>

            </div>
        
      </div>

	</div>

</div>

<?php get_footer(); ?>