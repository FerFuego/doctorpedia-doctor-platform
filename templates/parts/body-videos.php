<?php $rand_id = rand(); ?>

<div class="blog-post-preview blogging-video-item video-box-container" id="post_id" data-id="<?php the_ID(); ?>">

    <div class="trim trim-video">

    <?php if (isset($_GET['status']) && $_GET['status'] == 'pending' && !get_field('show_preview')) : ?>

        <img src="<?php echo WPBD_URL .'assets/img/Placeholder_'. rand(1,3) .'.jpg'; ?>" width="100%" alt="Placeholder Doctorpedia Video">

    <?php else : ?>

        <?php 
            if ( get_field('url_vimeo') ) : 
                $url_video = get_field('url_vimeo');
            else :
                $url_video = ( get_field('video_link_premium') ) ? get_field('video_link_premium') : null;
            endif;
        ?>

        <!-- Video Player -->
        <?php if ( stripos($url_video, 'youtube') || stripos($url_video, 'youtu') ) : 

            echo do_shortcode('[video src="'. $url_video .'"]');

        elseif ( stripos($url_video, 'vimeo') ) : ?>

            <iframe id="iframe_principal" class="video" src=<?php echo "$url_video"; ?> frameborder="0" mozallowfullscreen webkitallowfullscreen allowfullscreen allow="autoplay" width="100%" height="200" controls></iframe>

        <?php else : ?>

            <video width="100%" height="200" controls>
                <source src=<?php echo $url_video; ?> type="video/mp4">
                <source src=<?php echo $url_video; ?> type="video/ogg">
                <source src=<?php echo $url_video; ?> type="video/mov">
                Your browser does not support the video tag.
            </video>

        <?php endif; ?>
        <!-- End Video Player -->

    <?php endif; ?>

        <div class="cta-post">
            <div class="dropdown">
                <span><i class="fa fa-ellipsis-v"></i></span>
                <div class="dropdown-content">
                    <a class="cta-item-article" href="<?php echo esc_url('/doctor-platform/preview-video/?post='.get_the_ID().'&preview=true'); ?>" target="_blank">View Video</a>
                    <a class="cta-item-article" href="<?php echo esc_url( add_query_arg( 'post_id', get_the_ID(), home_url( '/doctor-platform/video-edit') ) ); ?>">Edit Video</a>
                    <a class="cta-item-article" href="javascript:;" onclick="deleteVideo('delete', <?php echo get_the_ID(); ?>)">Delete Video</a>
                </div>
            </div>
        </div>

    </div>

    <div class="content">
        <a 
            href="<?php echo ( isset( $_GET['status']) && $_GET['status'] == 'draft' ) ? esc_url( add_query_arg( 'post_id', get_the_ID(), home_url( '/doctor-platform/video-edit') ) ) : esc_url('/doctor-platform/preview-video/?post='.get_the_ID().'&preview=true'); ?>"
            target="<?php echo ( isset( $_GET['status']) && $_GET['status'] == 'draft' ) ? '' : '_blank';?>" >
            <h2 class="mb-2"><?php the_title(); ?></h2>
        </a>
        <p><?php echo custom_trim_excerpt( null, html_entity_decode(get_field('transcript')), 15 ); ?></p>
    </div>

</div>