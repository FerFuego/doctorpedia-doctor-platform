<div class="shadow doctors-shadow d-none" id="js-insert-article-modal">

    <div class="doctors-add-review-modal modal-new_article d-flex align-items-center">

        <!-- Pre-Publish -->
        <div class="modal-new_article__box d-flex flex-column align-items-center text-center position-relative js-confirm-modal">

            <img src="<?php echo WPBD_URL . 'assets/img/question-mark.jpg'; ?>" alt="" class="modal-new_article__box-icon"/>

            <h2 class="modal-new_article__box-title">Are you sure you want to publish the Article?</h2>

            <p class="modal-new_article__box-copy">When you click “Publish”, a Doctorpedia editor will review the article before publishing. Is your article ready for review?</p>

            <div class="modal-new_article__box-cta-container d-flex">

                <button type="button" onClick="openArticleVerifiedLinkModal()" class="modal-new_article__box-cta" id="js-open-verified">Publish</button>

                <button type="button" onClick="closeModal()" class="modal-new_article__box-cta hide-modal">Keep Editing</button>

            </div>
        
            <button type="button" onClick="closeModal()" class="close-modal hide-modal position-absolute"> <img src="<?php echo IMAGES; ?>/icons/close-modal-black.jpg" alt=""></button>

        </div>

    </div>

</div>