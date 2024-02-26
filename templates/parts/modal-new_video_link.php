<div class="shadow doctors-shadow d-none" id="js-insert-video-modal">

    <div class="doctors-add-review-modal modal-new_article d-flex align-items-center">

        <!-- Pre-Publish -->
        <div class="modal-new_article__box d-flex flex-column align-items-center text-center position-relative js-confirm-modal">

            <div id="js-uploading-video">

                <img src="<?php echo WPBD_URL . 'assets/img/question-mark.jpg'; ?>" alt="" class="modal-new_article__box-icon"/>
    
                <h2 class="modal-new_article__box-title">Are you sure you want to publish the Video?</h2>

            </div>

            <p class="modal-new_article__box-copy">When you click “Publish”, a Doctorpedia editor will review the video before publishing. Is your video ready for review?</p>

            <div class="modal-new_article__box-cta-container d-flex" id="js-cta-video-uploading">

                <button type="button" onClick="openVerifiedvideoModal()" class="modal-new_article__box-cta" id="js-open-verified">Publish</button>

                <button type="button" onClick="$('#js-insert-video-modal').addClass('d-none');" class="modal-new_article__box-cta hide-modal">Keep Editing</button>

            </div>

        </div>

    </div>

</div>