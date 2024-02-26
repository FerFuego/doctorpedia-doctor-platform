<div class="shadow doctors-shadow d-none" id="js-saved-video" data-redirect="">

    <div class="doctors-add-review-modal modal-new_article d-flex align-items-center">

        <!-- Pre-Publish -->
        <div class="modal-new_article__box d-flex flex-column align-items-center text-center position-relative js-confirm-modal">

            <img src="<?php echo WPBD_URL . 'assets/img/check-gif.gif'; ?>" alt="" class="modal-new_article__box-icon"/>

            <h2 class="modal-new_article__box-title progress-title">Thanks for uploading your video.</h2>

            <p class="progress-copy progress-saved">A Doctorpedia editor will review your content before publishing and be in touch if further action is required.</p>

            <div class="modal-new_article__box-cta-container d-flex justify-content-center">

                <a href="<?php echo esc_url( get_user_blog_data()['link'] ); ?>" class="modal-new_article__box-cta">Go to My Profile</a>
                
                <a href="<?php echo esc_url( home_url( 'doctor-platform' ) ); ?>" class="modal-new_article__box-cta hide-modal">Home</a>

            </div>
        
            <button type="button" onClick="closeVideoModal()" class="close-modal hide-modal position-absolute"> <img src="<?php echo WPBD_URL . 'assets/img/close-modal-black.svg'; ?>" alt=""></button>

        </div>

    </div>

</div>