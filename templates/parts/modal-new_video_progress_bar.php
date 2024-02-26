<div class="shadow doctors-shadow d-none" id="js-progressbar-video-modal">

    <div class="doctors-add-review-modal modal-new_article d-flex align-items-center">

        <!-- Pre-Publish -->
        <div class="modal-new_article__box d-flex flex-column align-items-center text-center position-relative js-confirm-modal">

            <div id="js-uploading-video">
                <h2 class="modal-new_article__box-title progress-title">Please wait until your video is uploaded</h2>
                <p class="modal-new_article__box-copy progress-copy">This might take a few minutes, please do not close this window until the video has been uploaded</p>
            </div>

            <div class="progress-container">
                <div class="d-flex justify-content-between">
                    <p class="progress_label">Uploading...</p>
                    <div class="modal-new_article__box-copy progress-info"><div id="percent">0%</div></div>
                </div>
                <div class="progress" id="progress_div">
                    <div class="bar" id="bar"></div>
                    <!-- <div class="percent" id="percent">0%</div> -->
                </div>
            </div>

            <div class="modal-new_article__box-cta-container d-flex" id="js-cta-video-uploading">
                <button type="hidden" class="modal-new_article__box-cta d-none"></button>
                <button type="button" class="modal-new_article__box-cta hide-modal cancel-upload">Cancel Upload</button>
            </div>

        </div>

    </div>

</div>