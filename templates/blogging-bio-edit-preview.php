<?php get_header('2021'); ?>

<?php if ( ! is_user_logged_in() ) {
	wp_redirect( home_url('/platform-login') ); 
	exit;
} ?>

<?php the_post(); ?>

<div class="doctor-dashboard custom-large-container">

   <!-- Wrapper -->
    <div class="doctor-dashboard__wrapper doctor-dashboard__editbio pt-5">

        <!-- Header -->
        <div class="doctor-dashboard__wrapper__header custom_complete_header">

            <h2 class="mb-0">

                Let's Get Started

                <div class="custom_complete_header__subtitle mt-3 pb-4">

                    <p>Fill in your information to help us build your public profile.</p>

                    <a href="javascript:;" onclick="activeSkipModal();">Complete this later</a>
                    
                </div>

            </h2>

        </div>

        <!-- Body -->
        <div class="doctor-dashboard__wrapper__body">

            <!-- Bio Edit Content -->
            <div class="doctor-dashboard__bio-edit d-flex flex-row flex-wrap mt-5" id="js-bios-edit-filters">

                <?php 
                    $content = ( isset($_GET['status']) ) ? $_GET['status'] : '';
                    echo Blog_BioEditPreview::get_content( $content ); 
                ?>

            </div>
        
        </div>

    </div>

</div>

<?php if ( $_COOKIE["wp_doctorpedia"] ) : ?>
    <?php require_once( __DIR__ .'/parts/modal-bio-creating.php' ); ?>
    <?php require_once( __DIR__ .'/parts/modal-bio.php' ); ?>
<?php else : ?>
    <?php require_once( __DIR__ .'/parts/modal-bio-save.php' ); ?>
<?php endif; ?>

<?php require_once( __DIR__ .'/parts/modal-skip-bio.php' ); ?>

<?php get_footer(); ?>