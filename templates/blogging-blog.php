<?php get_header('2021'); ?>

<?php if ( ! is_user_logged_in() ) :
	wp_redirect( home_url('/platform-login') ); 
	exit;
endif; ?>

<?php the_post(); ?>

<div class="doctor-dashboard__navbar">

	<?php require( 'blogging-navbar.php' ); ?>

</div>

<div class="doctor-dashboard custom-large-container">
    
    <div class="doctor-dashboard__wrapper  doctor-dashboard__blogs-container">

      <div class="doctor-dashboard__wrapper__header">

        <h2 class="doctor-dashboard__title">
            My Blogs
            <a href="<?php echo esc_url( home_url( '/doctor-platform/blog-edit') ); ?>" class="btn add-btn-plus">Add +</a>
        </h2>

        <div class="doctor-dashboard__wrapper__body__filters">

            <a href="<?php echo esc_url( add_query_arg( 'status', 'publish', $_SERVER['REQUEST_URI'] ) ); ?>" class="filters__items <?php echo ( !isset($_GET['status']) || $_GET['status'] == 'publish') ? 'active' : ''; ?>">Published (<?php echo Blog_Articles::get_cant_posts('blog','publish'); ?>)</a>

            <a href="<?php echo esc_url( add_query_arg( 'status', 'pending', $_SERVER['REQUEST_URI'] ) ); ?>" class="filters__items <?php echo (isset($_GET['status']) && $_GET['status'] == 'pending') ? 'active' : ''; ?>">Pending Approval (<?php echo Blog_Articles::get_cant_posts('blog','pending'); ?>)</a>

            <a href="<?php echo esc_url( add_query_arg( 'status', 'draft', $_SERVER['REQUEST_URI'] ) ); ?>" class="filters__items <?php echo (isset($_GET['status']) && $_GET['status'] == 'draft') ? 'active' : ''; ?>">Drafts (<?php echo Blog_Articles::get_cant_posts('blog','draft'); ?>)</a>

            <div class="ml-3" id="js-msj-article"></div>

        </div>

        <a href="<?php echo esc_url( home_url( '/doctor-platform/blog-edit') ); ?>" class="btn btn-primary mr-0 hidden-xs">Write a Blog</a>

      </div>
		
      <div class="doctor-dashboard__wrapper__body">

            <div class="doctor-dashboard__wrapper__body__articles d-flex flex-row flex-wrap w-100" id="js-articles-filters">

                <?php 
                    $content = ( isset($_GET['status']) ) ? $_GET['status'] : ''; 
                    echo Blog_Articles::get_content( 1, 'blog', $content );
                ?>

            </div>
        
      </div>

	</div>

</div>

<?php require_once( __DIR__ .'/parts/modal-new_blog_link.php' ); ?>

<?php get_footer(); ?>