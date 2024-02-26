<div class="shadow doctors-shadow d-none" id="js-terms-conditions">

    <div class="doctors-terms-modal d-flex align-items-center">

        <!-- Pre-Publish -->
        <div class="modal-new_article__box d-flex flex-column align-items-center text-center position-relative js-confirm-modal">

            <h2 class="modal-new_article__box-title"><?= bloginfo('title'); ?></h2>

            <h3 class="modal-new_article__box-subtitle"><?= esc_html(get_field('title-modal-terms', 'options')) ?></h3>

            <div class="modal-new_article__box-editdate">Last updated: <?= esc_html(get_field('last_update-terms', 'options')) ?></div>

            <div class="box-text-content text-left">

                <?= get_field('terms_and_condicions', 'options') ?>

            </div>

            <div class="modal-new_article__box-cta-container d-flex justify-content-center">

                <a href="javascript:;" class="modal-new_article__box-cta" onclick="HideTermsModal()">Accept</a>

            </div>

            <button type="button" onclick="closeTermsModalRegister()" class="close-modal hide-modal position-absolute"> <img src="<?php echo WPBD_URL . 'assets/img/close-modal-black.svg'; ?>" alt=""></button>

        </div>

    </div>

</div>