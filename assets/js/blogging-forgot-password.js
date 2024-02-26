/**
 * Verify email
 */
function doctorsForgotVerifyEmail() {

    let email = $('#user_email').val();
  
    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    
    if (emailRegex.test(email)) {

        $("#js-forgot-messageForm").html('');

        $('#user_email').removeClass('styles-danger').addClass('styles-success');

    } else {

        $("#js-forgot-messageForm").html('<p class="text-danger">Email is not correct</p>');

        $('#user_email').removeClass('styles-success').addClass('styles-danger');

        return;

    }

}

/**
 * Ajax
 */
jQuery( document ).ready( function() {

    jQuery( '#js-forgot-password' ).submit( function ( event ) {

        event.preventDefault();

        if ( $('#user_email').val() == '' ) {

            $("#js-forgot-messageForm").html('<p class="text-danger">Please complete Email</p>');

            return;
        }

        var serialize = $( this ).serializeArray();

        var formData = new FormData();

        formData.append('action',  'verifyUserEmail' );

        formData.append('user_email',  serialize[ 0 ].value );
        
        jQuery.ajax({

            cache: false,

            url: $( '#js-forgot-password' ).attr( 'action' ),

            type: 'POST',

            data: formData,

            contentType: false,

            processData: false,

            beforeSend: function () {

                $("#js-forgot-messageForm").fadeIn('fast');

                $("#js-forgot-messageForm").html('<p class="text-info">Sending....</p>');

            },

            success: function ( response ) {

                if ( response.success == true ) {

                    $("#js-forgot-messageForm").html('<p class="text-success">' + response.data + '</p>');

                } else {

                    $("#js-forgot-messageForm").html('<p class="text-danger">' + response.data + '</p>');

                }
                
            }

        });

        return false;

    });

});