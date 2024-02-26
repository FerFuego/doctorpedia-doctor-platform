<div class="doctors-appreviewed__head row"> 

    <div class="col-lg-1 doctors-appreviewed__app-img">

        <img class="app-review-module__img" src="<?php echo $image; ?>" alt="<?php echo $category->name; ?>">

    </div>

    <div class="col-lg-8 pl-lg-5 doctors-appreviewed__app-col-right">

        <div class="doctors-appreviewed__title-group d-flex align-items-center">
        
            <h1 class="doctors-appreviewed__app-title"><?php echo $name; ?></h1>

        </div>

        <div class="doctors-appreviewed__app-score d-flex align-items-center">

            <div class="app-review__overall-score mr-2">

                <p><?php echo number_format( $rating['overall_ranking'], 1, '.', ',' ); ?></p>

            </div>

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

        <p class="doctors-appreviewed__total-reviews"></p>
    
    </div>

</div>