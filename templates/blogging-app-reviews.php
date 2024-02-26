<?php get_header('2021'); ?>

<?php if ( ! is_user_logged_in() ) {
	wp_redirect( home_url('/platform-login') ); 
	exit;
} ?>

<?php the_post(); ?>

<div class="doctor-dashboard__navbar">

	<?php require( 'blogging-navbar.php' ); ?>

</div>

<div class="doctor-dashboard custom-large-container">

    <a href="#" onclick="showDoctorModal('<?php echo wp_get_current_user()->first_name . ' ' . wp_get_current_user()->last_name; ?>','<?php echo wp_get_current_user()->display_name; ?>', '<?php echo wp_get_current_user()->user_email; ?>')" class="btn btn-primary float-btn-plus xs-block hidden-sm hidden-md hidden-lg">+</a>
    
    <div class="doctor-dashboard__wrapper doctor-dashboard__reviews-container">
    
        <div class="doctor-dashboard__wrapper__header">

            <h2 class="doctor-dashboard__title">
                My Reviews
                <a href="#" onclick="showDoctorModal('<?php echo wp_get_current_user()->first_name . ' ' . wp_get_current_user()->last_name; ?>','<?php echo wp_get_current_user()->display_name; ?>', '<?php echo wp_get_current_user()->user_email; ?>')"  class="btn add-btn-plus">Add +</a>
            </h2>

            <div class="doctor-dashboard__wrapper__body__filters">

                <a href="<?php echo esc_url( add_query_arg( 'status', 'all', $_SERVER['REQUEST_URI'] ) ); ?>" class="filters__items <?php echo ( !isset($_GET['status']) || $_GET['status'] == 'all') ? 'active' : ''; ?>">App Directory</a>

                <a href="<?php echo esc_url( add_query_arg( 'status', 'publish', $_SERVER['REQUEST_URI'] ) ); ?>" class="filters__items <?php echo (isset($_GET['status']) && $_GET['status'] == 'publish') ? 'active' : ''; ?>">Published (<?php echo AppReviews::get_cant_posts('user-reviews','publish'); ?>)</a>

                <a href="<?php echo esc_url( add_query_arg( 'status', 'pending', $_SERVER['REQUEST_URI'] ) ); ?>" class="filters__items <?php echo (isset($_GET['status']) && $_GET['status'] == 'pending') ? 'active' : ''; ?>">Pending Approval (<?php echo AppReviews::get_cant_posts('user-reviews','pending'); ?>)</a>

            </div>

            <a href="#" onclick="showDoctorModal('<?php echo wp_get_current_user()->first_name . ' ' . wp_get_current_user()->last_name; ?>','<?php echo wp_get_current_user()->display_name; ?>', '<?php echo wp_get_current_user()->user_email; ?>')" class="btn btn-primary  hidden-xs mr-0">New Review</a>

        </div>
		
        <div class="doctor-dashboard__wrapper__body">

            <div class="doctor-dashboard__wrapper__body__articles doctor-app-reviews d-flex flex-row flex-wrap" id="js-articles-filters">

                <?php 
                    $content = ( isset($_GET['status']) ) ? $_GET['status'] : ''; 

                    echo AppReviews::get_content( 1, 'user-reviews', $content );
                ?>

            </div>
            
        </div>

	</div>

</div>

<!-- START MODAL -->
<?php require_once( __DIR__ .'/parts/modal-reviews.php' ); ?>
<!-- END MODAL -->

<?php get_footer(); ?>