<div class="shadow doctors-shadow d-none" id="js-draft-article-modal">

    <div class="doctors-add-review-modal modal-new_article d-flex align-items-center">

        <!-- Pre-Publish -->
        <div class="modal-new_article__box d-flex flex-column align-items-center text-center position-relative js-confirm-modal">

            <img src="<?php echo WPBD_URL . 'assets/img/check-gif.gif'; ?>" alt="" class="modal-new_article__box-icon"/>

            <h2 class="modal-new_article__box-title">Move to Draft</h2>

            <p class="modal-new_article__box-copy">By saving this blog as a draft, the blog will no longer be visible for the public. You'll still be able to see, edit and publish it again whenever you are ready. </p>

            <div class="modal-new_article__box-cta-container d-flex">

                <button type="button" onClick="closeModal()" class="modal-new_article__box-cta hide-modal">Cancel</button>

                <button type="button" onClick="openVerifiedDraftModal()" class="modal-new_article__box-cta" id="js-open-verified">Save Draft</button>

            </div>
        
            <button type="button" onClick="closeModal()" class="close-modal hide-modal position-absolute"> <img src="<?php echo IMAGES; ?>/icons/close-modal-black.jpg" alt=""></button>

        </div>

    </div>

</div>