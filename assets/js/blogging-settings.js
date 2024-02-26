function formSettingRequires() {

    if ( $('#user_password').val() == '' ) {
        $("#js-settings-msj").html('<p class="text-danger">Please complete Password</p>');
        return false;
    }

    if ( $('#user_confirm').val() == '' ) {
        $("#js-settings-msj").html('<p class="text-danger">Please Confirm Password</p>');
        return false;
    }

    if ( $('#user_password').val() !== $('#user_confirm').val() ) {
        $("#js-settings-msj").html('<p class="text-danger">Passwords don\'t match</p>');
        return false;
    }

    return true;

}

/**
 * Ajax Update Bio
 */
function FormSettingSubmit () {

    if ( ! formSettingRequires() )
        return;

    var formData = new FormData();

    formData.append( 'action',  'set_password' );

    formData.append( 'user_email',  $( '#user_email').val() );
    
    formData.append( 'user_password',  $( '#user_password').val() );

    jQuery.ajax({

        cache: false,

        url: bb_vars.ajaxurl,

        type: 'POST',

        data: formData,

        contentType: false,

        processData: false,

        beforeSend: function () {

            /* $( '#js-settings-msj' ).html( '<p class="text-info">Sending...</p>' ); */

            $('.js-save-animation').addClass('loading hiddenBtn').removeClass('done');

        },

        success: function ( response ) {

            $('.js-save-animation').removeClass('loading hiddenBtn').addClass('done');

            if ( response.success ) {
                
                $( '#js-settings-msj' ).html( '<p class="text-success">' + response.data + '</p>' );
                
            } else {
                
                $( '#js-settings-msj' ).html( '<p class="text-danger">' + response.data + '</p>' );

            }

        }

    });

    return false;

}