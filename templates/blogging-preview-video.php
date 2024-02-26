<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package doctorpedia_theme
 */
?>
<?php get_header('2021'); ?>

<?php 
$avatar = get_user_blog_data()['avatar'];

$post = get_post( $_GET['post'] );

$status = get_post_status( $post );

$label = 'Video';

$post_ID = get_the_ID(); ?>

<div class="video-playlist-container container single-videos-container pb-5" >

    <div class="header header-videos">

        <h1 class="title">

            <?php the_title(); ?>

        </h1>

    </div>
   
    <!-- Video Header -->
    <div class="video-module blog-post-page-header">

        <div class="video-wrapper video-wrapper-hub <?php echo (have_rows('call_to_action', 'option')) ? 'video-wrapper-limit-width video-module--state-play' : null; ?>">

            <style>.video{margin-left:auto; margin-right:auto; left:0; right:0;}</style>
            
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

                    <iframe id="iframe_principal" class="video" src=<?php echo "$url_video"; ?> frameborder="0" mozallowfullscreen webkitallowfullscreen allowfullscreen allow="autoplay"></iframe>

                <?php else : ?>

                    <video controls>
                        <source src=<?php echo $url_video; ?> type="video/mp4">
                        <source src=<?php echo $url_video; ?> type="video/ogg">
                        <source src=<?php echo $url_video; ?> type="video/mov">
                        Your browser does not support the video tag.
                    </video>

                <?php endif; ?>
                <!-- End Video Player -->

            <div class="network-share-call-to-action d-none" id="js-share-call-to-action">

                <img class="icon-open"  src="<?php print IMAGES; ?>/icons/share-video.svg" alt="">

            </div>

        </div>

        <?php 
            $post_thumbnail_id = get_post_thumbnail_id($v['video']);

            $url = wp_get_attachment_url( $post_thumbnail_id, 'large' ); 
        ?>

    </div>
    <!-- End Video Header -->
    
    <!-- Video Transcript -->
    <div class="container">
        
        <div id="platform-video-trascript">
            
            <div id="tanscription">
                
                <p><?php echo html_entity_decode(get_field('transcript')); ?></p>
                
            </div>
            
        </div>
        
    </div>
    <!-- End Video Transcript -->

</div>

<div class="vc_row wpb_row vc_row-fluid" style='background-color: #F2F2F2;'>

    <div class="wpb_column vc_column_container vc_col-sm-12">

        <div class="vc_column-inner">

            <div class="wpb_wrapper">

                <div class="wpb_text_column wpb_content_element">

                    <div class="wpb_wrapper">

                        <p style='text-align: center;'>

                            <a href="<?php echo esc_url(home_url('/doctor-platform/videos')); ?>">BACK</a>

                        </p>

                    </div>

                </div>

            </div>

        </div>

    </div>

</div>

<script>
    $('document').ready(function(){
        var i = 0;
        var skip = 5;
        var iframe = document.getElementById('iframe_principal');
        var player = new Vimeo.Player(iframe);
        var playlist = [
           /*  '<?php //echo get_field('dp_video_intro','options'); ?>', */
            '<?php echo get_field('video_link_premium'); ?>'
        ]

        //Show first author (Principal Video)
        $('#author-0').css({"display":"flex"});

        // First play button
        $('.video-module .play-video-btn').click(function(){
            $(this).parent().fadeOut('slow');
            $('platform-video-trascript').fadeIn();
            $(this).parent().siblings('.video-wrapper').children( 'iframe' ).click();
            $('#js-share-call-to-action').removeClass('d-none');
            $('#js-skip-intro').removeClass('d-none');
            setTimeout(function(){ player.play(); }, 1000);
            $('h2').removeClass('d-none');
            $('.video').removeClass('d-none');

            var width = $('#iframe_principal').width();
            $('#js-share-call-to-action').css({'width':width+'px'});
            $('#js-skip-intro').css({'width':width+'px'});

            $('#transcript').click(function(){
                $('#tanscription').slideToggle('fast');
                $('#transcript span').toggleClass('inactive');
            });

            i++;
        });

        //Btn pause
        $('.video-module .close-video-btn').click(function(){
            $('.video-module .play-video-btn').parent().fadeIn('slow');
            $('platform-video-trascript').hide('slow');
            $( this ).parent().siblings( '.video-wrapper-section' ).children( 'iframe' ).click();
            player.pause();
        });

        // open network-share 
        $('#js-share-call-to-action').click( function() {
            $('#js-share-call-to-action').addClass('d-none');
            $('#js-social-media').removeClass('d-none');
            var width = $('#iframe_principal').width();
            var height = $('#iframe_principal').height();
            $('#js-social-media').css({'width':width+'px', 'height':height+'px'});
            player.pause();
        });

        // close network-share
        $('#js-close-share').click( function() {
            $('#js-social-media').addClass('d-none');
            $('#js-share-call-to-action').removeClass('d-none');
            player.play();
        });

        //Skip intro
        $('#js-skip-intro').click( function () {
            //set time in 5 seg to skip intro
            player.setCurrentTime( skip ).then( function (seconds) {
                $('#js-skip-intro').hide('slow');
            });
        });

        $('#js-social-media').click(function(e) {
            if(e.target !== this) {
                return;
            }
            $('#js-social-media').addClass('d-none');
            $('#js-share-call-to-action').removeClass('d-none');
            player.play();
        });

        player.on('play', function() {
            $('#js-social-media').addClass('d-none');
            $('#js-share-call-to-action').removeClass('d-none');
        });

        player.on('pause', function() {
            $('#js-share-call-to-action').addClass('d-none');
            $('#js-social-media').removeClass('d-none');
            var width = $('#iframe_principal').width();
            var height = $('#iframe_principal').height();
            $('#js-social-media').css({'width':width+'px', 'height':height+'px'});
        });

        player.on('progress', function( data ) {
            player.getCurrentTime().then(function(seconds) {
                if( seconds > 5 ) {
                    $('#js-skip-intro').hide('slow');
                }
            });
        });

    });
</script>

<?php get_footer(); ?>