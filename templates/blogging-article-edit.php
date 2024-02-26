<?php get_header('2021'); ?>

<?php if (!is_user_logged_in()) {
    wp_redirect(home_url('/platform-login'));
    exit;
}?>

<?php the_post();?>

<!-- <div class="background-white"></div> -->

<div class="doctor-dashboard__navbar">

    <?php require 'blogging-navbar.php';?>

</div>

<div class="container-fluid article-edit">

    <div class="doctor-dashboard custom-large-container">

        <div class="doctor-dashboard__wrapper">

            <div class="doctor-dashboard__wrapper__header pt-5">

                <h2><?php echo (isset($_GET['post_id'])) ? 'Edit Article' : 'New Article'; ?></h2>

                <div class="doctor-dashboard__wrapper__header__cta">

                    <a href="#" <?php echo (isset($_GET['post_id']) && get_post_status($_GET['post_id']) == 'publish') ? 'onclick="showArticleDraftModal()"' : 'onclick="FormSubmitArticle( \'draft\' )"'; ?> id="js-draft-article" class="btn-save btn btn-primary">Save Draft</a>

                    <button type="button" onclick="showArticlesModal()" id="js-publish-article" class="btn-save btn btn-secondary">Publish Article</button>

                </div>

            </div>

            <div class="doctor-dashboard__wrapper__body">

                <?php if (isset($_GET['post_id'])) {
                    $data = ArticleEdit::get_article(1, $_GET['post_id']);
                } ?>

                <div id="js-edit-blogging-article"></div>

                <form id="js-edit-blogging-article-form" class="form-editor" enctype="multipart/form-data">

                    <div class="row form-group mb-0">

                        <div class="col-xs-12 col-md-7">

                            <div>

                                <label for="title" class="form-group__title">Title</label>

                                <input type="text" name="title" id="title" value="<?php echo (isset($data)) ? $data['basic']->post_title : ''; ?>">

                            </div>

                            <div>

                                <label for="subtitle" class="form-group__title">Subtitle</label>

                                <input type="text" name="subtitle" id="subtitle" value="<?php echo (isset($data)) ? $data['subtitle'] : ''; ?>">

                            </div>

                        </div>

                        <div class="col-xs-12 col-md-5">

                            <label>Featured Image</label>

                            <!-- Regular -->
                            <div class="featured-image d-flex flex-column justify-content-center align-items-center" id="js-featured-image-article" style="background-image: url(<?php echo (isset($data)) ? $data['thumbnail'] : ''; ?>);">

                                <img src="<?php echo plugin_dir_url(dirname(__FILE__)) . 'assets/img/upload-img.png'; ?>" alt="" class="featured-image__icon">

                                <label for="js-featured-image" id="js-choose-image">

                                    <button type="button" onClick="openArticlesImg()" class="featured-image__upload featured-image__btn">Choose an Image</button>

                                </label>

                                <input type="hidden" name="featuredImage" id="featuredImage">

                            </div>

                            <!-- Doctorpedia will choose -->
                            <div class="featured-image d-none flex-column justify-content-center align-items-center" id="js-doctorpedia-choose" style="background-image: url(<?php echo (isset($data)) ? $data['thumbnail'] : ''; ?>);">

                                <img src="<?php echo plugin_dir_url(dirname(__FILE__)) . 'assets/img/dp-logo-article.jpg'; ?>" alt="" class="featured-image__icon">

                                <label for="js-featured-image mb-0">

                                    <button type="button" class="featured-image__choose featured-image__btn featured-image__teal" onClick="chooseAnImage()">Choose an Image</button>

                                </label>

                            </div>

                        </div>

                    </div>

                    <div class="form-group mt-0">

                        <div class="d-flex justify-content-between mb-3 form-group--mtop">

                            <label for="edit" class="form-group__title">Content

                                <span class="ml-2 hidden-xs">* The maximum image size is 1MB</span>

                            </label>

                            <?php if (isset($_GET['post_id'])): ?>

                                <a href="<?php echo '../preview/?post=' . $_GET['post_id'] . '&preview=true&pt=article'; ?>" class="form-group__cta">Preview Article</a>

                            <?php else: ?>

                                <a
                                    href="javascript:;"
                                    class="form-group__cta"
                                    id="js-cta-post-preview"
                                    onclick="FormSubmitArticle('draft', 'preview')"
                                >
                                    Preview Article
                                </a>

                            <?php endif;?>

                        </div>

                        <!-- Include stylesheet -->
                        <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
                        <!-- Create the toolbar container -->
                        <div id="toolbar"></div>
                        <!-- Create the editor container -->
                        <div id="editor" class="editor">
                            <?php echo (isset($data)) ? $data['basic']->post_content : ''; ?>
                        </div>

                        <!-- Include the Quill library -->
                        <script src="//cdn.quilljs.com/1.3.6/quill.js"></script>

                        <!-- Initialize Quill editor -->
                        <script>
                            var toolbarOptions = [
                                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                                ['blockquote'],
                                [{ 'align': [] }],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                ['image', 'link']
                                //[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                                //['link']
                                //[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                                //[{ 'font': [] }],
                                //['blockquote', 'code-block'],
                                //[{ 'header': 1 }, { 'header': 2 }],               // custom button values
                                //[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                                //[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                                //[{ 'direction': 'rtl' }],                         // text direction
                                //['clean']     // remove formatting button
                            ];
                            var quill = new Quill('#editor', {
                                modules: {
                                    toolbar: toolbarOptions
                                },
                                placeholder: 'Start sharing your expertise with the world...',
                                theme: 'snow'
                            });
                        </script>

                        <script>
                            var images = document.querySelectorAll(".editor img");
                            for (var i = 0; i < images.length; i++) {
                                var image = images[i];
                                var src = image.getAttribute('src');
                                var new_src = 'data:' + src;
                                image.setAttribute('src', new_src);
                            }
                        </script>

                    </div>

                    <input type="hidden" name="post_id"  id="post_id" value="<?php echo (isset($_GET['post_id'])) ? $_GET['post_id'] : ''; ?>">

                    <input type="hidden" name="blog_id"  id="blog_id" value="1">

                    <label for="feature"><input type="checkbox" name="feature" id="feature" value="yes" <?php echo ( isset($data['feature']) ) ? 'checked' : ''; ?> > Feature this Article on your profile</label>

                </form>

                <div class="doctor-dashboard__wrapper__header__cta doctor-dashboard__wrapper__footer-cta-container d-flex  <?php echo (wp_is_mobile())? 'justify-content-center':'justify-content-end';?>">

                    <a href="#" <?php echo (isset($_GET['post_id']) && get_post_status($_GET['post_id']) == 'publish') ? 'onclick="showArticleDraftModal()"' : 'onclick="FormSubmitArticle( \'draft\' )"'; ?> id="js-draft-article" class="btn btn-primary">Save Draft</a>

                    <button type="button" onclick="showArticlesModal()" id="js-publish-article" class="btn btn-secondary">Publish Article</button>

                </div>

            </div>

        </div>

    </div>

</div>

<?php require_once __DIR__ . '/parts/modal-articles_img.php';?>

<?php require_once __DIR__ . '/parts/modal-new_article.php';?>

<?php require_once __DIR__ . '/parts/modal-new_article_pending.php';?>

<?php require_once __DIR__ . '/parts/modal-publish_to_draft_article.php';?>

<?php require_once __DIR__ . '/parts/modal-draft-article.php';?>

<?php get_footer();?>