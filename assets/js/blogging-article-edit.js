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
function FormSubmitArticle ( status, preview = null ) {

    if ( ! formRequiresArticle( status ) )
        return;

    /* var relevantList = [];

    $('.check_relevant').each( function() {

        relevantList.push( $(this).val() );

    });

    var relevantList = relevantList.join(','); */
    
    /* var keywordList = [];
    $('.check_keyword').each( function() {
        keywordList.push( $(this).val() );
    });
    var keywordList = keywordList.join(','); */

    var feature = '';  

    if($('#feature').is(":checked")) {
        feature = $('#feature').val();
    }

    var formData = new FormData();

    formData.append( 'action',  'save_article' );

    formData.append( 'status',  status );

    formData.append( 'post_id', $( '#post_id').val() );
    
    formData.append( 'title',  $( '#title').val() );
    
    formData.append( 'subtitle',  $( '#subtitle').val() );

    formData.append( 'content',  $('.ql-editor').html() );
    
    formData.append( 'blog_id', $( '#blog_id').val() );

    formData.append( 'feature', feature );

    formData.append( 'featuredImage', $('#featuredImage').val() );

    //formData.append( 'relevantList', relevantList );

    //formData.append( 'keywordList', keywordList );

    jQuery.ajax({

        cache: false,

        url: bms_vars.ajaxurl,

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

                    $('#js-pending-article-modal').removeClass('d-none');
                    
                    $('.js-pending-modal').removeClass('d-none');

                    $( '#js-edit-article' ).html( '<p class="text-success">' + response.data.message + '</p>' );

                }
                
            } else {
                
                $( '#js-edit-article' ).html( '<p class="text-danger">' + response.message + '</p>' );

            }

        }

    });

    return false;

}

/**
 * Ajax Insert Draft to Preview Article
 */
function FormSubmitPreviewArticle () {

    event.preventDefault();

    var formData = new FormData();

    formData.append( 'action',  'preview_article' );

    formData.append(' post_id', $( '#post_id').val() );
    
    formData.append( 'title',  $( '#title').val() );
    
    formData.append( 'subtitle',  $( '#subtitle').val() );

    formData.append( 'content',  $('.ql-editor').html() );

    formData.append('featuredImage', $('#featuredImage').val() );

    jQuery.ajax({

        cache: false,

        url: bms_vars.ajaxurl,

        type: 'POST',

        data: formData,

        contentType: false,

        processData: false,

        beforeSend: function () {

            $( '#js-edit-article' ).html( '<p class="text-info">sending...</p>' );

        },

        success: function ( response ) {

            if ( response.success ) {
                
                $( '#js-edit-article' ).html( '<p class="text-success">Saved Article</p>' );   
                             
            } else {
                
                $( '#js-edit-article' ).html( '<p class="text-danger">' + response.data + '</p>' );

            }

        }

    });

    return false;

}


/**
 * Ajax Delete Article
 */
function deleteSingleArticle ( status, post_id ) {

    var opcion = confirm("You sure want to delete the article?");

    if (opcion == true) {

        var formData = new FormData();
    
        formData.append( 'action',  'delete_article' );
    
        formData.append( 'status',  status );
    
        formData.append(' post_id', post_id );
    
        jQuery.ajax({
    
            cache: false,
    
            url: bms_vars.ajaxurl,
    
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
 * Ajax Publish Article by Link 
 */
function FormSingleLinkSubmit () {

    var formData = new FormData();

    formData.append( 'action',  'save_link_article' );

    formData.append( 'status',  'pending' );

    formData.append(' post_id', $('#post_id').attr('data-id') );
    
    jQuery.ajax({

        cache: false,

        url: bms_vars.ajaxurl,

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
                
                if ( response.data.status == 'publish' || response.data.status == 'pending' ) {
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
 * Select Relevant Sites
 */
function selectRelevantSites ( value ) {
    if ( value !== 'none' ) {
        //$("#relevant option:selected").attr('disabled','disabled');
        $('#list_relevant').append( '<li id="' + value + '">' + value + ' <input type="hidden" name="relevantList[]" value="' + value + '" class="check_relevant"><div onclick="deleteItem(\'' + value + '\')"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div> </li>' );
    }
}

/**
 * Add Keyword - select
 */
/* function selectKeyWord ( value ) {
    $('#list_keyword').append( '<li id="' + value + '">' + value + ' <input type="hidden" name="keywordList[]" value="' + value + '" class="check_keyword"><div onclick="deleteItem(' + value + ')"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div> </li>' );
} */

(function($) {
	$.sanitize = function(input) {
        /*
		var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
					 replace(/<[\/\!]*?[^<>]*?>/gi, '').
					 replace(/<style[^>]*?>.*?<\/style>/gi, '').
					 replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
	    return output;
        */
        return input.replace(/<(|\/|[^>\/bi]|\/[^>bi]|[^\/>][^>]+|\/[^>][^>]+)>/g, '');
	};
})(jQuery);

/**
 * Add Keyword - input
 */
function runScript(e) {

    tecla = (document.all) ? e.keyCode : e.which;

    //Tecla de retroceso para borrar, siempre la permite
    if (tecla == 8) {
        return true;
    }

    // Patron de entrada, en este caso solo acepta numeros y letras
    patron = /[A-Za-z0-9\s]/;
    tecla_final = String.fromCharCode(tecla);

    // Verifico que no exista la keyword
    function checkList( value ) {
        var array = [];

        $('#list_keyword li').each(function () {
            array.push( $(this).attr('id') );
        });
        
        if ( ! array.includes( value ) ) {
            array.push( value );
            return true;
        }
        
        return false;
    }

    if (e.keyCode == 13) {
        var value = $.sanitize($('#keyword').val());
        if ( value !== '' ) {
            if ( checkList( value ) ) {
                $('#list_keyword').append( '<li id="' + value + '">' + value + ' <input type="hidden" name="keywordList[]" value="' + value + '" class="check_keyword"><div onclick="deleteItem(\'' + value + '\')"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div> </li>' );
                $('#keyword').val('');
            }
        }
        return false;
    }

    return patron.test(tecla_final);
}

/**
 * Delete Item
 */
function deleteItem (value) {
    $('#' + value ).remove();
    $("#relevant option[value=" + value + "]").removeAttr('disabled');
}