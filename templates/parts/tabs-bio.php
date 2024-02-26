<div class="doctor-dashboard__wrapper__body__filters">

    <?php if ( is_page('bio-edit') ) : ?>

        <a href="<?php echo esc_url( add_query_arg( 'tab', 'bio', $_SERVER['REQUEST_URI'] ) ); ?>" class="filters__items <?php echo ( !isset($_GET['tab']) || $_GET['tab'] == 'bio') ? 'active' : ''; ?>">Edit Bio</a>

        <a href="<?php echo esc_url( add_query_arg( 'tab', 'settings', $_SERVER['REQUEST_URI'] ) ); ?>" class="filters__items <?php echo (isset($_GET['tab']) && $_GET['tab'] == 'settings') ? 'active' : ''; ?>">Change Password</a>
    
    <?php else : ?>

        <a href="<?php echo esc_url( add_query_arg( 'tab', 'bio', $_SERVER['REQUEST_URI'] ) ); ?>" class="filters__items <?php echo ( !isset($_GET['tab']) || $_GET['tab'] == 'bio') ? 'active' : ''; ?>">My Bio</a>

        <a href="<?php echo esc_url( add_query_arg( 'tab', 'clinic', $_SERVER['REQUEST_URI'] ) ); ?>" class="filters__items <?php echo (isset($_GET['tab']) && $_GET['tab'] == 'clinic') ? 'active' : ''; ?>">My Clinic</a>

        <a href="<?php echo esc_url( add_query_arg( 'tab', 'video', $_SERVER['REQUEST_URI'] ) ); ?>" class="filters__items <?php echo (isset($_GET['tab']) && $_GET['tab'] == 'video') ? 'active' : ''; ?>">Video Presentation</a>

        <a href="<?php echo esc_url( add_query_arg( 'tab', 'plans', $_SERVER['REQUEST_URI'] ) ); ?>" class="filters__items <?php echo (isset($_GET['tab']) && $_GET['tab'] == 'plans') ? 'active' : ''; ?>">Plans</a>

    <?php endif; ?>

</div>