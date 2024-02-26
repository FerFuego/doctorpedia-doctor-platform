<div class="shadow doctors-shadow d-none" id="js-error-video-modal">

    <div class="doctors-add-review-modal modal-new_article d-flex align-items-center">

        <!-- Pre-Publish -->
        <div class="modal-new_article__box d-flex flex-column align-items-center text-center position-relative js-confirm-modal">

            <div id="js-uploading-video">

                <img src="<?php echo WPBD_URL . 'assets/img/error_icon.svg'; ?>" alt="" class="modal-new_article__box-icon"/>
    
                <h2 class="modal-new_article__box-title progress-title progress-error-title"><!-- Text from js --></h2>

                <p class="modal-new_article__box-copy progress-copy progress-error-copy"><!-- Text from js --></p>

            </div>

            <div class="modal-new_article__box-cta-container d-flex" id="js-cta-video-uploading">

                <a href="<?php echo esc_url( get_user_blog_data()['link'] ); ?>" class="modal-new_article__box-cta-2 modal-new_article__box-cta-2--white">Go to my Profile</a>

                <button type="button" onClick="$('#js-error-video-modal').addClass('d-none'); $('#featuredImage').click();" for="featuredImage" class="modal-new_article__box-cta-2 modal-new_article__box-cta-2--red hide-modal">Change Video</button>

            </div>

        </div>

    </div>

</div>