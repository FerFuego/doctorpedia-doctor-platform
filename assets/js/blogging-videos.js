function showVideoModal() {

    if ( $("#featuredImage")[0].files[0] ==  undefined ) {
        $('#js-video-required').addClass('text-danger');
        $('#js-video-required').removeClass('text-muted');
        $('#js-video-required').html('Video is required!');
        $('#js-insert-video-modal').addClass('d-none');
        $('#js-progressbar-video-modal').addClass('d-none');
        $('#js-publish-article').removeClass('done hiddenBtn');
        return false;
    }

    $('#js-video-required').removeClass('text-danger');
    $('#js-insert-video-modal').removeClass('d-none');
}

function openVerifiedvideoModal() {
    $('#js-insert-video-modal').addClass('d-none');
    $('#js-progressbar-video-modal').removeClass('d-none');
    FormSubmitVideo('pending');
}

function readVideoURL( input ){
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#js-video-preview').removeClass('d-none');
            $('#js-video-preview').attr('src', e.target.result);
            $('#js-video-preview source').attr('src', e.target.result);
            $('#js-cta-videos').addClass('d-none');
            $('#js-cta-videos-after').addClass('d-flex').removeClass('d-none');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function closeVideoModal() {
    $('#js-saved-video').addClass('d-none');
    let redirect = $('#js-saved-video').attr('data-redirect');
    window.location.replace( redirect );
}

/**
 * Start Upload Video to S3
 */
function FormSubmitVideo ( status ) {
    
    var bar = $('#bar');
    var $ajaxCall = null;
    var percent = $('#percent');
    var method = $('#method').val();
    var doctor_method = $('#doctor_method').val();
    var fileVideo = $("#featuredImage")[0].files[0];

    /**
     * Cancel Upload
     */
    $(document).on('click','.cancel-upload', function(e){
        $ajaxCall.abort();
        DeleteCancelVideo();
        $('#js-progressbar-video-modal').addClass('d-none');
        $('#js-video-preview').addClass('d-none');
        console.log("Canceled");
    });

    if (method && doctor_method) {
        // urlife Storage
        document.getElementById("progress_div").style.display="block";
        var percentVal = '0%';
        bar.width(percentVal)
        percent.html(percentVal);
    
        getToken(status, fileVideo)

    } else {
        // Local Storage
        var formData = new FormData();
        formData.append( 'action',  'save_video' );
        formData.append( 'status',  status );
        formData.append( 'title',  $( '#title').val() );
        formData.append( 'content',  $('.ql-editor').html() );
        formData.append( 'method',  'local' );
        formData.append( 'featuredImage', $("#featuredImage")[0].files[0] );

        $ajaxCall = jQuery.ajax({
            cache: false,
            url: dms_vars.ajaxurl,
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            xhr: function() {
                
                document.getElementById("progress_div").style.display="block";
                var percentVal = '0%';
                bar.width(percentVal)
                percent.html(percentVal);
                
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);

                        var percentVal = percentComplete + '%';
                            bar.width(percentVal)
                            percent.html(percentVal);
                
                        if (percentComplete === 100) {
                        // do sumething
                        }
                    }
                }, false);
        
            return xhr;
            },
            success: function(response) {
                var percentVal = '100%';
                bar.width(percentVal);
                percent.html(percentVal);
                $('#js-progressbar-video-modal').addClass('d-none');
                $('#js-cta-video-uploading').removeClass('d-none');
                $('#js-video-progress-bar-status').append('<div class="d-flex align-content-center mt-1"><span class="mr-1">Completed</span> <img src="../../wp-content/plugins/blogging-platform/assets/img/video-complete.svg"></div>');
                $('#js-saved-video').removeClass('d-none');
                $('.js-confirm-modal').removeClass('d-none');
                $('.modal-new_article__box-title').html( response.data.message );
                $('#js-saved-video').attr('data-redirect', response.data.goback );
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                $('#js-progressbar-video-modal').addClass('d-none');
                $('#js-error-video-modal').removeClass('d-none');
                $('#js-video-preview').addClass('d-none');
                $('#js-error-video-modal .progress-title').html('Sorry, something went wrong');
                $('#js-error-video-modal .progress-copy').html('Please try again in a moment');
            }
        });
    }
}

/**
 * Get Token API
 */
function getToken (status, fileVideo) {

    var bar = $('#bar');
    var percent = $('#percent');
    var $ajaxCall = null;

    /**
     * Cancel Upload
     */
    $(document).on('click','.cancel-upload', function(e){
        $ajaxCall.abort();
        DeleteCancelVideo();
        $('#js-progressbar-video-modal').addClass('d-none');
        $('#js-video-preview').addClass('d-none');
        console.log("Canceled");
    });

    var formData = new FormData();
    formData.append( 'action',  'get_tokens' );

    $ajaxCall = jQuery.ajax({
        cache: false,
        url: dms_vars.ajaxurl,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            var percentVal = '1%';
            bar.width(percentVal)
            percent.html(percentVal);
            var credentials = response.data.data;
            var s3 = setCognitoIdentity(response.data.data);
            console.log('::::GET TOKEN AND SET COGNITO:::');
            if (s3) {
                getProjectsAWS(status, s3, credentials, fileVideo);
            } else {
                errorProcess()
            }
        }
    });
}

