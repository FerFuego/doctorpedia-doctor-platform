<div class="shadow doctors-shadow d-none" id="js-save-data-video-modal">

    <div class="doctors-add-review-modal modal-new_article d-flex align-items-center">

        <!-- Pre-Publish -->
        <div class="modal-new_article__box d-flex flex-column align-items-center text-center position-relative js-confirm-modal">

            <div id="js-uploading-video">

                <img src="<?php echo WPBD_URL . 'assets/img/check-gif.gif'; ?>" alt="" class="modal-new_article__box-icon"/>
    
                <h2 class="modal-new_article__box-title">The data was saved correctly!</h2>

            </div>

            <div class="modal-new_article__box-cta-container d-flex" id="js-cta-video-uploading">

                <a href="<?php echo esc_url( get_user_blog_data()['link'] ); ?>" class="modal-new_article__box-cta">Back to Profile</a>

                <button type="button" onClick="$('#js-save-data-video-modal').addClass('d-none');" class="modal-new_article__box-cta hide-modal">Keep Editing</button>

            </div>

        </div>

    </div>

</div>