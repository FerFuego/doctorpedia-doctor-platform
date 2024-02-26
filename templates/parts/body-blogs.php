<div class="blog-post-preview <?php echo (isset($_GET['status'])) ? $_GET['status'] : ''; ?>" id="post_id" data-id="<?php the_ID(); ?>">
    
    <div style="background-image:url(<?php echo get_the_post_thumbnail_url( get_the_ID(), 'medium') ?>);" class="trim">

        <div class="cta-post">

            <div class="dropdown">

                <span><i class="fa fa-ellipsis-v"></i></span>

                <div class="dropdown-content">

                    <?php if ( isset( $_GET['status']) && $_GET['status'] == 'draft' ) : ?>
                    
                        <a class="cta-item-article" href="<?php echo '../preview/?post='. get_the_ID() . '&preview=true'; ?>">View Preview</a>
                        
                        <a class="cta-item-article" onclick="showArticlesModal()">Publish Blog</a>

                    <?php else : ?>

                        <a class="cta-item-article" href="<?php echo the_permalink(); ?>" target="_blank">View Blog</a>
                    
                    <?php endif; ?>

                    <a class="cta-item-article" href="<?php echo esc_url( add_query_arg( 'post_id', get_the_ID(), home_url( '/doctor-platform/blog-edit') ) ); ?>">Edit Blog</a>

                    <a class="cta-item-article" href="#" onclick="deleteArticle('delete', <?php echo get_the_ID(); ?>)">Delete Blog</a>

                </div>

            </div>

        </div>

    </div>

    <div class="content">

        <!-- Author -->
        <div class="content-author-container">

            <div class="post-author" style="background-image:url(<?php echo $avatar; ?>)"></div>

            <div class="content-author-text">
            
                <h4 class="content-author-title"><?php the_author_meta('display_name');?></h4>
                
                <h5 class="content-author-date"><?php  the_time('F j, Y'); ?></h5>

            </div>

        </div>

        <a 
            href="<?php echo ( isset( $_GET['status']) && $_GET['status'] == 'draft' ) ? esc_url( add_query_arg( 'post_id', get_the_ID(), home_url( '/doctor-platform/blog-edit') ) ) : get_the_permalink(); ?>"
            target="<?php echo ( isset( $_GET['status']) && $_GET['status'] == 'draft' ) ? '' : '_blank';?>" 
        >
            
            <h2 class="mb-2"><?php the_title(); ?></h2>

            <?php if ( get_field('subtitle') ) : ?>
            
                <h3><?php echo get_field('subtitle'); ?></h3>

            <?php endif; ?>

        </a>
            
        <p><?php echo custom_trim_excerpt( get_the_ID(), null, 30 ); ?></p>

    </div>

</div>