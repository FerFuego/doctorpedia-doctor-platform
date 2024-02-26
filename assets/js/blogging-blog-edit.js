/**
 * Choose image - CTA
 * 
 */
function letDoctorpediaChoose() {
    
    $('#js-featured-image-article').removeClass('d-flex');
    $('#js-featured-image-article').addClass('d-none');
    $('#js-doctorpedia-choose').removeClass('d-none');
    $('#js-doctorpedia-choose').addClass('d-flex'); 
   

    chooseRandomImage();
}

/**
 * Change Image
 */
function readURL( input ) {

    if ( input.files && input.files[0] ) {

        var reader = new FileReader();

        reader.onload = function(e) {

            $('#js-featured-image-article').css("background-image", "url(" + e.target.result + ")");
            $('#js-choose-image').css({'transform':'translateY(85px)'});

        }

        reader.readAsDataURL(input.files[0]);
        
    }

}

/**
 * Choose image
 * 
 */
function setImageArticle( target ) {

    $('#js-featured-image-article').css("background-image", "url(" + target + ")");

    $('#js-featured-image-article img').css("display", "none");

    $('#js-insert-articles-img-modal').addClass('d-none');

    $('#js-choose-image').css({'transform':'translateY(85px)'});
    $('#js-choose-image button').text('Change image');

    $('#featuredImage').val(target);

}

/**
 * Ajax Choose random image
 */
function chooseRandomImage () {

    var formData = new FormData();

    formData.append( 'action',  'choose_random_image' );

    jQuery.ajax({

        cache: false,

        url: dms_vars.ajaxurl,

        type: 'POST',

        data: formData,

        contentType: false,

        processData: false,

        success: function ( response ) {
            
            setImageArticle( response.data );
        }

    });

    return false;

}

/**
 * Check inputs
 */
function formRequiresArticle( status ) {

    if ( $('#title').val() == '' ) {
        $("#title").attr('placeholder','Please complete Title')
        closeModal()
        return false;
    }

    return true;

}

/**
 * Ajax Insert & Update Article
 */
function FormSubmit ( status, preview = null ) {

    if ( !formRequiresArticle( status ) )
        return;

    var formData = new FormData();

    formData.append( 'action',  'save_blog' );

    formData.append( 'status',  status );

    formData.append( 'post_id', $( '#post_id').val() );
    
    formData.append( 'title',  $( '#title').val() );
    
    formData.append( 'subtitle',  $( '#subtitle').val() );

    formData.append( 'content',  $('.ql-editor').html() );
    
    formData.append( 'blog_id', $( '#blog_id').val() );

    formData.append( 'featuredImage', $('#featuredImage').val() );

    jQuery.ajax({

        cache: false,

        url: dms_vars.ajaxurl,

        type: 'POST',

        data: formData,

        contentType: false,

        processData: false,

        beforeSend: function () {

            $( '#js-edit-blogging-article' ).html( '<p class="text-info">Sending...</p>' );

            if ( status == 'draft') {
                $('#js-draft-article').addClass('loading hiddenBtn').removeClass('done');
            } else {
                $('#js-publish-article').addClass('loading hiddenBtn').removeClass('done');
            }

        },

        success: function ( response ) {

            if ( status == 'draft') {
                $('#js-draft-article').removeClass('loading hiddenBtn').addClass('done');
            } else {
                $('#js-publish-article').removeClass('loading hiddenBtn').addClass('done');
            }
            
            if ( response.success ) {

                if ( preview ) {
                    $('#js-edit-blogging-article').html('<p class="text-info">Refreshing page...</p>');
                    $('#js-draft-modal').addClass('d-none');
                    window.open( window.location.origin + response.data.preview, '_blank' );
                    window.location.replace( response.data.redirect );

                    return false;
                }
                
                if ( response.data.status == 'draft') {
                    
                    $('#js-draft-modal').removeClass('d-none');
                    
                    $('#js-draft-modal').attr('data-redirect', response.data.redirect );

                    $('#js-edit-blogging-article').html('<p class="text-info">Refreshing page...</p>');
                }
                
                if ( response.data.status == 'pending') {
                    
                    $('#js-pending-blog-modal').removeClass('d-none');
                    
                    $('.js-pending-modal').removeClass('d-none');

                    $( '#js-edit-blogging-article' ).html( '<p class="text-success">' + response.data.message + '</p>' );
                    
                }
                
            } else {
                
                $( '#js-edit-blogging-article' ).html( '<p class="text-danger">' + response.message + '</p>' );

            }

        }

    });

    return false;

}

