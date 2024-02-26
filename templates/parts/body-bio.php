<div class="doctor-dashboard__bio-content d-flex">
    <?php $user_data = get_user_blog_data(); ?>
    <!-- Avatar Column -->
    <div class="doctor-dashboard__bio-avatar-container">

        <div class="doctor-dashboard__bio-avatar" style="background-image: url('<?php echo $user_data['avatar']; ?>')"></div>

        <div class="doctor-dashboard__bio-social d-flex flex-wrap justify-content-center">

            <!-- Social Link 1 -->
            <?php if( $user_data['meta']->facebook[0] ) : ?>
                <a href="<?php echo esc_url( $user_data['meta']->facebook[0]); ?>" class="doctor-dashboard__bio-social-link" target="_blank">
                    <img src="<?php echo IMAGES; ?>/icons/media-icon.svg" alt="" class="doctor-dashboard__bio-social-icon"/>
                </a>
            <?php endif; ?>
            
            <!-- Mail -->
            <a href="mailto:<?php echo $user_data['profile']->user_email; ?>" target="_blank" class="doctor-dashboard__bio-social-link">
                <img src="<?php echo IMAGES; ?>/icons/mail.svg" alt="" class="doctor-dashboard__bio-social-icon"/>
            </a>               

            <!-- Linkedin -->
            <?php if( $user_data['meta']->linkedin[0] ) : ?>
                <a href="<?php echo esc_url( $user_data['meta']->linkedin[0]); ?>" class="doctor-dashboard__bio-social-link" target="_blank">
                    <img src="<?php echo IMAGES; ?>/icons/linkedin-icon.svg" alt="" class="doctor-dashboard__bio-social-icon"/>
                </a>
            <?php endif; ?>
            
            <!-- Twitter -->
            <?php if( $user_data['meta']->twitter[0] ) : ?>
                <a href="<?php echo esc_url( $user_data['meta']->twitter[0]); ?>" class="doctor-dashboard__bio-social-link" target="_blank">
                    <img src="<?php echo IMAGES; ?>/icons/twitter-icon.svg" alt="" class="doctor-dashboard__bio-social-icon"/>
                </a>
            <?php endif; ?>

            <?php //if( $user_data['meta']->instagram[0] ) : ?>
               <!--  <a href="<?php //echo esc_url( $user_data['meta']->instagram[0]); ?>" class="doctor-dashboard__bio-social-link" target="_blank">
                    <img src="<?php //echo IMAGES; ?>/icons/instagram.svg" alt="" class="doctor-dashboard__bio-social-icon"/>
                </a> -->
            <?php //endif; ?>

        </div>

        <div class="doctor-dashboard__bio-public d-flex flex-wrap justify-content-center">
            <a href="<?php echo esc_url( $user_data['link'] ); ?>" class="hover active" target="_blank">View Public Profile</a>
        </div>
    
    </div>

    <!-- Description Column -->
    <div class="doctor-dashboard__bio-description">

        <!-- Doctor Name -->
        <h2 class="doctor-dashboard__bio-description-title"><?php echo $user_data['profile']->first_name .' '. $user_data['profile']->last_name ?></h2>
        
        <!-- Doctor Category -->
        <?php if ( $user_data['acf']['specialty'] ) : ?>

            <?php foreach ( $user_data['acf']['specialty'] as $specialty ) : ?>

                <h3 class="doctor-dashboard__bio-description-subtitle">
                
                    <?php echo $specialty['specialty']; ?>

                    <?php if ( $specialty['subspecialty'] ) : ?>

                        - <?php echo $specialty['subspecialty']; ?>
                        
                    <?php endif; ?>

                </h3>

            <?php endforeach; ?>

        <?php endif; ?>
        
        <!-- Doctor Description -->
        <div class="doctor-dashboard__bio-description-copy">

            <?php if ( $user_data['acf']['biography'] ) : ?>

                <p><?php echo html_entity_decode(nl2br( $user_data['acf']['biography'] )); ?></p>

            <?php else : ?>

                <p>Please, go to <a href="<?php  echo esc_url( home_url( 'doctor-platform/bio-edit' ) ); ?>">Edit profile</a> and complete your profile.</p>

            <?php endif; ?>
            
        </div>

        <div class="doctor-dashboard__bio-education">

            <?php if ( $user_data['acf']['education'] ) : ?>
            
                <h2>Education</h2>
                
                <p><?php echo html_entity_decode(nl2br( $user_data['acf']['education'] )); ?></p>

            <?php endif;?>

        </div>
        
    </div>

</div>