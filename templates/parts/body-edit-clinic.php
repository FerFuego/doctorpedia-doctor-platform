<div class="doctor-dashboard__bio-content body-clinic d-block">
    
    <?php acf_form_head(); ?>

    <?php $options = array(
            'post_id' => 'user_'.get_user_blog_data()['profile']->ID,
            'field_groups' => array('group_5e3311b9c8ae8'),
            'fields' => array('field_5e331232cb4321','field_5e3387665498721','field_5e3387987654321','field_5e3387632cb4321','field_5e338852654321','field_5e33292cb4321'),
            'form' => true, 
            'return' => get_permalink() . '/?page=clinic', 
            'html_before_fields' => '',
            'html_after_fields' => '',
            'submit_value' => 'Save' 
        );
        acf_form( $options );
    ?>

</div>