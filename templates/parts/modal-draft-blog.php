<div class="shadow doctors-shadow d-none" id="js-draft-modal" data-redirect="">

    <div class="doctors-add-review-modal modal-new_article d-flex align-items-center">

        <!-- Pre-Publish -->
        <div class="modal-new_article__box d-flex flex-column align-items-center text-center position-relative js-confirm-modal">

            <img src="<?php echo WPBD_URL . 'assets/img/check-gif.gif'; ?>" alt="" class="modal-new_article__box-icon"/>

            <h2 class="modal-new_article__box-title">Your draft has been saved.</h2>

            <p class="modal-new_article__box-copy"></p>

            <div class="modal-new_article__box-cta-container d-flex">

                <a href="<?php echo esc_url( home_url( 'doctor-platform/my-blogs' ) ); ?>" class="modal-new_article__box-cta hide-modal">Back to Blogs</a>

                <button type="button" onClick="closeDraftModal()" class="modal-new_article__box-cta" id="js-open-verified">Keep Editing</button>

            </div>
        
            <button type="button" onClick="closeDraftModal()" class="close-modal hide-modal position-absolute"> <img src="<?php echo IMAGES; ?>/icons/close-modal-black.jpg" alt=""></button>

        </div>

    </div>

</div>