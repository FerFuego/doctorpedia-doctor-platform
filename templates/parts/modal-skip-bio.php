<div class="shadow doctors-shadow d-none" id="js-bio-modal-skip">

    <div class="doctors-creating-modal modal-new_article d-flex align-items-center">

        <!-- Pre-Publish -->
        <div class="modal-new_article__box d-flex flex-column align-items-center text-center position-relative js-confirm-modal">

            <img src="<?php echo WPBD_URL . 'assets/img/icon-skip-bio.svg'; ?>" class="doctors-creating-modal__loader mb-5"/>

            <h2 class="modal-new_article__box-title">Are you sure you want to skip this step?</h2>

            <p class="modal-new_article__box-copy">The information you have completed so far will not be saved. <br>If you skip this step, you will have to complete it again later.</p>

            <div class="modal-new_article__box-cta-container d-flex mt-0 mb-4">

                <a href="<?php echo esc_url( get_user_blog_data()['link'] ); ?>" class="modal-new_article__box-cta btn-white-red" style="color:#df054e!important; padding:9px 24px;">Skip & Complete Later</a>

                <a href="#" onclick="$('#js-bio-modal-skip').addClass('d-none');" class="modal-new_article__box-cta">Continue</a>

            </div>

        </div>

    </div>

</div>