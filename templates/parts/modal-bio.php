<div class="shadow doctors-shadow d-none" id="js-bio-modal-complete">

    <div class="doctors-creating-modal modal-new_article d-flex align-items-center">

        <!-- Pre-Publish -->
        <div class="modal-new_article__box d-flex flex-column align-items-center text-center position-relative js-confirm-modal">

            <img src="<?php echo WPBD_URL . 'assets/img/profile-created.svg'; ?>" class="doctors-creating-modal__complete"/>

            <h2 class="modal-new_article__box-title">Your profile is ready, Dr. <?php echo wp_get_current_user()->last_name; ?>!</h2>

            <div class="modal-new_article__box-cta-container d-flex mt-0">

                <a href="<?php echo esc_url( get_user_blog_data()['link'] ); ?>" class="modal-new_article__box-cta">Go to your profile</a>

            </div>

        </div>

    </div>

</div>