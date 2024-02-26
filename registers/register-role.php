<?php
/**
 * Functions Add Role
 * Plugin Blogging Dashboard
 * Version 1.0
 * Author: Wcanvas.com
 */

add_role( 'blogger', 'Blogger', array( 'read' => true, 'level_1' => true ) );

/* 
 * Use this only one time
 * 
 * 
$blogusers = get_users('role=blogger');
foreach ( $blogusers as $user) {
    $user->add_cap('level_1');
} */