/**
 * Login Cognito Token
 */
function setCognitoIdentity(credentials) {

    var bar = $('#bar');
    var percent = $('#percent');

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityId: credentials.IdentityId,
        Logins: {
          'cognito-identity.amazonaws.com': credentials.Token
        }
    })
    AWS.config.update({ region: 'us-west-2' })

    const s3 = new AWS.S3({ 
        apiVersion: '2006-03-01',
        params: { 
            Bucket: 'com.urlifemedia.beta' 
        } 
    })

    var percentVal = '2%';
            bar.width(percentVal)
            percent.html(percentVal);

    return s3;
}

/**
 * Get Projects
 */
function getProjectsAWS(status, s3, credentials, fileVideo) {

    var bar = $('#bar');
    var percent = $('#percent');
    var $ajaxCall = null;

    /**
     * Cancel Upload
     */
    $(document).on('click','.cancel-upload', function(e){
        $ajaxCall.abort();
        DeleteCancelVideo();
        $('#js-progressbar-video-modal').addClass('d-none');
        $('#js-video-preview').addClass('d-none');
        console.log("Canceled");
    });

    var formData = new FormData();
    formData.append( 'action',  'get_projects' );

    $ajaxCall = jQuery.ajax({
        cache: false,
        url: dms_vars.ajaxurl,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            var percentVal = '3%';
            bar.width(percentVal)
            percent.html(percentVal);
            
            var project = response.data;
            console.log('::::GET PROJECT:::')

            if ( project && project !== 'undefined' ) {
                createProjectsSKU(status, s3, project, credentials, fileVideo)
            } else {
                errorProcess()
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            errorProcess()
        }
    });
}

/**
 * 
 * Create projectskU
 */
 function createProjectsSKU(status, s3, project, credentials, fileVideo) {

    var bar = $('#bar');
    var percent = $('#percent');
    var $ajaxCall = null;

    /**
     * Cancel Upload
     */
    $(document).on('click','.cancel-upload', function(e){
        $ajaxCall.abort();
        DeleteCancelVideo();
        $('#js-progressbar-video-modal').addClass('d-none');
        $('#js-video-preview').addClass('d-none');
        console.log("Canceled");
    });

    var formData = new FormData();
    formData.append( 'action',  'create_project_sku' );
    formData.append( 'project_id', project);

    $ajaxCall = jQuery.ajax({
        cache: false,
        url: dms_vars.ajaxurl,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            var percentVal = '4%';
            bar.width(percentVal)
            percent.html(percentVal);
            
            var projectSKU = response.data;
            console.log('::::CREATE PROJECT SKU:::')

            if ( projectSKU && projectSKU !== 'undefined' ) {
                createFile(status, s3, project, projectSKU, credentials, fileVideo)
            } else {
                errorProcess()
            }
        }
    });
}

/**
 * 
 * Create file URLife
 */
function createFile(status, s3, project, projectSKU, credentials, fileVideo) {
    
    var bar = $('#bar');
    var percent = $('#percent');
    var $ajaxCall = null;

    /**
     * Cancel Upload
     */
    $(document).on('click','.cancel-upload', function(e){
        $ajaxCall.abort();
        DeleteCancelVideo();
        $('#js-progressbar-video-modal').addClass('d-none');
        $('#js-video-preview').addClass('d-none');
        console.log("Canceled");
    });

    var formData = new FormData();
    formData.append( 'action',  'createFileURLife' );
    formData.append( 'project_id', project );
    formData.append( 'project_sku', projectSKU );
    formData.append( 'fileName', fileVideo.name)
    formData.append( 'fileMimeType', fileVideo.type );
    formData.append( 'title',  $( '#title').val() );
    formData.append( 'description',  $('.ql-editor').html() );

    $ajaxCall = jQuery.ajax({
        cache: false,
        url: dms_vars.ajaxurl,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            var percentVal = '5%';
            bar.width(percentVal)
            percent.html(percentVal);
            //var fileURLife = response.data.data[0].id;
            var fileURLife = response.data.data[0];
            console.log('::::CREATE FILE:::')

            if ( fileURLife && fileURLife != 'undefined' ) {
                uploadFileAWS(status, s3, project, credentials, fileURLife, fileVideo)
            } else {
                errorProcess()
            }
        }
    });
}

/**
 * Upload File to AWS S3
 */
