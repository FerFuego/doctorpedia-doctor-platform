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

$label = ( isset($_GET['pt']) && $_GET['pt'] == 'article' ) ? 'Article' : 'Blog';
?>

<div class="single-blogging-page">

    <div class="doctor-dashboard__navbar">

        <?php require( 'blogging-navbar.php' ); ?>

    </div>

    <div class="doctor-dashboard container">

        <div class="doctor-dashboard__wrapper">

            <div class="doctor-dashboard__wrapper__header">

                <h2>Preview <?php echo $label; ?></h2>

                <div class="doctor-dashboard__wrapper__header__cta">

                    <?php if ( $status !== 'pending' ) : ?>

                        <button type="button" onclick="showArticlesModal()" id="js-publish-article" class="btn-save btn btn-primary">Publish <?php echo $label; ?></button>

                    <?php endif; ?>

                    <?php if ( $label == 'Blog' ) : ?>
                    
                        <a href="<?php echo esc_url( add_query_arg( 'post_id', get_the_ID(), home_url( 'doctor-platform/blog-edit/') ) ); ?>" class="btn btn-secondary">Back to Edit</a>

                    <?php else : ?>

                        <a href="<?php echo esc_url( add_query_arg( 'post_id', get_the_ID(), home_url( 'doctor-platform/article-edit/') ) ); ?>" class="btn btn-secondary">Back to Edit</a>

                    <?php endif; ?>

                </div>

            </div>
                
        </div>

    </div>

    <!-- Blog Post Layout-->
    <div class="blog-post-container single-blog-page single-blogging-page__container" id="post_id" data-id="<?php echo $post->ID; ?>" >

        <div class="container">

            <div class="header mt-5">

                <h1 class="mt-3"><?php echo $post->post_title ?></h1>

                <?php if ( get_field('subtitle') ) : ?>
        
                    <h2 class="pt-4 mt-0"><?php echo get_field('subtitle'); ?></h2>

                <?php endif; ?>

                <div class="details d-flex justify-content-between align-items-center">

                    <div class="author-avatar">
  
                            <img src="<?php echo $avatar; ?>" width="66px" />
                            
                            <span class="author"><?php echo get_user_blog_data()['profile']->first_name .' '. get_user_blog_data()['profile']->last_name ?> </span>

                            <span class="date"><?php the_time('M j, Y') ?></span>

                    </div>

                    <div class="social-media">

                        <?php echo do_shortcode('[easy-social-share]'); ?>

                    </div>

                </div>

            </div>

            <img class="main-post-img" src="<?php echo get_the_post_thumbnail_url( $post->ID ); ?>" >

            <div class="container single-blog-page-content">

                <div class="body">

                    <?php echo $post->post_content; ?>  

                    <script>
                        var images = document.querySelectorAll(".body img");
                        for (var i = 0; i < images.length; i++) {
                            var image = images[i];
                            var src = image.getAttribute('src');
                            var new_src = 'data:' + src;
                            image.setAttribute('src', new_src);
                        }
                        
                        var links = document.querySelectorAll(".body a");
                        for (var x = 0; x < links.length; x++) {
                            var link = links[x];
                            var href = link.getAttribute('href');
                            var n = href.search("http");
                            if ( n == '-1') {
                                var new_href = 'https://' + href;
                                link.setAttribute('href', new_href);
                            }
                        }
                    </script>

                </div>

            </div>

        </div>

    </div>
    <!-- End Blog Post -->

    <div class="container">

        <hr>
        
        <div class="doctor-dashboard__wrapper__header__cta doctor-dashboard__wrapper__footer-cta-container d-flex <?php echo (wp_is_mobile())? 'justify-content-center':'justify-content-end';?> pt-0 pb-5">
            
            <button type="button" onclick="showArticlesModal()" id="js-publish-article" class="btn-save btn btn-primary">Publish <?php echo $label; ?></button>

            <?php if ( $label == 'Blog' ) : ?>
                    
                <a href="<?php echo esc_url( add_query_arg( 'post_id', get_the_ID(), home_url( 'doctor-platform/blog-edit/') ) ); ?>" class="btn btn-secondary">Back to Edit</a>

            <?php else : ?>

                <a href="<?php echo esc_url( add_query_arg( 'post_id', get_the_ID(), home_url( 'doctor-platform/article-edit/') ) ); ?>" class="btn btn-secondary">Back to Edit</a>

            <?php endif; ?>

        </div>

    </div>
    

</div>

<?php if ( $label == 'Blog' ) : 
    
    require_once( __DIR__ .'/parts/modal-new_blog_link.php' );

else : 

    require_once( __DIR__ .'/parts/modal-new_article_link.php' );

endif; ?>    

<?php get_footer(); ?>