/**
 * Ajax Insert Draft to Preview Article
 */
function FormSubmitPreview () {

    event.preventDefault();

    var formData = new FormData();

    formData.append( 'action',  'preview_article' );

    formData.append(' post_id', $( '#post_id').val() );
    
    formData.append( 'title',  $( '#title').val() );
    
    formData.append( 'subtitle',  $( '#subtitle').val() );

    formData.append( 'content',  $('.ql-editor').html() );
    
    formData.append(' blog_id', $( '#blog_id').val() );

    formData.append('featuredImage', $('#featuredImage').val() );

    jQuery.ajax({

        cache: false,

        url: dms_vars.ajaxurl,

        type: 'POST',

        data: formData,

        contentType: false,

        processData: false,

        beforeSend: function () {

            $( '#js-edit-blogging-article' ).html( '<p class="text-info">Sending...</p>' );

        },

        success: function ( response ) {

            if ( response.success ) {
                
                $( '#js-edit-blogging-article' ).html( '<p class="text-success">Saved Blog</p>' );

                window.open( window.location.origin + '/doctor-platform/preview/?post=' + response.data.p + '&preview=true', '_blank' );
                
            } else {
                
                $( '#js-edit-blogging-article' ).html( '<p class="text-danger">' + response.data + '</p>' );

            }

        }

    });

    return false;

}

/* Ajax Publish Article by Link */
function FormLinkSubmit() {

    var formData = new FormData();

    formData.append( 'action',  'save_link_blog' );

    formData.append( 'status',  'pending' );

    formData.append(' post_id', $('#post_id').attr('data-id') );
    
    jQuery.ajax({

        cache: false,

        url: dms_vars.ajaxurl,

        type: 'POST',

        data: formData,

        contentType: false,

        processData: false,

        beforeSend: function () {

            $( '#js-edit-blogging-article' ).html( '<p class="text-info">Sending...</p>' );

            $('.btn-save').addClass('loading hiddenBtn').removeClass('done');

        },

        success: function ( response ) {

            $('.btn-save').removeClass('loading hiddenBtn').addClass('done');

            if ( response.success ) {

                $( '#js-msj-article' ).html( '<p class="text-success">' + response.data.message + '</p>' );
                
                if ( response.data.status == 'publish') {
                    window.location.replace( response.data.redirect );
                }
                
            } else {
                
                $( '#js-msj-article' ).html( '<p class="text-danger">' + response.message + '</p>' );

            }

        }

    });

    return false;
}


/**
 * Ajax Delete Article
 */
function deleteArticle ( status, post_id ) {

    var opcion = confirm("You sure want to delete the blog?");

    if (opcion == true) {

        var formData = new FormData();
    
        formData.append( 'action',  'delete_article' );
    
        formData.append( 'status',  status );
    
        formData.append(' post_id', post_id );
    
        jQuery.ajax({
    
            cache: false,
    
            url: dms_vars.ajaxurl,
    
            type: 'POST',
    
            data: formData,
    
            contentType: false,
    
            processData: false,
        
            complete: function () {
    
                location.reload();
    
            }
    
        });

    }


    return false;

}

/**
 * Disabled link preview
 */
function deshabilitar( link ){
    event.preventDefault();
    link.style.pointerEvents = 'none';
    link.style.pointerEvents = null;
    link.style.color = '#ccc';
    link.style.borderBottom = '1px solid #ccc';
    jQuery( '#js-cta-post-preview span' ).show()
}

jQuery( document ).ready( function () {
   jQuery('#content_ifr').keyup( function() {
       jQuery('#tinymce').value = document.getElementById('content').value.substring(0,10)
       console.log( jQuery(this).value )
   })
});