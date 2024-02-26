<div class="doctor-app-reviews__container">

    <div class="doctor-app-reviews__container__header">

        <div class="doctor-app-reviews__container__header__content">

            <h2>My Reviews</h2>

            <div class="doctor-app-reviews__container__header__img mb-5 mt-0 custom-hidden-lg">
                <img src="<?php echo WPBD_URL . '/assets/img/doctor-dashboard-reviews.svg'; ?>" alt="">
            </div>

            <p>Our team has researched and collected various mobile apps that help people manage their health and wellness.
                Search by topic or condition to find any apps that might be relevant to your specialty and review them so your patients know what to trust.</p>

            <a href="#" onclick="showDoctorModal('<?php echo wp_get_current_user()->first_name . ' ' . wp_get_current_user()->last_name; ?>','<?php echo wp_get_current_user()->display_name; ?>', '<?php echo wp_get_current_user()->user_email; ?>')" class="btn btn-primary mt-4 <?php echo (wp_is_mobile())? 'mx-auto':'';?>">Write Your First Review</a>

        </div>

        <div class="doctor-app-reviews__container__header__img no-posts-content-mobile">
            <img src="<?php echo WPBD_URL . '/assets/img/doctor-dashboard-reviews.svg'; ?>" alt="">
        </div>

    </div>

    <div class="doctor-app-reviews__container__search">

        <h2>Apps Directory</h2>

        <div class="doctor-app-reviews__container__search__form">

            <select name="tag_filter" onchange="dynamicFilter(this.value)">

                <option value="">Find Apps By Tags:</option>
                <option disabled></option>
                <option disabled>_____________________________________</option>
                <option value="all">All</option>
                <option disabled>_____________________________________</option>
                <option disabled></option>

                <?php foreach ( get_tags_of_apps() as $tag ) : ?>

                    <option value="<?php echo $tag; ?>"><?php echo $tag; ?></option>

                <?php endforeach; ?>

            </select>

            <input type="text" placeholder="Search App" onkeyup="dynamicSearch(this.value)">

        </div>

    </div>

    <div class="doctor-app-reviews__container__body" id="js-reorder-apps">

        <?php
            $args = array(
                'taxonomy' => 'user-reviews-category',
                'orderby' => 'id',
                'order' => 'DESC',
                'hide_empty' => 0
            );

            $categories = get_categories( $args );

            if( $categories ) :
            
                foreach( $categories as $category ) :

                    $taxonomytype   = $category->taxonomy . '_' . $category->term_id;
                    $appLink        = get_field( 'app_link', $taxonomytype );
                    $image          = get_field( 'image', $taxonomytype );
                    $ratings        = calcGralRating( $category->term_id ); // Return Prom Ratings
                    $overall        = $ratings['rating'];
                    $support        = $ratings['support'];
                    $site_filter    = ['Doctorpedia'];
                    $tags           = ['all'];
                    $app_filter     = get_field( 'wp_tags_app', $taxonomytype );
                    $sites          = get_field( 'wp_multisites', $taxonomytype );

                    if( $app_filter ) {
                        foreach( $app_filter as $app ) {
                            array_push($tags, $app['tag_app'] );
                        }
                    } 

                    
                    ?>

                    <div class="app-review-module mb-3" data-order="<?php echo intval($category->count); ?>">

                        <div class="row app-review-module__app-container">

                            <div class="d-flex justify-content-center align-items-center app-review-module__app-container__app-img mr-3" 
                                 style="background-image: url('<?php echo $image; ?>');"></div>

                            <div class="app-review-module__app-container__app-column-right">

                                <a href="<?php echo get_category_link( $category->term_id ); ?>">

                                    <h2 class="app-review-module__title" data-site="<?php echo implode(',', $tags); ?>"><?php echo $category->name; ?></h2>

                                </a>

                                <div class="app-review-module__stars-group d-flex flex-row align-items-center mb-2">

                                    <div class="app-review-module__stars-inner-group d-flex align-items-center">

                                        <div class="app-review-module__overall-score mr-2">

                                            <p><?php echo number_format( $overall, 1, '.', ',' ); ?></p>

                                        </div>
            
                                        <div class="star-module d-flex flex-row justify-content-center">

                                            <div class="list-stars">

                                                <?php for ($i=1; $i < 6; $i++) { 

                                                    if($i <= $overall){

                                                        echo '<img src="'.IMAGES.'/icons/star-type-1-red.svg" alt="Star">';

                                                    }else{

                                                        echo '<img src="'.IMAGES.'/icons/star-type-1-grey.svg" alt="Star">';

                                                    }

                                                } ?>

                                            </div>

                                        </div>
                                        
                                    </div>
                                    
                                    <a href="<?php echo get_category_link( $category->term_id ); ?>" class="app-review-module__review-link">(<?php echo $category->count; ?> Reviews)</a>
                                
                                </div>

                            </div>

                        </div>

                        <div class="row relative h-100">

                            <p class="app-review-module__app-description">

                                <?php 
                                    $desc = strip_tags( $category->category_description, '<p><a><b><br><strong>');

                                    if ( strlen( $desc ) > 200 ) {

                                        echo Cadena::corta( $desc, 200);

                                    } else {

                                        echo $desc;
                                        
                                    }
                                ?>

                            </p>

                        </div>

                        <div class="row relative">

                            <a href="#" onclick="showAppReviewsModal('<?php echo wp_get_current_user()->first_name . ' ' . wp_get_current_user()->last_name; ?>','<?php echo wp_get_current_user()->display_name; ?>', '<?php echo wp_get_current_user()->user_email; ?>','<?php echo $category->name; ?>','<?php echo get_category_link( $category->term_id ); ?>')" class="app-review-module__app-make-review">Write a Review</a>

                            <a href="<?php echo get_category_link( $category->term_id ); ?>" class="app-review-module__app-view-review">View App</a>

                        </div>

                    </div>

                <?php endforeach;
            
            endif;
        ?>

    </div>

</div>

<script> jQuery(document).ready(function() { sortBy() });; </script>