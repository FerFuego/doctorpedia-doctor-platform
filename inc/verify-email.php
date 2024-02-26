<?php

require_once( $_SERVER['DOCUMENT_ROOT'] . '/wp-load.php' );

require_once( $_SERVER['DOCUMENT_ROOT'] . '/wp-includes/user.php' );

require_once( ABSPATH . 'wp-includes/pluggable.php' );

if ( ! email_exists( clean_input( $_POST['email'] ) ) ) {

    $data = array(
        'message' => '<p class="text-success">Email Available</p>',
        'data' =>'success',
    );

} else {

    $data = array(
        'message' => '<p class="text-danger">There is already an account with that email, please enter a new one.</p>',
        'data' => 'error'
    );

}

echo json_encode($data);
?>