<?php

require_once( $_SERVER['DOCUMENT_ROOT'] . '/wp-load.php' );

require_once( $_SERVER['DOCUMENT_ROOT'] . '/wp-includes/user.php' );

require_once( ABSPATH . 'wp-includes/pluggable.php' );

$data = array(
    'message' => '<p class="text-danger">Please enter a invite code.</p>',
    'data' => 'error'
);

$inviteCode = clean_input( $_POST['inviteCode'] );

if ( $inviteCode ) {

    $brand = false;

    $codes = get_field('registration_codes', 'option');

    foreach ( $codes as $code ) {

        if ( $inviteCode === $code['code'] ) {
            $brand = true;
        }
    }

    if ( $brand ) {

        $data = array(
            'message' => '',
            'data' =>'success',
        );

    } else {

        $data = array(
            'message' => '<p class="text-danger">The invite code is incorrect, please enter a new one.</p>',
            'data' => 'error'
        );
    }

}

echo json_encode($data);
?>