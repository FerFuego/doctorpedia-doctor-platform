<div class="custom-large-container d-flex justify-content-between">

    <div class="blogging-navbar">

        <a href="<?php echo esc_url( home_url( 'doctor-platform/my-articles' ) ); ?>" class="<?php  echo ( is_page('my-articles') ) ? 'active' : ''; ?>">My Articles</a>

        <a href="<?php echo esc_url( home_url( 'doctor-platform/my-blogs' ) ); ?>" class="<?php  echo ( is_page('my-blogs') ) ? 'active' : ''; ?>">My Blogs</a>

        <a href="<?php echo esc_url( home_url( 'doctor-platform/app-reviews' ) ); ?>" class="<?php  echo ( is_page('app-reviews') ) ? 'active' : ''; ?>">My Reviews</a>

        <a href="<?php echo esc_url( home_url( 'doctor-platform/videos' ) ); ?>" class="<?php  echo ( is_page('videos') ) ? 'active' : ''; ?>">My Videos</a>

    </div>

    <div class="dropdown-profile">

        <div class="dropdown">

            <span><?php echo wp_get_current_user()->display_name; ?><i class="fa fa-caret-down"></i></span>

            <a href="<?php echo get_user_blog_data()['link']; ?>"><div class="drpicture" style="background-image: url(<?php echo get_avatar_url(get_the_author_meta('ID', wp_get_current_user()->ID), '200'); ?>);"></div></a>

            <div class="dropdown-content">

                <a href="<?php echo esc_url( get_user_blog_data()['link'] ); ?>">My Profile</a>

                <a href="<?php echo esc_url( home_url( 'doctor-platform/bio-edit' ) ); ?>">Edit Profile</a>

                <a href="<?php echo esc_url( home_url( 'doctor-platform/my-articles' ) ); ?>" class="visible-xs hidden-sm hidden-md hidden-lg <?php  echo ( is_page('my-articles') ) ? 'active' : ''; ?>">My Articles</a>

                <a href="<?php echo esc_url( home_url( 'doctor-platform/my-blogs' ) ); ?>" class="visible-xs hidden-sm hidden-md hidden-lg <?php  echo ( is_page('my-blogs') ) ? 'active' : ''; ?>">My Blogs</a>

                <a href="<?php echo esc_url( home_url( 'doctor-platform/app-reviews' ) ); ?>" class="visible-xs hidden-sm hidden-md hidden-lg <?php  echo ( is_page('app-reviews') ) ? 'active' : ''; ?>">My Reviews</a>

                <a href="<?php echo esc_url( home_url( 'doctor-platform/videos' ) ); ?>" class="visible-xs hidden-sm hidden-md hidden-lg <?php  echo ( is_page('videos') ) ? 'active' : ''; ?>">My Videos</a>

                <a href="<?php echo wp_logout_url( esc_url( home_url( '/' ) )); ?>" class="dropdown-profile__logout">Log Out <img src="<?php echo IMAGES .'/public-profile/icon-logout.svg'; ?>" alt="logout"></a>

            </div>

        </div>
        
    </div>
    
</div>