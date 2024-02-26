/**
 * Change Image
 */
function readURL( input ) {

    if ( input.files && input.files[0] ) {

        var reader = new FileReader();

        reader.onload = function(e) {
            $('#js-featured-background').css("background-image", "url(" + e.target.result + ")");
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function formRequires() {

    if ( $('#user_firstname').val() == '' ) {
        $("#js-bio-edit-msj").html('<p class="text-danger">Please complete First Name</p>');
        return false;
    }

    if ( $('#user_lastname').val() == '' ) {
        $("#js-bio-edit-msj").html('<p class="text-danger">Please complete Last Name</p>');
        return false;
    }
    
    return true;

}

/**
 * Active Board Certification
 */
let activeBoard = () => {
    
    document.getElementById("js-board").checked = true;
    document.getElementById("js-resident").checked = false;
    
    var board = document.getElementById('js-visible-certifications');
        board.classList.remove('d-none');
    
    var resident = document.getElementById('js-cta-resident');
        resident.classList.add('d-none');

    var credential = document.getElementById('js-visible-credential');
        credential.classList.add('d-none');

    var resident = document.getElementById('js-visible-resident');
        resident.classList.add('d-none');
}

/**
 * Active Resident
 */
let activeResident = () => {
    
    var board = document.getElementById('js-visible-certifications');
        board.classList.add('d-none');
    
        document.getElementById("js-resident").checked = true;
        document.getElementById("js-board").checked = false;

    var resident = document.getElementById('js-cta-resident');
        resident.classList.remove('d-none');
}

/**
 * Active Resident Field
 */
let activeResidentField = () => {

    document.getElementById("js-resident-y").checked = true;
    document.getElementById("js-resident-x").checked = false;

    var resident = document.getElementById('js-visible-resident');
        resident.classList.remove('d-none');

    var credential = document.getElementById('js-visible-credential');
        credential.classList.add('d-none');
}

/**
 * Active Credential Field
 */
let activeCredentialField = () => {

    document.getElementById("js-resident-y").checked = false;
    document.getElementById("js-resident-x").checked = true;

    var credential = document.getElementById('js-visible-credential');
        credential.classList.remove('d-none');

    var resident = document.getElementById('js-visible-resident');
        resident.classList.add('d-none');
}
/**
 * Ajax Update Complete Bio
 */
function FormCompleteBioSubmit () {

    if ( ! formRequires() )
        return;
    
    $('#js-bio-modal-creating').removeClass('d-none');

    var specialties = [];
    var certifications = [];
    var educations = [];
    var expertise = [];

    $('.check_specialty').each( function() {

        var specialty = {
            specialty: $(this).find('.item_specialty').val(),
            subspecialty: $(this).find('.item_subspecialty').val(),
        }

        specialties.push( specialty );
    });

    $('.check_certification').each( function() {

        var certification = {
            certification: $(this).find('.item_certification').val(),
            subcertification: $(this).find('.item_subcertification').val(),
        }

        certifications.push( certification );
    });

    $('.check_education').each( function() {
        educations.push( $(this).find('.item_education').val() );
    });

    $('.check_expertise').each( function() {
        expertise.push( $(this).find('.item_education').val() );
    });

    var formData = new FormData();
    formData.append( 'action',  'save_pre_bio' );
    formData.append( 'user_id',  $( '#user_id' ).val() );
    formData.append( 'user_control',  $( '#user_control' ).val() );
    formData.append( 'user_firstname',  $( '#user_firstname' ).val() );
    formData.append( 'user_lastname',  $( '#user_lastname' ).val() );
    formData.append( 'user_specialty',  JSON.stringify(specialties) );
    formData.append( 'user_website',  $( '#user_website' ).val() );
    formData.append( 'user_linkedin',  $( '#user_linkedin' ).val() );
    formData.append( 'user_twitter',  $( '#user_twitter' ).val() );
    formData.append( 'user_facebook',  $( '#user_facebook' ).val() );
    formData.append( 'user_instagram',  $( '#user_instagram' ).val() );
    formData.append( 'clinic_name',  $( '#clinic_name' ).val() );
    formData.append( 'clinic_email',  $( '#clinic_email' ).val() );
    formData.append( 'clinic_open',  $( '#clinic_open' ).val() );
    formData.append( 'clinic_phone',  $( '#clinic_phone' ).val() );
    formData.append( 'clinic_appointment', $( '#clinic_appointment').val() );
    formData.append( 'clinic_web',  $( '#clinic_web' ).val() );
    formData.append( 'clinic_lat',  $( '#latitud_prop' ).val() );
    formData.append( 'clinic_lng',  $( '#longitud_prop' ).val() );
    formData.append( 'clinic_location',  $( '#js-google-search' ).val() );
    formData.append( 'city',  $( '#city_prop' ).val() );
    formData.append( 'state',  $( '#state_prop' ).val() );
    formData.append( 'country',  $( '#country_prop' ).val() );
    formData.append( 'user_description',  $( '#user_description' ).val() );
    formData.append( 'user_description_link',  $( '#user_description_link' ).val() );
    formData.append( 'user_education',  JSON.stringify(educations) );
    formData.append( 'user_certification',  JSON.stringify(certifications) );
    formData.append( 'user_expertise',  JSON.stringify(expertise) );
    formData.append( 'user_residency', $( '#user_residency').val() );
    formData.append( 'user_credential', $( '#user_credential').val() );
    formData.append( 'user_npi', $( '#user_npi').val() );
    formData.append( 'featuredImage', $( 'input[type=file]' )[0].files[0] );

    jQuery.ajax({
        cache: false,
        url: ddb_vars.ajaxurl,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function () {
            $('.js-save-animation').addClass('loading hiddenBtn').removeClass('done');
        },
        success: function ( response ) {
            $('.js-save-animation').removeClass('loading hiddenBtn').addClass('done');
            if ( response.success ) {
                $( '#js-skip-step' ).text( 'Cancel' );
                setTimeout(function(){ 
                    $('#js-bio-modal-creating').addClass('d-none');
                    $('#js-bio-modal').removeClass('d-none');
                    $('#js-bio-modal-complete').removeClass('d-none');
                }, 3000);
            } else {
                $( '#js-bio-edit-msj' ).html( '<p class="text-danger">' + response.data + '</p>' );
            }
        }
    });
    return false;
}

/**
 * Btn submit external button
 */
function buttonA_clickHandler (event) {

    $('.js-save-animation').addClass('loading hiddenBtn').removeClass('done');
    $('.acf-form-submit input').click();
}

/**
 * Load Sub Specialties select
 */
function loadSubSpecialties (value) {

    if ( !value ) return

    if ( value == 'other') {
        $('#js-other-specialty').css('display','flex');
        return
    }

    var formData = new FormData();
    formData.append( 'action',  'load_subspecialties' );
    formData.append( 'user_specialty',  value );

    jQuery.ajax({
        cache: false,
        url: ddb_vars.ajaxurl,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function ( response ) {
            $( '#user_subspecialty' ).html( '<option value="" selected disabled>loading...</option>' );
        },
        success: function ( response ) {      
            $( '#user_subspecialty' ).html( response.data );
        }
    });

    return false;
}

/**
 * Add bio specialties
 */
function addSpecialties () {

    let specialty = $('#user_specialty').val();
    let specialty_slug = specialty.replace(/ /g, "-").replace(/["'()]/g, "");
    let subspecialty = $('#user_subspecialty').val();
    let subspecialty_slug = subspecialty.replace(/ /g, "-").replace(/["'()]/g, "");
    let html = '';

    if ( specialty && specialty !== 'none' &&  specialty !== 'null' ) {
        //$("#user_specialty option:selected").attr('disabled','disabled');
        html += '<li id="' + specialty_slug + '"  class="d-flex flex-row check_specialty">';
        html += '<div class="box-specialty box-specialty-purple d-flex flex-row">' + specialty + '<input type="hidden" value="' + specialty + '" class="item_specialty"><div onclick="deleteItemSpecialty(this);"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div></div>';
    }
    if ( subspecialty && subspecialty !== 'none' && subspecialty !== 'null' ) {
        //$("#user_subspecialty option:selected").attr('disabled','disabled');
        html += '<div id="' + subspecialty_slug + '"  class="box-specialty box-specialty-pink d-flex flex-row">' + subspecialty + ' <input type="hidden" value="' + subspecialty + '" class="item_subspecialty"><div onclick="deleteItemSubSpecialty(this)"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div></div> ';
    }
    html += '</li>';

    $('#js-list-specialties').append( html );
}

/**
 * Add Other specialties
 */
function addOtherSpecialties () {

    let specialty = $('#other_specialty').val();
    let specialty_slug = specialty.replace(/ /g, "-").replace(/["'()]/g, "");
    let html = '';

    if ( specialty && specialty !== 'none' &&  specialty !== 'null' ) {
        html += '<li id="' + specialty_slug + '"  class="d-flex flex-row check_specialty">';
        html += '<div class="box-specialty box-specialty-purple d-flex flex-row">' + specialty + '<input type="hidden" value="' + specialty + '" class="item_specialty"><div onclick="deleteItemSpecialty(this);"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div></div>';
        $('#other_specialty').val('');
        $('#user_specialty').val('');
        $('#js-other-specialty').css('display','none');
    }
    html += '</li>';

    $('#js-list-specialties').append( html );
}

/**
 * Delete Item
 */
function deleteItemSpecialty (obj) {
    var elem = obj;
    $( elem ).parent().parent().remove();
    //$('#user_specialty option[value="' + id + '"]').removeAttr('disabled');
}

function deleteItemSubSpecialty (obj) {
    var elem = obj;
    $( elem ).parent().parent().remove();
    //$('#user_subspecialty option[value="' + id + '"]').removeAttr('disabled');
}

/**
 * Load Sub Specialties select Board Certification
 */
function loadSubCertification (value) {

    if ( !value ) return;

    var formData = new FormData();
    formData.append( 'action',  'load_subspecialties' );
    formData.append( 'user_specialty',  value );

    jQuery.ajax({
        cache: false,
        url: ddb_vars.ajaxurl,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function ( response ) {
            $( '#user_subcertification' ).html( '<option value="" selected disabled>loading...</option>' );
        },
        success: function ( response ) {      
            $( '#user_subcertification' ).html( response.data );
        }
    });

    return false;
}

/**
 * Add bio specialties certification
 */
function addCertification () {
    var rand = Math.floor(Math.random() * (9999 - 9)) + 9;
    let certification = $('#user_certification').val();
    let certification_slug = certification.replace(/ /g, "-").replace(/["'()]/g, "") + rand;
    let subcertification = $('#user_subcertification').val();
    let subcertification_slug = subcertification.replace(/ /g, "-").replace(/["'()]/g, "") + rand;
    let html = '';

    if ( certification && certification !== 'none' &&  certification !== 'null' ) {
        //$("#user_certification option:selected").attr('disabled','disabled');
        html += '<li id="' + certification_slug + '"  class="d-flex flex-row check_certification">';
        html += '<div class="box-certification box-certification-purple d-flex flex-row">' + certification + '<input type="hidden" value="' + certification + '" class="item_certification"><div onclick="deleteItemcertification(this);"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div></div>';
    }
    if ( subcertification && subcertification !== 'none' && subcertification !== 'null' ) {
        //$("#user_subcertification option:selected").attr('disabled','disabled');
        html += '<div id="' + subcertification_slug + '"  class="box-certification box-certification-pink d-flex flex-row">' + subcertification + ' <input type="hidden" value="' + subcertification + '" class="item_subcertification"><div onclick="deleteItemSubcertification(this);"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div></div> ';
    }
    html += '</li>';

    $('#js-list-certification').append( html );
}

/**
 * Delete Item certification
 */
function deleteItemcertification (obj) {
    var elem = obj;
    $( elem ).parent().parent().remove();
    //$('#user_certification option[value="' + id + '"]').removeAttr('disabled');
}

function deleteItemSubcertification (obj) {
    var elem = obj;
    $( elem ).parent().parent().remove();
    //$('#user_subcertification option[value="' + id + '"]').removeAttr('disabled');
}

/**
 * Add Bio Education
 */
function addEducationItem () {

    let education = $('#user_education').val();
    let education_slug = education.replace(/ /g, "-").replace(/["'()]/g, "");
    let html = '';

    if ( education && education !== 'none' &&  education !== 'null' ) {
        //$("#user_education option:selected").attr('disabled','disabled');
        html += '<li id="' + education_slug + '"  class="d-flex flex-row check_education">';
        html += '<div class="box-education box-education-purple d-flex flex-row">' + education + '<input type="hidden" value="' + education + '" class="item_education"><div onclick="deleteItemEducation(this);"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div></div>';
    }
    html += '</li>';

    $('#js-list-education').append( html );
    $('#user_education').val('');
}

function deleteItemEducation (obj) {
    var elem = obj;
    $( elem ).parent().parent().remove();
}

/**
 * Add Area of Expertise
 */
function addExpertiseItem () {

    let expertise = $('#user_expertise').val();
    let expertise_slug = expertise.replace(/ /g, "-").replace(/["'()]/g, "");
    let html = '';

    if ( expertise && expertise !== 'none' &&  expertise !== 'null' ) {
        html += '<li id="' + expertise_slug + '"  class="d-flex flex-row check_expertise">';
        html += '<div class="box-education box-education-purple d-flex flex-row">' + expertise + '<input type="hidden" value="' + expertise + '" class="item_education"><div onclick="deleteExpertiseItem(this);"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div></div>';
    }
    html += '</li>';

    $('#js-list-expertise').append( html );
    $('#user_expertise').val('');
}

function deleteExpertiseItem (obj) {
    var elem = obj;
    $( elem ).parent().parent().remove();
}


/**
 * Map Clinic
 */
(function( $ ) {
    /**
     * initMap
     *
     * Renders a Google Map onto the selected jQuery element
     *
     * @date    22/10/19
     * @since   5.8.6
     *
     * @param   jQuery $el The jQuery element.
     * @return  object The map instance.
     */
    function initMap( $el ) {
    
        // Find marker elements within map.
        var $markers = $el.find('.marker');
    
        // Create gerenic map.
        var mapArgs = {
            zoom        : $el.data('zoom') || 16,
            mapTypeId   : google.maps.MapTypeId.ROADMAP,
            panControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            overviewMapControl: false,
            zoomControl: true,
            scaleControl: false,
            fullscreenControl: false,
            rotateControl: false
        };

        var map = new google.maps.Map( $el[0], mapArgs );
    
        // Add markers.
        map.markers = [];
        $markers.each(function(){
            initMarker( $(this), map );
        });
    
        // Center map based on markers.
        centerMap( map );

        // Search Input and push into map
        searchInput( map );
    
        // Return map instance.
        return map;
    }
    
    /**
     * initMarker
     *
     * Creates a marker for the given jQuery element and map.
     *
     * @date    22/10/19
     * @since   5.8.6
     *
     * @param   jQuery $el The jQuery element.
     * @param   object The map instance.
     * @return  object The marker instance.
     */
    function initMarker( $marker, map ) {
    
        // Get position from marker.
        var lat = $marker.data('lat');
        var lng = $marker.data('lng');

        $("#latitud_prop").val(lat); //Set input lat
        $("#longitud_prop").val(lng); //Set input lng

        var latLng = {
            lat: parseFloat( lat ),
            lng: parseFloat( lng )
        };
    
        // Create marker instance.
        var marker = new google.maps.Marker({
            position : latLng,
            icon: "../../wp-content/themes/doctorpedia/img/authors/marker-premium.svg",
            map: map
        });
    
        // Append to reference for later use.
        map.markers.push( marker );
    
        // If marker contains HTML, add it to an infoWindow.
        if( $marker.html() ){
    
            // Create info window.
            var infowindow = new google.maps.InfoWindow({
                content: $marker.html()
            });
    
            // Show info window when marker is clicked.
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open( map, marker );
            });
        }
    }
    
    /**
     * centerMap
     *
     * Centers the map showing all markers in view.
     *
     * @date    22/10/19
     * @since   5.8.6
     *
     * @param   object The map instance.
     * @return  void
     */
    function centerMap( map ) {
    
        // Create map boundaries from all map markers.
        var bounds = new google.maps.LatLngBounds();
        map.markers.forEach(function( marker ){
            bounds.extend({
                lat: marker.position.lat(),
                lng: marker.position.lng()
            });
        });
    
        // Case: Single marker.
        if( map.markers.length == 1 ){
            map.setCenter( bounds.getCenter() );
    
        // Case: Multiple markers.
        } else{
            map.fitBounds( bounds );
        }
    }


    function searchInput( map ) {
        
        var input = document.getElementById('js-google-search');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    
        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });
    
        var markers = [];
        // [START region_getplaces]
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
    
        if (places.length == 0) {
            return;
        }
    
        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];
    
        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
                
            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: "../../wp-content/themes/doctorpedia/img/authors/marker-premium.svg",
                title: place.name,
                position: place.geometry.location
            }));

            $("#latitud_prop").val(place.geometry.location.lat); //set input lat
            $("#longitud_prop").val(place.geometry.location.lng); //set input lng
    
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });

        map.fitBounds(bounds);

        });
    }
    
    // Render maps on page load.
    $(document).ready(function(){
        $('.acf-map').each(function(){
            var map = initMap( $(this) );
        });
    });
    
})(jQuery);

$('#js-google-search').keypress(function(e) { 
    return e.keyCode != 13;
});


/**
 * Verify phone entry
 * @param {*} e
 */
function runCheckPhone ( e ) {

    tecla = (document.all) ? e.keyCode : e.which;

    //Tecla de retroceso para borrar, siempre la permite
    if (tecla == 8) {
        return true;
    }

    // Patron de entrada, en este caso solo acepta numeros y letras
    patron = /[0-9\s]/;
    tecla_final = String.fromCharCode(tecla);

    return patron.test(tecla_final);
}

/**
 * Verify email entry
 * @param {*} email
 */
function runCheckEmail ( email ) {

    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    
    if (emailRegex.test(email)) {
        $('#js-message-email').html('<span class="text-success">Valid Email!</span>');
        $(".js-save-animation").removeAttr('disabled');
    } else {
        $("#js-message-email").html('<span class="text-danger">Email is not valid</span>');
        $(".js-save-animation").prop("disabled", true);
    }
    return;
}

function activeSkipModal() {
    $('#js-bio-modal-skip').removeClass('d-none');
}

/**
 * Count Characters
 */
function countChars (obj) {
    var maxLength = 500;
    var strLength = obj.value.length;
    
    if ( strLength >= maxLength ) {
        document.getElementById("charNum").innerHTML = '<span class="text-danger text-min">'+strLength+' out of '+maxLength+' characters</span>';
        $(obj).val($(obj).val().substring(0,maxLength));
        return false;
    } else {
        document.getElementById("charNum").innerHTML = strLength+' out of '+maxLength+' characters';
    }

}