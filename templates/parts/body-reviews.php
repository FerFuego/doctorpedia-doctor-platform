<div class="container doctors-appreviewed__user-review mt-3 mb-5">

    <div class="cta-post">

        <div class="dropdown">

            <span><i class="fa fa-ellipsis-v"></i></span>

            <div class="dropdown-content">

                <a class="cta-item-article" href="<?php echo get_category_link( $taxonomy->term_id ); ?>" target="_blank">View App</a>

                <!-- <a class="cta-item-article" href="<?php //echo esc_url( add_query_arg( 'post_id', get_the_ID(), home_url( '/doctors-dashboard/edit-article') ) ); ?>">Edit Article</a> -->

                <a class="cta-item-article" href="#" onclick="deleteReview('delete', <?php echo get_the_ID(); ?>)">Delete Review</a>

            </div>

        </div>

    </div>

    <div class="row doctors-appreviewed__group d-flex flex-row justify-content-between">

        <div class="doctors-appreviewed__box-container d-flex justify-content-between <?php echo ( $rows['doctor'] ) ? 'is_doctor' : ''; ?>">
            
            <div class="doctors-appreviewed__box-container__float-doctor">

                <img src="<?php echo IMAGES; ?>/doctor-logo.svg" alt="Doctor Logo">

            </div>
            
            <div class="doctors-appreviewed__box-container__name">

                <h2 class="doctors-appreviewed__box-container__name__user-name"><?php echo ( $rows['private'] ) ? 'Anonymous' : get_the_title(); ?></h2>

                <?php if ( $rows['doctor'] && $rows['specialty'] ) : ?>

                    <p class="doctors-appreviewed__box-container__name__date id_doctor_specialty"><b><?php echo $rows['specialty']; ?></b></p>

                    <p class="doctors-appreviewed__box-container__name__date"><?php echo get_the_date('F j, g:iA '); ?></p>

                <?php else: ?>

                    <p class="doctors-appreviewed__box-container__name__date"><?php echo get_the_date('F j, g:iA '); ?></p>

                    <p class="doctors-appreviewed__box-container__name__date">User since <?php echo get_the_date('Y'); ?></p>

                <?php endif; ?>

            </div>

            <div class="doctors-appreviewed__box-container__overall d-flex flex-column">

                <p class="doctors-appreviewed__box-container__overall__number"><?php echo number_format( $rating['overall_ranking'], 1, '.', ',' ); ?></p>
                
                <div class="doctors-appreviewed__group d-flex flex-row">

                    <div class="list-stars">
                        <?php 
                            for ( $i=1; $i < 6; $i++ ) { 

                                if( $i <= $rating['overall_ranking'] ){

                                    echo '<img src="'.IMAGES.'/icons/star-type-1-red.svg" alt="Star">';

                                }else{

                                    echo '<img src="'.IMAGES.'/icons/star-type-1-grey.svg" alt="Star">';

                                }
                            } 
                        ?>                      
                    </div>

                </div>

                <h3 class="doctors-appreviewed__box-container__overall__text pb-1">Overall App Score</h3>

            </div>

            <div class="doctors-appreviewed__box-container__scores-group order-lg-2 order-1">

                <div class="doctors-appreviewed__rating-box-group">

                    <div class="doctors-appreviewed__rating-box d-flex flex-row justify-content-between">

                        <p class="doctors-appreviewed__rating-box-title">Ease of Use</p>

                        <div class="doctors-appreviewed__rating-box__group d-flex">

                            <p class="doctors-appreviewed__overall-number"><?php echo ( $rating['ease_use'] ) ? number_format( $rating['ease_use'], 1, '.', ',' ) : '0.0'; ?></p>
                            
                            <div class="list-stars">
                                    <?php 
                                        for ( $i=1; $i < 6; $i++ ) { 

                                            if( $i <= $rating['ease_use'] ){

                                                echo '<img src="'.IMAGES.'/icons/star-type-1-red.svg" alt="Star">';

                                            }else{

                                                echo '<img src="'.IMAGES.'/icons/star-type-1-grey.svg" alt="Star">';

                                            }
                                        } 
                                    ?>
                            </div>   

                        </div>

                    </div>

                    <div class="doctors-appreviewed__rating-box d-flex flex-row justify-content-between">

                        <p class="doctors-appreviewed__rating-box-title">Features</p>

                        <div class="doctors-appreviewed__rating-box__group d-flex">

                            <p class="doctors-appreviewed__overall-number"><?php echo ( $rating['features'] ) ? number_format( $rating['features'], 1, '.', ',' ) : '0.0'; ?></p>
                            
                            <div class="list-stars">
                                    <?php 
                                        for ( $i=1; $i < 6; $i++ ) { 

                                            if( $i <= $rating['features'] ){

                                                echo '<img src="'.IMAGES.'/icons/star-type-1-red.svg" alt="Star">';

                                            }else{

                                                echo '<img src="'.IMAGES.'/icons/star-type-1-grey.svg" alt="Star">';

                                            }

                                        } 
                                    ?>
                            </div>   

                        </div>

                    </div>

                    <div class="doctors-appreviewed__rating-box d-flex flex-row justify-content-between">

                        <p class="doctors-appreviewed__rating-box-title">Value for Money</p>
                        
                        <div class="doctors-appreviewed__rating-box__group d-flex">
                        
                            <p class="doctors-appreviewed__overall-number"><?php echo ( $rating['value_money'] ) ? number_format( $rating['value_money'], 1, '.', ',' ) : '0.0'; ?></p>
                            
                            <div class="list-stars">

                                <?php for ( $i=1; $i < 6; $i++ ) { 

                                        if( $i <= $rating['value_money'] ){

                                            echo '<img src="'.IMAGES.'/icons/star-type-1-red.svg" alt="Star">';

                                        }else{

                                            echo '<img src="'.IMAGES.'/icons/star-type-1-grey.svg" alt="Star">';

                                        }

                                    } 
                                ?>

                            </div>   
                        
                        </div>
                        
                    </div>

                    <div class="doctors-appreviewed__rating-box d-flex flex-row justify-content-between">

                        <p class="doctors-appreviewed__rating-box-title">Customer Support</p>
                        
                        <div class="doctors-appreviewed__rating-box__group d-flex">
                        
                            <p class="doctors-appreviewed__overall-number"><?php echo ( $rating['support'] ) ? number_format( $rating['support'], 1, '.', ',' ) : '0.0'; ?></p>
                            
                            <div class="list-stars">
                                <?php for ( $i=1; $i < 6; $i++ ) { 
                                    if( $i <= $rating['support'] ){
                                        echo '<img src="'.IMAGES.'/icons/star-type-1-red.svg" alt="Star">';
                                    }else{
                                        echo '<img src="'.IMAGES.'/icons/star-type-1-grey.svg" alt="Star">';
                                    }
                                } ?>
                            </div>   
                        
                        </div>
                        
                    </div>

                </div>

            </div>

        </div>

    </div>

    <div class="row doctors-appreviewed__group doctors-appreviewed__commentaries d-flex flex-row justify-content-between <?php echo ( $rows['doctor'] ) ? 'is_doctor_commetaries' : ''; ?>">

        <div class="order-lg-1 order-2">

            <h2 class="doctors-appreviewed__overall-comment-title mb-2">Overall Comment</h2>

            <p class="doctors-appreviewed__overall-comment d-flex flex-column justify-content-between mb-4">

                <?php the_field( 'comment' ); ?>

            </p>

            <button type="button" id="js-show-<?php echo get_the_ID(); ?>" onclick="readMore( <?php echo get_the_ID(); ?> )" class="btn-read-more text-left">Read More...</button>
        </div>

        <!-- READMORE -->
        <div id="js-more-<?php echo get_the_ID(); ?>" class="doctors-appreviewed__read-more order-3 d-none">

            <h2 class="doctors-appreviewed__overall-comment-title mb-2">Pros</h2>

            <p class="doctors-appreviewed__read-more-commentary mb-4">

                <?php the_field( 'pros' ); ?>

            </p>

            <h2 class="doctors-appreviewed__overall-comment-title mb-2">Cons</h2>

            <p class="doctors-appreviewed__read-more-commentary mb-4">

                <?php the_field( 'cons' ); ?>

            </p>

            <button type="button" onclick="readLess( <?php echo get_the_ID(); ?> )" class="btn-read-more">Read Less...</button>

        </div>
        
    </div>

</div>