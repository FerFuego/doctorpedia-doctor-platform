<?php 
/**
 * Get Tags of Apps
 * @return html
 */
function get_tags_of_apps() {

    $html = [];

	$terms = get_terms( 'user-reviews-category', array( 'hide_empty' => false ) );

	if ( $terms && !is_wp_error( $terms ) ) :
					
        foreach ( $terms as $term ) :

            $term_tags = get_field( 'wp_tags_app', $term->taxonomy . '_' . $term->term_id );
            
			if ( $term_tags ) :

                foreach ( $term_tags as $tag ) :
                    
                    $html[] = $tag['tag_app'];

                endforeach;

			endif;

		endforeach;

	endif;

	asort( $html );

	return array_unique( $html );
}