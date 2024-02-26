/**
 * Verify email
 */
function doctorsVerifyEmail() {

    let email = $('#user_email').val();
  
    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    
    if (emailRegex.test(email)) {

        $("#js-register-messageForm").html('');

        $('#user_email').removeClass('styles-danger').addClass('styles-success');

    } else {

        $("#js-register-messageForm").html('<p class="text-danger">Email is not correct</p>');

        $('#user_email').removeClass('styles-success').addClass('styles-danger');

        return;

    }
  
    $.ajax({

        method: "POST",

        url: location.origin + '/wp-content/plugins/blogging-platform/inc/verify-email.php',

        data: {email:email},
  
        beforeSend: function () {

            $("#js-register-messageForm").fadeIn('fast');

            $("#js-register-messageForm").html('<p class="text-info">Checking....</p>');

        },
  
        success:  function (response) {
  
          var obj = JSON.parse(response);
  
          if(obj.data == 'error'){

              $('#user_email').removeClass('styles-success').addClass('styles-danger');

              $('#attach-confirm-email').removeClass('styles-success').addClass('styles-danger');

          }else{

              $('#user_email').removeClass('styles-danger').addClass('styles-success');

              $('#attach-confirm-email').removeClass('styles-danger').addClass('styles-success');

          }
  
          $("#js-register-messageForm").html(obj.message);

        }

    });

}

/**
 * @param String name
 * @return String
 */
 function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
  
/**
 * Ajax
 */
jQuery( document ).ready( function() {

    var userEmail;

    if ( userEmail = getParameterByName('email') ) {
        $('#user_email').val(userEmail);
    }

    jQuery( '#js-blogging-register' ).submit( function ( event ) {

        event.preventDefault();

        if ( $('#user_fistname').val() == '' ) {
            $("#js-register-messageForm").html('<p class="text-danger">Please complete Fist Name</p>');
            return;
        }
        if ( $('#user_lastname').val() == '' ) {
            $("#js-register-messageForm").html('<p class="text-danger">Please complete Last Name</p>');
            return;
        }
        if ( $('#user_email').val() == '' ) {
            $("#js-register-messageForm").html('<p class="text-danger">Please complete Email</p>');
            return;
        }
        if ( $('#user_pass').val() == '' ) {
            $("#js-register-messageForm").html('<p class="text-danger">Please complete Password</p>');
            return;
        }
        if ( $('#user_repass').val() == '' ) {
            $("#js-register-messageForm").html('<p class="text-danger">Please complete Confirm Password</p>');
            return;
        }
        if ( $('#user_repass').val() !== $('#user_pass').val()) {
            $("#js-register-messageForm").html('<p class="text-danger">Passwords don\'t match</p>');
            return;
        }

        var how_to = $('#how_to').val();
        if ( how_to.trim() == '' ) {
            $("#js-register-messageForm").html('<p class="text-danger">Please complete field, How did you hear about Doctorpedia?</p>');
            return;
        }
        
        /*if ( $('#user_npi').val() == '' ) {
            $("#js-register-messageForm").html('<p class="text-danger">Please complete NPI# <br> (If N/A, please provide alternative verification)</p>');
            return;
        }
         if ( $('#user_invite').val() == '' ) {
            $("#js-register-messageForm").html('<p class="text-danger">Please complete Invite Code</p>');
            return;
        } */
       /*  if ( $('#user_invite_control').val() !== 'valid') {
            $("#js-register-messageForm").html('<p class="text-danger">Please enter a valid invitation code</p>');
            return;
        } */
        if ( $('#terms').is(':checked') ) {

        } else {
            $("#js-register-messageForm").html('<p class="text-danger">Please Accept Terms & Conditions</p>');
            return;
        }
                
        var formData = new FormData();

        formData.append('action', 'blogging_Register' );

        formData.append('user_fistname',  $('#user_fistname').val() );

        formData.append('user_lastname', $('#user_lastname').val() );

        formData.append('user_email', $('#user_email').val() );

        formData.append('user_pass', $('#user_pass').val() );

        //formData.append('user_npi', $('#user_npi').val() );

        formData.append('how_to', $('#how_to').val() );

        jQuery.ajax({

            cache: false,

            url: $( '#js-blogging-register' ).attr( 'action' ),

            type: 'POST',

            data: formData,

            contentType: false,

            processData: false,

            beforeSend: function () {

                $("#js-register-messageForm").fadeIn('fast');

                $("#js-register-messageForm").html('<p class="text-info">Sending....</p>');

            },

            success: function ( response ) {

                if ( response.success == true ) {

                    $("#js-register-messageForm").html('<p class="text-success">' + response.data + '</p>');

                    //$("#js-register-submit").addClass('d-none');

                    $(location).attr('href', '/doctor-platform/complete-bio/');

                } else {

                    $("#js-register-messageForm").html('<p class="text-danger">' + response.data + '</p>');

                }

            }

        });

        return false;
    });

});

/**
 * Open modal terms
 */
function open_modal_terms() {
    console.log('OPEN MODAL')
    $('#js-terms-conditions').removeClass('d-none'); 
    $('#js-terms-conditions-form').removeClass('d-none'); 
}

/**
 * Close modal terms
 */
function HideTermsModal() {
    $('#js-terms-conditions').addClass('d-none');
    $('#js-terms-conditions-form').addClass('d-none');
    $('#terms').prop( "checked", true );
    console.log('HIDE');
}

function closeTermsModalRegister() {
    $('#js-terms-conditions').addClass('d-none');
    $('#js-terms-conditions-form').addClass('d-none');
}

/**
 * Verify invite Code
 */
function doctorsVerifyCode() {

    let inviteCode = $('#user_invite').val();
  
    $.ajax({

        method: "POST",

        url: location.origin + '/wp-content/plugins/blogging-platform/inc/verify-invite-code.php',

        data: {inviteCode:inviteCode},
  
        beforeSend: function () {

            $("#js-register-messageForm").fadeIn('fast');

            $("#js-register-messageForm").html('<p class="text-info">Checking....</p>');

        },
  
        success:  function (response) {
  
          var obj = JSON.parse(response);
  
          if(obj.data == 'error'){

              $('#user_invite').removeClass('styles-success').addClass('styles-danger');

              $('#attach-confirm-email').removeClass('styles-success').addClass('styles-danger');

              $('#js-register-submit').attr('disabled', true);

          }else{

              $('#user_invite').removeClass('styles-danger').addClass('styles-success');

              $('#attach-confirm-email').removeClass('styles-danger').addClass('styles-success');

              $('#user_invite_control').val('valid');

              $('#js-register-submit').removeAttr('disabled');

          }
  
          $("#js-register-messageForm").html(obj.message);

        }

    });

}