<?php get_header('2021'); ?>

<?php if ( ! is_user_logged_in() ) {
	wp_redirect( home_url('/platform-login') ); 
	exit;
} ?>

<?php the_post(); ?>

<div class="doctor-dashboard__navbar">

	<?php require( 'blogging-navbar.php' ); ?>

</div>

<div class="doctor-dashboard doctor-dashboard-videos custom-large-container">
    
    <div class="doctor-dashboard__wrapper">

        <div class="doctor-dashboard__wrapper__header">

            <h2 class="doctor-dashboard__title">
                My Videos
                <a href="<?php echo esc_url( home_url( '/doctor-platform/video-edit') ); ?>" class="btn add-btn-plus">Add +</a>
            </h2>

            <div class="doctor-dashboard__wrapper__body__filters">

                <a href="<?php echo esc_url( add_query_arg( 'status', 'publish', $_SERVER['REQUEST_URI'] ) ); ?>" class="filters__items <?php echo ( !isset($_GET['status']) || $_GET['status'] == 'publish') ? 'active' : ''; ?>">Published (<?php echo Videos::get_cant_posts('videos','publish'); ?>)</a>

                <a href="<?php echo esc_url( add_query_arg( 'status', 'pending', $_SERVER['REQUEST_URI'] ) ); ?>" class="filters__items <?php echo (isset($_GET['status']) && $_GET['status'] == 'pending') ? 'active' : ''; ?>">Pending Approval (<?php echo Videos::get_cant_posts('videos','pending'); ?>)</a>

                <div class="ml-3" id="js-msj-article"></div>

            </div>

            <a href="<?php echo esc_url( home_url( '/doctor-platform/video-edit') ); ?>" class="btn btn-primary mr-0 hidden-xs">Upload a Video</a>

        </div>
            
        <div class="doctor-dashboard__wrapper__body">

            <div class="doctor-dashboard__wrapper__body__container">

                <img src="<?php echo WPBD_URL . '/assets/img/video-slider-left.svg'; ?>" class="prev-video">
                
                <div class="doctor-dashboard__wrapper__body__articles doctor-dashboard__wrapper__body__videos mt-4" id="js-articles-filters">
                
                    <?php 
                        $content = ( isset($_GET['status']) ) ? $_GET['status'] : ''; 
                        echo Videos::get_content( 1, 'videos', $content );
                    ?>
                
                </div>
                        
                <img src="<?php echo WPBD_URL . '/assets/img/video-slider-right.svg'; ?>" class="next-video">

            </div>

        </div>

	</div>

</div>

<?php get_footer(); ?>

<script src="//cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js"></script>

<script>   
    $("document").ready(function(){
        var divs = document.getElementsByClassName("blogging-video-item").length;

        if ( divs <= 3 || $(window).width() < 769 ) {
            $('.next-video').remove();
            $('.prev-video').remove();
        }

        if ( divs > 3 || $(window).width() < 769 ) {

            $('.blogging-video-item').addClass('blogging-video-item-slider');

            jQuery("#js-articles-filters").slick({
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 3,
                prevArrow: $(".prev-video"),
                nextArrow: $(".next-video"),
                dots: (divs > 3 || $(window).width() < 769) ? true : false,
                responsive: [
                    {
                        breakpoint: 1930,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                        }
                    },
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        }
                    },
                    {
                        breakpoint: 1025,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        }
                    },
                    {
                        breakpoint: 769,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                        }
                    }
                ]
            });
        }
    });
    
    $(window).on("resize", function() {
        $("#js-articles-filters").not(".slick-initialized").slick("resize");
    });
</script>