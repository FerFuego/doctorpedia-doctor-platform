<div class="shadow doctors-shadow d-none" id="js-pending-blog-modal">

    <div class="doctors-add-review-modal modal-new_article d-flex align-items-center">

        <!-- Pre-Publish -->
        <div class="modal-new_article__box d-flex flex-column align-items-center text-center position-relative js-pending-modal">

            <img src="<?php echo WPBD_URL . 'assets/img/check-gif.gif';?>" alt="" class="modal-new_article__box-icon"/>

            <h2 class="modal-new_article__box-title">Your blog has been sent for review</h2>

            <p class="modal-new_article__box-copy">Once the Doctorpedia editorial team reviews and approves your blog, <br>you will see it in the <b>"Published"</b> tab and on your public profile.</p>

            <div class="modal-new_article__box-cta-container d-flex">

                <a href="<?php echo esc_url( home_url( 'doctor-platform/blog-edit/' ) ); ?>" type="button" class="modal-new_article__box-cta hide-modal">Write Another Blog</a>

                <a href="<?php echo get_user_blog_data()['link']; ?>" type="button" class="modal-new_article__box-cta">Back to Profile</a>

            </div>
        
            <button type="button" onClick="closeModal()" class="close-modal hide-modal position-absolute"> <img src="<?php echo IMAGES; ?>/icons/close-modal-black.jpg" alt=""></button>

        </div>

    </div>

</div>