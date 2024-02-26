/**
 * Ajax Delete Review
 */
function deleteReview ( status, post_id ) {

    var opcion = confirm("You sure want to delete the review?");

    if (opcion == true) {

        var formData = new FormData();
    
        formData.append( 'action',  'delete_reviews' );
    
        formData.append( 'status',  status );
    
        formData.append(' post_id', post_id );
    
        jQuery.ajax({
    
            cache: false,
    
            url: dd_vars.ajaxurl,
    
            type: 'POST',
    
            data: formData,
    
            contentType: false,
    
            processData: false,
    
            beforeSend: function () {
    
            },
    
            success: function ( response ) {
    
            },
    
            complete: function () {
    
                location.reload();
    
            }
    
        });

    }


    return false;

}

function dynamicSearch ( value ) {

    if ( value.length > 2 ) {

        $('.app-review-module').each( function () {
    
            let string1 = $(this).find('.app-review-module__title').html();
            let string2 = string1.toLowerCase();
            let string3 = string1.toUpperCase();
            let subvalue1 = value.toLowerCase();
            let subvalue2 = value.toUpperCase();

            if ( string1.includes( value ) || string1.includes( subvalue1 ) || string1.includes( subvalue2 ) ) {

                $(this).removeClass('d-none');

            } else if ( string2.includes( value ) || string2.includes( subvalue1 ) || string2.includes( subvalue2 ) ) {

                $(this).removeClass('d-none');

            } else if ( string3.includes( value ) || string3.includes( subvalue1 ) || string3.includes( subvalue2 ) ) {

                $(this).removeClass('d-none');

            } else {

                $(this).addClass('d-none');

            }
            
        });

    } else {

        $('.app-review-module').removeClass('d-none');

    }
}


function dynamicFilter ( value ) {

    if ( value ) {

        $('.app-review-module').each( function () {
    
            let string = $(this).find('.app-review-module__title').attr('data-site');
        
            if ( string.includes( value ) ) {

                $(this).removeClass('d-none');

            } else {

                $(this).addClass('d-none');

            }
            
        });
    }
}

function sortBy () {
    var myArray = $("#js-reorder-apps .app-review-module");
    var count = 0;

    // sort based on timestamp attribute
    myArray.sort(function (a, b) {
    
    // convert to integers from strings
    a = parseInt($(a).attr("data-order"), 10);
    b = parseInt($(b).attr("data-order"), 10);
    count += 2;
    // compare
        if(a > b) {
            return -1;
        } else if(a < b) {
            return 1;
        } else {
            return 0;
        }
    });

    // put sorted results back on page
    $("#js-reorder-apps").html(myArray);
}