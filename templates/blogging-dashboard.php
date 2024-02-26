<?php /* Template Name: Doctors Dashboard */?>

<?php get_header('2021'); ?>

<?php
if (!is_user_logged_in()) {
    wp_redirect(home_url('/platform-login'));
    exit;
} else {
	wp_redirect( get_user_blog_data()['link'] );
    exit;
}
?>

<?php the_post();?>

<!-- <div class="background-white"></div> -->

<div class="doctor-dashboard__navbar">

	<?php require 'blogging-navbar.php';?>

</div>

<div class="doctor-dashboard custom-large-container">

	<div class="doctor-dashboard__wrapper">

		<div class="doctor-dashboard__wrapper__header-principal">

			<h2>Welcome <span>Dr. <?php echo wp_get_current_user()->display_name; ?><span></h2>

			<p>Now thar you've created a profile, you can produce and share content <br>
			including articles, blogs, and app reviews.</p>

		</div>

		<div class="doctor-dashboard__wrapper__body-principal">

			<h2>
				Share Your Expertise

				<span>Easily create and distribute content for your Doctorpedia Profile and across our network of websites.</span>
			</h2>

			<div class="doctor-dashboard__wrapper__body-principal__content">

				<div class="doctor-dashboard__wrapper__body-principal__content__box">

					<div>

						<div class="doctor-dashboard__wrapper__body-principal__content__box__header">

							<img src="<?php echo WPBD_URL . 'assets/img/article-icon.svg'; ?>" class="icon-show" alt="articles">

							<img src="<?php echo WPBD_URL . 'assets/img/article-hover.svg'; ?>" class="icon-hover" alt="articles">

							<h2>Article</h2>

						</div>

						<h3>Share your research with the world by writing an article for Doctorpedia to review and add to relevant websites.</h3>

					</div>

					<a href="<?php echo esc_url(home_url('doctor-platform/article-edit')); ?>">Post An Article</a>

				</div>

				<div class="doctor-dashboard__wrapper__body-principal__content__box">

					<div>

						<div class="doctor-dashboard__wrapper__body-principal__content__box__header">

							<img src="<?php echo WPBD_URL . 'assets/img/blog-icon.svg'; ?>" class="icon-show" alt="blog">

							<img src="<?php echo WPBD_URL . 'assets/img/blog-hover.svg'; ?>" class="icon-hover" alt="blog">

							<h2>Blog</h2>

						</div>

						<h3>Share your personal and professional experiences with your patients.</h3>

					</div>

					<a href="<?php echo esc_url(home_url('doctor-platform/blog-edit')); ?>">Share A Blog</a>

				</div>

				<div class="doctor-dashboard__wrapper__body-principal__content__box">

					<div>

						<div class="doctor-dashboard__wrapper__body-principal__content__box__header">

							<div class="d-flex f-row">

								<img src="<?php echo WPBD_URL . 'assets/img/review-icon.svg'; ?>" class="icon-show" alt="app reviews">

								<img src="<?php echo WPBD_URL . 'assets/img/review-hover.svg'; ?>" class="icon-hover" alt="app reviews">

							</div>

							<h2>App Review</h2>

						</div>

						<h3>Review and rate the latest mobile apps by condition or topic.</h3>

					</div>

					<a href="<?php echo esc_url(home_url('doctor-platform/app-reviews')); ?>">Review An App</a>

				</div>

			</div>

		</div>

	</div>

</div>

<?php get_footer();?>