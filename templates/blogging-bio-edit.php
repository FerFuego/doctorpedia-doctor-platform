<?php get_header('2021'); ?>

<?php if ( ! is_user_logged_in() ) {
	wp_redirect( home_url('/platform-login') ); 
	exit;
} ?>

<?php the_post(); ?>

<!-- Navbar -->
<div class="doctor-dashboard__navbar">

	<?php require( 'blogging-navbar.php' ); ?>

</div>

<div class="doctor-dashboard custom-large-container">

   <!-- Wrapper -->
    <div class="doctor-dashboard__wrapper doctor-dashboard__editbio">

        <!-- Header -->
        <div class="doctor-dashboard__wrapper__header">

            <!-- Tabs -->
            <?php require plugin_dir_path( __FILE__ ) . '../templates/parts/tabs-bio.php'; ?>

            <?php if ( is_page('bio-edit') ) : ?>

                <?php if ( isset($_GET['tab']) && $_GET['tab'] == 'clinic' ) : ?>

                    <a id="myBtn" class="acf-button2 btn button btn-primary mr-0 btn-save js-save-animation" name="4" onclick="buttonA_clickHandler(event);">Save</a>
                    
                <?php elseif ( isset($_GET['tab']) && $_GET['tab'] !== 'settings' ) : ?>

                    <button type="button" onclick="FormCompleteBioSubmit()" class="btn btn-primary mr-0 btn-save js-save-animation">Save</button>

                <?php endif; ?>

            <?php else : ?>

                <a href="<?php echo esc_url( home_url( '/doctor-platform/bio-edit') ); ?>" class="btn btn-primary">Edit Profile</a>
            
            <?php endif; ?>

        </div>

        <!-- Body -->
        <div class="doctor-dashboard__wrapper__body">

            <!-- Bio Edit Content -->
            <div class="doctor-dashboard__bio doctor-dashboard__bio-edit d-flex flex-row flex-wrap mt-5" id="js-bios-edit-filters">

                <?php 
                    $content = ( isset($_GET['tab']) ) ? $_GET['tab'] : ''; 
                    
                    echo Blog_BioEdit::get_content( $content );
                ?>

            </div>
        
        </div>

    </div>

</div>

<?php if ( isset( $_COOKIE["wp_doctorpedia"] ) ) : ?>

    <?php require_once( __DIR__ .'/parts/modal-bio-creating.php' ); ?>

    <?php require_once( __DIR__ .'/parts/modal-bio.php' ); ?>

<?php else : ?>

    <?php require_once( __DIR__ .'/parts/modal-bio-save.php' ); ?>

<?php endif; ?>

<?php get_footer(); ?>