/**
 * Login Platform with Ajax
 */
jQuery( document ).ready( function() {
    jQuery( '#js-blogging-login' ).submit( function ( event ) {

        event.preventDefault();

        if ( $('#user_login').val() == '' ) {
            $("#js-messageForm").html('<p class="text-danger">Please complete Email</p>');
            return;
        }

        if ( $('#user_pass').val() == '' ) {
            $("#js-messageForm").html('<p class="text-danger">Please complete Password</p>');
            return;
        }
                
        var formData = new FormData();
        formData.append('action', 'blogging_login' );
        formData.append('user_login',  $('#user_login').val() );
        formData.append('user_pass', $('#user_pass').val() );
        formData.append('security', $('#security').val() );
        formData.append('_wp_http_referer', $('input[name="_wp_http_referer"]').val() );

        jQuery.ajax({

            cache: false,
            url: $( '#js-blogging-login' ).attr( 'action' ),
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function () {
                $("#js-messageForm").fadeIn('fast');
                $("#js-messageForm").html('<p class="text-info">Sending....</p>');
            },
            success: function ( response ) {
                if ( response.data.loggedin == true ) {
                    $("#js-messageForm").html('<p class="text-success">' + response.data.message + '</p>');
                    $("#js-register-submit").addClass('d-none');
                    $(location).attr('href', '../doctor-profile/' + response.data.user_nicename);
                } else {
                    $("#js-messageForm").html('<p class="text-danger">' + response.data.message + '</p>');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                $("#js-messageForm").html('<p class="text-danger">Bad send, please refresh page and try again</p>');
             }
        });
    });
});