function uploadFileAWS (status, s3, project, credentials, fileURLife, fileVideo) {

    var bar = $('#bar');
    var percent = $('#percent');
    var fileName = fileVideo.name;
    var fileExt = fileName.split(".").pop();
    var fileKey = 'uploads/' + credentials.IdentityId + '/project/' + fileURLife.id + '.' + fileURLife.fileExt;
    //var fileKey = 'uploads/' + credentials.IdentityId + '/' + fileURLife.id + '.' + fileURLife.fileExt;

    s3.upload({
        Bucket: 'com.urlifemedia.beta',
        Key: fileKey,
        Body: fileVideo,
        ACL: 'public-read'
    }, function(err, data){
        if (err) {
            console.log(err);
            errorProcess();
            return false;
        }
        console.log('::::UPLOAD FILE:::')
        sendDataWP(status, fileURLife, fileVideo, project, data);

    }).on('httpUploadProgress', function (progress) {

        var percentComplete = progress.loaded / progress.total;
        percentComplete = parseInt(percentComplete * 100) + 15;

        if ( percentComplete < 100 ) {
            var percentVal = percentComplete + '%';
            bar.width(percentVal)
            percent.html(percentVal);
        }
    });
}

/**
 * Send Data to WP
 */
function sendDataWP (status, fileURLife, fileVideo, project, data) {

    var bar = $('#bar');
    var percent = $('#percent');
    var $ajaxCall = null;

    /**
     * Cancel Upload
     */
    $(document).on('click','.cancel-upload', function(e){
        $ajaxCall.abort();
        DeleteCancelVideo();
        $('#js-progressbar-video-modal').addClass('d-none');
        $('#js-video-preview').addClass('d-none');
        console.log("Canceled");
    });
    var formData = new FormData();
    formData.append( 'action',  'save_video' );
    formData.append( 'status',  status );
    formData.append( 'title',  $( '#title').val() );
    formData.append( 'location', data.Location);
    formData.append( 'content',  $('.ql-editor').html() );
    formData.append( 'fileName', fileVideo.name );
    formData.append( 'fileMimeType', fileURLife.fileExt );
    formData.append( 'project_id', project );
    formData.append( 'file_id', fileURLife.id);
    formData.append( 'method', 'urlife' );

    $ajaxCall = jQuery.ajax({
        cache: false,
        url: dms_vars.ajaxurl,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        /* xhr: function() {                
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    percentComplete = parseInt(percentComplete * 100);

                    var percentVal = percentComplete + '%';
                        bar.width(percentVal)
                        percent.html(percentVal);
            
                    if (percentComplete === 100) {
                        // do sumething
                    }
                }
            }, false);
        
            return xhr;
        }, */
        success: function(response) {
            var percentVal = '100%';
            bar.width(percentVal);
            percent.html(percentVal);
            console.log('::::UPDATE FILE:::')
            $('#js-progressbar-video-modal').addClass('d-none');
            $('#js-cta-video-uploading').removeClass('d-none');
            $('#js-video-progress-bar-status').append('<div class="d-flex align-content-center mt-1"><span class="mr-1">Completed</span> <img src="../../wp-content/plugins/blogging-platform/assets/img/video-complete.svg"></div>');
            $('#js-saved-video').removeClass('d-none');
            $('.js-confirm-modal').removeClass('d-none');
            $('.modal-new_article__box-title').html( response.data.message );
            $('#js-saved-video').attr('data-redirect', response.data.goback );
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            errorProcess()
        }
    });
}

/**
 * Ajax Save data Not upload
 */
function DeleteCancelVideo () {

    var formData = new FormData();
    formData.append( 'action',  'delete_cancel_video' );

    jQuery.ajax({
        cache: false,
        url: dms_vars.ajaxurl,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function ( response ) {
            // Do something
        }
    });
}

/**
 * Ajax Save data Not upload
 */
function FormSaveVideo ( status ) {

    var formData = new FormData();
    formData.append( 'action',  'edit_video' );
    formData.append( 'title',  $( '#title').val() );
    formData.append( 'post_id',  $( '#post_id').val() );
    formData.append( 'content',  $('.ql-editor').html() );

    jQuery.ajax({
        cache: false,
        url: dms_vars.ajaxurl,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,

        success: function ( response ) {
            $('#js-insert-video-modal').addClass('d-none');
            $('#js-save-data-video-modal').removeClass('d-none');
            $('#js-video-message').html( response.data.message );
            $('#js-saved-video').attr('data-redirect', response.data.goback );
        }

    });

    return false;

}

/**
 * Ajax Delete Video
 */
function deleteVideo ( status, post_id ) {

    var opcion = confirm("You sure want to delete the video?");

    if (opcion == true) {

        var formData = new FormData();
    
        formData.append( 'action',  'delete_video' );
    
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
 * Error
 */
function errorProcess() {
    $('#js-progressbar-video-modal').addClass('d-none');
    $('#js-error-video-modal').removeClass('d-none');
    $('#js-video-preview').addClass('d-none');
    $('#js-error-video-modal .progress-title').html('Sorry, something went wrong');
    $('#js-error-video-modal .progress-copy').html('Please try again in a moment');
}