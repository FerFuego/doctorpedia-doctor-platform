<?php get_header('2021'); ?>

<?php if (!is_user_logged_in()) {
    wp_redirect(home_url('/platform-login'));
    exit;
}?>

<?php the_post();?>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.3.0/jquery.form.min.js" integrity="sha384-qlmct0AOBiA2VPZkMY3+2WqkHtIQ9lSdAsAn5RUJD/3vA5MKDgSGcdmIv4ycVxyn" crossorigin="anonymous"></script>
<script src="https://sdk.amazonaws.com/js/aws-sdk-2.224.1.min.js"></script>

<div class="doctor-dashboard__navbar">

    <?php require 'blogging-navbar.php';?>

</div>

<div class="article-edit blogging-video-editor">

    <div class="doctor-dashboard custom-large-container">

        <div class="doctor-dashboard__wrapper">

            <div class="doctor-dashboard__wrapper__header filters-mobile">

                <h2 class="doctor-dashboard__title">Upload Video</h2>

                <div class="doctor-dashboard__wrapper__body__filters">

                    <a href="<?php echo esc_url( add_query_arg( 'status', 'publish', home_url('/doctor-platform/videos/') ) ); ?>" class="filters__items <?php echo ( !isset($_GET['status']) || $_GET['status'] == 'publish') ? 'active' : ''; ?>">Published (<?php echo Videos::get_cant_posts('videos','publish'); ?>)</a>

                    <a href="<?php echo esc_url( add_query_arg( 'status', 'pending', home_url('/doctor-platform/videos/') ) ); ?>" class="filters__items <?php echo (isset($_GET['status']) && $_GET['status'] == 'pending') ? 'active' : ''; ?>">Pending Approval (<?php echo Videos::get_cant_posts('videos','pending'); ?>)</a>

                    <div class="ml-3" id="js-msj-article"></div>

                </div>

            </div>

            <div class="doctor-dashboard__wrapper__body">

                <div class="video-progress-bar-container d-none">
                    <div id="video-progress-bar"></div>
                    <div class="video-progress-bar-status" id="js-video-progress-bar-status"></div>
                </div>

                <div id="js-edit-blogging-video"></div>

                <h2>Upload Video</h2>

                <form id="js-edit-blogging-article-form" class="form-editor" method="post" enctype="multipart/form-data">

                    <input type="hidden" name="method" id="method" value="<?php echo get_field('upload_video_method','option'); ?>">
                    <input type="hidden" name="doctor_method" id="doctor_method" value="<?php echo get_user_blog_data()['acf']['doctor_method']; ?>">

                    <?php if ( isset( $_GET['post_id'] ) ) :

                        $data = VideosEdit::get_content($_GET['post_id']); ?>

                        <input type="hidden" name="post_id" id="post_id" value="<?php echo $_GET['post_id']; ?>">

                    <?php else : 
                        $data = null;
                    endif; ?>

                    <div class="row form-group video-edit-mobile mx-0">

                        <div class="upload-video-transcript-container col-xs-12 col-md-7 pl-0">

                            <div>

                                <label for="title" class="form-group__title">Title</label>

                                <input type="text" name="title" id="title" value="<?php echo ( $data['post'] ) ? $data['post']->post_title : ''; ?>">

                            </div>

                            <div>

                                <div class="d-flex justify-content-between mt-3">

                                    <label for="edit" class="form-group__title">Transcript</label>

                                </div>

                                <!-- Include stylesheet -->
                                <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
                                <!-- Create the toolbar container -->
                                <div id="toolbar"></div>
                                <!-- Create the editor container -->
                                <div id="editor" class="editor">
                                    <?php echo ($data) ? html_entity_decode(nl2br(str_replace('&nbsp;', ' ', $data['transcript'] ))) : ''; ?>
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
                                        placeholder: 'Adding a transcript can help optimize your video...',
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

                        </div>

                        <div class="upload-video-box-container col-xs-12 col-md-5 pr-0">

                            <label><span class="text-muted" id="js-video-required">*The maximum time should be 3 minutes, availables formats .mov and .mp4</span></label>

                            <!-- Regular -->
                            <div class="featured-image d-flex flex-column justify-content-center align-items-center video-box-preview" id="js-featured-image-article">

                                <video class="video-preview d-none" id="js-video-preview" controls>
                                    <source src="<?php echo ( $data ) ? $data['video'] : ''; ?>" type="video/mp4">
                                    <source src="<?php echo ( $data ) ? $data['video'] : ''; ?>" type="video/ogg">
                                    <source src="<?php echo ( $data ) ? $data['video'] : ''; ?>" type="video/mov">
                                    <source src="<?php echo ( $data ) ? $data['video'] : ''; ?>" type="video/quicktime">
                                    Your browser does not support the video tag.
                                </video>

                                <label for="featuredImage" id="js-cta-videos">
                                
                                    <img src="<?php echo WPBD_URL . '/assets/img/upload-video.svg'; ?>" alt="" class="featured-image__icon"><br>

                                    Select a file

                                </label>

                                <input type="file" name="featuredImage" id="featuredImage" class="d-none" onchange="readVideoURL(this);" accept="video/mp4,video/x-m4v,video/*">

                            </div>

                            <div class="d-none flex-row justify-content-center align-items-center mt-3" style="cursor: pointer;" id="js-cta-videos-after">

                                <img src="<?php echo WPBD_URL . '/assets/img/upload-video.svg'; ?>" alt="" class="featured-image__icon mr-3"><br>
                                <label for="featuredImage" style="cursor: pointer;">Select a new file</label>

                            </div>

                        </div>

                    </div>

                </form>

                <div class="doctor-dashboard__wrapper__header__cta doctor-dashboard__wrapper__footer-cta-container d-flex  <?php echo (wp_is_mobile())? 'justify-content-center':'justify-content-end';?> video-edit-mobile">

                    <?php if ( isset($_GET['post_id']) ) : ?>
                        <a href="javascript:;" onclick="FormSaveVideo()" id="" class="btn btn-secondary">Only Edit</a> 
                    <?php endif; ?>

                    <a href="#" onclick="showVideoModal()" id="js-publish-article" class="btn btn-primary">Publish Video</a>

                </div>

            </div>

        </div>

    </div>

</div>

<?php require_once __DIR__ . '/parts/modal-new_video_link.php';?>
<?php require_once __DIR__ . '/parts/modal-new_video_progress_bar.php';?>
<?php require_once __DIR__ . '/parts/modal-new_video_error.php';?>
<?php require_once __DIR__ . '/parts/modal-save_data_video.php';?>
<?php require_once __DIR__ . '/parts/modal-saved-video.php';?>

<?php get_footer();?>