"use strict";

/**
 * Ajax Delete Review
 */
function deleteReview(status, post_id) {
  var opcion = confirm("You sure want to delete the review?");

  if (opcion == true) {
    var formData = new FormData();
    formData.append('action', 'delete_reviews');
    formData.append('status', status);
    formData.append(' post_id', post_id);
    jQuery.ajax({
      cache: false,
      url: dd_vars.ajaxurl,
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      beforeSend: function beforeSend() {},
      success: function success(response) {},
      complete: function complete() {
        location.reload();
      }
    });
  }

  return false;
}

function dynamicSearch(value) {
  if (value.length > 2) {
    $('.app-review-module').each(function () {
      var string1 = $(this).find('.app-review-module__title').html();
      var string2 = string1.toLowerCase();
      var string3 = string1.toUpperCase();
      var subvalue1 = value.toLowerCase();
      var subvalue2 = value.toUpperCase();

      if (string1.includes(value) || string1.includes(subvalue1) || string1.includes(subvalue2)) {
        $(this).removeClass('d-none');
      } else if (string2.includes(value) || string2.includes(subvalue1) || string2.includes(subvalue2)) {
        $(this).removeClass('d-none');
      } else if (string3.includes(value) || string3.includes(subvalue1) || string3.includes(subvalue2)) {
        $(this).removeClass('d-none');
      } else {
        $(this).addClass('d-none');
      }
    });
  } else {
    $('.app-review-module').removeClass('d-none');
  }
}

function dynamicFilter(value) {
  if (value) {
    $('.app-review-module').each(function () {
      var string = $(this).find('.app-review-module__title').attr('data-site');

      if (string.includes(value)) {
        $(this).removeClass('d-none');
      } else {
        $(this).addClass('d-none');
      }
    });
  }
}

function sortBy() {
  var myArray = $("#js-reorder-apps .app-review-module");
  var count = 0; // sort based on timestamp attribute

  myArray.sort(function (a, b) {
    // convert to integers from strings
    a = parseInt($(a).attr("data-order"), 10);
    b = parseInt($(b).attr("data-order"), 10);
    count += 2; // compare

    if (a > b) {
      return -1;
    } else if (a < b) {
      return 1;
    } else {
      return 0;
    }
  }); // put sorted results back on page

  $("#js-reorder-apps").html(myArray);
}
"use strict";

/**
 * Check inputs
 */
function formRequiresArticle(status) {
  if ($('#title').val() == '') {
    $("#title").attr('placeholder', 'Please complete Title');
    closeModal();
    return false;
  }

  return true;
}
/**
 * Ajax Insert & Update Article
 */


function FormSubmitArticle(status) {
  var preview = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (!formRequiresArticle(status)) return;
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

  if ($('#feature').is(":checked")) {
    feature = $('#feature').val();
  }

  var formData = new FormData();
  formData.append('action', 'save_article');
  formData.append('status', status);
  formData.append('post_id', $('#post_id').val());
  formData.append('title', $('#title').val());
  formData.append('subtitle', $('#subtitle').val());
  formData.append('content', $('.ql-editor').html());
  formData.append('blog_id', $('#blog_id').val());
  formData.append('feature', feature);
  formData.append('featuredImage', $('#featuredImage').val()); //formData.append( 'relevantList', relevantList );
  //formData.append( 'keywordList', keywordList );

  jQuery.ajax({
    cache: false,
    url: bms_vars.ajaxurl,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    beforeSend: function beforeSend() {
      $('#js-edit-blogging-article').html('<p class="text-info">Sending...</p>');

      if (status == 'draft') {
        $('#js-draft-article').addClass('loading hiddenBtn').removeClass('done');
      } else {
        $('#js-publish-article').addClass('loading hiddenBtn').removeClass('done');
      }
    },
    success: function success(response) {
      if (status == 'draft') {
        $('#js-draft-article').removeClass('loading hiddenBtn').addClass('done');
      } else {
        $('#js-publish-article').removeClass('loading hiddenBtn').addClass('done');
      }

      if (response.success) {
        if (preview) {
          $('#js-edit-blogging-article').html('<p class="text-info">Refreshing page...</p>');
          $('#js-draft-modal').addClass('d-none');
          window.open(window.location.origin + response.data.preview, '_blank');
          window.location.replace(response.data.redirect);
          return false;
        }

        if (response.data.status == 'draft') {
          $('#js-draft-modal').removeClass('d-none');
          $('#js-draft-modal').attr('data-redirect', response.data.redirect);
          $('#js-edit-blogging-article').html('<p class="text-info">Refreshing page...</p>');
        }

        if (response.data.status == 'pending') {
          $('#js-pending-article-modal').removeClass('d-none');
          $('.js-pending-modal').removeClass('d-none');
          $('#js-edit-article').html('<p class="text-success">' + response.data.message + '</p>');
        }
      } else {
        $('#js-edit-article').html('<p class="text-danger">' + response.message + '</p>');
      }
    }
  });
  return false;
}
/**
 * Ajax Insert Draft to Preview Article
 */


function FormSubmitPreviewArticle() {
  event.preventDefault();
  var formData = new FormData();
  formData.append('action', 'preview_article');
  formData.append(' post_id', $('#post_id').val());
  formData.append('title', $('#title').val());
  formData.append('subtitle', $('#subtitle').val());
  formData.append('content', $('.ql-editor').html());
  formData.append('featuredImage', $('#featuredImage').val());
  jQuery.ajax({
    cache: false,
    url: bms_vars.ajaxurl,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    beforeSend: function beforeSend() {
      $('#js-edit-article').html('<p class="text-info">sending...</p>');
    },
    success: function success(response) {
      if (response.success) {
        $('#js-edit-article').html('<p class="text-success">Saved Article</p>');
      } else {
        $('#js-edit-article').html('<p class="text-danger">' + response.data + '</p>');
      }
    }
  });
  return false;
}
/**
 * Ajax Delete Article
 */


function deleteSingleArticle(status, post_id) {
  var opcion = confirm("You sure want to delete the article?");

  if (opcion == true) {
    var formData = new FormData();
    formData.append('action', 'delete_article');
    formData.append('status', status);
    formData.append(' post_id', post_id);
    jQuery.ajax({
      cache: false,
      url: bms_vars.ajaxurl,
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      complete: function complete() {
        location.reload();
      }
    });
  }

  return false;
}
/** 
 * Ajax Publish Article by Link 
 */


function FormSingleLinkSubmit() {
  var formData = new FormData();
  formData.append('action', 'save_link_article');
  formData.append('status', 'pending');
  formData.append(' post_id', $('#post_id').attr('data-id'));
  jQuery.ajax({
    cache: false,
    url: bms_vars.ajaxurl,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    beforeSend: function beforeSend() {
      $('#js-edit-blogging-article').html('<p class="text-info">Sending...</p>');
      $('.btn-save').addClass('loading hiddenBtn').removeClass('done');
    },
    success: function success(response) {
      $('.btn-save').removeClass('loading hiddenBtn').addClass('done');

      if (response.success) {
        $('#js-msj-article').html('<p class="text-success">' + response.data.message + '</p>');

        if (response.data.status == 'publish' || response.data.status == 'pending') {
          window.location.replace(response.data.redirect);
        }
      } else {
        $('#js-msj-article').html('<p class="text-danger">' + response.message + '</p>');
      }
    }
  });
  return false;
}
/**
 * Select Relevant Sites
 */


function selectRelevantSites(value) {
  if (value !== 'none') {
    //$("#relevant option:selected").attr('disabled','disabled');
    $('#list_relevant').append('<li id="' + value + '">' + value + ' <input type="hidden" name="relevantList[]" value="' + value + '" class="check_relevant"><div onclick="deleteItem(\'' + value + '\')"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div> </li>');
  }
}
/**
 * Add Keyword - select
 */

/* function selectKeyWord ( value ) {
    $('#list_keyword').append( '<li id="' + value + '">' + value + ' <input type="hidden" name="keywordList[]" value="' + value + '" class="check_keyword"><div onclick="deleteItem(' + value + ')"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div> </li>' );
} */


(function ($) {
  $.sanitize = function (input) {
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
  tecla = document.all ? e.keyCode : e.which; //Tecla de retroceso para borrar, siempre la permite

  if (tecla == 8) {
    return true;
  } // Patron de entrada, en este caso solo acepta numeros y letras


  patron = /[A-Za-z0-9\s]/;
  tecla_final = String.fromCharCode(tecla); // Verifico que no exista la keyword

  function checkList(value) {
    var array = [];
    $('#list_keyword li').each(function () {
      array.push($(this).attr('id'));
    });

    if (!array.includes(value)) {
      array.push(value);
      return true;
    }

    return false;
  }

  if (e.keyCode == 13) {
    var value = $.sanitize($('#keyword').val());

    if (value !== '') {
      if (checkList(value)) {
        $('#list_keyword').append('<li id="' + value + '">' + value + ' <input type="hidden" name="keywordList[]" value="' + value + '" class="check_keyword"><div onclick="deleteItem(\'' + value + '\')"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div> </li>');
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


function deleteItem(value) {
  $('#' + value).remove();
  $("#relevant option[value=" + value + "]").removeAttr('disabled');
}
"use strict";

/**
 * Change Image
 */
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#js-featured-background').css("background-image", "url(" + e.target.result + ")");
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function formRequires() {
  if ($('#user_firstname').val() == '') {
    $("#js-bio-edit-msj").html('<p class="text-danger">Please complete First Name</p>');
    return false;
  }

  if ($('#user_lastname').val() == '') {
    $("#js-bio-edit-msj").html('<p class="text-danger">Please complete Last Name</p>');
    return false;
  }

  return true;
}
/**
 * Active Board Certification
 */


var activeBoard = function activeBoard() {
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
};
/**
 * Active Resident
 */


var activeResident = function activeResident() {
  var board = document.getElementById('js-visible-certifications');
  board.classList.add('d-none');
  document.getElementById("js-resident").checked = true;
  document.getElementById("js-board").checked = false;
  var resident = document.getElementById('js-cta-resident');
  resident.classList.remove('d-none');
};
/**
 * Active Resident Field
 */


var activeResidentField = function activeResidentField() {
  document.getElementById("js-resident-y").checked = true;
  document.getElementById("js-resident-x").checked = false;
  var resident = document.getElementById('js-visible-resident');
  resident.classList.remove('d-none');
  var credential = document.getElementById('js-visible-credential');
  credential.classList.add('d-none');
};
/**
 * Active Credential Field
 */


var activeCredentialField = function activeCredentialField() {
  document.getElementById("js-resident-y").checked = false;
  document.getElementById("js-resident-x").checked = true;
  var credential = document.getElementById('js-visible-credential');
  credential.classList.remove('d-none');
  var resident = document.getElementById('js-visible-resident');
  resident.classList.add('d-none');
};
/**
 * Ajax Update Complete Bio
 */


function FormCompleteBioSubmit() {
  if (!formRequires()) return;
  $('#js-bio-modal-creating').removeClass('d-none');
  var specialties = [];
  var certifications = [];
  var educations = [];
  var expertise = [];
  $('.check_specialty').each(function () {
    var specialty = {
      specialty: $(this).find('.item_specialty').val(),
      subspecialty: $(this).find('.item_subspecialty').val()
    };
    specialties.push(specialty);
  });
  $('.check_certification').each(function () {
    var certification = {
      certification: $(this).find('.item_certification').val(),
      subcertification: $(this).find('.item_subcertification').val()
    };
    certifications.push(certification);
  });
  $('.check_education').each(function () {
    educations.push($(this).find('.item_education').val());
  });
  $('.check_expertise').each(function () {
    expertise.push($(this).find('.item_education').val());
  });
  var formData = new FormData();
  formData.append('action', 'save_pre_bio');
  formData.append('user_id', $('#user_id').val());
  formData.append('user_control', $('#user_control').val());
  formData.append('user_firstname', $('#user_firstname').val());
  formData.append('user_lastname', $('#user_lastname').val());
  formData.append('user_specialty', JSON.stringify(specialties));
  formData.append('user_website', $('#user_website').val());
  formData.append('user_linkedin', $('#user_linkedin').val());
  formData.append('user_twitter', $('#user_twitter').val());
  formData.append('user_facebook', $('#user_facebook').val());
  formData.append('user_instagram', $('#user_instagram').val());
  formData.append('clinic_name', $('#clinic_name').val());
  formData.append('clinic_email', $('#clinic_email').val());
  formData.append('clinic_open', $('#clinic_open').val());
  formData.append('clinic_phone', $('#clinic_phone').val());
  formData.append('clinic_appointment', $('#clinic_appointment').val());
  formData.append('clinic_web', $('#clinic_web').val());
  formData.append('clinic_lat', $('#latitud_prop').val());
  formData.append('clinic_lng', $('#longitud_prop').val());
  formData.append('clinic_location', $('#js-google-search').val());
  formData.append('city', $('#city_prop').val());
  formData.append('state', $('#state_prop').val());
  formData.append('country', $('#country_prop').val());
  formData.append('user_description', $('#user_description').val());
  formData.append('user_description_link', $('#user_description_link').val());
  formData.append('user_education', JSON.stringify(educations));
  formData.append('user_certification', JSON.stringify(certifications));
  formData.append('user_expertise', JSON.stringify(expertise));
  formData.append('user_residency', $('#user_residency').val());
  formData.append('user_credential', $('#user_credential').val());
  formData.append('user_npi', $('#user_npi').val());
  formData.append('featuredImage', $('input[type=file]')[0].files[0]);
  jQuery.ajax({
    cache: false,
    url: ddb_vars.ajaxurl,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    beforeSend: function beforeSend() {
      $('.js-save-animation').addClass('loading hiddenBtn').removeClass('done');
    },
    success: function success(response) {
      $('.js-save-animation').removeClass('loading hiddenBtn').addClass('done');

      if (response.success) {
        $('#js-skip-step').text('Cancel');
        setTimeout(function () {
          $('#js-bio-modal-creating').addClass('d-none');
          $('#js-bio-modal').removeClass('d-none');
          $('#js-bio-modal-complete').removeClass('d-none');
        }, 3000);
      } else {
        $('#js-bio-edit-msj').html('<p class="text-danger">' + response.data + '</p>');
      }
    }
  });
  return false;
}
/**
 * Btn submit external button
 */


function buttonA_clickHandler(event) {
  $('.js-save-animation').addClass('loading hiddenBtn').removeClass('done');
  $('.acf-form-submit input').click();
}
/**
 * Load Sub Specialties select
 */


function loadSubSpecialties(value) {
  if (!value) return;

  if (value == 'other') {
    $('#js-other-specialty').css('display', 'flex');
    return;
  }

  var formData = new FormData();
  formData.append('action', 'load_subspecialties');
  formData.append('user_specialty', value);
  jQuery.ajax({
    cache: false,
    url: ddb_vars.ajaxurl,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    beforeSend: function beforeSend(response) {
      $('#user_subspecialty').html('<option value="" selected disabled>loading...</option>');
    },
    success: function success(response) {
      $('#user_subspecialty').html(response.data);
    }
  });
  return false;
}
/**
 * Add bio specialties
 */


function addSpecialties() {
  var specialty = $('#user_specialty').val();
  var specialty_slug = specialty.replace(/ /g, "-").replace(/["'()]/g, "");
  var subspecialty = $('#user_subspecialty').val();
  var subspecialty_slug = subspecialty.replace(/ /g, "-").replace(/["'()]/g, "");
  var html = '';

  if (specialty && specialty !== 'none' && specialty !== 'null') {
    //$("#user_specialty option:selected").attr('disabled','disabled');
    html += '<li id="' + specialty_slug + '"  class="d-flex flex-row check_specialty">';
    html += '<div class="box-specialty box-specialty-purple d-flex flex-row">' + specialty + '<input type="hidden" value="' + specialty + '" class="item_specialty"><div onclick="deleteItemSpecialty(this);"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div></div>';
  }

  if (subspecialty && subspecialty !== 'none' && subspecialty !== 'null') {
    //$("#user_subspecialty option:selected").attr('disabled','disabled');
    html += '<div id="' + subspecialty_slug + '"  class="box-specialty box-specialty-pink d-flex flex-row">' + subspecialty + ' <input type="hidden" value="' + subspecialty + '" class="item_subspecialty"><div onclick="deleteItemSubSpecialty(this)"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div></div> ';
  }

  html += '</li>';
  $('#js-list-specialties').append(html);
}
/**
 * Add Other specialties
 */


function addOtherSpecialties() {
  var specialty = $('#other_specialty').val();
  var specialty_slug = specialty.replace(/ /g, "-").replace(/["'()]/g, "");
  var html = '';

  if (specialty && specialty !== 'none' && specialty !== 'null') {
    html += '<li id="' + specialty_slug + '"  class="d-flex flex-row check_specialty">';
    html += '<div class="box-specialty box-specialty-purple d-flex flex-row">' + specialty + '<input type="hidden" value="' + specialty + '" class="item_specialty"><div onclick="deleteItemSpecialty(this);"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div></div>';
    $('#other_specialty').val('');
    $('#user_specialty').val('');
    $('#js-other-specialty').css('display', 'none');
  }

  html += '</li>';
  $('#js-list-specialties').append(html);
}
/**
 * Delete Item
 */


function deleteItemSpecialty(obj) {
  var elem = obj;
  $(elem).parent().parent().remove(); //$('#user_specialty option[value="' + id + '"]').removeAttr('disabled');
}

function deleteItemSubSpecialty(obj) {
  var elem = obj;
  $(elem).parent().parent().remove(); //$('#user_subspecialty option[value="' + id + '"]').removeAttr('disabled');
}
/**
 * Load Sub Specialties select Board Certification
 */


function loadSubCertification(value) {
  if (!value) return;
  var formData = new FormData();
  formData.append('action', 'load_subspecialties');
  formData.append('user_specialty', value);
  jQuery.ajax({
    cache: false,
    url: ddb_vars.ajaxurl,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    beforeSend: function beforeSend(response) {
      $('#user_subcertification').html('<option value="" selected disabled>loading...</option>');
    },
    success: function success(response) {
      $('#user_subcertification').html(response.data);
    }
  });
  return false;
}
/**
 * Add bio specialties certification
 */


function addCertification() {
  var rand = Math.floor(Math.random() * (9999 - 9)) + 9;
  var certification = $('#user_certification').val();
  var certification_slug = certification.replace(/ /g, "-").replace(/["'()]/g, "") + rand;
  var subcertification = $('#user_subcertification').val();
  var subcertification_slug = subcertification.replace(/ /g, "-").replace(/["'()]/g, "") + rand;
  var html = '';

  if (certification && certification !== 'none' && certification !== 'null') {
    //$("#user_certification option:selected").attr('disabled','disabled');
    html += '<li id="' + certification_slug + '"  class="d-flex flex-row check_certification">';
    html += '<div class="box-certification box-certification-purple d-flex flex-row">' + certification + '<input type="hidden" value="' + certification + '" class="item_certification"><div onclick="deleteItemcertification(this);"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div></div>';
  }

  if (subcertification && subcertification !== 'none' && subcertification !== 'null') {
    //$("#user_subcertification option:selected").attr('disabled','disabled');
    html += '<div id="' + subcertification_slug + '"  class="box-certification box-certification-pink d-flex flex-row">' + subcertification + ' <input type="hidden" value="' + subcertification + '" class="item_subcertification"><div onclick="deleteItemSubcertification(this);"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div></div> ';
  }

  html += '</li>';
  $('#js-list-certification').append(html);
}
/**
 * Delete Item certification
 */


function deleteItemcertification(obj) {
  var elem = obj;
  $(elem).parent().parent().remove(); //$('#user_certification option[value="' + id + '"]').removeAttr('disabled');
}

function deleteItemSubcertification(obj) {
  var elem = obj;
  $(elem).parent().parent().remove(); //$('#user_subcertification option[value="' + id + '"]').removeAttr('disabled');
}
/**
 * Add Bio Education
 */


function addEducationItem() {
  var education = $('#user_education').val();
  var education_slug = education.replace(/ /g, "-").replace(/["'()]/g, "");
  var html = '';

  if (education && education !== 'none' && education !== 'null') {
    //$("#user_education option:selected").attr('disabled','disabled');
    html += '<li id="' + education_slug + '"  class="d-flex flex-row check_education">';
    html += '<div class="box-education box-education-purple d-flex flex-row">' + education + '<input type="hidden" value="' + education + '" class="item_education"><div onclick="deleteItemEducation(this);"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div></div>';
  }

  html += '</li>';
  $('#js-list-education').append(html);
  $('#user_education').val('');
}

function deleteItemEducation(obj) {
  var elem = obj;
  $(elem).parent().parent().remove();
}
/**
 * Add Area of Expertise
 */


function addExpertiseItem() {
  var expertise = $('#user_expertise').val();
  var expertise_slug = expertise.replace(/ /g, "-").replace(/["'()]/g, "");
  var html = '';

  if (expertise && expertise !== 'none' && expertise !== 'null') {
    html += '<li id="' + expertise_slug + '"  class="d-flex flex-row check_expertise">';
    html += '<div class="box-education box-education-purple d-flex flex-row">' + expertise + '<input type="hidden" value="' + expertise + '" class="item_education"><div onclick="deleteExpertiseItem(this);"><img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg" /></div></div>';
  }

  html += '</li>';
  $('#js-list-expertise').append(html);
  $('#user_expertise').val('');
}

function deleteExpertiseItem(obj) {
  var elem = obj;
  $(elem).parent().parent().remove();
}
/**
 * Map Clinic
 */


(function ($) {
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
  function initMap($el) {
    // Find marker elements within map.
    var $markers = $el.find('.marker'); // Create gerenic map.

    var mapArgs = {
      zoom: $el.data('zoom') || 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      panControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      overviewMapControl: false,
      zoomControl: true,
      scaleControl: false,
      fullscreenControl: false,
      rotateControl: false
    };
    var map = new google.maps.Map($el[0], mapArgs); // Add markers.

    map.markers = [];
    $markers.each(function () {
      initMarker($(this), map);
    }); // Center map based on markers.

    centerMap(map); // Search Input and push into map

    searchInput(map); // Return map instance.

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


  function initMarker($marker, map) {
    // Get position from marker.
    var lat = $marker.data('lat');
    var lng = $marker.data('lng');
    $("#latitud_prop").val(lat); //Set input lat

    $("#longitud_prop").val(lng); //Set input lng

    var latLng = {
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    }; // Create marker instance.

    var marker = new google.maps.Marker({
      position: latLng,
      icon: "../../wp-content/themes/doctorpedia/img/authors/marker-premium.svg",
      map: map
    }); // Append to reference for later use.

    map.markers.push(marker); // If marker contains HTML, add it to an infoWindow.

    if ($marker.html()) {
      // Create info window.
      var infowindow = new google.maps.InfoWindow({
        content: $marker.html()
      }); // Show info window when marker is clicked.

      google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
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


  function centerMap(map) {
    // Create map boundaries from all map markers.
    var bounds = new google.maps.LatLngBounds();
    map.markers.forEach(function (marker) {
      bounds.extend({
        lat: marker.position.lat(),
        lng: marker.position.lng()
      });
    }); // Case: Single marker.

    if (map.markers.length == 1) {
      map.setCenter(bounds.getCenter()); // Case: Multiple markers.
    } else {
      map.fitBounds(bounds);
    }
  }

  function searchInput(map) {
    var input = document.getElementById('js-google-search');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input); // Bias the SearchBox results towards current map's viewport.

    map.addListener('bounds_changed', function () {
      searchBox.setBounds(map.getBounds());
    });
    var markers = []; // [START region_getplaces]
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.

    searchBox.addListener('places_changed', function () {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      } // Clear out the old markers.


      markers.forEach(function (marker) {
        marker.setMap(null);
      });
      markers = []; // For each place, get the icon, name and location.

      var bounds = new google.maps.LatLngBounds();
      places.forEach(function (place) {
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
  } // Render maps on page load.


  $(document).ready(function () {
    $('.acf-map').each(function () {
      var map = initMap($(this));
    });
  });
})(jQuery);

$('#js-google-search').keypress(function (e) {
  return e.keyCode != 13;
});
/**
 * Verify phone entry
 * @param {*} e
 */

function runCheckPhone(e) {
  tecla = document.all ? e.keyCode : e.which; //Tecla de retroceso para borrar, siempre la permite

  if (tecla == 8) {
    return true;
  } // Patron de entrada, en este caso solo acepta numeros y letras


  patron = /[0-9\s]/;
  tecla_final = String.fromCharCode(tecla);
  return patron.test(tecla_final);
}
/**
 * Verify email entry
 * @param {*} email
 */


function runCheckEmail(email) {
  var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

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


function countChars(obj) {
  var maxLength = 500;
  var strLength = obj.value.length;

  if (strLength >= maxLength) {
    document.getElementById("charNum").innerHTML = '<span class="text-danger text-min">' + strLength + ' out of ' + maxLength + ' characters</span>';
    $(obj).val($(obj).val().substring(0, maxLength));
    return false;
  } else {
    document.getElementById("charNum").innerHTML = strLength + ' out of ' + maxLength + ' characters';
  }
}
"use strict";

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


function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#js-featured-image-article').css("background-image", "url(" + e.target.result + ")");
      $('#js-choose-image').css({
        'transform': 'translateY(85px)'
      });
    };

    reader.readAsDataURL(input.files[0]);
  }
}
/**
 * Choose image
 * 
 */


function setImageArticle(target) {
  $('#js-featured-image-article').css("background-image", "url(" + target + ")");
  $('#js-featured-image-article img').css("display", "none");
  $('#js-insert-articles-img-modal').addClass('d-none');
  $('#js-choose-image').css({
    'transform': 'translateY(85px)'
  });
  $('#js-choose-image button').text('Change image');
  $('#featuredImage').val(target);
}
/**
 * Ajax Choose random image
 */


function chooseRandomImage() {
  var formData = new FormData();
  formData.append('action', 'choose_random_image');
  jQuery.ajax({
    cache: false,
    url: dms_vars.ajaxurl,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    success: function success(response) {
      setImageArticle(response.data);
    }
  });
  return false;
}
/**
 * Check inputs
 */


function formRequiresArticle(status) {
  if ($('#title').val() == '') {
    $("#title").attr('placeholder', 'Please complete Title');
    closeModal();
    return false;
  }

  return true;
}
/**
 * Ajax Insert & Update Article
 */


function FormSubmit(status) {
  var preview = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (!formRequiresArticle(status)) return;
  var formData = new FormData();
  formData.append('action', 'save_blog');
  formData.append('status', status);
  formData.append('post_id', $('#post_id').val());
  formData.append('title', $('#title').val());
  formData.append('subtitle', $('#subtitle').val());
  formData.append('content', $('.ql-editor').html());
  formData.append('blog_id', $('#blog_id').val());
  formData.append('featuredImage', $('#featuredImage').val());
  jQuery.ajax({
    cache: false,
    url: dms_vars.ajaxurl,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    beforeSend: function beforeSend() {
      $('#js-edit-blogging-article').html('<p class="text-info">Sending...</p>');

      if (status == 'draft') {
        $('#js-draft-article').addClass('loading hiddenBtn').removeClass('done');
      } else {
        $('#js-publish-article').addClass('loading hiddenBtn').removeClass('done');
      }
    },
    success: function success(response) {
      if (status == 'draft') {
        $('#js-draft-article').removeClass('loading hiddenBtn').addClass('done');
      } else {
        $('#js-publish-article').removeClass('loading hiddenBtn').addClass('done');
      }

      if (response.success) {
        if (preview) {
          $('#js-edit-blogging-article').html('<p class="text-info">Refreshing page...</p>');
          $('#js-draft-modal').addClass('d-none');
          window.open(window.location.origin + response.data.preview, '_blank');
          window.location.replace(response.data.redirect);
          return false;
        }

        if (response.data.status == 'draft') {
          $('#js-draft-modal').removeClass('d-none');
          $('#js-draft-modal').attr('data-redirect', response.data.redirect);
          $('#js-edit-blogging-article').html('<p class="text-info">Refreshing page...</p>');
        }

        if (response.data.status == 'pending') {
          $('#js-pending-blog-modal').removeClass('d-none');
          $('.js-pending-modal').removeClass('d-none');
          $('#js-edit-blogging-article').html('<p class="text-success">' + response.data.message + '</p>');
        }
      } else {
        $('#js-edit-blogging-article').html('<p class="text-danger">' + response.message + '</p>');
      }
    }
  });
  return false;
}
/**
 * Ajax Insert Draft to Preview Article
 */


function FormSubmitPreview() {
  event.preventDefault();
  var formData = new FormData();
  formData.append('action', 'preview_article');
  formData.append(' post_id', $('#post_id').val());
  formData.append('title', $('#title').val());
  formData.append('subtitle', $('#subtitle').val());
  formData.append('content', $('.ql-editor').html());
  formData.append(' blog_id', $('#blog_id').val());
  formData.append('featuredImage', $('#featuredImage').val());
  jQuery.ajax({
    cache: false,
    url: dms_vars.ajaxurl,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    beforeSend: function beforeSend() {
      $('#js-edit-blogging-article').html('<p class="text-info">Sending...</p>');
    },
    success: function success(response) {
      if (response.success) {
        $('#js-edit-blogging-article').html('<p class="text-success">Saved Blog</p>');
        window.open(window.location.origin + '/doctor-platform/preview/?post=' + response.data.p + '&preview=true', '_blank');
      } else {
        $('#js-edit-blogging-article').html('<p class="text-danger">' + response.data + '</p>');
      }
    }
  });
  return false;
}
/* Ajax Publish Article by Link */


function FormLinkSubmit() {
  var formData = new FormData();
  formData.append('action', 'save_link_blog');
  formData.append('status', 'pending');
  formData.append(' post_id', $('#post_id').attr('data-id'));
  jQuery.ajax({
    cache: false,
    url: dms_vars.ajaxurl,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    beforeSend: function beforeSend() {
      $('#js-edit-blogging-article').html('<p class="text-info">Sending...</p>');
      $('.btn-save').addClass('loading hiddenBtn').removeClass('done');
    },
    success: function success(response) {
      $('.btn-save').removeClass('loading hiddenBtn').addClass('done');

      if (response.success) {
        $('#js-msj-article').html('<p class="text-success">' + response.data.message + '</p>');

        if (response.data.status == 'publish') {
          window.location.replace(response.data.redirect);
        }
      } else {
        $('#js-msj-article').html('<p class="text-danger">' + response.message + '</p>');
      }
    }
  });
  return false;
}
/**
 * Ajax Delete Article
 */


function deleteArticle(status, post_id) {
  var opcion = confirm("You sure want to delete the blog?");

  if (opcion == true) {
    var formData = new FormData();
    formData.append('action', 'delete_article');
    formData.append('status', status);
    formData.append(' post_id', post_id);
    jQuery.ajax({
      cache: false,
      url: dms_vars.ajaxurl,
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      complete: function complete() {
        location.reload();
      }
    });
  }

  return false;
}
/**
 * Disabled link preview
 */


function deshabilitar(link) {
  event.preventDefault();
  link.style.pointerEvents = 'none';
  link.style.pointerEvents = null;
  link.style.color = '#ccc';
  link.style.borderBottom = '1px solid #ccc';
  jQuery('#js-cta-post-preview span').show();
}

jQuery(document).ready(function () {
  jQuery('#content_ifr').keyup(function () {
    jQuery('#tinymce').value = document.getElementById('content').value.substring(0, 10);
    console.log(jQuery(this).value);
  });
});
"use strict";

/**
 * Verify email
 */
function doctorsForgotVerifyEmail() {
  var email = $('#user_email').val();
  var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

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


jQuery(document).ready(function () {
  jQuery('#js-forgot-password').submit(function (event) {
    event.preventDefault();

    if ($('#user_email').val() == '') {
      $("#js-forgot-messageForm").html('<p class="text-danger">Please complete Email</p>');
      return;
    }

    var serialize = $(this).serializeArray();
    var formData = new FormData();
    formData.append('action', 'verifyUserEmail');
    formData.append('user_email', serialize[0].value);
    jQuery.ajax({
      cache: false,
      url: $('#js-forgot-password').attr('action'),
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      beforeSend: function beforeSend() {
        $("#js-forgot-messageForm").fadeIn('fast');
        $("#js-forgot-messageForm").html('<p class="text-info">Sending....</p>');
      },
      success: function success(response) {
        if (response.success == true) {
          $("#js-forgot-messageForm").html('<p class="text-success">' + response.data + '</p>');
        } else {
          $("#js-forgot-messageForm").html('<p class="text-danger">' + response.data + '</p>');
        }
      }
    });
    return false;
  });
});
"use strict";

/**
 * Login Platform with Ajax
 */
jQuery(document).ready(function () {
  jQuery('#js-blogging-login').submit(function (event) {
    event.preventDefault();

    if ($('#user_login').val() == '') {
      $("#js-messageForm").html('<p class="text-danger">Please complete Email</p>');
      return;
    }

    if ($('#user_pass').val() == '') {
      $("#js-messageForm").html('<p class="text-danger">Please complete Password</p>');
      return;
    }

    var formData = new FormData();
    formData.append('action', 'blogging_login');
    formData.append('user_login', $('#user_login').val());
    formData.append('user_pass', $('#user_pass').val());
    formData.append('security', $('#security').val());
    formData.append('_wp_http_referer', $('input[name="_wp_http_referer"]').val());
    jQuery.ajax({
      cache: false,
      url: $('#js-blogging-login').attr('action'),
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      beforeSend: function beforeSend() {
        $("#js-messageForm").fadeIn('fast');
        $("#js-messageForm").html('<p class="text-info">Sending....</p>');
      },
      success: function success(response) {
        if (response.data.loggedin == true) {
          $("#js-messageForm").html('<p class="text-success">' + response.data.message + '</p>');
          $("#js-register-submit").addClass('d-none');
          $(location).attr('href', '../doctor-profile/' + response.data.user_nicename);
        } else {
          $("#js-messageForm").html('<p class="text-danger">' + response.data.message + '</p>');
        }
      },
      error: function error(XMLHttpRequest, textStatus, errorThrown) {
        $("#js-messageForm").html('<p class="text-danger">Bad send, please refresh page and try again</p>');
      }
    });
  });
});
"use strict";

/**
 * Verify email
 */
function doctorsVerifyEmail() {
  var email = $('#user_email').val();
  var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

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
    data: {
      email: email
    },
    beforeSend: function beforeSend() {
      $("#js-register-messageForm").fadeIn('fast');
      $("#js-register-messageForm").html('<p class="text-info">Checking....</p>');
    },
    success: function success(response) {
      var obj = JSON.parse(response);

      if (obj.data == 'error') {
        $('#user_email').removeClass('styles-success').addClass('styles-danger');
        $('#attach-confirm-email').removeClass('styles-success').addClass('styles-danger');
      } else {
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


jQuery(document).ready(function () {
  var userEmail;

  if (userEmail = getParameterByName('email')) {
    $('#user_email').val(userEmail);
  }

  jQuery('#js-blogging-register').submit(function (event) {
    event.preventDefault();

    if ($('#user_fistname').val() == '') {
      $("#js-register-messageForm").html('<p class="text-danger">Please complete Fist Name</p>');
      return;
    }

    if ($('#user_lastname').val() == '') {
      $("#js-register-messageForm").html('<p class="text-danger">Please complete Last Name</p>');
      return;
    }

    if ($('#user_email').val() == '') {
      $("#js-register-messageForm").html('<p class="text-danger">Please complete Email</p>');
      return;
    }

    if ($('#user_pass').val() == '') {
      $("#js-register-messageForm").html('<p class="text-danger">Please complete Password</p>');
      return;
    }

    if ($('#user_repass').val() == '') {
      $("#js-register-messageForm").html('<p class="text-danger">Please complete Confirm Password</p>');
      return;
    }

    if ($('#user_repass').val() !== $('#user_pass').val()) {
      $("#js-register-messageForm").html('<p class="text-danger">Passwords don\'t match</p>');
      return;
    }

    var how_to = $('#how_to').val();

    if (how_to.trim() == '') {
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


    if ($('#terms').is(':checked')) {} else {
      $("#js-register-messageForm").html('<p class="text-danger">Please Accept Terms & Conditions</p>');
      return;
    }

    var formData = new FormData();
    formData.append('action', 'blogging_Register');
    formData.append('user_fistname', $('#user_fistname').val());
    formData.append('user_lastname', $('#user_lastname').val());
    formData.append('user_email', $('#user_email').val());
    formData.append('user_pass', $('#user_pass').val()); //formData.append('user_npi', $('#user_npi').val() );

    formData.append('how_to', $('#how_to').val());
    jQuery.ajax({
      cache: false,
      url: $('#js-blogging-register').attr('action'),
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      beforeSend: function beforeSend() {
        $("#js-register-messageForm").fadeIn('fast');
        $("#js-register-messageForm").html('<p class="text-info">Sending....</p>');
      },
      success: function success(response) {
        if (response.success == true) {
          $("#js-register-messageForm").html('<p class="text-success">' + response.data + '</p>'); //$("#js-register-submit").addClass('d-none');

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
  console.log('OPEN MODAL');
  $('#js-terms-conditions').removeClass('d-none');
  $('#js-terms-conditions-form').removeClass('d-none');
}
/**
 * Close modal terms
 */


function HideTermsModal() {
  $('#js-terms-conditions').addClass('d-none');
  $('#js-terms-conditions-form').addClass('d-none');
  $('#terms').prop("checked", true);
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
  var inviteCode = $('#user_invite').val();
  $.ajax({
    method: "POST",
    url: location.origin + '/wp-content/plugins/blogging-platform/inc/verify-invite-code.php',
    data: {
      inviteCode: inviteCode
    },
    beforeSend: function beforeSend() {
      $("#js-register-messageForm").fadeIn('fast');
      $("#js-register-messageForm").html('<p class="text-info">Checking....</p>');
    },
    success: function success(response) {
      var obj = JSON.parse(response);

      if (obj.data == 'error') {
        $('#user_invite').removeClass('styles-success').addClass('styles-danger');
        $('#attach-confirm-email').removeClass('styles-success').addClass('styles-danger');
        $('#js-register-submit').attr('disabled', true);
      } else {
        $('#user_invite').removeClass('styles-danger').addClass('styles-success');
        $('#attach-confirm-email').removeClass('styles-danger').addClass('styles-success');
        $('#user_invite_control').val('valid');
        $('#js-register-submit').removeAttr('disabled');
      }

      $("#js-register-messageForm").html(obj.message);
    }
  });
}
"use strict";

function formSettingRequires() {
  if ($('#user_password').val() == '') {
    $("#js-settings-msj").html('<p class="text-danger">Please complete Password</p>');
    return false;
  }

  if ($('#user_confirm').val() == '') {
    $("#js-settings-msj").html('<p class="text-danger">Please Confirm Password</p>');
    return false;
  }

  if ($('#user_password').val() !== $('#user_confirm').val()) {
    $("#js-settings-msj").html('<p class="text-danger">Passwords don\'t match</p>');
    return false;
  }

  return true;
}
/**
 * Ajax Update Bio
 */


function FormSettingSubmit() {
  if (!formSettingRequires()) return;
  var formData = new FormData();
  formData.append('action', 'set_password');
  formData.append('user_email', $('#user_email').val());
  formData.append('user_password', $('#user_password').val());
  jQuery.ajax({
    cache: false,
    url: bb_vars.ajaxurl,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    beforeSend: function beforeSend() {
      /* $( '#js-settings-msj' ).html( '<p class="text-info">Sending...</p>' ); */
      $('.js-save-animation').addClass('loading hiddenBtn').removeClass('done');
    },
    success: function success(response) {
      $('.js-save-animation').removeClass('loading hiddenBtn').addClass('done');

      if (response.success) {
        $('#js-settings-msj').html('<p class="text-success">' + response.data + '</p>');
      } else {
        $('#js-settings-msj').html('<p class="text-danger">' + response.data + '</p>');
      }
    }
  });
  return false;
}
"use strict";

function showVideoModal() {
  if ($("#featuredImage")[0].files[0] == undefined) {
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

function readVideoURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#js-video-preview').removeClass('d-none');
      $('#js-video-preview').attr('src', e.target.result);
      $('#js-video-preview source').attr('src', e.target.result);
      $('#js-cta-videos').addClass('d-none');
      $('#js-cta-videos-after').addClass('d-flex').removeClass('d-none');
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function closeVideoModal() {
  $('#js-saved-video').addClass('d-none');
  var redirect = $('#js-saved-video').attr('data-redirect');
  window.location.replace(redirect);
}
/**
 * Start Upload Video to S3
 */


function FormSubmitVideo(status) {
  var bar = $('#bar');
  var $ajaxCall = null;
  var percent = $('#percent');
  var method = $('#method').val();
  var doctor_method = $('#doctor_method').val();
  var fileVideo = $("#featuredImage")[0].files[0];
  /**
   * Cancel Upload
   */

  $(document).on('click', '.cancel-upload', function (e) {
    $ajaxCall.abort();
    DeleteCancelVideo();
    $('#js-progressbar-video-modal').addClass('d-none');
    $('#js-video-preview').addClass('d-none');
    console.log("Canceled");
  });

  if (method && doctor_method) {
    // urlife Storage
    document.getElementById("progress_div").style.display = "block";
    var percentVal = '0%';
    bar.width(percentVal);
    percent.html(percentVal);
    getToken(status, fileVideo);
  } else {
    // Local Storage
    var formData = new FormData();
    formData.append('action', 'save_video');
    formData.append('status', status);
    formData.append('title', $('#title').val());
    formData.append('content', $('.ql-editor').html());
    formData.append('method', 'local');
    formData.append('featuredImage', $("#featuredImage")[0].files[0]);
    $ajaxCall = jQuery.ajax({
      cache: false,
      url: dms_vars.ajaxurl,
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      xhr: function xhr() {
        document.getElementById("progress_div").style.display = "block";
        var percentVal = '0%';
        bar.width(percentVal);
        percent.html(percentVal);
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function (evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);
            var percentVal = percentComplete + '%';
            bar.width(percentVal);
            percent.html(percentVal);

            if (percentComplete === 100) {// do sumething
            }
          }
        }, false);
        return xhr;
      },
      success: function success(response) {
        var percentVal = '100%';
        bar.width(percentVal);
        percent.html(percentVal);
        $('#js-progressbar-video-modal').addClass('d-none');
        $('#js-cta-video-uploading').removeClass('d-none');
        $('#js-video-progress-bar-status').append('<div class="d-flex align-content-center mt-1"><span class="mr-1">Completed</span> <img src="../../wp-content/plugins/blogging-platform/assets/img/video-complete.svg"></div>');
        $('#js-saved-video').removeClass('d-none');
        $('.js-confirm-modal').removeClass('d-none');
        $('.modal-new_article__box-title').html(response.data.message);
        $('#js-saved-video').attr('data-redirect', response.data.goback);
      },
      error: function error(XMLHttpRequest, textStatus, errorThrown) {
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


function getToken(status, fileVideo) {
  var bar = $('#bar');
  var percent = $('#percent');
  var $ajaxCall = null;
  /**
   * Cancel Upload
   */

  $(document).on('click', '.cancel-upload', function (e) {
    $ajaxCall.abort();
    DeleteCancelVideo();
    $('#js-progressbar-video-modal').addClass('d-none');
    $('#js-video-preview').addClass('d-none');
    console.log("Canceled");
  });
  var formData = new FormData();
  formData.append('action', 'get_tokens');
  $ajaxCall = jQuery.ajax({
    cache: false,
    url: dms_vars.ajaxurl,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    success: function success(response) {
      var percentVal = '1%';
      bar.width(percentVal);
      percent.html(percentVal);
      var credentials = response.data.data;
      var s3 = setCognitoIdentity(response.data.data);
      console.log('::::GET TOKEN AND SET COGNITO:::');

      if (s3) {
        getProjectsAWS(status, s3, credentials, fileVideo);
      } else {
        errorProcess();
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
  });
  AWS.config.update({
    region: 'us-west-2'
  });
  var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {
      Bucket: 'com.urlifemedia.beta'
    }
  });
  var percentVal = '2%';
  bar.width(percentVal);
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

  $(document).on('click', '.cancel-upload', function (e) {
    $ajaxCall.abort();
    DeleteCancelVideo();
    $('#js-progressbar-video-modal').addClass('d-none');
    $('#js-video-preview').addClass('d-none');
    console.log("Canceled");
  });
  var formData = new FormData();
  formData.append('action', 'get_projects');
  $ajaxCall = jQuery.ajax({
    cache: false,
    url: dms_vars.ajaxurl,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    success: function success(response) {
      var percentVal = '3%';
      bar.width(percentVal);
      percent.html(percentVal);
      var project = response.data;
      console.log('::::GET PROJECT:::');

      if (project && project !== 'undefined') {
        createProjectsSKU(status, s3, project, credentials, fileVideo);
      } else {
        errorProcess();
      }
    },
    error: function error(XMLHttpRequest, textStatus, errorThrown) {
      errorProcess();
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

  $(document).on('click', '.cancel-upload', function (e) {
    $ajaxCall.abort();
    DeleteCancelVideo();
    $('#js-progressbar-video-modal').addClass('d-none');
    $('#js-video-preview').addClass('d-none');
    console.log("Canceled");
  });
  var formData = new FormData();
  formData.append('action', 'create_project_sku');
  formData.append('project_id', project);
  $ajaxCall = jQuery.ajax({
    cache: false,
    url: dms_vars.ajaxurl,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    success: function success(response) {
      var percentVal = '4%';
      bar.width(percentVal);
      percent.html(percentVal);
      var projectSKU = response.data;
      console.log('::::CREATE PROJECT SKU:::');

      if (projectSKU && projectSKU !== 'undefined') {
        createFile(status, s3, project, projectSKU, credentials, fileVideo);
      } else {
        errorProcess();
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

  $(document).on('click', '.cancel-upload', function (e) {
    $ajaxCall.abort();
    DeleteCancelVideo();
    $('#js-progressbar-video-modal').addClass('d-none');
    $('#js-video-preview').addClass('d-none');
    console.log("Canceled");
  });
  var formData = new FormData();
  formData.append('action', 'createFileURLife');
  formData.append('project_id', project);
  formData.append('project_sku', projectSKU);
  formData.append('fileName', fileVideo.name);
  formData.append('fileMimeType', fileVideo.type);
  formData.append('title', $('#title').val());
  formData.append('description', $('.ql-editor').html());
  $ajaxCall = jQuery.ajax({
    cache: false,
    url: dms_vars.ajaxurl,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    success: function success(response) {
      var percentVal = '5%';
      bar.width(percentVal);
      percent.html(percentVal); //var fileURLife = response.data.data[0].id;

      var fileURLife = response.data.data[0];
      console.log('::::CREATE FILE:::');

      if (fileURLife && fileURLife != 'undefined') {
        uploadFileAWS(status, s3, project, credentials, fileURLife, fileVideo);
      } else {
        errorProcess();
      }
    }
  });
}
/**
 * Upload File to AWS S3
 */


function uploadFileAWS(status, s3, project, credentials, fileURLife, fileVideo) {
  var bar = $('#bar');
  var percent = $('#percent');
  var fileName = fileVideo.name;
  var fileExt = fileName.split(".").pop();
  var fileKey = 'uploads/' + credentials.IdentityId + '/project/' + fileURLife.id + '.' + fileURLife.fileExt; //var fileKey = 'uploads/' + credentials.IdentityId + '/' + fileURLife.id + '.' + fileURLife.fileExt;

  s3.upload({
    Bucket: 'com.urlifemedia.beta',
    Key: fileKey,
    Body: fileVideo,
    ACL: 'public-read'
  }, function (err, data) {
    if (err) {
      console.log(err);
      errorProcess();
      return false;
    }

    console.log('::::UPLOAD FILE:::');
    sendDataWP(status, fileURLife, fileVideo, project, data);
  }).on('httpUploadProgress', function (progress) {
    var percentComplete = progress.loaded / progress.total;
    percentComplete = parseInt(percentComplete * 100) + 15;

    if (percentComplete < 100) {
      var percentVal = percentComplete + '%';
      bar.width(percentVal);
      percent.html(percentVal);
    }
  });
}
/**
 * Send Data to WP
 */


function sendDataWP(status, fileURLife, fileVideo, project, data) {
  var bar = $('#bar');
  var percent = $('#percent');
  var $ajaxCall = null;
  /**
   * Cancel Upload
   */

  $(document).on('click', '.cancel-upload', function (e) {
    $ajaxCall.abort();
    DeleteCancelVideo();
    $('#js-progressbar-video-modal').addClass('d-none');
    $('#js-video-preview').addClass('d-none');
    console.log("Canceled");
  });
  var formData = new FormData();
  formData.append('action', 'save_video');
  formData.append('status', status);
  formData.append('title', $('#title').val());
  formData.append('location', data.Location);
  formData.append('content', $('.ql-editor').html());
  formData.append('fileName', fileVideo.name);
  formData.append('fileMimeType', fileURLife.fileExt);
  formData.append('project_id', project);
  formData.append('file_id', fileURLife.id);
  formData.append('method', 'urlife');
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
    success: function success(response) {
      var percentVal = '100%';
      bar.width(percentVal);
      percent.html(percentVal);
      console.log('::::UPDATE FILE:::');
      $('#js-progressbar-video-modal').addClass('d-none');
      $('#js-cta-video-uploading').removeClass('d-none');
      $('#js-video-progress-bar-status').append('<div class="d-flex align-content-center mt-1"><span class="mr-1">Completed</span> <img src="../../wp-content/plugins/blogging-platform/assets/img/video-complete.svg"></div>');
      $('#js-saved-video').removeClass('d-none');
      $('.js-confirm-modal').removeClass('d-none');
      $('.modal-new_article__box-title').html(response.data.message);
      $('#js-saved-video').attr('data-redirect', response.data.goback);
    },
    error: function error(XMLHttpRequest, textStatus, errorThrown) {
      errorProcess();
    }
  });
}
/**
 * Ajax Save data Not upload
 */


function DeleteCancelVideo() {
  var formData = new FormData();
  formData.append('action', 'delete_cancel_video');
  jQuery.ajax({
    cache: false,
    url: dms_vars.ajaxurl,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    success: function success(response) {// Do something
    }
  });
}
/**
 * Ajax Save data Not upload
 */


function FormSaveVideo(status) {
  var formData = new FormData();
  formData.append('action', 'edit_video');
  formData.append('title', $('#title').val());
  formData.append('post_id', $('#post_id').val());
  formData.append('content', $('.ql-editor').html());
  jQuery.ajax({
    cache: false,
    url: dms_vars.ajaxurl,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    success: function success(response) {
      $('#js-insert-video-modal').addClass('d-none');
      $('#js-save-data-video-modal').removeClass('d-none');
      $('#js-video-message').html(response.data.message);
      $('#js-saved-video').attr('data-redirect', response.data.goback);
    }
  });
  return false;
}
/**
 * Ajax Delete Video
 */


function deleteVideo(status, post_id) {
  var opcion = confirm("You sure want to delete the video?");

  if (opcion == true) {
    var formData = new FormData();
    formData.append('action', 'delete_video');
    formData.append('status', status);
    formData.append(' post_id', post_id);
    jQuery.ajax({
      cache: false,
      url: dms_vars.ajaxurl,
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      complete: function complete() {
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
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* NicEdit - Micro Inline WYSIWYG
 * Copyright 2007-2008 Brian Kirchoff
 *
 * NicEdit is distributed under the terms of the MIT license
 * For more information visit http://nicedit.com/
 * Do not remove this copyright message
 */
var bkExtend = function bkExtend() {
  var A = arguments;

  if (A.length == 1) {
    A = [this, A[0]];
  }

  for (var B in A[1]) {
    A[0][B] = A[1][B];
  }

  return A[0];
};

function bkClass() {}

bkClass.prototype.construct = function () {};

bkClass.extend = function (C) {
  var A = function A() {
    if (arguments[0] !== bkClass) {
      return this.construct.apply(this, arguments);
    }
  };

  var B = new this(bkClass);
  bkExtend(B, C);
  A.prototype = B;
  A.extend = this.extend;
  return A;
};

var bkElement = bkClass.extend({
  construct: function construct(B, A) {
    if (typeof B == "string") {
      B = (A || document).createElement(B);
    }

    B = $BK(B);
    return B;
  },
  appendTo: function appendTo(A) {
    A.appendChild(this);
    return this;
  },
  appendBefore: function appendBefore(A) {
    A.parentNode.insertBefore(this, A);
    return this;
  },
  addEvent: function addEvent(B, A) {
    bkLib.addEvent(this, B, A);
    return this;
  },
  setContent: function setContent(A) {
    this.innerHTML = A;
    return this;
  },
  pos: function pos() {
    var C = curtop = 0;
    var B = obj = this;

    if (obj.offsetParent) {
      do {
        C += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
    }

    var A = !window.opera ? parseInt(this.getStyle("border-width") || this.style.border) || 0 : 0;
    return [C + A, curtop + A + this.offsetHeight];
  },
  noSelect: function noSelect() {
    bkLib.noSelect(this);
    return this;
  },
  parentTag: function parentTag(A) {
    var B = this;

    do {
      if (B && B.nodeName && B.nodeName.toUpperCase() == A) {
        return B;
      }

      B = B.parentNode;
    } while (B);

    return false;
  },
  hasClass: function hasClass(A) {
    return this.className.match(new RegExp("(\\s|^)nicEdit-" + A + "(\\s|$)"));
  },
  addClass: function addClass(A) {
    if (!this.hasClass(A)) {
      this.className += " nicEdit-" + A;
    }

    return this;
  },
  removeClass: function removeClass(A) {
    if (this.hasClass(A)) {
      this.className = this.className.replace(new RegExp("(\\s|^)nicEdit-" + A + "(\\s|$)"), " ");
    }

    return this;
  },
  setStyle: function setStyle(A) {
    var B = this.style;

    for (var C in A) {
      switch (C) {
        case "float":
          B.cssFloat = B.styleFloat = A[C];
          break;

        case "opacity":
          B.opacity = A[C];
          B.filter = "alpha(opacity=" + Math.round(A[C] * 100) + ")";
          break;

        case "className":
          this.className = A[C];
          break;

        default:
          B[C] = A[C];
      }
    }

    return this;
  },
  getStyle: function getStyle(A, C) {
    var B = !C ? document.defaultView : C;

    if (this.nodeType == 1) {
      return B && B.getComputedStyle ? B.getComputedStyle(this, null).getPropertyValue(A) : this.currentStyle[bkLib.camelize(A)];
    }
  },
  remove: function remove() {
    this.parentNode.removeChild(this);
    return this;
  },
  setAttributes: function setAttributes(A) {
    for (var B in A) {
      this[B] = A[B];
    }

    return this;
  }
});
var bkLib = {
  isMSIE: navigator.appVersion.indexOf("MSIE") != -1,
  addEvent: function addEvent(C, B, A) {
    C.addEventListener ? C.addEventListener(B, A, false) : C.attachEvent("on" + B, A);
  },
  toArray: function toArray(C) {
    var B = C.length,
        A = new Array(B);

    while (B--) {
      A[B] = C[B];
    }

    return A;
  },
  noSelect: function noSelect(B) {
    if (B.setAttribute && B.nodeName.toLowerCase() != "input" && B.nodeName.toLowerCase() != "textarea") {
      B.setAttribute("unselectable", "on");
    }

    for (var A = 0; A < B.childNodes.length; A++) {
      bkLib.noSelect(B.childNodes[A]);
    }
  },
  camelize: function camelize(A) {
    return A.replace(/\-(.)/g, function (B, C) {
      return C.toUpperCase();
    });
  },
  inArray: function inArray(A, B) {
    return bkLib.search(A, B) != null;
  },
  search: function search(A, C) {
    for (var B = 0; B < A.length; B++) {
      if (A[B] == C) {
        return B;
      }
    }

    return null;
  },
  cancelEvent: function cancelEvent(A) {
    A = A || window.event;

    if (A.preventDefault && A.stopPropagation) {
      A.preventDefault();
      A.stopPropagation();
    }

    return false;
  },
  domLoad: [],
  domLoaded: function domLoaded() {
    if (arguments.callee.done) {
      return;
    }

    arguments.callee.done = true;

    for (i = 0; i < bkLib.domLoad.length; i++) {
      bkLib.domLoad[i]();
    }
  },
  onDomLoaded: function onDomLoaded(A) {
    this.domLoad.push(A);

    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", bkLib.domLoaded, null);
    } else {
      if (bkLib.isMSIE) {
        document.write("<style>.nicEdit-main p { margin: 0; }</style><script id=__ie_onload defer " + (location.protocol == "https:" ? "src='javascript:void(0)'" : "src=//0") + "><\/script>");

        $BK("__ie_onload").onreadystatechange = function () {
          if (this.readyState == "complete") {
            bkLib.domLoaded();
          }
        };
      }
    }

    window.onload = bkLib.domLoaded;
  }
};

function $BK(A) {
  if (typeof A == "string") {
    A = document.getElementById(A);
  }

  return A && !A.appendTo ? bkExtend(A, bkElement.prototype) : A;
}

var bkEvent = {
  addEvent: function addEvent(A, B) {
    if (B) {
      this.eventList = this.eventList || {};
      this.eventList[A] = this.eventList[A] || [];
      this.eventList[A].push(B);
    }

    return this;
  },
  fireEvent: function fireEvent() {
    var A = bkLib.toArray(arguments),
        C = A.shift();

    if (this.eventList && this.eventList[C]) {
      for (var B = 0; B < this.eventList[C].length; B++) {
        this.eventList[C][B].apply(this, A);
      }
    }
  }
};

function __(A) {
  return A;
}

Function.prototype.closure = function () {
  var A = this,
      B = bkLib.toArray(arguments),
      C = B.shift();
  return function () {
    if (typeof bkLib != "undefined") {
      return A.apply(C, B.concat(bkLib.toArray(arguments)));
    }
  };
};

Function.prototype.closureListener = function () {
  var A = this,
      C = bkLib.toArray(arguments),
      B = C.shift();
  return function (E) {
    E = E || window.event;

    if (E.target) {
      var D = E.target;
    } else {
      var D = E.srcElement;
    }

    return A.apply(B, [E, D].concat(C));
  };
};

var nicEditorConfig = bkClass.extend({
  buttons: {
    'bold': {
      name: __('Click to Bold'),
      command: 'Bold',
      tags: ['B', 'STRONG'],
      css: {
        'font-weight': 'bold'
      },
      key: 'b'
    },
    'italic': {
      name: __('Click to Italic'),
      command: 'Italic',
      tags: ['EM', 'I'],
      css: {
        'font-style': 'italic'
      },
      key: 'i'
    },
    'underline': {
      name: __('Click to Underline'),
      command: 'Underline',
      tags: ['U'],
      css: {
        'text-decoration': 'underline'
      },
      key: 'u'
    },
    'left': {
      name: __('Left Align'),
      command: 'justifyleft',
      noActive: true
    },
    'center': {
      name: __('Center Align'),
      command: 'justifycenter',
      noActive: true
    },
    'right': {
      name: __('Right Align'),
      command: 'justifyright',
      noActive: true
    },
    'justify': {
      name: __('Justify Align'),
      command: 'justifyfull',
      noActive: true
    },
    'ol': {
      name: __('Insert Ordered List'),
      command: 'insertorderedlist',
      tags: ['OL']
    },
    'ul': {
      name: __('Insert Unordered List'),
      command: 'insertunorderedlist',
      tags: ['UL']
    },
    'subscript': {
      name: __('Click to Subscript'),
      command: 'subscript',
      tags: ['SUB']
    },
    'superscript': {
      name: __('Click to Superscript'),
      command: 'superscript',
      tags: ['SUP']
    },
    'strikethrough': {
      name: __('Click to Strike Through'),
      command: 'strikeThrough',
      css: {
        'text-decoration': 'line-through'
      }
    },
    'removeformat': {
      name: __('Remove Formatting'),
      command: 'removeformat',
      noActive: true
    },
    'indent': {
      name: __('Indent Text'),
      command: 'indent',
      noActive: true
    },
    'outdent': {
      name: __('Remove Indent'),
      command: 'outdent',
      noActive: true
    },
    'hr': {
      name: __('Horizontal Rule'),
      command: 'insertHorizontalRule',
      noActive: true
    }
  },
  iconsPath: 'http://js.nicedit.com/nicEditIcons-latest.gif',
  buttonList: ['save', 'bold', 'italic', 'underline', 'left', 'center', 'right', 'justify', 'ol', 'ul', 'fontSize', 'fontFamily', 'fontFormat', 'indent', 'outdent', 'image', 'upload', 'link', 'unlink', 'forecolor', 'bgcolor'],
  iconList: {
    "xhtml": 1,
    "bgcolor": 2,
    "forecolor": 3,
    "bold": 4,
    "center": 5,
    "hr": 6,
    "indent": 7,
    "italic": 8,
    "justify": 9,
    "left": 10,
    "ol": 11,
    "outdent": 12,
    "removeformat": 13,
    "right": 14,
    "save": 25,
    "strikethrough": 16,
    "subscript": 17,
    "superscript": 18,
    "ul": 19,
    "underline": 20,
    "image": 21,
    "link": 22,
    "unlink": 23,
    "close": 24,
    "arrow": 26,
    "upload": 27
  }
});
;
var nicEditors = {
  nicPlugins: [],
  editors: [],
  registerPlugin: function registerPlugin(B, A) {
    this.nicPlugins.push({
      p: B,
      o: A
    });
  },
  allTextAreas: function allTextAreas(C) {
    var A = document.getElementsByTagName("textarea");

    for (var B = 0; B < A.length; B++) {
      nicEditors.editors.push(new nicEditor(C).panelInstance(A[B]));
    }

    return nicEditors.editors;
  },
  findEditor: function findEditor(C) {
    var B = nicEditors.editors;

    for (var A = 0; A < B.length; A++) {
      if (B[A].instanceById(C)) {
        return B[A].instanceById(C);
      }
    }
  }
};
var nicEditor = bkClass.extend({
  construct: function construct(C) {
    this.options = new nicEditorConfig();
    bkExtend(this.options, C);
    this.nicInstances = new Array();
    this.loadedPlugins = new Array();
    var A = nicEditors.nicPlugins;

    for (var B = 0; B < A.length; B++) {
      this.loadedPlugins.push(new A[B].p(this, A[B].o));
    }

    nicEditors.editors.push(this);
    bkLib.addEvent(document.body, "mousedown", this.selectCheck.closureListener(this));
  },
  panelInstance: function panelInstance(B, C) {
    B = this.checkReplace($BK(B));
    var A = new bkElement("DIV").setStyle({
      width: (parseInt(B.getStyle("width")) || B.clientWidth) + "px"
    }).appendBefore(B);
    this.setPanel(A);
    return this.addInstance(B, C);
  },
  checkReplace: function checkReplace(B) {
    var A = nicEditors.findEditor(B);

    if (A) {
      A.removeInstance(B);
      A.removePanel();
    }

    return B;
  },
  addInstance: function addInstance(B, C) {
    B = this.checkReplace($BK(B));

    if (B.contentEditable || !!window.opera) {
      var A = new nicEditorInstance(B, C, this);
    } else {
      var A = new nicEditorIFrameInstance(B, C, this);
    }

    this.nicInstances.push(A);
    return this;
  },
  removeInstance: function removeInstance(C) {
    C = $BK(C);
    var B = this.nicInstances;

    for (var A = 0; A < B.length; A++) {
      if (B[A].e == C) {
        B[A].remove();
        this.nicInstances.splice(A, 1);
      }
    }
  },
  removePanel: function removePanel(A) {
    if (this.nicPanel) {
      this.nicPanel.remove();
      this.nicPanel = null;
    }
  },
  instanceById: function instanceById(C) {
    C = $BK(C);
    var B = this.nicInstances;

    for (var A = 0; A < B.length; A++) {
      if (B[A].e == C) {
        return B[A];
      }
    }
  },
  setPanel: function setPanel(A) {
    this.nicPanel = new nicEditorPanel($BK(A), this.options, this);
    this.fireEvent("panel", this.nicPanel);
    return this;
  },
  nicCommand: function nicCommand(B, A) {
    if (this.selectedInstance) {
      this.selectedInstance.nicCommand(B, A);
    }
  },
  getIcon: function getIcon(D, A) {
    var C = this.options.iconList[D];
    var B = A.iconFiles ? A.iconFiles[D] : "";
    return {
      backgroundImage: "url('" + (C ? this.options.iconsPath : B) + "')",
      backgroundPosition: (C ? (C - 1) * -18 : 0) + "px 0px"
    };
  },
  selectCheck: function selectCheck(C, A) {
    var B = false;

    do {
      if (A.className && A.className.indexOf("nicEdit") != -1) {
        return false;
      }
    } while (A = A.parentNode);

    this.fireEvent("blur", this.selectedInstance, A);
    this.lastSelectedInstance = this.selectedInstance;
    this.selectedInstance = null;
    return false;
  }
});
nicEditor = nicEditor.extend(bkEvent);
var nicEditorInstance = bkClass.extend({
  isSelected: false,
  construct: function construct(G, D, C) {
    this.ne = C;
    this.elm = this.e = G;
    this.options = D || {};
    newX = parseInt(G.getStyle("width")) || G.clientWidth;
    newY = parseInt(G.getStyle("height")) || G.clientHeight;
    this.initialHeight = newY - 8;
    var H = G.nodeName.toLowerCase() == "textarea";

    if (H || this.options.hasPanel) {
      var B = bkLib.isMSIE && !(typeof document.body.style.maxHeight != "undefined" && document.compatMode == "CSS1Compat");
      var E = {
        width: newX + "px",
        border: "1px solid #ccc",
        borderTop: 0,
        overflowY: "auto",
        overflowX: "hidden"
      };
      E[B ? "height" : "maxHeight"] = this.ne.options.maxHeight ? this.ne.options.maxHeight + "px" : null;
      this.editorContain = new bkElement("DIV").setStyle(E).appendBefore(G);
      var A = new bkElement("DIV").setStyle({
        width: newX - 8 + "px",
        margin: "4px",
        minHeight: newY + "px"
      }).addClass("main").appendTo(this.editorContain);
      G.setStyle({
        display: "none"
      });
      A.innerHTML = G.innerHTML;

      if (H) {
        A.setContent(G.value);
        this.copyElm = G;
        var F = G.parentTag("FORM");

        if (F) {
          bkLib.addEvent(F, "submit", this.saveContent.closure(this));
        }
      }

      A.setStyle(B ? {
        height: newY + "px"
      } : {
        overflow: "hidden"
      });
      this.elm = A;
    }

    this.ne.addEvent("blur", this.blur.closure(this));
    this.init();
    this.blur();
  },
  init: function init() {
    this.elm.setAttribute("contentEditable", "true");

    if (this.getContent() == "") {
      this.setContent("<br />");
    }

    this.instanceDoc = document.defaultView;
    this.elm.addEvent("mousedown", this.selected.closureListener(this)).addEvent("keypress", this.keyDown.closureListener(this)).addEvent("focus", this.selected.closure(this)).addEvent("blur", this.blur.closure(this)).addEvent("keyup", this.selected.closure(this));
    this.ne.fireEvent("add", this);
  },
  remove: function remove() {
    this.saveContent();

    if (this.copyElm || this.options.hasPanel) {
      this.editorContain.remove();
      this.e.setStyle({
        display: "block"
      });
      this.ne.removePanel();
    }

    this.disable();
    this.ne.fireEvent("remove", this);
  },
  disable: function disable() {
    this.elm.setAttribute("contentEditable", "false");
  },
  getSel: function getSel() {
    return window.getSelection ? window.getSelection() : document.selection;
  },
  getRng: function getRng() {
    var A = this.getSel();

    if (!A || A.rangeCount === 0) {
      return;
    }

    return A.rangeCount > 0 ? A.getRangeAt(0) : A.createRange();
  },
  selRng: function selRng(A, B) {
    if (window.getSelection) {
      B.removeAllRanges();
      B.addRange(A);
    } else {
      A.select();
    }
  },
  selElm: function selElm() {
    var C = this.getRng();

    if (!C) {
      return;
    }

    if (C.startContainer) {
      var D = C.startContainer;

      if (C.cloneContents().childNodes.length == 1) {
        for (var B = 0; B < D.childNodes.length; B++) {
          var A = D.childNodes[B].ownerDocument.createRange();
          A.selectNode(D.childNodes[B]);

          if (C.compareBoundaryPoints(Range.START_TO_START, A) != 1 && C.compareBoundaryPoints(Range.END_TO_END, A) != -1) {
            return $BK(D.childNodes[B]);
          }
        }
      }

      return $BK(D);
    } else {
      return $BK(this.getSel().type == "Control" ? C.item(0) : C.parentElement());
    }
  },
  saveRng: function saveRng() {
    this.savedRange = this.getRng();
    this.savedSel = this.getSel();
  },
  restoreRng: function restoreRng() {
    if (this.savedRange) {
      this.selRng(this.savedRange, this.savedSel);
    }
  },
  keyDown: function keyDown(B, A) {
    if (B.ctrlKey) {
      this.ne.fireEvent("key", this, B);
    }
  },
  selected: function selected(C, A) {
    if (!A && !(A = this.selElm)) {
      A = this.selElm();
    }

    if (!C.ctrlKey) {
      var B = this.ne.selectedInstance;

      if (B != this) {
        if (B) {
          this.ne.fireEvent("blur", B, A);
        }

        this.ne.selectedInstance = this;
        this.ne.fireEvent("focus", B, A);
      }

      this.ne.fireEvent("selected", B, A);
      this.isFocused = true;
      this.elm.addClass("selected");
    }

    return false;
  },
  blur: function blur() {
    this.isFocused = false;
    this.elm.removeClass("selected");
  },
  saveContent: function saveContent() {
    if (this.copyElm || this.options.hasPanel) {
      this.ne.fireEvent("save", this);
      this.copyElm ? this.copyElm.value = this.getContent() : this.e.innerHTML = this.getContent();
    }
  },
  getElm: function getElm() {
    return this.elm;
  },
  getContent: function getContent() {
    this.content = this.getElm().innerHTML;
    this.ne.fireEvent("get", this);
    return this.content;
  },
  setContent: function setContent(A) {
    this.content = A;
    this.ne.fireEvent("set", this);
    this.elm.innerHTML = this.content;
  },
  nicCommand: function nicCommand(B, A) {
    document.execCommand(B, false, A);
  }
});
var nicEditorIFrameInstance = nicEditorInstance.extend({
  savedStyles: [],
  init: function init() {
    var B = this.elm.innerHTML.replace(/^\s+|\s+$/g, "");
    this.elm.innerHTML = "";
    !B ? B = "<br />" : B;
    this.initialContent = B;
    this.elmFrame = new bkElement("iframe").setAttributes({
      src: "javascript:;",
      frameBorder: 0,
      allowTransparency: "true",
      scrolling: "no"
    }).setStyle({
      height: "100px",
      width: "100%"
    }).addClass("frame").appendTo(this.elm);

    if (this.copyElm) {
      this.elmFrame.setStyle({
        width: this.elm.offsetWidth - 4 + "px"
      });
    }

    var A = ["font-size", "font-family", "font-weight", "color"];

    for (itm in A) {
      this.savedStyles[bkLib.camelize(itm)] = this.elm.getStyle(itm);
    }

    setTimeout(this.initFrame.closure(this), 50);
  },
  disable: function disable() {
    this.elm.innerHTML = this.getContent();
  },
  initFrame: function initFrame() {
    var B = $BK(this.elmFrame.contentWindow.document);
    B.designMode = "on";
    B.open();
    var A = this.ne.options.externalCSS;
    B.write("<html><head>" + (A ? '<link href="' + A + '" rel="stylesheet" type="text/css" />' : "") + '</head><body id="nicEditContent" style="margin: 0 !important; background-color: transparent !important;">' + this.initialContent + "</body></html>");
    B.close();
    this.frameDoc = B;
    this.frameWin = $BK(this.elmFrame.contentWindow);
    this.frameContent = $BK(this.frameWin.document.body).setStyle(this.savedStyles);
    this.instanceDoc = this.frameWin.document.defaultView;
    this.heightUpdate();
    this.frameDoc.addEvent("mousedown", this.selected.closureListener(this)).addEvent("keyup", this.heightUpdate.closureListener(this)).addEvent("keydown", this.keyDown.closureListener(this)).addEvent("keyup", this.selected.closure(this));
    this.ne.fireEvent("add", this);
  },
  getElm: function getElm() {
    return this.frameContent;
  },
  setContent: function setContent(A) {
    this.content = A;
    this.ne.fireEvent("set", this);
    this.frameContent.innerHTML = this.content;
    this.heightUpdate();
  },
  getSel: function getSel() {
    return this.frameWin ? this.frameWin.getSelection() : this.frameDoc.selection;
  },
  heightUpdate: function heightUpdate() {
    this.elmFrame.style.height = Math.max(this.frameContent.offsetHeight, this.initialHeight) + "px";
  },
  nicCommand: function nicCommand(B, A) {
    this.frameDoc.execCommand(B, false, A);
    setTimeout(this.heightUpdate.closure(this), 100);
  }
});
var nicEditorPanel = bkClass.extend({
  construct: function construct(E, B, A) {
    this.elm = E;
    this.options = B;
    this.ne = A;
    this.panelButtons = new Array();
    this.buttonList = bkExtend([], this.ne.options.buttonList);
    this.panelContain = new bkElement("DIV").setStyle({
      overflow: "hidden",
      width: "100%",
      border: "1px solid #cccccc",
      backgroundColor: "#efefef"
    }).addClass("panelContain");
    this.panelElm = new bkElement("DIV").setStyle({
      margin: "2px",
      marginTop: "0px",
      zoom: 1,
      overflow: "hidden"
    }).addClass("panel").appendTo(this.panelContain);
    this.panelContain.appendTo(E);
    var C = this.ne.options;
    var D = C.buttons;

    for (button in D) {
      this.addButton(button, C, true);
    }

    this.reorder();
    E.noSelect();
  },
  addButton: function addButton(buttonName, options, noOrder) {
    var button = options.buttons[buttonName];
    var type = button.type ? eval("(typeof(" + button.type + ') == "undefined") ? null : ' + button.type + ";") : nicEditorButton;
    var hasButton = bkLib.inArray(this.buttonList, buttonName);

    if (type && (hasButton || this.ne.options.fullPanel)) {
      this.panelButtons.push(new type(this.panelElm, buttonName, options, this.ne));

      if (!hasButton) {
        this.buttonList.push(buttonName);
      }
    }
  },
  findButton: function findButton(B) {
    for (var A = 0; A < this.panelButtons.length; A++) {
      if (this.panelButtons[A].name == B) {
        return this.panelButtons[A];
      }
    }
  },
  reorder: function reorder() {
    var C = this.buttonList;

    for (var B = 0; B < C.length; B++) {
      var A = this.findButton(C[B]);

      if (A) {
        this.panelElm.appendChild(A.margin);
      }
    }
  },
  remove: function remove() {
    this.elm.remove();
  }
});
var nicEditorButton = bkClass.extend({
  construct: function construct(D, A, C, B) {
    this.options = C.buttons[A];
    this.name = A;
    this.ne = B;
    this.elm = D;
    this.margin = new bkElement("DIV").setStyle({
      "float": "left",
      marginTop: "2px"
    }).appendTo(D);
    this.contain = new bkElement("DIV").setStyle({
      width: "20px",
      height: "20px"
    }).addClass("buttonContain").appendTo(this.margin);
    this.border = new bkElement("DIV").setStyle({
      backgroundColor: "#efefef",
      border: "1px solid #efefef"
    }).appendTo(this.contain);
    this.button = new bkElement("DIV").setStyle({
      width: "18px",
      height: "18px",
      overflow: "hidden",
      zoom: 1,
      cursor: "pointer"
    }).addClass("button").setStyle(this.ne.getIcon(A, C)).appendTo(this.border);
    this.button.addEvent("mouseover", this.hoverOn.closure(this)).addEvent("mouseout", this.hoverOff.closure(this)).addEvent("mousedown", this.mouseClick.closure(this)).noSelect();

    if (!window.opera) {
      this.button.onmousedown = this.button.onclick = bkLib.cancelEvent;
    }

    B.addEvent("selected", this.enable.closure(this)).addEvent("blur", this.disable.closure(this)).addEvent("key", this.key.closure(this));
    this.disable();
    this.init();
  },
  init: function init() {},
  hide: function hide() {
    this.contain.setStyle({
      display: "none"
    });
  },
  updateState: function updateState() {
    if (this.isDisabled) {
      this.setBg();
    } else {
      if (this.isHover) {
        this.setBg("hover");
      } else {
        if (this.isActive) {
          this.setBg("active");
        } else {
          this.setBg();
        }
      }
    }
  },
  setBg: function setBg(A) {
    switch (A) {
      case "hover":
        var B = {
          border: "1px solid #666",
          backgroundColor: "#ddd"
        };
        break;

      case "active":
        var B = {
          border: "1px solid #666",
          backgroundColor: "#ccc"
        };
        break;

      default:
        var B = {
          border: "1px solid #efefef",
          backgroundColor: "#efefef"
        };
    }

    this.border.setStyle(B).addClass("button-" + A);
  },
  checkNodes: function checkNodes(A) {
    var B = A;

    do {
      if (this.options.tags && bkLib.inArray(this.options.tags, B.nodeName)) {
        this.activate();
        return true;
      }
    } while (B = B.parentNode && B.className != "nicEdit");

    B = $BK(A);

    while (B.nodeType == 3) {
      B = $BK(B.parentNode);
    }

    if (this.options.css) {
      for (itm in this.options.css) {
        if (B.getStyle(itm, this.ne.selectedInstance.instanceDoc) == this.options.css[itm]) {
          this.activate();
          return true;
        }
      }
    }

    this.deactivate();
    return false;
  },
  activate: function activate() {
    if (!this.isDisabled) {
      this.isActive = true;
      this.updateState();
      this.ne.fireEvent("buttonActivate", this);
    }
  },
  deactivate: function deactivate() {
    this.isActive = false;
    this.updateState();

    if (!this.isDisabled) {
      this.ne.fireEvent("buttonDeactivate", this);
    }
  },
  enable: function enable(A, B) {
    this.isDisabled = false;
    this.contain.setStyle({
      opacity: 1
    }).addClass("buttonEnabled");
    this.updateState();
    this.checkNodes(B);
  },
  disable: function disable(A, B) {
    this.isDisabled = true;
    this.contain.setStyle({
      opacity: 0.6
    }).removeClass("buttonEnabled");
    this.updateState();
  },
  toggleActive: function toggleActive() {
    this.isActive ? this.deactivate() : this.activate();
  },
  hoverOn: function hoverOn() {
    if (!this.isDisabled) {
      this.isHover = true;
      this.updateState();
      this.ne.fireEvent("buttonOver", this);
    }
  },
  hoverOff: function hoverOff() {
    this.isHover = false;
    this.updateState();
    this.ne.fireEvent("buttonOut", this);
  },
  mouseClick: function mouseClick() {
    if (this.options.command) {
      this.ne.nicCommand(this.options.command, this.options.commandArgs);

      if (!this.options.noActive) {
        this.toggleActive();
      }
    }

    this.ne.fireEvent("buttonClick", this);
  },
  key: function key(A, B) {
    if (this.options.key && B.ctrlKey && String.fromCharCode(B.keyCode || B.charCode).toLowerCase() == this.options.key) {
      this.mouseClick();

      if (B.preventDefault) {
        B.preventDefault();
      }
    }
  }
});
var nicPlugin = bkClass.extend({
  construct: function construct(B, A) {
    this.options = A;
    this.ne = B;
    this.ne.addEvent("panel", this.loadPanel.closure(this));
    this.init();
  },
  loadPanel: function loadPanel(C) {
    var B = this.options.buttons;

    for (var A in B) {
      C.addButton(A, this.options);
    }

    C.reorder();
  },
  init: function init() {}
});
var nicPaneOptions = {};
var nicEditorPane = bkClass.extend({
  construct: function construct(D, C, B, A) {
    this.ne = C;
    this.elm = D;
    this.pos = D.pos();
    this.contain = new bkElement("div").setStyle({
      zIndex: "99999",
      overflow: "hidden",
      position: "absolute",
      left: this.pos[0] + "px",
      top: this.pos[1] + "px"
    });
    this.pane = new bkElement("div").setStyle({
      fontSize: "12px",
      border: "1px solid #ccc",
      overflow: "hidden",
      padding: "4px",
      textAlign: "left",
      backgroundColor: "#ffffc9"
    }).addClass("pane").setStyle(B).appendTo(this.contain);

    if (A && !A.options.noClose) {
      this.close = new bkElement("div").setStyle({
        "float": "right",
        height: "16px",
        width: "16px",
        cursor: "pointer"
      }).setStyle(this.ne.getIcon("close", nicPaneOptions)).addEvent("mousedown", A.removePane.closure(this)).appendTo(this.pane);
    }

    this.contain.noSelect().appendTo(document.body);
    this.position();
    this.init();
  },
  init: function init() {},
  position: function position() {
    if (this.ne.nicPanel) {
      var B = this.ne.nicPanel.elm;
      var A = B.pos();
      var C = A[0] + parseInt(B.getStyle("width")) - (parseInt(this.pane.getStyle("width")) + 8);

      if (C < this.pos[0]) {
        this.contain.setStyle({
          left: C + "px"
        });
      }
    }
  },
  toggle: function toggle() {
    this.isVisible = !this.isVisible;
    this.contain.setStyle({
      display: this.isVisible ? "block" : "none"
    });
  },
  remove: function remove() {
    if (this.contain) {
      this.contain.remove();
      this.contain = null;
    }
  },
  append: function append(A) {
    A.appendTo(this.pane);
  },
  setContent: function setContent(A) {
    this.pane.setContent(A);
  }
});
var nicSelectOptions = {
  buttons: {
    'fontSize': {
      name: __('Select Font Size'),
      type: 'nicEditorFontSizeSelect',
      command: 'fontsize'
    },
    'fontFamily': {
      name: __('Select Font Family'),
      type: 'nicEditorFontFamilySelect',
      command: 'fontname'
    },
    'fontFormat': {
      name: __('Select Font Format'),
      type: 'nicEditorFontFormatSelect',
      command: 'formatBlock'
    }
  }
};
var nicEditorSelect = bkClass.extend({
  construct: function construct(D, A, C, B) {
    this.options = C.buttons[A];
    this.elm = D;
    this.ne = B;
    this.name = A;
    this.selOptions = new Array();
    this.margin = new bkElement("div").setStyle({
      "float": "left",
      margin: "2px 1px 0 1px"
    }).appendTo(this.elm);
    this.contain = new bkElement("div").setStyle({
      width: "90px",
      height: "20px",
      cursor: "pointer",
      overflow: "hidden"
    }).addClass("selectContain").addEvent("click", this.toggle.closure(this)).appendTo(this.margin);
    this.items = new bkElement("div").setStyle({
      overflow: "hidden",
      zoom: 1,
      border: "1px solid #ccc",
      paddingLeft: "3px",
      backgroundColor: "#fff"
    }).appendTo(this.contain);
    this.control = new bkElement("div").setStyle({
      overflow: "hidden",
      "float": "right",
      height: "18px",
      width: "16px"
    }).addClass("selectControl").setStyle(this.ne.getIcon("arrow", C)).appendTo(this.items);
    this.txt = new bkElement("div").setStyle({
      overflow: "hidden",
      "float": "left",
      width: "66px",
      height: "14px",
      marginTop: "1px",
      fontFamily: "sans-serif",
      textAlign: "center",
      fontSize: "12px"
    }).addClass("selectTxt").appendTo(this.items);

    if (!window.opera) {
      this.contain.onmousedown = this.control.onmousedown = this.txt.onmousedown = bkLib.cancelEvent;
    }

    this.margin.noSelect();
    this.ne.addEvent("selected", this.enable.closure(this)).addEvent("blur", this.disable.closure(this));
    this.disable();
    this.init();
  },
  disable: function disable() {
    this.isDisabled = true;
    this.close();
    this.contain.setStyle({
      opacity: 0.6
    });
  },
  enable: function enable(A) {
    this.isDisabled = false;
    this.close();
    this.contain.setStyle({
      opacity: 1
    });
  },
  setDisplay: function setDisplay(A) {
    this.txt.setContent(A);
  },
  toggle: function toggle() {
    if (!this.isDisabled) {
      this.pane ? this.close() : this.open();
    }
  },
  open: function open() {
    this.pane = new nicEditorPane(this.items, this.ne, {
      width: "88px",
      padding: "0px",
      borderTop: 0,
      borderLeft: "1px solid #ccc",
      borderRight: "1px solid #ccc",
      borderBottom: "0px",
      backgroundColor: "#fff"
    });

    for (var C = 0; C < this.selOptions.length; C++) {
      var _bkElement$setStyle;

      var B = this.selOptions[C];
      var A = new bkElement("div").setStyle((_bkElement$setStyle = {
        overflow: "hidden",
        borderBottom: "1px solid #ccc",
        width: "88px",
        textAlign: "left"
      }, _defineProperty(_bkElement$setStyle, "overflow", "hidden"), _defineProperty(_bkElement$setStyle, "cursor", "pointer"), _bkElement$setStyle));
      var D = new bkElement("div").setStyle({
        padding: "0px 4px"
      }).setContent(B[1]).appendTo(A).noSelect();
      D.addEvent("click", this.update.closure(this, B[0])).addEvent("mouseover", this.over.closure(this, D)).addEvent("mouseout", this.out.closure(this, D)).setAttributes("id", B[0]);
      this.pane.append(A);

      if (!window.opera) {
        D.onmousedown = bkLib.cancelEvent;
      }
    }
  },
  close: function close() {
    if (this.pane) {
      this.pane = this.pane.remove();
    }
  },
  over: function over(A) {
    A.setStyle({
      backgroundColor: "#ccc"
    });
  },
  out: function out(A) {
    A.setStyle({
      backgroundColor: "#fff"
    });
  },
  add: function add(B, A) {
    this.selOptions.push(new Array(B, A));
  },
  update: function update(A) {
    this.ne.nicCommand(this.options.command, A);
    this.close();
  }
});
var nicEditorFontSizeSelect = nicEditorSelect.extend({
  sel: {
    1: "1&nbsp;(8pt)",
    2: "2&nbsp;(10pt)",
    3: "3&nbsp;(12pt)",
    4: "4&nbsp;(14pt)",
    5: "5&nbsp;(18pt)",
    6: "6&nbsp;(24pt)"
  },
  init: function init() {
    this.setDisplay("Font&nbsp;Size...");

    for (itm in this.sel) {
      this.add(itm, '<font size="' + itm + '">' + this.sel[itm] + "</font>");
    }
  }
});
var nicEditorFontFamilySelect = nicEditorSelect.extend({
  sel: {
    arial: "Arial",
    "comic sans ms": "Comic Sans",
    "courier new": "Courier New",
    georgia: "Georgia",
    helvetica: "Helvetica",
    impact: "Impact",
    "times new roman": "Times",
    "trebuchet ms": "Trebuchet",
    verdana: "Verdana"
  },
  init: function init() {
    this.setDisplay("Font&nbsp;Family...");

    for (itm in this.sel) {
      this.add(itm, '<font face="' + itm + '">' + this.sel[itm] + "</font>");
    }
  }
});
var nicEditorFontFormatSelect = nicEditorSelect.extend({
  sel: {
    p: "Paragraph",
    pre: "Pre",
    h6: "Heading&nbsp;6",
    h5: "Heading&nbsp;5",
    h4: "Heading&nbsp;4",
    h3: "Heading&nbsp;3",
    h2: "Heading&nbsp;2",
    h1: "Heading&nbsp;1"
  },
  init: function init() {
    this.setDisplay("Font&nbsp;Format...");

    for (itm in this.sel) {
      var A = itm.toUpperCase();
      this.add("<" + A + ">", "<" + itm + ' style="padding: 0px; margin: 0px;">' + this.sel[itm] + "</" + A + ">");
    }
  }
});
nicEditors.registerPlugin(nicPlugin, nicSelectOptions);
var nicButtonTips = bkClass.extend({
  construct: function construct(A) {
    this.ne = A;
    A.addEvent("buttonOver", this.show.closure(this)).addEvent("buttonOut", this.hide.closure(this));
  },
  show: function show(A) {
    this.timer = setTimeout(this.create.closure(this, A), 400);
  },
  create: function create(A) {
    this.timer = null;

    if (!this.pane) {
      this.pane = new nicEditorPane(A.button, this.ne, {
        fontSize: "12px",
        marginTop: "5px"
      });
      this.pane.setContent(A.options.name);
    }
  },
  hide: function hide(A) {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    if (this.pane) {
      this.pane = this.pane.remove();
    }
  }
});
nicEditors.registerPlugin(nicButtonTips);
var nicEditorAdvancedButton = nicEditorButton.extend({
  init: function init() {
    this.ne.addEvent("selected", this.removePane.closure(this)).addEvent("blur", this.removePane.closure(this));
  },
  mouseClick: function mouseClick() {
    if (!this.isDisabled) {
      if (this.pane && this.pane.pane) {
        this.removePane();
      } else {
        this.pane = new nicEditorPane(this.contain, this.ne, {
          width: this.width || "270px",
          backgroundColor: "#fff"
        }, this);
        this.addPane();
        this.ne.selectedInstance.saveRng();
      }
    }
  },
  addForm: function addForm(C, G) {
    this.form = new bkElement("form").addEvent("submit", this.submit.closureListener(this));
    this.pane.append(this.form);
    this.inputs = {};

    for (itm in C) {
      var D = C[itm];
      var F = "";

      if (G) {
        F = G.getAttribute(itm);
      }

      if (!F) {
        F = D.value || "";
      }

      var A = C[itm].type;

      if (A == "title") {
        new bkElement("div").setContent(D.txt).setStyle({
          fontSize: "14px",
          fontWeight: "bold",
          padding: "0px",
          margin: "2px 0"
        }).appendTo(this.form);
      } else {
        var B = new bkElement("div").setStyle({
          overflow: "hidden",
          clear: "both"
        }).appendTo(this.form);

        if (D.txt) {
          new bkElement("label").setAttributes({
            "for": itm
          }).setContent(D.txt).setStyle({
            margin: "2px 4px",
            fontSize: "13px",
            width: "50px",
            lineHeight: "20px",
            textAlign: "right",
            "float": "left"
          }).appendTo(B);
        }

        switch (A) {
          case "text":
            this.inputs[itm] = new bkElement("input").setAttributes({
              id: itm,
              value: F,
              type: "text"
            }).setStyle({
              margin: "2px 0",
              fontSize: "13px",
              "float": "left",
              height: "20px",
              border: "1px solid #ccc",
              overflow: "hidden"
            }).setStyle(D.style).appendTo(B);
            break;

          case "select":
            this.inputs[itm] = new bkElement("select").setAttributes({
              id: itm
            }).setStyle({
              border: "1px solid #ccc",
              "float": "left",
              margin: "2px 0"
            }).appendTo(B);

            for (opt in D.options) {
              var E = new bkElement("option").setAttributes({
                value: opt,
                selected: opt == F ? "selected" : ""
              }).setContent(D.options[opt]).appendTo(this.inputs[itm]);
            }

            break;

          case "content":
            this.inputs[itm] = new bkElement("textarea").setAttributes({
              id: itm
            }).setStyle({
              border: "1px solid #ccc",
              "float": "left"
            }).setStyle(D.style).appendTo(B);
            this.inputs[itm].value = F;
        }
      }
    }

    new bkElement("input").setAttributes({
      type: "submit"
    }).setStyle({
      backgroundColor: "#efefef",
      border: "1px solid #ccc",
      margin: "3px 0",
      "float": "left",
      clear: "both"
    }).appendTo(this.form);
    this.form.onsubmit = bkLib.cancelEvent;
  },
  submit: function submit() {},
  findElm: function findElm(B, A, E) {
    var D = this.ne.selectedInstance.getElm().getElementsByTagName(B);

    for (var C = 0; C < D.length; C++) {
      if (D[C].getAttribute(A) == E) {
        return $BK(D[C]);
      }
    }
  },
  removePane: function removePane() {
    if (this.pane) {
      this.pane.remove();
      this.pane = null;
      this.ne.selectedInstance.restoreRng();
    }
  }
});
var nicLinkOptions = {
  buttons: {
    'link': {
      name: 'Add Link',
      type: 'nicLinkButton',
      tags: ['A']
    },
    'unlink': {
      name: 'Remove Link',
      command: 'unlink',
      noActive: true
    }
  }
};
var nicLinkButton = nicEditorAdvancedButton.extend({
  addPane: function addPane() {
    this.ln = this.ne.selectedInstance.selElm().parentTag("A");
    this.addForm({
      "": {
        type: "title",
        txt: "Add/Edit Link"
      },
      href: {
        type: "text",
        txt: "URL",
        value: "http://",
        style: {
          width: "150px"
        }
      },
      title: {
        type: "text",
        txt: "Title"
      },
      target: {
        type: "select",
        txt: "Open In",
        options: {
          "": "Current Window",
          _blank: "New Window"
        },
        style: {
          width: "100px"
        }
      }
    }, this.ln);
  },
  submit: function submit(C) {
    var A = this.inputs.href.value;

    if (A == "http://" || A == "") {
      alert("You must enter a URL to Create a Link");
      return false;
    }

    this.removePane();

    if (!this.ln) {
      var B = "javascript:nicTemp();";
      this.ne.nicCommand("createlink", B);
      this.ln = this.findElm("A", "href", B);
    }

    if (this.ln) {
      this.ln.setAttributes({
        href: this.inputs.href.value,
        title: this.inputs.title.value,
        target: this.inputs.target.options[this.inputs.target.selectedIndex].value
      });
    }
  }
});
nicEditors.registerPlugin(nicPlugin, nicLinkOptions);
var nicColorOptions = {
  buttons: {
    'forecolor': {
      name: __('Change Text Color'),
      type: 'nicEditorColorButton',
      noClose: true
    },
    'bgcolor': {
      name: __('Change Background Color'),
      type: 'nicEditorBgColorButton',
      noClose: true
    }
  }
};
var nicEditorColorButton = nicEditorAdvancedButton.extend({
  addPane: function addPane() {
    var D = {
      0: "00",
      1: "33",
      2: "66",
      3: "99",
      4: "CC",
      5: "FF"
    };
    var H = new bkElement("DIV").setStyle({
      width: "270px"
    });

    for (var A in D) {
      for (var F in D) {
        for (var E in D) {
          var I = "#" + D[A] + D[E] + D[F];
          var C = new bkElement("DIV").setStyle({
            cursor: "pointer",
            height: "15px",
            "float": "left"
          }).appendTo(H);
          var G = new bkElement("DIV").setStyle({
            border: "2px solid " + I
          }).appendTo(C);
          var B = new bkElement("DIV").setStyle({
            backgroundColor: I,
            overflow: "hidden",
            width: "11px",
            height: "11px"
          }).addEvent("click", this.colorSelect.closure(this, I)).addEvent("mouseover", this.on.closure(this, G)).addEvent("mouseout", this.off.closure(this, G, I)).appendTo(G);

          if (!window.opera) {
            C.onmousedown = B.onmousedown = bkLib.cancelEvent;
          }
        }
      }
    }

    this.pane.append(H.noSelect());
  },
  colorSelect: function colorSelect(A) {
    this.ne.nicCommand("foreColor", A);
    this.removePane();
  },
  on: function on(A) {
    A.setStyle({
      border: "2px solid #000"
    });
  },
  off: function off(A, B) {
    A.setStyle({
      border: "2px solid " + B
    });
  }
});
var nicEditorBgColorButton = nicEditorColorButton.extend({
  colorSelect: function colorSelect(A) {
    this.ne.nicCommand("hiliteColor", A);
    this.removePane();
  }
});
nicEditors.registerPlugin(nicPlugin, nicColorOptions);
var nicImageOptions = {
  buttons: {
    'image': {
      name: 'Add Image',
      type: 'nicImageButton',
      tags: ['IMG']
    }
  }
};
var nicImageButton = nicEditorAdvancedButton.extend({
  addPane: function addPane() {
    this.im = this.ne.selectedInstance.selElm().parentTag("IMG");
    this.addForm({
      "": {
        type: "title",
        txt: "Add/Edit Image"
      },
      src: {
        type: "text",
        txt: "URL",
        value: "http://",
        style: {
          width: "150px"
        }
      },
      alt: {
        type: "text",
        txt: "Alt Text",
        style: {
          width: "100px"
        }
      },
      align: {
        type: "select",
        txt: "Align",
        options: {
          none: "Default",
          left: "Left",
          right: "Right"
        }
      }
    }, this.im);
  },
  submit: function submit(B) {
    var C = this.inputs.src.value;

    if (C == "" || C == "http://") {
      alert("You must enter a Image URL to insert");
      return false;
    }

    this.removePane();

    if (!this.im) {
      var A = "javascript:nicImTemp();";
      this.ne.nicCommand("insertImage", A);
      this.im = this.findElm("IMG", "src", A);
    }

    if (this.im) {
      this.im.setAttributes({
        src: this.inputs.src.value,
        alt: this.inputs.alt.value,
        align: this.inputs.align.value
      });
    }
  }
});
nicEditors.registerPlugin(nicPlugin, nicImageOptions);
var nicSaveOptions = {
  buttons: {
    'save': {
      name: __('Save this content'),
      type: 'nicEditorSaveButton'
    }
  }
};
var nicEditorSaveButton = nicEditorButton.extend({
  init: function init() {
    if (!this.ne.options.onSave) {
      this.margin.setStyle({
        display: "none"
      });
    }
  },
  mouseClick: function mouseClick() {
    var B = this.ne.options.onSave;
    var A = this.ne.selectedInstance;
    B(A.getContent(), A.elm.id, A);
  }
});
nicEditors.registerPlugin(nicPlugin, nicSaveOptions);
var nicXHTML = bkClass.extend({
  stripAttributes: ["_moz_dirty", "_moz_resizing", "_extended"],
  noShort: ["style", "title", "script", "textarea", "a"],
  cssReplace: {
    "font-weight:bold;": "strong",
    "font-style:italic;": "em"
  },
  sizes: {
    1: "xx-small",
    2: "x-small",
    3: "small",
    4: "medium",
    5: "large",
    6: "x-large"
  },
  construct: function construct(A) {
    this.ne = A;

    if (this.ne.options.xhtml) {
      A.addEvent("get", this.cleanup.closure(this));
    }
  },
  cleanup: function cleanup(A) {
    var B = A.getElm();
    var C = this.toXHTML(B);
    A.content = C;
  },
  toXHTML: function toXHTML(C, A, L) {
    var G = "";
    var O = "";
    var P = "";
    var I = C.nodeType;
    var Q = C.nodeName.toLowerCase();
    var N = C.hasChildNodes && C.hasChildNodes();
    var B = new Array();

    switch (I) {
      case 1:
        var H = C.attributes;

        switch (Q) {
          case "b":
            Q = "strong";
            break;

          case "i":
            Q = "em";
            break;

          case "font":
            Q = "span";
            break;
        }

        if (A) {
          for (var F = 0; F < H.length; F++) {
            var K = H[F];
            var M = K.nodeName.toLowerCase();
            var D = K.nodeValue;

            if (!K.specified || !D || bkLib.inArray(this.stripAttributes, M) || typeof D == "function") {
              continue;
            }

            switch (M) {
              case "style":
                var J = D.replace(/ /g, "");

                for (itm in this.cssReplace) {
                  if (J.indexOf(itm) != -1) {
                    B.push(this.cssReplace[itm]);
                    J = J.replace(itm, "");
                  }
                }

                P += J;
                D = "";
                break;

              case "class":
                D = D.replace("Apple-style-span", "");
                break;

              case "size":
                P += "font-size:" + this.sizes[D] + ";";
                D = "";
                break;
            }

            if (D) {
              O += " " + M + '="' + D + '"';
            }
          }

          if (P) {
            O += ' style="' + P + '"';
          }

          for (var F = 0; F < B.length; F++) {
            G += "<" + B[F] + ">";
          }

          if (O == "" && Q == "span") {
            A = false;
          }

          if (A) {
            G += "<" + Q;

            if (Q != "br") {
              G += O;
            }
          }
        }

        if (!N && !bkLib.inArray(this.noShort, M)) {
          if (A) {
            G += " />";
          }
        } else {
          if (A) {
            G += ">";
          }

          for (var F = 0; F < C.childNodes.length; F++) {
            var E = this.toXHTML(C.childNodes[F], true, true);

            if (E) {
              G += E;
            }
          }
        }

        if (A && N) {
          G += "</" + Q + ">";
        }

        for (var F = 0; F < B.length; F++) {
          G += "</" + B[F] + ">";
        }

        break;

      case 3:
        G += C.nodeValue;
        break;
    }

    return G;
  }
});
nicEditors.registerPlugin(nicXHTML);
var nicCodeOptions = {
  buttons: {
    'xhtml': {
      name: 'Edit HTML',
      type: 'nicCodeButton'
    }
  }
};
var nicCodeButton = nicEditorAdvancedButton.extend({
  width: "350px",
  addPane: function addPane() {
    this.addForm({
      "": {
        type: "title",
        txt: "Edit HTML"
      },
      code: {
        type: "content",
        value: this.ne.selectedInstance.getContent(),
        style: {
          width: "340px",
          height: "200px"
        }
      }
    });
  },
  submit: function submit(B) {
    var A = this.inputs.code.value;
    this.ne.selectedInstance.setContent(A);
    this.removePane();
  }
});
nicEditors.registerPlugin(nicPlugin, nicCodeOptions);
var nicBBCode = bkClass.extend({
  construct: function construct(A) {
    this.ne = A;

    if (this.ne.options.bbCode) {
      A.addEvent("get", this.bbGet.closure(this));
      A.addEvent("set", this.bbSet.closure(this));
      var B = this.ne.loadedPlugins;

      for (itm in B) {
        if (B[itm].toXHTML) {
          this.xhtml = B[itm];
        }
      }
    }
  },
  bbGet: function bbGet(A) {
    var B = this.xhtml.toXHTML(A.getElm());
    A.content = this.toBBCode(B);
  },
  bbSet: function bbSet(A) {
    A.content = this.fromBBCode(A.content);
  },
  toBBCode: function toBBCode(B) {
    function A(D, C) {
      B = B.replace(D, C);
    }

    A(/\n/gi, "");
    A(/<strong>(.*?)<\/strong>/gi, "[b]$1[/b]");
    A(/<em>(.*?)<\/em>/gi, "[i]$1[/i]");
    A(/<span.*?style="text-decoration:underline;">(.*?)<\/span>/gi, "[u]$1[/u]");
    A(/<ul>(.*?)<\/ul>/gi, "[list]$1[/list]");
    A(/<li>(.*?)<\/li>/gi, "[*]$1[]");
    A(/<ol>(.*?)<\/ol>/gi, "[list=1]$1[/list]");
    A(/<img.*?src="(.*?)".*?>/gi, "[img]$1[/img]");
    A(/<a.*?href="(.*?)".*?>(.*?)<\/a>/gi, "[url=$1]$2[/url]");
    A(/<br.*?>/gi, "\n");
    A(/<.*?>.*?<\/.*?>/gi, "");
    return B;
  },
  fromBBCode: function fromBBCode(A) {
    function B(D, C) {
      A = A.replace(D, C);
    }

    B(/\[b\](.*?)\[\/b\]/gi, "<strong>$1</strong>");
    B(/\[i\](.*?)\[\/i\]/gi, "<em>$1</em>");
    B(/\[u\](.*?)\[\/u\]/gi, '<span style="text-decoration:underline;">$1</span>');
    B(/\[list\](.*?)\[\/list\]/gi, "<ul>$1</ul>");
    B(/\[list=1\](.*?)\[\/list\]/gi, "<ol>$1</ol>");
    B(/\[\*\](.*?)\[\/\*\]/gi, "<li>$1</li>");
    B(/\[img\](.*?)\[\/img\]/gi, '<img src="$1" />');
    B(/\[url=(.*?)\](.*?)\[\/url\]/gi, '<a href="$1">$2</a>');
    B(/\n/gi, "<br />");
    return A;
  }
});
nicEditors.registerPlugin(nicBBCode);
var nicUploadOptions = {
  buttons: {
    'upload': {
      name: 'Upload Image',
      type: 'nicUploadButton'
    }
  }
};
var nicUploadButton = nicEditorAdvancedButton.extend({
  nicURI: "https://api.imgur.com/3/image",
  errorText: "Failed to upload image",
  addPane: function addPane() {
    if (typeof window.FormData === "undefined") {
      return this.onError("Image uploads are not supported in this browser, use Chrome, Firefox, or Safari instead.");
    }

    this.im = this.ne.selectedInstance.selElm().parentTag("IMG");
    var A = new bkElement("div").setStyle({
      padding: "10px"
    }).appendTo(this.pane.pane);
    new bkElement("div").setStyle({
      fontSize: "14px",
      fontWeight: "bold",
      paddingBottom: "5px"
    }).setContent("Insert an Image").appendTo(A);
    this.fileInput = new bkElement("input").setAttributes({
      type: "file"
    }).appendTo(A);
    this.progress = new bkElement("progress").setStyle({
      width: "100%",
      display: "none"
    }).setAttributes("max", 100).appendTo(A);
    this.fileInput.onchange = this.uploadFile.closure(this);
  },
  onError: function onError(A) {
    this.removePane();
    alert(A || "Failed to upload image");
  },
  uploadFile: function uploadFile() {
    var B = this.fileInput.files[0];

    if (!B || !B.type.match(/image.*/)) {
      this.onError("Only image files can be uploaded");
      return;
    }

    this.fileInput.setStyle({
      display: "none"
    });
    this.setProgress(0);
    var A = new FormData();
    A.append("image", B);
    var C = new XMLHttpRequest();
    C.open("POST", this.ne.options.uploadURI || this.nicURI);

    C.onload = function () {
      try {
        var D = JSON.parse(C.responseText).data;
      } catch (E) {
        return this.onError();
      }

      if (D.error) {
        return this.onError(D.error);
      }

      this.onUploaded(D);
    }.closure(this);

    C.onerror = this.onError.closure(this);

    C.upload.onprogress = function (D) {
      this.setProgress(D.loaded / D.total);
    }.closure(this);

    C.setRequestHeader("Authorization", "Client-ID c37fc05199a05b7");
    C.send(A);
  },
  setProgress: function setProgress(A) {
    this.progress.setStyle({
      display: "block"
    });

    if (A < 0.98) {
      this.progress.value = A;
    } else {
      this.progress.removeAttribute("value");
    }
  },
  onUploaded: function onUploaded(B) {
    this.removePane();
    var D = B.link;

    if (!this.im) {
      this.ne.selectedInstance.restoreRng();
      var C = "javascript:nicImTemp();";
      this.ne.nicCommand("insertImage", D);
      this.im = this.findElm("IMG", "src", D);
    }

    var A = parseInt(this.ne.selectedInstance.elm.getStyle("width"));

    if (this.im) {
      this.im.setAttributes({
        src: D,
        width: A && B.width ? Math.min(A, B.width) : ""
      });
    }
  }
});
nicEditors.registerPlugin(nicPlugin, nicUploadOptions);
"use strict";

/**
 * Switch show password
 */
function showPassword(eye, id) {
  var x = document.getElementById(id);

  if (x.type === "password") {
    x.type = "text";
    $(eye).addClass('fa-eye-slash').removeClass('fa-eye');
  } else {
    x.type = "password";
    $(eye).addClass('fa-eye').removeClass('fa-eye-slash');
  }
}
/**
 * Read More
 */


function readMore(id) {
  $('#js-show-' + id).css('display', 'none');
  $('#js-more-' + id).removeClass('d-none ');
}
/**
* Read Less
*/


function readLess(id) {
  $('#js-more-' + id).addClass('d-none');
  $('#js-show-' + id).css('display', 'block');
}
/**
 * Modal Show
 */


function showDoctorModal(completename, username, useremail) {
  //input completename
  $('#acf-field_5d645ddc0ab2c-group_rip2322322').val(completename); //input username

  $('#acf-field_5d645ddc0ab2c-group_rip522322').val(username); //input useremail

  $('#acf-field_5d645ddc0ab2c-group_rip54322').val(useremail);
  $('#js-insert-review-modal').removeClass('d-none');
  $('#acf-form-data').addClass('acf-hidden');
  $('.modal-header').css({
    'visibility': 'visible'
  });
  $('#acf-field_5d645ddc0ab2c-group_rop54312-Yes').attr('checked', 'checked');
}

function showAppReviewsModal(completename, username, useremail, app, app_link) {
  //input completename
  $('#acf-field_5d645ddc0ab2c-group_rip2322322').val(completename); //input username

  $('#acf-field_5d645ddc0ab2c-group_rip522322').val(username); //input useremail

  $('#acf-field_5d645ddc0ab2c-group_rip54322').val(useremail); //add option to select
  //$( '#acf-field_5d64629ede297' ).append(`<option value="${app}">${app}</option>`); 
  //auto select option

  $('#acf-field_5d64629ede297').val(app).change(); //show modal

  $('#js-insert-review-modal').removeClass('d-none');
  $('#acf-form-data').removeClass('acf-hidden');
  $('#js-app-reviews-modal-title').remove();
  $('#acf-form-data').append('<div id="js-app-reviews-modal-title" class="d-flex flex-row justify-content-between"><h2>' + app + '</h2><a href="' + app_link + '" target="_blank" class="text-danger mt-2">View App</a></div>');
  $('.modal-header').css({
    'visibility': 'hidden'
  });
  $('#acf-field_5d645ddc0ab2c-group_rop54312-Yes').attr('checked', 'checked');
}
/**
* Modal Hide
*/


function hideModal() {
  $('#js-insert-reviews-modal').addClass('d-none');
}
/**
 * Modal Map Hide
 */


function hideModalMap() {
  $('#bio-clinic').removeClass('active');
}
/**
 * Stars in Input type Range
 */


$(document).ready(function () {
  var $s1input = $('#acf-field_5d64533dc0ab2c-field_app22c07ea20cf9');
  $('.acf-field-app22c07ea20cf9 .acf-range-wrap').hide();
  $('.acf-field-app22c07ea20cf9 .acf-input').starrr({
    max: 5,
    rating: $s1input.val(),
    change: function change(e, value) {
      $s1input.val(value).trigger('input');
    }
  });
  var $s2input = $('#acf-field_5d64533dc0ab2c-field_app1w1c7ea20cf9');
  $('.acf-field-app1w1c7ea20cf9 .acf-range-wrap').hide();
  $('.acf-field-app1w1c7ea20cf9 .acf-input').starrr({
    max: 5,
    rating: $s2input.val(),
    change: function change(e, value) {
      $s2input.val(value).trigger('input');
    }
  });
  var $s3input = $('#acf-field_5d64533dc0ab2c-field_app3w307ea20cf9');
  $('.acf-field-app3w307ea20cf9 .acf-range-wrap').hide();
  $('.acf-field-app3w307ea20cf9 .acf-input').starrr({
    max: 5,
    rating: $s3input.val(),
    change: function change(e, value) {
      $s3input.val(value).trigger('input');
    }
  });
  var $s4input = $('#acf-field_5d64533dc0ab2c-field_app3w30723420cf9');
  $('.acf-field-app3w30723420cf9 .acf-range-wrap').hide();
  $('.acf-field-app3w30723420cf9 .acf-input').starrr({
    max: 5,
    rating: $s4input.val(),
    change: function change(e, value) {
      $s4input.val(value).trigger('input');
    }
  });
  var $s5input = $('#acf-field_5d64533dc0ab2c-field_app3red7ea20cf9');
  $('.acf-field-app3red7ea20cf9 .acf-range-wrap').hide();
  $('.acf-field-app3red7ea20cf9 .acf-input').starrr({
    max: 5,
    rating: $s5input.val(),
    change: function change(e, value) {
      $s5input.val(value).trigger('input');
    }
  });
});
/**
 * Hide inputs ACF_FORM
 */

$('.acf-field-group-rop54312').css({
  'display': 'none'
});
$('.acf-field-group-rup522322').css({
  'display': 'none'
});
/**
 * Success Submit
 */

$('#js-app-reviewed-cancel').click(function () {
  $('#js-app-reviewed-success').css({
    'display': 'none'
  });
});

function showArticlesModal() {
  $('#js-insert-article-modal').removeClass('d-none');
}

function openVerifiedModal() {
  $('.js-confirm-modal').addClass('d-none');
  $('.js-confirm-modal').removeClass('d-flex');
  $('#js-insert-article-modal').addClass('d-none');
  FormSubmit('pending');
}

function openVerifiedArticleModal() {
  $('.js-confirm-modal').addClass('d-none');
  $('.js-confirm-modal').removeClass('d-flex');
  $('#js-insert-article-modal').addClass('d-none');
  $('#js-insert-article-modal').addClass('d-none');
  FormSubmitArticle('pending');
}

function closeDraftModal() {
  $('#js-draft-modal').addClass('d-none');
  $('#js-edit-blogging-article').html('<p class="text-info">Refreshing page...</p>');
  var redirect = $('#js-draft-modal').attr('data-redirect');
  window.location.replace(redirect);
}

function showArticleDraftModal() {
  $('#js-draft-article-modal').removeClass('d-none');
}

function openVerifiedDraftModal() {
  $('.js-confirm-modal').addClass('d-none');
  $('.js-confirm-modal').removeClass('d-flex');
  $('#js-draft-article-modal').addClass('d-none');
  FormSubmit('draft');
}

function openVerifiedDraftArticleModal() {
  $('.js-confirm-modal').addClass('d-none');
  $('.js-confirm-modal').removeClass('d-flex');
  $('#js-draft-article-modal').addClass('d-none');
  FormSubmitArticle('draft');
}

function openArticlesImg() {
  $('#js-insert-articles-img-modal').removeClass('d-none');
}

function chooseAnImage() {
  $('#js-doctorpedia-choose').removeClass('d-flex');
  $('#js-doctorpedia-choose').addClass('d-none');
  $('#js-featured-image-article').removeClass('d-none');
  $('#js-featured-image-article').addClass('d-flex');
  openArticlesImg();
}

$(document).ready(function () {
  $('.isDisabled').click(function (event) {
    event.preventDefault();
  });
});

function openVerifiedLinkModal() {
  $('.js-confirm-modal').addClass('d-none');
  $('.js-confirm-modal').removeClass('d-flex');
  $('#js-insert-article-modal').addClass('d-none');
  FormLinkSubmit();
}

function openArticleVerifiedLinkModal() {
  $('.js-confirm-modal').addClass('d-none');
  $('.js-confirm-modal').removeClass('d-flex');
  $('#js-insert-article-modal').addClass('d-none');
  FormSingleLinkSubmit();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJsb2dnaW5nLWFwcC1yZXZpZXdzLmpzIiwiYmxvZ2dpbmctYXJ0aWNsZS1lZGl0LmpzIiwiYmxvZ2dpbmctYmlvLWVkaXQuanMiLCJibG9nZ2luZy1ibG9nLWVkaXQuanMiLCJibG9nZ2luZy1mb3Jnb3QtcGFzc3dvcmQuanMiLCJibG9nZ2luZy1sb2dpbi5qcyIsImJsb2dnaW5nLXJlZ2lzdGVyLmpzIiwiYmxvZ2dpbmctc2V0dGluZ3MuanMiLCJibG9nZ2luZy12aWRlb3MuanMiLCJuaWNlLWVkaXQuanMiLCJzY3JpcHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOVJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOWtFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHBfc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG4vKipcclxuICogQWpheCBEZWxldGUgUmV2aWV3XHJcbiAqL1xuZnVuY3Rpb24gZGVsZXRlUmV2aWV3KHN0YXR1cywgcG9zdF9pZCkge1xuICB2YXIgb3BjaW9uID0gY29uZmlybShcIllvdSBzdXJlIHdhbnQgdG8gZGVsZXRlIHRoZSByZXZpZXc/XCIpO1xuXG4gIGlmIChvcGNpb24gPT0gdHJ1ZSkge1xuICAgIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnYWN0aW9uJywgJ2RlbGV0ZV9yZXZpZXdzJyk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCdzdGF0dXMnLCBzdGF0dXMpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnIHBvc3RfaWQnLCBwb3N0X2lkKTtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICB1cmw6IGRkX3ZhcnMuYWpheHVybCxcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gYmVmb3JlU2VuZCgpIHt9LFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge30sXG4gICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUoKSB7XG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBkeW5hbWljU2VhcmNoKHZhbHVlKSB7XG4gIGlmICh2YWx1ZS5sZW5ndGggPiAyKSB7XG4gICAgJCgnLmFwcC1yZXZpZXctbW9kdWxlJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3RyaW5nMSA9ICQodGhpcykuZmluZCgnLmFwcC1yZXZpZXctbW9kdWxlX190aXRsZScpLmh0bWwoKTtcbiAgICAgIHZhciBzdHJpbmcyID0gc3RyaW5nMS50b0xvd2VyQ2FzZSgpO1xuICAgICAgdmFyIHN0cmluZzMgPSBzdHJpbmcxLnRvVXBwZXJDYXNlKCk7XG4gICAgICB2YXIgc3VidmFsdWUxID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIHZhciBzdWJ2YWx1ZTIgPSB2YWx1ZS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICBpZiAoc3RyaW5nMS5pbmNsdWRlcyh2YWx1ZSkgfHwgc3RyaW5nMS5pbmNsdWRlcyhzdWJ2YWx1ZTEpIHx8IHN0cmluZzEuaW5jbHVkZXMoc3VidmFsdWUyKSkge1xuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcbiAgICAgIH0gZWxzZSBpZiAoc3RyaW5nMi5pbmNsdWRlcyh2YWx1ZSkgfHwgc3RyaW5nMi5pbmNsdWRlcyhzdWJ2YWx1ZTEpIHx8IHN0cmluZzIuaW5jbHVkZXMoc3VidmFsdWUyKSkge1xuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcbiAgICAgIH0gZWxzZSBpZiAoc3RyaW5nMy5pbmNsdWRlcyh2YWx1ZSkgfHwgc3RyaW5nMy5pbmNsdWRlcyhzdWJ2YWx1ZTEpIHx8IHN0cmluZzMuaW5jbHVkZXMoc3VidmFsdWUyKSkge1xuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgICQoJy5hcHAtcmV2aWV3LW1vZHVsZScpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkeW5hbWljRmlsdGVyKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSkge1xuICAgICQoJy5hcHAtcmV2aWV3LW1vZHVsZScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHN0cmluZyA9ICQodGhpcykuZmluZCgnLmFwcC1yZXZpZXctbW9kdWxlX190aXRsZScpLmF0dHIoJ2RhdGEtc2l0ZScpO1xuXG4gICAgICBpZiAoc3RyaW5nLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNvcnRCeSgpIHtcbiAgdmFyIG15QXJyYXkgPSAkKFwiI2pzLXJlb3JkZXItYXBwcyAuYXBwLXJldmlldy1tb2R1bGVcIik7XG4gIHZhciBjb3VudCA9IDA7IC8vIHNvcnQgYmFzZWQgb24gdGltZXN0YW1wIGF0dHJpYnV0ZVxuXG4gIG15QXJyYXkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIC8vIGNvbnZlcnQgdG8gaW50ZWdlcnMgZnJvbSBzdHJpbmdzXG4gICAgYSA9IHBhcnNlSW50KCQoYSkuYXR0cihcImRhdGEtb3JkZXJcIiksIDEwKTtcbiAgICBiID0gcGFyc2VJbnQoJChiKS5hdHRyKFwiZGF0YS1vcmRlclwiKSwgMTApO1xuICAgIGNvdW50ICs9IDI7IC8vIGNvbXBhcmVcblxuICAgIGlmIChhID4gYikge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH0gZWxzZSBpZiAoYSA8IGIpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH0pOyAvLyBwdXQgc29ydGVkIHJlc3VsdHMgYmFjayBvbiBwYWdlXG5cbiAgJChcIiNqcy1yZW9yZGVyLWFwcHNcIikuaHRtbChteUFycmF5KTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXHJcbiAqIENoZWNrIGlucHV0c1xyXG4gKi9cbmZ1bmN0aW9uIGZvcm1SZXF1aXJlc0FydGljbGUoc3RhdHVzKSB7XG4gIGlmICgkKCcjdGl0bGUnKS52YWwoKSA9PSAnJykge1xuICAgICQoXCIjdGl0bGVcIikuYXR0cigncGxhY2Vob2xkZXInLCAnUGxlYXNlIGNvbXBsZXRlIFRpdGxlJyk7XG4gICAgY2xvc2VNb2RhbCgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuLyoqXHJcbiAqIEFqYXggSW5zZXJ0ICYgVXBkYXRlIEFydGljbGVcclxuICovXG5cblxuZnVuY3Rpb24gRm9ybVN1Ym1pdEFydGljbGUoc3RhdHVzKSB7XG4gIHZhciBwcmV2aWV3ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuICBpZiAoIWZvcm1SZXF1aXJlc0FydGljbGUoc3RhdHVzKSkgcmV0dXJuO1xuICAvKiB2YXIgcmVsZXZhbnRMaXN0ID0gW107XHJcbiAgICAkKCcuY2hlY2tfcmVsZXZhbnQnKS5lYWNoKCBmdW5jdGlvbigpIHtcclxuICAgICAgICByZWxldmFudExpc3QucHVzaCggJCh0aGlzKS52YWwoKSApO1xyXG4gICAgfSk7XHJcbiAgICB2YXIgcmVsZXZhbnRMaXN0ID0gcmVsZXZhbnRMaXN0LmpvaW4oJywnKTsgKi9cblxuICAvKiB2YXIga2V5d29yZExpc3QgPSBbXTtcclxuICAkKCcuY2hlY2tfa2V5d29yZCcpLmVhY2goIGZ1bmN0aW9uKCkge1xyXG4gICAgICBrZXl3b3JkTGlzdC5wdXNoKCAkKHRoaXMpLnZhbCgpICk7XHJcbiAgfSk7XHJcbiAgdmFyIGtleXdvcmRMaXN0ID0ga2V5d29yZExpc3Quam9pbignLCcpOyAqL1xuXG4gIHZhciBmZWF0dXJlID0gJyc7XG5cbiAgaWYgKCQoJyNmZWF0dXJlJykuaXMoXCI6Y2hlY2tlZFwiKSkge1xuICAgIGZlYXR1cmUgPSAkKCcjZmVhdHVyZScpLnZhbCgpO1xuICB9XG5cbiAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnYWN0aW9uJywgJ3NhdmVfYXJ0aWNsZScpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ3N0YXR1cycsIHN0YXR1cyk7XG4gIGZvcm1EYXRhLmFwcGVuZCgncG9zdF9pZCcsICQoJyNwb3N0X2lkJykudmFsKCkpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ3RpdGxlJywgJCgnI3RpdGxlJykudmFsKCkpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ3N1YnRpdGxlJywgJCgnI3N1YnRpdGxlJykudmFsKCkpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2NvbnRlbnQnLCAkKCcucWwtZWRpdG9yJykuaHRtbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdibG9nX2lkJywgJCgnI2Jsb2dfaWQnKS52YWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnZmVhdHVyZScsIGZlYXR1cmUpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2ZlYXR1cmVkSW1hZ2UnLCAkKCcjZmVhdHVyZWRJbWFnZScpLnZhbCgpKTsgLy9mb3JtRGF0YS5hcHBlbmQoICdyZWxldmFudExpc3QnLCByZWxldmFudExpc3QgKTtcbiAgLy9mb3JtRGF0YS5hcHBlbmQoICdrZXl3b3JkTGlzdCcsIGtleXdvcmRMaXN0ICk7XG5cbiAgalF1ZXJ5LmFqYXgoe1xuICAgIGNhY2hlOiBmYWxzZSxcbiAgICB1cmw6IGJtc192YXJzLmFqYXh1cmwsXG4gICAgdHlwZTogJ1BPU1QnLFxuICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gYmVmb3JlU2VuZCgpIHtcbiAgICAgICQoJyNqcy1lZGl0LWJsb2dnaW5nLWFydGljbGUnKS5odG1sKCc8cCBjbGFzcz1cInRleHQtaW5mb1wiPlNlbmRpbmcuLi48L3A+Jyk7XG5cbiAgICAgIGlmIChzdGF0dXMgPT0gJ2RyYWZ0Jykge1xuICAgICAgICAkKCcjanMtZHJhZnQtYXJ0aWNsZScpLmFkZENsYXNzKCdsb2FkaW5nIGhpZGRlbkJ0bicpLnJlbW92ZUNsYXNzKCdkb25lJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCcjanMtcHVibGlzaC1hcnRpY2xlJykuYWRkQ2xhc3MoJ2xvYWRpbmcgaGlkZGVuQnRuJykucmVtb3ZlQ2xhc3MoJ2RvbmUnKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgIGlmIChzdGF0dXMgPT0gJ2RyYWZ0Jykge1xuICAgICAgICAkKCcjanMtZHJhZnQtYXJ0aWNsZScpLnJlbW92ZUNsYXNzKCdsb2FkaW5nIGhpZGRlbkJ0bicpLmFkZENsYXNzKCdkb25lJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCcjanMtcHVibGlzaC1hcnRpY2xlJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcgaGlkZGVuQnRuJykuYWRkQ2xhc3MoJ2RvbmUnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgaWYgKHByZXZpZXcpIHtcbiAgICAgICAgICAkKCcjanMtZWRpdC1ibG9nZ2luZy1hcnRpY2xlJykuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LWluZm9cIj5SZWZyZXNoaW5nIHBhZ2UuLi48L3A+Jyk7XG4gICAgICAgICAgJCgnI2pzLWRyYWZ0LW1vZGFsJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAgICAgICAgIHdpbmRvdy5vcGVuKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyByZXNwb25zZS5kYXRhLnByZXZpZXcsICdfYmxhbmsnKTtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShyZXNwb25zZS5kYXRhLnJlZGlyZWN0KTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5zdGF0dXMgPT0gJ2RyYWZ0Jykge1xuICAgICAgICAgICQoJyNqcy1kcmFmdC1tb2RhbCcpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcbiAgICAgICAgICAkKCcjanMtZHJhZnQtbW9kYWwnKS5hdHRyKCdkYXRhLXJlZGlyZWN0JywgcmVzcG9uc2UuZGF0YS5yZWRpcmVjdCk7XG4gICAgICAgICAgJCgnI2pzLWVkaXQtYmxvZ2dpbmctYXJ0aWNsZScpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1pbmZvXCI+UmVmcmVzaGluZyBwYWdlLi4uPC9wPicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuc3RhdHVzID09ICdwZW5kaW5nJykge1xuICAgICAgICAgICQoJyNqcy1wZW5kaW5nLWFydGljbGUtbW9kYWwnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XG4gICAgICAgICAgJCgnLmpzLXBlbmRpbmctbW9kYWwnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XG4gICAgICAgICAgJCgnI2pzLWVkaXQtYXJ0aWNsZScpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+JyArIHJlc3BvbnNlLmRhdGEubWVzc2FnZSArICc8L3A+Jyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoJyNqcy1lZGl0LWFydGljbGUnKS5odG1sKCc8cCBjbGFzcz1cInRleHQtZGFuZ2VyXCI+JyArIHJlc3BvbnNlLm1lc3NhZ2UgKyAnPC9wPicpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmYWxzZTtcbn1cbi8qKlxyXG4gKiBBamF4IEluc2VydCBEcmFmdCB0byBQcmV2aWV3IEFydGljbGVcclxuICovXG5cblxuZnVuY3Rpb24gRm9ybVN1Ym1pdFByZXZpZXdBcnRpY2xlKCkge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdhY3Rpb24nLCAncHJldmlld19hcnRpY2xlJyk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnIHBvc3RfaWQnLCAkKCcjcG9zdF9pZCcpLnZhbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCd0aXRsZScsICQoJyN0aXRsZScpLnZhbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdzdWJ0aXRsZScsICQoJyNzdWJ0aXRsZScpLnZhbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdjb250ZW50JywgJCgnLnFsLWVkaXRvcicpLmh0bWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnZmVhdHVyZWRJbWFnZScsICQoJyNmZWF0dXJlZEltYWdlJykudmFsKCkpO1xuICBqUXVlcnkuYWpheCh7XG4gICAgY2FjaGU6IGZhbHNlLFxuICAgIHVybDogYm1zX3ZhcnMuYWpheHVybCxcbiAgICB0eXBlOiAnUE9TVCcsXG4gICAgZGF0YTogZm9ybURhdGEsXG4gICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiBiZWZvcmVTZW5kKCkge1xuICAgICAgJCgnI2pzLWVkaXQtYXJ0aWNsZScpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1pbmZvXCI+c2VuZGluZy4uLjwvcD4nKTtcbiAgICB9LFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICQoJyNqcy1lZGl0LWFydGljbGUnKS5odG1sKCc8cCBjbGFzcz1cInRleHQtc3VjY2Vzc1wiPlNhdmVkIEFydGljbGU8L3A+Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCcjanMtZWRpdC1hcnRpY2xlJykuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPicgKyByZXNwb25zZS5kYXRhICsgJzwvcD4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmFsc2U7XG59XG4vKipcclxuICogQWpheCBEZWxldGUgQXJ0aWNsZVxyXG4gKi9cblxuXG5mdW5jdGlvbiBkZWxldGVTaW5nbGVBcnRpY2xlKHN0YXR1cywgcG9zdF9pZCkge1xuICB2YXIgb3BjaW9uID0gY29uZmlybShcIllvdSBzdXJlIHdhbnQgdG8gZGVsZXRlIHRoZSBhcnRpY2xlP1wiKTtcblxuICBpZiAob3BjaW9uID09IHRydWUpIHtcbiAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2FjdGlvbicsICdkZWxldGVfYXJ0aWNsZScpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnc3RhdHVzJywgc3RhdHVzKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoJyBwb3N0X2lkJywgcG9zdF9pZCk7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgdXJsOiBibXNfdmFycy5hamF4dXJsLFxuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgZGF0YTogZm9ybURhdGEsXG4gICAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUoKSB7XG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuLyoqIFxyXG4gKiBBamF4IFB1Ymxpc2ggQXJ0aWNsZSBieSBMaW5rIFxyXG4gKi9cblxuXG5mdW5jdGlvbiBGb3JtU2luZ2xlTGlua1N1Ym1pdCgpIHtcbiAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnYWN0aW9uJywgJ3NhdmVfbGlua19hcnRpY2xlJyk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnc3RhdHVzJywgJ3BlbmRpbmcnKTtcbiAgZm9ybURhdGEuYXBwZW5kKCcgcG9zdF9pZCcsICQoJyNwb3N0X2lkJykuYXR0cignZGF0YS1pZCcpKTtcbiAgalF1ZXJ5LmFqYXgoe1xuICAgIGNhY2hlOiBmYWxzZSxcbiAgICB1cmw6IGJtc192YXJzLmFqYXh1cmwsXG4gICAgdHlwZTogJ1BPU1QnLFxuICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gYmVmb3JlU2VuZCgpIHtcbiAgICAgICQoJyNqcy1lZGl0LWJsb2dnaW5nLWFydGljbGUnKS5odG1sKCc8cCBjbGFzcz1cInRleHQtaW5mb1wiPlNlbmRpbmcuLi48L3A+Jyk7XG4gICAgICAkKCcuYnRuLXNhdmUnKS5hZGRDbGFzcygnbG9hZGluZyBoaWRkZW5CdG4nKS5yZW1vdmVDbGFzcygnZG9uZScpO1xuICAgIH0sXG4gICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgJCgnLmJ0bi1zYXZlJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcgaGlkZGVuQnRuJykuYWRkQ2xhc3MoJ2RvbmUnKTtcblxuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgJCgnI2pzLW1zai1hcnRpY2xlJykuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LXN1Y2Nlc3NcIj4nICsgcmVzcG9uc2UuZGF0YS5tZXNzYWdlICsgJzwvcD4nKTtcblxuICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5zdGF0dXMgPT0gJ3B1Ymxpc2gnIHx8IHJlc3BvbnNlLmRhdGEuc3RhdHVzID09ICdwZW5kaW5nJykge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHJlc3BvbnNlLmRhdGEucmVkaXJlY3QpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCcjanMtbXNqLWFydGljbGUnKS5odG1sKCc8cCBjbGFzcz1cInRleHQtZGFuZ2VyXCI+JyArIHJlc3BvbnNlLm1lc3NhZ2UgKyAnPC9wPicpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmYWxzZTtcbn1cbi8qKlxyXG4gKiBTZWxlY3QgUmVsZXZhbnQgU2l0ZXNcclxuICovXG5cblxuZnVuY3Rpb24gc2VsZWN0UmVsZXZhbnRTaXRlcyh2YWx1ZSkge1xuICBpZiAodmFsdWUgIT09ICdub25lJykge1xuICAgIC8vJChcIiNyZWxldmFudCBvcHRpb246c2VsZWN0ZWRcIikuYXR0cignZGlzYWJsZWQnLCdkaXNhYmxlZCcpO1xuICAgICQoJyNsaXN0X3JlbGV2YW50JykuYXBwZW5kKCc8bGkgaWQ9XCInICsgdmFsdWUgKyAnXCI+JyArIHZhbHVlICsgJyA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJyZWxldmFudExpc3RbXVwiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiIGNsYXNzPVwiY2hlY2tfcmVsZXZhbnRcIj48ZGl2IG9uY2xpY2s9XCJkZWxldGVJdGVtKFxcJycgKyB2YWx1ZSArICdcXCcpXCI+PGltZyBzcmM9XCIvd3AtY29udGVudC9wbHVnaW5zL2Jsb2dnaW5nLXBsYXRmb3JtL2Fzc2V0cy9pbWcvZGVsZXRlLXgtaWNvbi5zdmdcIiAvPjwvZGl2PiA8L2xpPicpO1xuICB9XG59XG4vKipcclxuICogQWRkIEtleXdvcmQgLSBzZWxlY3RcclxuICovXG5cbi8qIGZ1bmN0aW9uIHNlbGVjdEtleVdvcmQgKCB2YWx1ZSApIHtcclxuICAgICQoJyNsaXN0X2tleXdvcmQnKS5hcHBlbmQoICc8bGkgaWQ9XCInICsgdmFsdWUgKyAnXCI+JyArIHZhbHVlICsgJyA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJrZXl3b3JkTGlzdFtdXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCIgY2xhc3M9XCJjaGVja19rZXl3b3JkXCI+PGRpdiBvbmNsaWNrPVwiZGVsZXRlSXRlbSgnICsgdmFsdWUgKyAnKVwiPjxpbWcgc3JjPVwiL3dwLWNvbnRlbnQvcGx1Z2lucy9ibG9nZ2luZy1wbGF0Zm9ybS9hc3NldHMvaW1nL2RlbGV0ZS14LWljb24uc3ZnXCIgLz48L2Rpdj4gPC9saT4nICk7XHJcbn0gKi9cblxuXG4oZnVuY3Rpb24gKCQpIHtcbiAgJC5zYW5pdGl6ZSA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIC8qXHJcbiAgICB2YXIgb3V0cHV0ID0gaW5wdXQucmVwbGFjZSgvPHNjcmlwdFtePl0qPz4uKj88XFwvc2NyaXB0Pi9naSwgJycpLlxyXG4gICAgcmVwbGFjZSgvPFtcXC9cXCFdKj9bXjw+XSo/Pi9naSwgJycpLlxyXG4gICAgcmVwbGFjZSgvPHN0eWxlW14+XSo/Pi4qPzxcXC9zdHlsZT4vZ2ksICcnKS5cclxuICAgIHJlcGxhY2UoLzwhW1xcc1xcU10qPy0tWyBcXHRcXG5cXHJdKj4vZ2ksICcnKTtcclxuICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICAqL1xuICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC88KHxcXC98W14+XFwvYmldfFxcL1tePmJpXXxbXlxcLz5dW14+XSt8XFwvW14+XVtePl0rKT4vZywgJycpO1xuICB9O1xufSkoalF1ZXJ5KTtcbi8qKlxyXG4gKiBBZGQgS2V5d29yZCAtIGlucHV0XHJcbiAqL1xuXG5cbmZ1bmN0aW9uIHJ1blNjcmlwdChlKSB7XG4gIHRlY2xhID0gZG9jdW1lbnQuYWxsID8gZS5rZXlDb2RlIDogZS53aGljaDsgLy9UZWNsYSBkZSByZXRyb2Nlc28gcGFyYSBib3JyYXIsIHNpZW1wcmUgbGEgcGVybWl0ZVxuXG4gIGlmICh0ZWNsYSA9PSA4KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gUGF0cm9uIGRlIGVudHJhZGEsIGVuIGVzdGUgY2FzbyBzb2xvIGFjZXB0YSBudW1lcm9zIHkgbGV0cmFzXG5cblxuICBwYXRyb24gPSAvW0EtWmEtejAtOVxcc10vO1xuICB0ZWNsYV9maW5hbCA9IFN0cmluZy5mcm9tQ2hhckNvZGUodGVjbGEpOyAvLyBWZXJpZmljbyBxdWUgbm8gZXhpc3RhIGxhIGtleXdvcmRcblxuICBmdW5jdGlvbiBjaGVja0xpc3QodmFsdWUpIHtcbiAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAkKCcjbGlzdF9rZXl3b3JkIGxpJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBhcnJheS5wdXNoKCQodGhpcykuYXR0cignaWQnKSk7XG4gICAgfSk7XG5cbiAgICBpZiAoIWFycmF5LmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgYXJyYXkucHVzaCh2YWx1ZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgdmFyIHZhbHVlID0gJC5zYW5pdGl6ZSgkKCcja2V5d29yZCcpLnZhbCgpKTtcblxuICAgIGlmICh2YWx1ZSAhPT0gJycpIHtcbiAgICAgIGlmIChjaGVja0xpc3QodmFsdWUpKSB7XG4gICAgICAgICQoJyNsaXN0X2tleXdvcmQnKS5hcHBlbmQoJzxsaSBpZD1cIicgKyB2YWx1ZSArICdcIj4nICsgdmFsdWUgKyAnIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImtleXdvcmRMaXN0W11cIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIiBjbGFzcz1cImNoZWNrX2tleXdvcmRcIj48ZGl2IG9uY2xpY2s9XCJkZWxldGVJdGVtKFxcJycgKyB2YWx1ZSArICdcXCcpXCI+PGltZyBzcmM9XCIvd3AtY29udGVudC9wbHVnaW5zL2Jsb2dnaW5nLXBsYXRmb3JtL2Fzc2V0cy9pbWcvZGVsZXRlLXgtaWNvbi5zdmdcIiAvPjwvZGl2PiA8L2xpPicpO1xuICAgICAgICAkKCcja2V5d29yZCcpLnZhbCgnJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHBhdHJvbi50ZXN0KHRlY2xhX2ZpbmFsKTtcbn1cbi8qKlxyXG4gKiBEZWxldGUgSXRlbVxyXG4gKi9cblxuXG5mdW5jdGlvbiBkZWxldGVJdGVtKHZhbHVlKSB7XG4gICQoJyMnICsgdmFsdWUpLnJlbW92ZSgpO1xuICAkKFwiI3JlbGV2YW50IG9wdGlvblt2YWx1ZT1cIiArIHZhbHVlICsgXCJdXCIpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJyk7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxyXG4gKiBDaGFuZ2UgSW1hZ2VcclxuICovXG5mdW5jdGlvbiByZWFkVVJMKGlucHV0KSB7XG4gIGlmIChpbnB1dC5maWxlcyAmJiBpbnB1dC5maWxlc1swXSkge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAkKCcjanMtZmVhdHVyZWQtYmFja2dyb3VuZCcpLmNzcyhcImJhY2tncm91bmQtaW1hZ2VcIiwgXCJ1cmwoXCIgKyBlLnRhcmdldC5yZXN1bHQgKyBcIilcIik7XG4gICAgfTtcblxuICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGlucHV0LmZpbGVzWzBdKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtUmVxdWlyZXMoKSB7XG4gIGlmICgkKCcjdXNlcl9maXJzdG5hbWUnKS52YWwoKSA9PSAnJykge1xuICAgICQoXCIjanMtYmlvLWVkaXQtbXNqXCIpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1kYW5nZXJcIj5QbGVhc2UgY29tcGxldGUgRmlyc3QgTmFtZTwvcD4nKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoJCgnI3VzZXJfbGFzdG5hbWUnKS52YWwoKSA9PSAnJykge1xuICAgICQoXCIjanMtYmlvLWVkaXQtbXNqXCIpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1kYW5nZXJcIj5QbGVhc2UgY29tcGxldGUgTGFzdCBOYW1lPC9wPicpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuLyoqXHJcbiAqIEFjdGl2ZSBCb2FyZCBDZXJ0aWZpY2F0aW9uXHJcbiAqL1xuXG5cbnZhciBhY3RpdmVCb2FyZCA9IGZ1bmN0aW9uIGFjdGl2ZUJvYXJkKCkge1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzLWJvYXJkXCIpLmNoZWNrZWQgPSB0cnVlO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzLXJlc2lkZW50XCIpLmNoZWNrZWQgPSBmYWxzZTtcbiAgdmFyIGJvYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLXZpc2libGUtY2VydGlmaWNhdGlvbnMnKTtcbiAgYm9hcmQuY2xhc3NMaXN0LnJlbW92ZSgnZC1ub25lJyk7XG4gIHZhciByZXNpZGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1jdGEtcmVzaWRlbnQnKTtcbiAgcmVzaWRlbnQuY2xhc3NMaXN0LmFkZCgnZC1ub25lJyk7XG4gIHZhciBjcmVkZW50aWFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLXZpc2libGUtY3JlZGVudGlhbCcpO1xuICBjcmVkZW50aWFsLmNsYXNzTGlzdC5hZGQoJ2Qtbm9uZScpO1xuICB2YXIgcmVzaWRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtdmlzaWJsZS1yZXNpZGVudCcpO1xuICByZXNpZGVudC5jbGFzc0xpc3QuYWRkKCdkLW5vbmUnKTtcbn07XG4vKipcclxuICogQWN0aXZlIFJlc2lkZW50XHJcbiAqL1xuXG5cbnZhciBhY3RpdmVSZXNpZGVudCA9IGZ1bmN0aW9uIGFjdGl2ZVJlc2lkZW50KCkge1xuICB2YXIgYm9hcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtdmlzaWJsZS1jZXJ0aWZpY2F0aW9ucycpO1xuICBib2FyZC5jbGFzc0xpc3QuYWRkKCdkLW5vbmUnKTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqcy1yZXNpZGVudFwiKS5jaGVja2VkID0gdHJ1ZTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqcy1ib2FyZFwiKS5jaGVja2VkID0gZmFsc2U7XG4gIHZhciByZXNpZGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1jdGEtcmVzaWRlbnQnKTtcbiAgcmVzaWRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnZC1ub25lJyk7XG59O1xuLyoqXHJcbiAqIEFjdGl2ZSBSZXNpZGVudCBGaWVsZFxyXG4gKi9cblxuXG52YXIgYWN0aXZlUmVzaWRlbnRGaWVsZCA9IGZ1bmN0aW9uIGFjdGl2ZVJlc2lkZW50RmllbGQoKSB7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianMtcmVzaWRlbnQteVwiKS5jaGVja2VkID0gdHJ1ZTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqcy1yZXNpZGVudC14XCIpLmNoZWNrZWQgPSBmYWxzZTtcbiAgdmFyIHJlc2lkZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLXZpc2libGUtcmVzaWRlbnQnKTtcbiAgcmVzaWRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnZC1ub25lJyk7XG4gIHZhciBjcmVkZW50aWFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLXZpc2libGUtY3JlZGVudGlhbCcpO1xuICBjcmVkZW50aWFsLmNsYXNzTGlzdC5hZGQoJ2Qtbm9uZScpO1xufTtcbi8qKlxyXG4gKiBBY3RpdmUgQ3JlZGVudGlhbCBGaWVsZFxyXG4gKi9cblxuXG52YXIgYWN0aXZlQ3JlZGVudGlhbEZpZWxkID0gZnVuY3Rpb24gYWN0aXZlQ3JlZGVudGlhbEZpZWxkKCkge1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzLXJlc2lkZW50LXlcIikuY2hlY2tlZCA9IGZhbHNlO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzLXJlc2lkZW50LXhcIikuY2hlY2tlZCA9IHRydWU7XG4gIHZhciBjcmVkZW50aWFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLXZpc2libGUtY3JlZGVudGlhbCcpO1xuICBjcmVkZW50aWFsLmNsYXNzTGlzdC5yZW1vdmUoJ2Qtbm9uZScpO1xuICB2YXIgcmVzaWRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtdmlzaWJsZS1yZXNpZGVudCcpO1xuICByZXNpZGVudC5jbGFzc0xpc3QuYWRkKCdkLW5vbmUnKTtcbn07XG4vKipcclxuICogQWpheCBVcGRhdGUgQ29tcGxldGUgQmlvXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIEZvcm1Db21wbGV0ZUJpb1N1Ym1pdCgpIHtcbiAgaWYgKCFmb3JtUmVxdWlyZXMoKSkgcmV0dXJuO1xuICAkKCcjanMtYmlvLW1vZGFsLWNyZWF0aW5nJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xuICB2YXIgc3BlY2lhbHRpZXMgPSBbXTtcbiAgdmFyIGNlcnRpZmljYXRpb25zID0gW107XG4gIHZhciBlZHVjYXRpb25zID0gW107XG4gIHZhciBleHBlcnRpc2UgPSBbXTtcbiAgJCgnLmNoZWNrX3NwZWNpYWx0eScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgIHZhciBzcGVjaWFsdHkgPSB7XG4gICAgICBzcGVjaWFsdHk6ICQodGhpcykuZmluZCgnLml0ZW1fc3BlY2lhbHR5JykudmFsKCksXG4gICAgICBzdWJzcGVjaWFsdHk6ICQodGhpcykuZmluZCgnLml0ZW1fc3Vic3BlY2lhbHR5JykudmFsKClcbiAgICB9O1xuICAgIHNwZWNpYWx0aWVzLnB1c2goc3BlY2lhbHR5KTtcbiAgfSk7XG4gICQoJy5jaGVja19jZXJ0aWZpY2F0aW9uJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNlcnRpZmljYXRpb24gPSB7XG4gICAgICBjZXJ0aWZpY2F0aW9uOiAkKHRoaXMpLmZpbmQoJy5pdGVtX2NlcnRpZmljYXRpb24nKS52YWwoKSxcbiAgICAgIHN1YmNlcnRpZmljYXRpb246ICQodGhpcykuZmluZCgnLml0ZW1fc3ViY2VydGlmaWNhdGlvbicpLnZhbCgpXG4gICAgfTtcbiAgICBjZXJ0aWZpY2F0aW9ucy5wdXNoKGNlcnRpZmljYXRpb24pO1xuICB9KTtcbiAgJCgnLmNoZWNrX2VkdWNhdGlvbicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgIGVkdWNhdGlvbnMucHVzaCgkKHRoaXMpLmZpbmQoJy5pdGVtX2VkdWNhdGlvbicpLnZhbCgpKTtcbiAgfSk7XG4gICQoJy5jaGVja19leHBlcnRpc2UnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICBleHBlcnRpc2UucHVzaCgkKHRoaXMpLmZpbmQoJy5pdGVtX2VkdWNhdGlvbicpLnZhbCgpKTtcbiAgfSk7XG4gIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2FjdGlvbicsICdzYXZlX3ByZV9iaW8nKTtcbiAgZm9ybURhdGEuYXBwZW5kKCd1c2VyX2lkJywgJCgnI3VzZXJfaWQnKS52YWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgndXNlcl9jb250cm9sJywgJCgnI3VzZXJfY29udHJvbCcpLnZhbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCd1c2VyX2ZpcnN0bmFtZScsICQoJyN1c2VyX2ZpcnN0bmFtZScpLnZhbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCd1c2VyX2xhc3RuYW1lJywgJCgnI3VzZXJfbGFzdG5hbWUnKS52YWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgndXNlcl9zcGVjaWFsdHknLCBKU09OLnN0cmluZ2lmeShzcGVjaWFsdGllcykpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ3VzZXJfd2Vic2l0ZScsICQoJyN1c2VyX3dlYnNpdGUnKS52YWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgndXNlcl9saW5rZWRpbicsICQoJyN1c2VyX2xpbmtlZGluJykudmFsKCkpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ3VzZXJfdHdpdHRlcicsICQoJyN1c2VyX3R3aXR0ZXInKS52YWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgndXNlcl9mYWNlYm9vaycsICQoJyN1c2VyX2ZhY2Vib29rJykudmFsKCkpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ3VzZXJfaW5zdGFncmFtJywgJCgnI3VzZXJfaW5zdGFncmFtJykudmFsKCkpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2NsaW5pY19uYW1lJywgJCgnI2NsaW5pY19uYW1lJykudmFsKCkpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2NsaW5pY19lbWFpbCcsICQoJyNjbGluaWNfZW1haWwnKS52YWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnY2xpbmljX29wZW4nLCAkKCcjY2xpbmljX29wZW4nKS52YWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnY2xpbmljX3Bob25lJywgJCgnI2NsaW5pY19waG9uZScpLnZhbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdjbGluaWNfYXBwb2ludG1lbnQnLCAkKCcjY2xpbmljX2FwcG9pbnRtZW50JykudmFsKCkpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2NsaW5pY193ZWInLCAkKCcjY2xpbmljX3dlYicpLnZhbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdjbGluaWNfbGF0JywgJCgnI2xhdGl0dWRfcHJvcCcpLnZhbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdjbGluaWNfbG5nJywgJCgnI2xvbmdpdHVkX3Byb3AnKS52YWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnY2xpbmljX2xvY2F0aW9uJywgJCgnI2pzLWdvb2dsZS1zZWFyY2gnKS52YWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnY2l0eScsICQoJyNjaXR5X3Byb3AnKS52YWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnc3RhdGUnLCAkKCcjc3RhdGVfcHJvcCcpLnZhbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdjb3VudHJ5JywgJCgnI2NvdW50cnlfcHJvcCcpLnZhbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCd1c2VyX2Rlc2NyaXB0aW9uJywgJCgnI3VzZXJfZGVzY3JpcHRpb24nKS52YWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgndXNlcl9kZXNjcmlwdGlvbl9saW5rJywgJCgnI3VzZXJfZGVzY3JpcHRpb25fbGluaycpLnZhbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCd1c2VyX2VkdWNhdGlvbicsIEpTT04uc3RyaW5naWZ5KGVkdWNhdGlvbnMpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCd1c2VyX2NlcnRpZmljYXRpb24nLCBKU09OLnN0cmluZ2lmeShjZXJ0aWZpY2F0aW9ucykpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ3VzZXJfZXhwZXJ0aXNlJywgSlNPTi5zdHJpbmdpZnkoZXhwZXJ0aXNlKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgndXNlcl9yZXNpZGVuY3knLCAkKCcjdXNlcl9yZXNpZGVuY3knKS52YWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgndXNlcl9jcmVkZW50aWFsJywgJCgnI3VzZXJfY3JlZGVudGlhbCcpLnZhbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCd1c2VyX25waScsICQoJyN1c2VyX25waScpLnZhbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdmZWF0dXJlZEltYWdlJywgJCgnaW5wdXRbdHlwZT1maWxlXScpWzBdLmZpbGVzWzBdKTtcbiAgalF1ZXJ5LmFqYXgoe1xuICAgIGNhY2hlOiBmYWxzZSxcbiAgICB1cmw6IGRkYl92YXJzLmFqYXh1cmwsXG4gICAgdHlwZTogJ1BPU1QnLFxuICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gYmVmb3JlU2VuZCgpIHtcbiAgICAgICQoJy5qcy1zYXZlLWFuaW1hdGlvbicpLmFkZENsYXNzKCdsb2FkaW5nIGhpZGRlbkJ0bicpLnJlbW92ZUNsYXNzKCdkb25lJyk7XG4gICAgfSxcbiAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAkKCcuanMtc2F2ZS1hbmltYXRpb24nKS5yZW1vdmVDbGFzcygnbG9hZGluZyBoaWRkZW5CdG4nKS5hZGRDbGFzcygnZG9uZScpO1xuXG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAkKCcjanMtc2tpcC1zdGVwJykudGV4dCgnQ2FuY2VsJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQoJyNqcy1iaW8tbW9kYWwtY3JlYXRpbmcnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gICAgICAgICAgJCgnI2pzLWJpby1tb2RhbCcpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcbiAgICAgICAgICAkKCcjanMtYmlvLW1vZGFsLWNvbXBsZXRlJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xuICAgICAgICB9LCAzMDAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoJyNqcy1iaW8tZWRpdC1tc2onKS5odG1sKCc8cCBjbGFzcz1cInRleHQtZGFuZ2VyXCI+JyArIHJlc3BvbnNlLmRhdGEgKyAnPC9wPicpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmYWxzZTtcbn1cbi8qKlxyXG4gKiBCdG4gc3VibWl0IGV4dGVybmFsIGJ1dHRvblxyXG4gKi9cblxuXG5mdW5jdGlvbiBidXR0b25BX2NsaWNrSGFuZGxlcihldmVudCkge1xuICAkKCcuanMtc2F2ZS1hbmltYXRpb24nKS5hZGRDbGFzcygnbG9hZGluZyBoaWRkZW5CdG4nKS5yZW1vdmVDbGFzcygnZG9uZScpO1xuICAkKCcuYWNmLWZvcm0tc3VibWl0IGlucHV0JykuY2xpY2soKTtcbn1cbi8qKlxyXG4gKiBMb2FkIFN1YiBTcGVjaWFsdGllcyBzZWxlY3RcclxuICovXG5cblxuZnVuY3Rpb24gbG9hZFN1YlNwZWNpYWx0aWVzKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHJldHVybjtcblxuICBpZiAodmFsdWUgPT0gJ290aGVyJykge1xuICAgICQoJyNqcy1vdGhlci1zcGVjaWFsdHknKS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2FjdGlvbicsICdsb2FkX3N1YnNwZWNpYWx0aWVzJyk7XG4gIGZvcm1EYXRhLmFwcGVuZCgndXNlcl9zcGVjaWFsdHknLCB2YWx1ZSk7XG4gIGpRdWVyeS5hamF4KHtcbiAgICBjYWNoZTogZmFsc2UsXG4gICAgdXJsOiBkZGJfdmFycy5hamF4dXJsLFxuICAgIHR5cGU6ICdQT1NUJyxcbiAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uIGJlZm9yZVNlbmQocmVzcG9uc2UpIHtcbiAgICAgICQoJyN1c2VyX3N1YnNwZWNpYWx0eScpLmh0bWwoJzxvcHRpb24gdmFsdWU9XCJcIiBzZWxlY3RlZCBkaXNhYmxlZD5sb2FkaW5nLi4uPC9vcHRpb24+Jyk7XG4gICAgfSxcbiAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAkKCcjdXNlcl9zdWJzcGVjaWFsdHknKS5odG1sKHJlc3BvbnNlLmRhdGEpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmYWxzZTtcbn1cbi8qKlxyXG4gKiBBZGQgYmlvIHNwZWNpYWx0aWVzXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGFkZFNwZWNpYWx0aWVzKCkge1xuICB2YXIgc3BlY2lhbHR5ID0gJCgnI3VzZXJfc3BlY2lhbHR5JykudmFsKCk7XG4gIHZhciBzcGVjaWFsdHlfc2x1ZyA9IHNwZWNpYWx0eS5yZXBsYWNlKC8gL2csIFwiLVwiKS5yZXBsYWNlKC9bXCInKCldL2csIFwiXCIpO1xuICB2YXIgc3Vic3BlY2lhbHR5ID0gJCgnI3VzZXJfc3Vic3BlY2lhbHR5JykudmFsKCk7XG4gIHZhciBzdWJzcGVjaWFsdHlfc2x1ZyA9IHN1YnNwZWNpYWx0eS5yZXBsYWNlKC8gL2csIFwiLVwiKS5yZXBsYWNlKC9bXCInKCldL2csIFwiXCIpO1xuICB2YXIgaHRtbCA9ICcnO1xuXG4gIGlmIChzcGVjaWFsdHkgJiYgc3BlY2lhbHR5ICE9PSAnbm9uZScgJiYgc3BlY2lhbHR5ICE9PSAnbnVsbCcpIHtcbiAgICAvLyQoXCIjdXNlcl9zcGVjaWFsdHkgb3B0aW9uOnNlbGVjdGVkXCIpLmF0dHIoJ2Rpc2FibGVkJywnZGlzYWJsZWQnKTtcbiAgICBodG1sICs9ICc8bGkgaWQ9XCInICsgc3BlY2lhbHR5X3NsdWcgKyAnXCIgIGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93IGNoZWNrX3NwZWNpYWx0eVwiPic7XG4gICAgaHRtbCArPSAnPGRpdiBjbGFzcz1cImJveC1zcGVjaWFsdHkgYm94LXNwZWNpYWx0eS1wdXJwbGUgZC1mbGV4IGZsZXgtcm93XCI+JyArIHNwZWNpYWx0eSArICc8aW5wdXQgdHlwZT1cImhpZGRlblwiIHZhbHVlPVwiJyArIHNwZWNpYWx0eSArICdcIiBjbGFzcz1cIml0ZW1fc3BlY2lhbHR5XCI+PGRpdiBvbmNsaWNrPVwiZGVsZXRlSXRlbVNwZWNpYWx0eSh0aGlzKTtcIj48aW1nIHNyYz1cIi93cC1jb250ZW50L3BsdWdpbnMvYmxvZ2dpbmctcGxhdGZvcm0vYXNzZXRzL2ltZy9kZWxldGUteC1pY29uLnN2Z1wiIC8+PC9kaXY+PC9kaXY+JztcbiAgfVxuXG4gIGlmIChzdWJzcGVjaWFsdHkgJiYgc3Vic3BlY2lhbHR5ICE9PSAnbm9uZScgJiYgc3Vic3BlY2lhbHR5ICE9PSAnbnVsbCcpIHtcbiAgICAvLyQoXCIjdXNlcl9zdWJzcGVjaWFsdHkgb3B0aW9uOnNlbGVjdGVkXCIpLmF0dHIoJ2Rpc2FibGVkJywnZGlzYWJsZWQnKTtcbiAgICBodG1sICs9ICc8ZGl2IGlkPVwiJyArIHN1YnNwZWNpYWx0eV9zbHVnICsgJ1wiICBjbGFzcz1cImJveC1zcGVjaWFsdHkgYm94LXNwZWNpYWx0eS1waW5rIGQtZmxleCBmbGV4LXJvd1wiPicgKyBzdWJzcGVjaWFsdHkgKyAnIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgdmFsdWU9XCInICsgc3Vic3BlY2lhbHR5ICsgJ1wiIGNsYXNzPVwiaXRlbV9zdWJzcGVjaWFsdHlcIj48ZGl2IG9uY2xpY2s9XCJkZWxldGVJdGVtU3ViU3BlY2lhbHR5KHRoaXMpXCI+PGltZyBzcmM9XCIvd3AtY29udGVudC9wbHVnaW5zL2Jsb2dnaW5nLXBsYXRmb3JtL2Fzc2V0cy9pbWcvZGVsZXRlLXgtaWNvbi5zdmdcIiAvPjwvZGl2PjwvZGl2PiAnO1xuICB9XG5cbiAgaHRtbCArPSAnPC9saT4nO1xuICAkKCcjanMtbGlzdC1zcGVjaWFsdGllcycpLmFwcGVuZChodG1sKTtcbn1cbi8qKlxyXG4gKiBBZGQgT3RoZXIgc3BlY2lhbHRpZXNcclxuICovXG5cblxuZnVuY3Rpb24gYWRkT3RoZXJTcGVjaWFsdGllcygpIHtcbiAgdmFyIHNwZWNpYWx0eSA9ICQoJyNvdGhlcl9zcGVjaWFsdHknKS52YWwoKTtcbiAgdmFyIHNwZWNpYWx0eV9zbHVnID0gc3BlY2lhbHR5LnJlcGxhY2UoLyAvZywgXCItXCIpLnJlcGxhY2UoL1tcIicoKV0vZywgXCJcIik7XG4gIHZhciBodG1sID0gJyc7XG5cbiAgaWYgKHNwZWNpYWx0eSAmJiBzcGVjaWFsdHkgIT09ICdub25lJyAmJiBzcGVjaWFsdHkgIT09ICdudWxsJykge1xuICAgIGh0bWwgKz0gJzxsaSBpZD1cIicgKyBzcGVjaWFsdHlfc2x1ZyArICdcIiAgY2xhc3M9XCJkLWZsZXggZmxleC1yb3cgY2hlY2tfc3BlY2lhbHR5XCI+JztcbiAgICBodG1sICs9ICc8ZGl2IGNsYXNzPVwiYm94LXNwZWNpYWx0eSBib3gtc3BlY2lhbHR5LXB1cnBsZSBkLWZsZXggZmxleC1yb3dcIj4nICsgc3BlY2lhbHR5ICsgJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgdmFsdWU9XCInICsgc3BlY2lhbHR5ICsgJ1wiIGNsYXNzPVwiaXRlbV9zcGVjaWFsdHlcIj48ZGl2IG9uY2xpY2s9XCJkZWxldGVJdGVtU3BlY2lhbHR5KHRoaXMpO1wiPjxpbWcgc3JjPVwiL3dwLWNvbnRlbnQvcGx1Z2lucy9ibG9nZ2luZy1wbGF0Zm9ybS9hc3NldHMvaW1nL2RlbGV0ZS14LWljb24uc3ZnXCIgLz48L2Rpdj48L2Rpdj4nO1xuICAgICQoJyNvdGhlcl9zcGVjaWFsdHknKS52YWwoJycpO1xuICAgICQoJyN1c2VyX3NwZWNpYWx0eScpLnZhbCgnJyk7XG4gICAgJCgnI2pzLW90aGVyLXNwZWNpYWx0eScpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gIH1cblxuICBodG1sICs9ICc8L2xpPic7XG4gICQoJyNqcy1saXN0LXNwZWNpYWx0aWVzJykuYXBwZW5kKGh0bWwpO1xufVxuLyoqXHJcbiAqIERlbGV0ZSBJdGVtXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGRlbGV0ZUl0ZW1TcGVjaWFsdHkob2JqKSB7XG4gIHZhciBlbGVtID0gb2JqO1xuICAkKGVsZW0pLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZSgpOyAvLyQoJyN1c2VyX3NwZWNpYWx0eSBvcHRpb25bdmFsdWU9XCInICsgaWQgKyAnXCJdJykucmVtb3ZlQXR0cignZGlzYWJsZWQnKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlSXRlbVN1YlNwZWNpYWx0eShvYmopIHtcbiAgdmFyIGVsZW0gPSBvYmo7XG4gICQoZWxlbSkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlKCk7IC8vJCgnI3VzZXJfc3Vic3BlY2lhbHR5IG9wdGlvblt2YWx1ZT1cIicgKyBpZCArICdcIl0nKS5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpO1xufVxuLyoqXHJcbiAqIExvYWQgU3ViIFNwZWNpYWx0aWVzIHNlbGVjdCBCb2FyZCBDZXJ0aWZpY2F0aW9uXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGxvYWRTdWJDZXJ0aWZpY2F0aW9uKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHJldHVybjtcbiAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnYWN0aW9uJywgJ2xvYWRfc3Vic3BlY2lhbHRpZXMnKTtcbiAgZm9ybURhdGEuYXBwZW5kKCd1c2VyX3NwZWNpYWx0eScsIHZhbHVlKTtcbiAgalF1ZXJ5LmFqYXgoe1xuICAgIGNhY2hlOiBmYWxzZSxcbiAgICB1cmw6IGRkYl92YXJzLmFqYXh1cmwsXG4gICAgdHlwZTogJ1BPU1QnLFxuICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gYmVmb3JlU2VuZChyZXNwb25zZSkge1xuICAgICAgJCgnI3VzZXJfc3ViY2VydGlmaWNhdGlvbicpLmh0bWwoJzxvcHRpb24gdmFsdWU9XCJcIiBzZWxlY3RlZCBkaXNhYmxlZD5sb2FkaW5nLi4uPC9vcHRpb24+Jyk7XG4gICAgfSxcbiAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAkKCcjdXNlcl9zdWJjZXJ0aWZpY2F0aW9uJykuaHRtbChyZXNwb25zZS5kYXRhKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmFsc2U7XG59XG4vKipcclxuICogQWRkIGJpbyBzcGVjaWFsdGllcyBjZXJ0aWZpY2F0aW9uXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGFkZENlcnRpZmljYXRpb24oKSB7XG4gIHZhciByYW5kID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDk5OTkgLSA5KSkgKyA5O1xuICB2YXIgY2VydGlmaWNhdGlvbiA9ICQoJyN1c2VyX2NlcnRpZmljYXRpb24nKS52YWwoKTtcbiAgdmFyIGNlcnRpZmljYXRpb25fc2x1ZyA9IGNlcnRpZmljYXRpb24ucmVwbGFjZSgvIC9nLCBcIi1cIikucmVwbGFjZSgvW1wiJygpXS9nLCBcIlwiKSArIHJhbmQ7XG4gIHZhciBzdWJjZXJ0aWZpY2F0aW9uID0gJCgnI3VzZXJfc3ViY2VydGlmaWNhdGlvbicpLnZhbCgpO1xuICB2YXIgc3ViY2VydGlmaWNhdGlvbl9zbHVnID0gc3ViY2VydGlmaWNhdGlvbi5yZXBsYWNlKC8gL2csIFwiLVwiKS5yZXBsYWNlKC9bXCInKCldL2csIFwiXCIpICsgcmFuZDtcbiAgdmFyIGh0bWwgPSAnJztcblxuICBpZiAoY2VydGlmaWNhdGlvbiAmJiBjZXJ0aWZpY2F0aW9uICE9PSAnbm9uZScgJiYgY2VydGlmaWNhdGlvbiAhPT0gJ251bGwnKSB7XG4gICAgLy8kKFwiI3VzZXJfY2VydGlmaWNhdGlvbiBvcHRpb246c2VsZWN0ZWRcIikuYXR0cignZGlzYWJsZWQnLCdkaXNhYmxlZCcpO1xuICAgIGh0bWwgKz0gJzxsaSBpZD1cIicgKyBjZXJ0aWZpY2F0aW9uX3NsdWcgKyAnXCIgIGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93IGNoZWNrX2NlcnRpZmljYXRpb25cIj4nO1xuICAgIGh0bWwgKz0gJzxkaXYgY2xhc3M9XCJib3gtY2VydGlmaWNhdGlvbiBib3gtY2VydGlmaWNhdGlvbi1wdXJwbGUgZC1mbGV4IGZsZXgtcm93XCI+JyArIGNlcnRpZmljYXRpb24gKyAnPGlucHV0IHR5cGU9XCJoaWRkZW5cIiB2YWx1ZT1cIicgKyBjZXJ0aWZpY2F0aW9uICsgJ1wiIGNsYXNzPVwiaXRlbV9jZXJ0aWZpY2F0aW9uXCI+PGRpdiBvbmNsaWNrPVwiZGVsZXRlSXRlbWNlcnRpZmljYXRpb24odGhpcyk7XCI+PGltZyBzcmM9XCIvd3AtY29udGVudC9wbHVnaW5zL2Jsb2dnaW5nLXBsYXRmb3JtL2Fzc2V0cy9pbWcvZGVsZXRlLXgtaWNvbi5zdmdcIiAvPjwvZGl2PjwvZGl2Pic7XG4gIH1cblxuICBpZiAoc3ViY2VydGlmaWNhdGlvbiAmJiBzdWJjZXJ0aWZpY2F0aW9uICE9PSAnbm9uZScgJiYgc3ViY2VydGlmaWNhdGlvbiAhPT0gJ251bGwnKSB7XG4gICAgLy8kKFwiI3VzZXJfc3ViY2VydGlmaWNhdGlvbiBvcHRpb246c2VsZWN0ZWRcIikuYXR0cignZGlzYWJsZWQnLCdkaXNhYmxlZCcpO1xuICAgIGh0bWwgKz0gJzxkaXYgaWQ9XCInICsgc3ViY2VydGlmaWNhdGlvbl9zbHVnICsgJ1wiICBjbGFzcz1cImJveC1jZXJ0aWZpY2F0aW9uIGJveC1jZXJ0aWZpY2F0aW9uLXBpbmsgZC1mbGV4IGZsZXgtcm93XCI+JyArIHN1YmNlcnRpZmljYXRpb24gKyAnIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgdmFsdWU9XCInICsgc3ViY2VydGlmaWNhdGlvbiArICdcIiBjbGFzcz1cIml0ZW1fc3ViY2VydGlmaWNhdGlvblwiPjxkaXYgb25jbGljaz1cImRlbGV0ZUl0ZW1TdWJjZXJ0aWZpY2F0aW9uKHRoaXMpO1wiPjxpbWcgc3JjPVwiL3dwLWNvbnRlbnQvcGx1Z2lucy9ibG9nZ2luZy1wbGF0Zm9ybS9hc3NldHMvaW1nL2RlbGV0ZS14LWljb24uc3ZnXCIgLz48L2Rpdj48L2Rpdj4gJztcbiAgfVxuXG4gIGh0bWwgKz0gJzwvbGk+JztcbiAgJCgnI2pzLWxpc3QtY2VydGlmaWNhdGlvbicpLmFwcGVuZChodG1sKTtcbn1cbi8qKlxyXG4gKiBEZWxldGUgSXRlbSBjZXJ0aWZpY2F0aW9uXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGRlbGV0ZUl0ZW1jZXJ0aWZpY2F0aW9uKG9iaikge1xuICB2YXIgZWxlbSA9IG9iajtcbiAgJChlbGVtKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmUoKTsgLy8kKCcjdXNlcl9jZXJ0aWZpY2F0aW9uIG9wdGlvblt2YWx1ZT1cIicgKyBpZCArICdcIl0nKS5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpO1xufVxuXG5mdW5jdGlvbiBkZWxldGVJdGVtU3ViY2VydGlmaWNhdGlvbihvYmopIHtcbiAgdmFyIGVsZW0gPSBvYmo7XG4gICQoZWxlbSkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlKCk7IC8vJCgnI3VzZXJfc3ViY2VydGlmaWNhdGlvbiBvcHRpb25bdmFsdWU9XCInICsgaWQgKyAnXCJdJykucmVtb3ZlQXR0cignZGlzYWJsZWQnKTtcbn1cbi8qKlxyXG4gKiBBZGQgQmlvIEVkdWNhdGlvblxyXG4gKi9cblxuXG5mdW5jdGlvbiBhZGRFZHVjYXRpb25JdGVtKCkge1xuICB2YXIgZWR1Y2F0aW9uID0gJCgnI3VzZXJfZWR1Y2F0aW9uJykudmFsKCk7XG4gIHZhciBlZHVjYXRpb25fc2x1ZyA9IGVkdWNhdGlvbi5yZXBsYWNlKC8gL2csIFwiLVwiKS5yZXBsYWNlKC9bXCInKCldL2csIFwiXCIpO1xuICB2YXIgaHRtbCA9ICcnO1xuXG4gIGlmIChlZHVjYXRpb24gJiYgZWR1Y2F0aW9uICE9PSAnbm9uZScgJiYgZWR1Y2F0aW9uICE9PSAnbnVsbCcpIHtcbiAgICAvLyQoXCIjdXNlcl9lZHVjYXRpb24gb3B0aW9uOnNlbGVjdGVkXCIpLmF0dHIoJ2Rpc2FibGVkJywnZGlzYWJsZWQnKTtcbiAgICBodG1sICs9ICc8bGkgaWQ9XCInICsgZWR1Y2F0aW9uX3NsdWcgKyAnXCIgIGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93IGNoZWNrX2VkdWNhdGlvblwiPic7XG4gICAgaHRtbCArPSAnPGRpdiBjbGFzcz1cImJveC1lZHVjYXRpb24gYm94LWVkdWNhdGlvbi1wdXJwbGUgZC1mbGV4IGZsZXgtcm93XCI+JyArIGVkdWNhdGlvbiArICc8aW5wdXQgdHlwZT1cImhpZGRlblwiIHZhbHVlPVwiJyArIGVkdWNhdGlvbiArICdcIiBjbGFzcz1cIml0ZW1fZWR1Y2F0aW9uXCI+PGRpdiBvbmNsaWNrPVwiZGVsZXRlSXRlbUVkdWNhdGlvbih0aGlzKTtcIj48aW1nIHNyYz1cIi93cC1jb250ZW50L3BsdWdpbnMvYmxvZ2dpbmctcGxhdGZvcm0vYXNzZXRzL2ltZy9kZWxldGUteC1pY29uLnN2Z1wiIC8+PC9kaXY+PC9kaXY+JztcbiAgfVxuXG4gIGh0bWwgKz0gJzwvbGk+JztcbiAgJCgnI2pzLWxpc3QtZWR1Y2F0aW9uJykuYXBwZW5kKGh0bWwpO1xuICAkKCcjdXNlcl9lZHVjYXRpb24nKS52YWwoJycpO1xufVxuXG5mdW5jdGlvbiBkZWxldGVJdGVtRWR1Y2F0aW9uKG9iaikge1xuICB2YXIgZWxlbSA9IG9iajtcbiAgJChlbGVtKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmUoKTtcbn1cbi8qKlxyXG4gKiBBZGQgQXJlYSBvZiBFeHBlcnRpc2VcclxuICovXG5cblxuZnVuY3Rpb24gYWRkRXhwZXJ0aXNlSXRlbSgpIHtcbiAgdmFyIGV4cGVydGlzZSA9ICQoJyN1c2VyX2V4cGVydGlzZScpLnZhbCgpO1xuICB2YXIgZXhwZXJ0aXNlX3NsdWcgPSBleHBlcnRpc2UucmVwbGFjZSgvIC9nLCBcIi1cIikucmVwbGFjZSgvW1wiJygpXS9nLCBcIlwiKTtcbiAgdmFyIGh0bWwgPSAnJztcblxuICBpZiAoZXhwZXJ0aXNlICYmIGV4cGVydGlzZSAhPT0gJ25vbmUnICYmIGV4cGVydGlzZSAhPT0gJ251bGwnKSB7XG4gICAgaHRtbCArPSAnPGxpIGlkPVwiJyArIGV4cGVydGlzZV9zbHVnICsgJ1wiICBjbGFzcz1cImQtZmxleCBmbGV4LXJvdyBjaGVja19leHBlcnRpc2VcIj4nO1xuICAgIGh0bWwgKz0gJzxkaXYgY2xhc3M9XCJib3gtZWR1Y2F0aW9uIGJveC1lZHVjYXRpb24tcHVycGxlIGQtZmxleCBmbGV4LXJvd1wiPicgKyBleHBlcnRpc2UgKyAnPGlucHV0IHR5cGU9XCJoaWRkZW5cIiB2YWx1ZT1cIicgKyBleHBlcnRpc2UgKyAnXCIgY2xhc3M9XCJpdGVtX2VkdWNhdGlvblwiPjxkaXYgb25jbGljaz1cImRlbGV0ZUV4cGVydGlzZUl0ZW0odGhpcyk7XCI+PGltZyBzcmM9XCIvd3AtY29udGVudC9wbHVnaW5zL2Jsb2dnaW5nLXBsYXRmb3JtL2Fzc2V0cy9pbWcvZGVsZXRlLXgtaWNvbi5zdmdcIiAvPjwvZGl2PjwvZGl2Pic7XG4gIH1cblxuICBodG1sICs9ICc8L2xpPic7XG4gICQoJyNqcy1saXN0LWV4cGVydGlzZScpLmFwcGVuZChodG1sKTtcbiAgJCgnI3VzZXJfZXhwZXJ0aXNlJykudmFsKCcnKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlRXhwZXJ0aXNlSXRlbShvYmopIHtcbiAgdmFyIGVsZW0gPSBvYmo7XG4gICQoZWxlbSkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlKCk7XG59XG4vKipcclxuICogTWFwIENsaW5pY1xyXG4gKi9cblxuXG4oZnVuY3Rpb24gKCQpIHtcbiAgLyoqXHJcbiAgICogaW5pdE1hcFxyXG4gICAqXHJcbiAgICogUmVuZGVycyBhIEdvb2dsZSBNYXAgb250byB0aGUgc2VsZWN0ZWQgalF1ZXJ5IGVsZW1lbnRcclxuICAgKlxyXG4gICAqIEBkYXRlICAgIDIyLzEwLzE5XHJcbiAgICogQHNpbmNlICAgNS44LjZcclxuICAgKlxyXG4gICAqIEBwYXJhbSAgIGpRdWVyeSAkZWwgVGhlIGpRdWVyeSBlbGVtZW50LlxyXG4gICAqIEByZXR1cm4gIG9iamVjdCBUaGUgbWFwIGluc3RhbmNlLlxyXG4gICAqL1xuICBmdW5jdGlvbiBpbml0TWFwKCRlbCkge1xuICAgIC8vIEZpbmQgbWFya2VyIGVsZW1lbnRzIHdpdGhpbiBtYXAuXG4gICAgdmFyICRtYXJrZXJzID0gJGVsLmZpbmQoJy5tYXJrZXInKTsgLy8gQ3JlYXRlIGdlcmVuaWMgbWFwLlxuXG4gICAgdmFyIG1hcEFyZ3MgPSB7XG4gICAgICB6b29tOiAkZWwuZGF0YSgnem9vbScpIHx8IDE2LFxuICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUCxcbiAgICAgIHBhbkNvbnRyb2w6IGZhbHNlLFxuICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxuICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlLFxuICAgICAgb3ZlcnZpZXdNYXBDb250cm9sOiBmYWxzZSxcbiAgICAgIHpvb21Db250cm9sOiB0cnVlLFxuICAgICAgc2NhbGVDb250cm9sOiBmYWxzZSxcbiAgICAgIGZ1bGxzY3JlZW5Db250cm9sOiBmYWxzZSxcbiAgICAgIHJvdGF0ZUNvbnRyb2w6IGZhbHNlXG4gICAgfTtcbiAgICB2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcCgkZWxbMF0sIG1hcEFyZ3MpOyAvLyBBZGQgbWFya2Vycy5cblxuICAgIG1hcC5tYXJrZXJzID0gW107XG4gICAgJG1hcmtlcnMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBpbml0TWFya2VyKCQodGhpcyksIG1hcCk7XG4gICAgfSk7IC8vIENlbnRlciBtYXAgYmFzZWQgb24gbWFya2Vycy5cblxuICAgIGNlbnRlck1hcChtYXApOyAvLyBTZWFyY2ggSW5wdXQgYW5kIHB1c2ggaW50byBtYXBcblxuICAgIHNlYXJjaElucHV0KG1hcCk7IC8vIFJldHVybiBtYXAgaW5zdGFuY2UuXG5cbiAgICByZXR1cm4gbWFwO1xuICB9XG4gIC8qKlxyXG4gICAqIGluaXRNYXJrZXJcclxuICAgKlxyXG4gICAqIENyZWF0ZXMgYSBtYXJrZXIgZm9yIHRoZSBnaXZlbiBqUXVlcnkgZWxlbWVudCBhbmQgbWFwLlxyXG4gICAqXHJcbiAgICogQGRhdGUgICAgMjIvMTAvMTlcclxuICAgKiBAc2luY2UgICA1LjguNlxyXG4gICAqXHJcbiAgICogQHBhcmFtICAgalF1ZXJ5ICRlbCBUaGUgalF1ZXJ5IGVsZW1lbnQuXHJcbiAgICogQHBhcmFtICAgb2JqZWN0IFRoZSBtYXAgaW5zdGFuY2UuXHJcbiAgICogQHJldHVybiAgb2JqZWN0IFRoZSBtYXJrZXIgaW5zdGFuY2UuXHJcbiAgICovXG5cblxuICBmdW5jdGlvbiBpbml0TWFya2VyKCRtYXJrZXIsIG1hcCkge1xuICAgIC8vIEdldCBwb3NpdGlvbiBmcm9tIG1hcmtlci5cbiAgICB2YXIgbGF0ID0gJG1hcmtlci5kYXRhKCdsYXQnKTtcbiAgICB2YXIgbG5nID0gJG1hcmtlci5kYXRhKCdsbmcnKTtcbiAgICAkKFwiI2xhdGl0dWRfcHJvcFwiKS52YWwobGF0KTsgLy9TZXQgaW5wdXQgbGF0XG5cbiAgICAkKFwiI2xvbmdpdHVkX3Byb3BcIikudmFsKGxuZyk7IC8vU2V0IGlucHV0IGxuZ1xuXG4gICAgdmFyIGxhdExuZyA9IHtcbiAgICAgIGxhdDogcGFyc2VGbG9hdChsYXQpLFxuICAgICAgbG5nOiBwYXJzZUZsb2F0KGxuZylcbiAgICB9OyAvLyBDcmVhdGUgbWFya2VyIGluc3RhbmNlLlxuXG4gICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgcG9zaXRpb246IGxhdExuZyxcbiAgICAgIGljb246IFwiLi4vLi4vd3AtY29udGVudC90aGVtZXMvZG9jdG9ycGVkaWEvaW1nL2F1dGhvcnMvbWFya2VyLXByZW1pdW0uc3ZnXCIsXG4gICAgICBtYXA6IG1hcFxuICAgIH0pOyAvLyBBcHBlbmQgdG8gcmVmZXJlbmNlIGZvciBsYXRlciB1c2UuXG5cbiAgICBtYXAubWFya2Vycy5wdXNoKG1hcmtlcik7IC8vIElmIG1hcmtlciBjb250YWlucyBIVE1MLCBhZGQgaXQgdG8gYW4gaW5mb1dpbmRvdy5cblxuICAgIGlmICgkbWFya2VyLmh0bWwoKSkge1xuICAgICAgLy8gQ3JlYXRlIGluZm8gd2luZG93LlxuICAgICAgdmFyIGluZm93aW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XG4gICAgICAgIGNvbnRlbnQ6ICRtYXJrZXIuaHRtbCgpXG4gICAgICB9KTsgLy8gU2hvdyBpbmZvIHdpbmRvdyB3aGVuIG1hcmtlciBpcyBjbGlja2VkLlxuXG4gICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW5mb3dpbmRvdy5vcGVuKG1hcCwgbWFya2VyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBjZW50ZXJNYXBcclxuICAgKlxyXG4gICAqIENlbnRlcnMgdGhlIG1hcCBzaG93aW5nIGFsbCBtYXJrZXJzIGluIHZpZXcuXHJcbiAgICpcclxuICAgKiBAZGF0ZSAgICAyMi8xMC8xOVxyXG4gICAqIEBzaW5jZSAgIDUuOC42XHJcbiAgICpcclxuICAgKiBAcGFyYW0gICBvYmplY3QgVGhlIG1hcCBpbnN0YW5jZS5cclxuICAgKiBAcmV0dXJuICB2b2lkXHJcbiAgICovXG5cblxuICBmdW5jdGlvbiBjZW50ZXJNYXAobWFwKSB7XG4gICAgLy8gQ3JlYXRlIG1hcCBib3VuZGFyaWVzIGZyb20gYWxsIG1hcCBtYXJrZXJzLlxuICAgIHZhciBib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XG4gICAgbWFwLm1hcmtlcnMuZm9yRWFjaChmdW5jdGlvbiAobWFya2VyKSB7XG4gICAgICBib3VuZHMuZXh0ZW5kKHtcbiAgICAgICAgbGF0OiBtYXJrZXIucG9zaXRpb24ubGF0KCksXG4gICAgICAgIGxuZzogbWFya2VyLnBvc2l0aW9uLmxuZygpXG4gICAgICB9KTtcbiAgICB9KTsgLy8gQ2FzZTogU2luZ2xlIG1hcmtlci5cblxuICAgIGlmIChtYXAubWFya2Vycy5sZW5ndGggPT0gMSkge1xuICAgICAgbWFwLnNldENlbnRlcihib3VuZHMuZ2V0Q2VudGVyKCkpOyAvLyBDYXNlOiBNdWx0aXBsZSBtYXJrZXJzLlxuICAgIH0gZWxzZSB7XG4gICAgICBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2VhcmNoSW5wdXQobWFwKSB7XG4gICAgdmFyIGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWdvb2dsZS1zZWFyY2gnKTtcbiAgICB2YXIgc2VhcmNoQm94ID0gbmV3IGdvb2dsZS5tYXBzLnBsYWNlcy5TZWFyY2hCb3goaW5wdXQpO1xuICAgIG1hcC5jb250cm9sc1tnb29nbGUubWFwcy5Db250cm9sUG9zaXRpb24uVE9QX0xFRlRdLnB1c2goaW5wdXQpOyAvLyBCaWFzIHRoZSBTZWFyY2hCb3ggcmVzdWx0cyB0b3dhcmRzIGN1cnJlbnQgbWFwJ3Mgdmlld3BvcnQuXG5cbiAgICBtYXAuYWRkTGlzdGVuZXIoJ2JvdW5kc19jaGFuZ2VkJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VhcmNoQm94LnNldEJvdW5kcyhtYXAuZ2V0Qm91bmRzKCkpO1xuICAgIH0pO1xuICAgIHZhciBtYXJrZXJzID0gW107IC8vIFtTVEFSVCByZWdpb25fZ2V0cGxhY2VzXVxuICAgIC8vIExpc3RlbiBmb3IgdGhlIGV2ZW50IGZpcmVkIHdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhIHByZWRpY3Rpb24gYW5kIHJldHJpZXZlXG4gICAgLy8gbW9yZSBkZXRhaWxzIGZvciB0aGF0IHBsYWNlLlxuXG4gICAgc2VhcmNoQm94LmFkZExpc3RlbmVyKCdwbGFjZXNfY2hhbmdlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBwbGFjZXMgPSBzZWFyY2hCb3guZ2V0UGxhY2VzKCk7XG5cbiAgICAgIGlmIChwbGFjZXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSAvLyBDbGVhciBvdXQgdGhlIG9sZCBtYXJrZXJzLlxuXG5cbiAgICAgIG1hcmtlcnMuZm9yRWFjaChmdW5jdGlvbiAobWFya2VyKSB7XG4gICAgICAgIG1hcmtlci5zZXRNYXAobnVsbCk7XG4gICAgICB9KTtcbiAgICAgIG1hcmtlcnMgPSBbXTsgLy8gRm9yIGVhY2ggcGxhY2UsIGdldCB0aGUgaWNvbiwgbmFtZSBhbmQgbG9jYXRpb24uXG5cbiAgICAgIHZhciBib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XG4gICAgICBwbGFjZXMuZm9yRWFjaChmdW5jdGlvbiAocGxhY2UpIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgbWFya2VyIGZvciBlYWNoIHBsYWNlLlxuICAgICAgICBtYXJrZXJzLnB1c2gobmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgaWNvbjogXCIuLi8uLi93cC1jb250ZW50L3RoZW1lcy9kb2N0b3JwZWRpYS9pbWcvYXV0aG9ycy9tYXJrZXItcHJlbWl1bS5zdmdcIixcbiAgICAgICAgICB0aXRsZTogcGxhY2UubmFtZSxcbiAgICAgICAgICBwb3NpdGlvbjogcGxhY2UuZ2VvbWV0cnkubG9jYXRpb25cbiAgICAgICAgfSkpO1xuICAgICAgICAkKFwiI2xhdGl0dWRfcHJvcFwiKS52YWwocGxhY2UuZ2VvbWV0cnkubG9jYXRpb24ubGF0KTsgLy9zZXQgaW5wdXQgbGF0XG5cbiAgICAgICAgJChcIiNsb25naXR1ZF9wcm9wXCIpLnZhbChwbGFjZS5nZW9tZXRyeS5sb2NhdGlvbi5sbmcpOyAvL3NldCBpbnB1dCBsbmdcblxuICAgICAgICBpZiAocGxhY2UuZ2VvbWV0cnkudmlld3BvcnQpIHtcbiAgICAgICAgICAvLyBPbmx5IGdlb2NvZGVzIGhhdmUgdmlld3BvcnQuXG4gICAgICAgICAgYm91bmRzLnVuaW9uKHBsYWNlLmdlb21ldHJ5LnZpZXdwb3J0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBib3VuZHMuZXh0ZW5kKHBsYWNlLmdlb21ldHJ5LmxvY2F0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XG4gICAgfSk7XG4gIH0gLy8gUmVuZGVyIG1hcHMgb24gcGFnZSBsb2FkLlxuXG5cbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICQoJy5hY2YtbWFwJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbWFwID0gaW5pdE1hcCgkKHRoaXMpKTtcbiAgICB9KTtcbiAgfSk7XG59KShqUXVlcnkpO1xuXG4kKCcjanMtZ29vZ2xlLXNlYXJjaCcpLmtleXByZXNzKGZ1bmN0aW9uIChlKSB7XG4gIHJldHVybiBlLmtleUNvZGUgIT0gMTM7XG59KTtcbi8qKlxyXG4gKiBWZXJpZnkgcGhvbmUgZW50cnlcclxuICogQHBhcmFtIHsqfSBlXHJcbiAqL1xuXG5mdW5jdGlvbiBydW5DaGVja1Bob25lKGUpIHtcbiAgdGVjbGEgPSBkb2N1bWVudC5hbGwgPyBlLmtleUNvZGUgOiBlLndoaWNoOyAvL1RlY2xhIGRlIHJldHJvY2VzbyBwYXJhIGJvcnJhciwgc2llbXByZSBsYSBwZXJtaXRlXG5cbiAgaWYgKHRlY2xhID09IDgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSAvLyBQYXRyb24gZGUgZW50cmFkYSwgZW4gZXN0ZSBjYXNvIHNvbG8gYWNlcHRhIG51bWVyb3MgeSBsZXRyYXNcblxuXG4gIHBhdHJvbiA9IC9bMC05XFxzXS87XG4gIHRlY2xhX2ZpbmFsID0gU3RyaW5nLmZyb21DaGFyQ29kZSh0ZWNsYSk7XG4gIHJldHVybiBwYXRyb24udGVzdCh0ZWNsYV9maW5hbCk7XG59XG4vKipcclxuICogVmVyaWZ5IGVtYWlsIGVudHJ5XHJcbiAqIEBwYXJhbSB7Kn0gZW1haWxcclxuICovXG5cblxuZnVuY3Rpb24gcnVuQ2hlY2tFbWFpbChlbWFpbCkge1xuICB2YXIgZW1haWxSZWdleCA9IC9eWy1cXHcuJStdezEsNjR9QCg/OltBLVowLTktXXsxLDYzfVxcLil7MSwxMjV9W0EtWl17Miw2M30kL2k7XG5cbiAgaWYgKGVtYWlsUmVnZXgudGVzdChlbWFpbCkpIHtcbiAgICAkKCcjanMtbWVzc2FnZS1lbWFpbCcpLmh0bWwoJzxzcGFuIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+VmFsaWQgRW1haWwhPC9zcGFuPicpO1xuICAgICQoXCIuanMtc2F2ZS1hbmltYXRpb25cIikucmVtb3ZlQXR0cignZGlzYWJsZWQnKTtcbiAgfSBlbHNlIHtcbiAgICAkKFwiI2pzLW1lc3NhZ2UtZW1haWxcIikuaHRtbCgnPHNwYW4gY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPkVtYWlsIGlzIG5vdCB2YWxpZDwvc3Bhbj4nKTtcbiAgICAkKFwiLmpzLXNhdmUtYW5pbWF0aW9uXCIpLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgfVxuXG4gIHJldHVybjtcbn1cblxuZnVuY3Rpb24gYWN0aXZlU2tpcE1vZGFsKCkge1xuICAkKCcjanMtYmlvLW1vZGFsLXNraXAnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XG59XG4vKipcclxuICogQ291bnQgQ2hhcmFjdGVyc1xyXG4gKi9cblxuXG5mdW5jdGlvbiBjb3VudENoYXJzKG9iaikge1xuICB2YXIgbWF4TGVuZ3RoID0gNTAwO1xuICB2YXIgc3RyTGVuZ3RoID0gb2JqLnZhbHVlLmxlbmd0aDtcblxuICBpZiAoc3RyTGVuZ3RoID49IG1heExlbmd0aCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhck51bVwiKS5pbm5lckhUTUwgPSAnPHNwYW4gY2xhc3M9XCJ0ZXh0LWRhbmdlciB0ZXh0LW1pblwiPicgKyBzdHJMZW5ndGggKyAnIG91dCBvZiAnICsgbWF4TGVuZ3RoICsgJyBjaGFyYWN0ZXJzPC9zcGFuPic7XG4gICAgJChvYmopLnZhbCgkKG9iaikudmFsKCkuc3Vic3RyaW5nKDAsIG1heExlbmd0aCkpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXJOdW1cIikuaW5uZXJIVE1MID0gc3RyTGVuZ3RoICsgJyBvdXQgb2YgJyArIG1heExlbmd0aCArICcgY2hhcmFjdGVycyc7XG4gIH1cbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXHJcbiAqIENob29zZSBpbWFnZSAtIENUQVxyXG4gKiBcclxuICovXG5mdW5jdGlvbiBsZXREb2N0b3JwZWRpYUNob29zZSgpIHtcbiAgJCgnI2pzLWZlYXR1cmVkLWltYWdlLWFydGljbGUnKS5yZW1vdmVDbGFzcygnZC1mbGV4Jyk7XG4gICQoJyNqcy1mZWF0dXJlZC1pbWFnZS1hcnRpY2xlJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAkKCcjanMtZG9jdG9ycGVkaWEtY2hvb3NlJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xuICAkKCcjanMtZG9jdG9ycGVkaWEtY2hvb3NlJykuYWRkQ2xhc3MoJ2QtZmxleCcpO1xuICBjaG9vc2VSYW5kb21JbWFnZSgpO1xufVxuLyoqXHJcbiAqIENoYW5nZSBJbWFnZVxyXG4gKi9cblxuXG5mdW5jdGlvbiByZWFkVVJMKGlucHV0KSB7XG4gIGlmIChpbnB1dC5maWxlcyAmJiBpbnB1dC5maWxlc1swXSkge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAkKCcjanMtZmVhdHVyZWQtaW1hZ2UtYXJ0aWNsZScpLmNzcyhcImJhY2tncm91bmQtaW1hZ2VcIiwgXCJ1cmwoXCIgKyBlLnRhcmdldC5yZXN1bHQgKyBcIilcIik7XG4gICAgICAkKCcjanMtY2hvb3NlLWltYWdlJykuY3NzKHtcbiAgICAgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGVZKDg1cHgpJ1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGlucHV0LmZpbGVzWzBdKTtcbiAgfVxufVxuLyoqXHJcbiAqIENob29zZSBpbWFnZVxyXG4gKiBcclxuICovXG5cblxuZnVuY3Rpb24gc2V0SW1hZ2VBcnRpY2xlKHRhcmdldCkge1xuICAkKCcjanMtZmVhdHVyZWQtaW1hZ2UtYXJ0aWNsZScpLmNzcyhcImJhY2tncm91bmQtaW1hZ2VcIiwgXCJ1cmwoXCIgKyB0YXJnZXQgKyBcIilcIik7XG4gICQoJyNqcy1mZWF0dXJlZC1pbWFnZS1hcnRpY2xlIGltZycpLmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuICAkKCcjanMtaW5zZXJ0LWFydGljbGVzLWltZy1tb2RhbCcpLmFkZENsYXNzKCdkLW5vbmUnKTtcbiAgJCgnI2pzLWNob29zZS1pbWFnZScpLmNzcyh7XG4gICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGVZKDg1cHgpJ1xuICB9KTtcbiAgJCgnI2pzLWNob29zZS1pbWFnZSBidXR0b24nKS50ZXh0KCdDaGFuZ2UgaW1hZ2UnKTtcbiAgJCgnI2ZlYXR1cmVkSW1hZ2UnKS52YWwodGFyZ2V0KTtcbn1cbi8qKlxyXG4gKiBBamF4IENob29zZSByYW5kb20gaW1hZ2VcclxuICovXG5cblxuZnVuY3Rpb24gY2hvb3NlUmFuZG9tSW1hZ2UoKSB7XG4gIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2FjdGlvbicsICdjaG9vc2VfcmFuZG9tX2ltYWdlJyk7XG4gIGpRdWVyeS5hamF4KHtcbiAgICBjYWNoZTogZmFsc2UsXG4gICAgdXJsOiBkbXNfdmFycy5hamF4dXJsLFxuICAgIHR5cGU6ICdQT1NUJyxcbiAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgIHNldEltYWdlQXJ0aWNsZShyZXNwb25zZS5kYXRhKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmFsc2U7XG59XG4vKipcclxuICogQ2hlY2sgaW5wdXRzXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGZvcm1SZXF1aXJlc0FydGljbGUoc3RhdHVzKSB7XG4gIGlmICgkKCcjdGl0bGUnKS52YWwoKSA9PSAnJykge1xuICAgICQoXCIjdGl0bGVcIikuYXR0cigncGxhY2Vob2xkZXInLCAnUGxlYXNlIGNvbXBsZXRlIFRpdGxlJyk7XG4gICAgY2xvc2VNb2RhbCgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuLyoqXHJcbiAqIEFqYXggSW5zZXJ0ICYgVXBkYXRlIEFydGljbGVcclxuICovXG5cblxuZnVuY3Rpb24gRm9ybVN1Ym1pdChzdGF0dXMpIHtcbiAgdmFyIHByZXZpZXcgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG4gIGlmICghZm9ybVJlcXVpcmVzQXJ0aWNsZShzdGF0dXMpKSByZXR1cm47XG4gIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2FjdGlvbicsICdzYXZlX2Jsb2cnKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdzdGF0dXMnLCBzdGF0dXMpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ3Bvc3RfaWQnLCAkKCcjcG9zdF9pZCcpLnZhbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCd0aXRsZScsICQoJyN0aXRsZScpLnZhbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdzdWJ0aXRsZScsICQoJyNzdWJ0aXRsZScpLnZhbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdjb250ZW50JywgJCgnLnFsLWVkaXRvcicpLmh0bWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnYmxvZ19pZCcsICQoJyNibG9nX2lkJykudmFsKCkpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2ZlYXR1cmVkSW1hZ2UnLCAkKCcjZmVhdHVyZWRJbWFnZScpLnZhbCgpKTtcbiAgalF1ZXJ5LmFqYXgoe1xuICAgIGNhY2hlOiBmYWxzZSxcbiAgICB1cmw6IGRtc192YXJzLmFqYXh1cmwsXG4gICAgdHlwZTogJ1BPU1QnLFxuICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gYmVmb3JlU2VuZCgpIHtcbiAgICAgICQoJyNqcy1lZGl0LWJsb2dnaW5nLWFydGljbGUnKS5odG1sKCc8cCBjbGFzcz1cInRleHQtaW5mb1wiPlNlbmRpbmcuLi48L3A+Jyk7XG5cbiAgICAgIGlmIChzdGF0dXMgPT0gJ2RyYWZ0Jykge1xuICAgICAgICAkKCcjanMtZHJhZnQtYXJ0aWNsZScpLmFkZENsYXNzKCdsb2FkaW5nIGhpZGRlbkJ0bicpLnJlbW92ZUNsYXNzKCdkb25lJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCcjanMtcHVibGlzaC1hcnRpY2xlJykuYWRkQ2xhc3MoJ2xvYWRpbmcgaGlkZGVuQnRuJykucmVtb3ZlQ2xhc3MoJ2RvbmUnKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgIGlmIChzdGF0dXMgPT0gJ2RyYWZ0Jykge1xuICAgICAgICAkKCcjanMtZHJhZnQtYXJ0aWNsZScpLnJlbW92ZUNsYXNzKCdsb2FkaW5nIGhpZGRlbkJ0bicpLmFkZENsYXNzKCdkb25lJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCcjanMtcHVibGlzaC1hcnRpY2xlJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcgaGlkZGVuQnRuJykuYWRkQ2xhc3MoJ2RvbmUnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgaWYgKHByZXZpZXcpIHtcbiAgICAgICAgICAkKCcjanMtZWRpdC1ibG9nZ2luZy1hcnRpY2xlJykuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LWluZm9cIj5SZWZyZXNoaW5nIHBhZ2UuLi48L3A+Jyk7XG4gICAgICAgICAgJCgnI2pzLWRyYWZ0LW1vZGFsJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAgICAgICAgIHdpbmRvdy5vcGVuKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyByZXNwb25zZS5kYXRhLnByZXZpZXcsICdfYmxhbmsnKTtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShyZXNwb25zZS5kYXRhLnJlZGlyZWN0KTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5zdGF0dXMgPT0gJ2RyYWZ0Jykge1xuICAgICAgICAgICQoJyNqcy1kcmFmdC1tb2RhbCcpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcbiAgICAgICAgICAkKCcjanMtZHJhZnQtbW9kYWwnKS5hdHRyKCdkYXRhLXJlZGlyZWN0JywgcmVzcG9uc2UuZGF0YS5yZWRpcmVjdCk7XG4gICAgICAgICAgJCgnI2pzLWVkaXQtYmxvZ2dpbmctYXJ0aWNsZScpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1pbmZvXCI+UmVmcmVzaGluZyBwYWdlLi4uPC9wPicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuc3RhdHVzID09ICdwZW5kaW5nJykge1xuICAgICAgICAgICQoJyNqcy1wZW5kaW5nLWJsb2ctbW9kYWwnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XG4gICAgICAgICAgJCgnLmpzLXBlbmRpbmctbW9kYWwnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XG4gICAgICAgICAgJCgnI2pzLWVkaXQtYmxvZ2dpbmctYXJ0aWNsZScpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+JyArIHJlc3BvbnNlLmRhdGEubWVzc2FnZSArICc8L3A+Jyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoJyNqcy1lZGl0LWJsb2dnaW5nLWFydGljbGUnKS5odG1sKCc8cCBjbGFzcz1cInRleHQtZGFuZ2VyXCI+JyArIHJlc3BvbnNlLm1lc3NhZ2UgKyAnPC9wPicpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmYWxzZTtcbn1cbi8qKlxyXG4gKiBBamF4IEluc2VydCBEcmFmdCB0byBQcmV2aWV3IEFydGljbGVcclxuICovXG5cblxuZnVuY3Rpb24gRm9ybVN1Ym1pdFByZXZpZXcoKSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2FjdGlvbicsICdwcmV2aWV3X2FydGljbGUnKTtcbiAgZm9ybURhdGEuYXBwZW5kKCcgcG9zdF9pZCcsICQoJyNwb3N0X2lkJykudmFsKCkpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ3RpdGxlJywgJCgnI3RpdGxlJykudmFsKCkpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ3N1YnRpdGxlJywgJCgnI3N1YnRpdGxlJykudmFsKCkpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2NvbnRlbnQnLCAkKCcucWwtZWRpdG9yJykuaHRtbCgpKTtcbiAgZm9ybURhdGEuYXBwZW5kKCcgYmxvZ19pZCcsICQoJyNibG9nX2lkJykudmFsKCkpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2ZlYXR1cmVkSW1hZ2UnLCAkKCcjZmVhdHVyZWRJbWFnZScpLnZhbCgpKTtcbiAgalF1ZXJ5LmFqYXgoe1xuICAgIGNhY2hlOiBmYWxzZSxcbiAgICB1cmw6IGRtc192YXJzLmFqYXh1cmwsXG4gICAgdHlwZTogJ1BPU1QnLFxuICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gYmVmb3JlU2VuZCgpIHtcbiAgICAgICQoJyNqcy1lZGl0LWJsb2dnaW5nLWFydGljbGUnKS5odG1sKCc8cCBjbGFzcz1cInRleHQtaW5mb1wiPlNlbmRpbmcuLi48L3A+Jyk7XG4gICAgfSxcbiAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAkKCcjanMtZWRpdC1ibG9nZ2luZy1hcnRpY2xlJykuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LXN1Y2Nlc3NcIj5TYXZlZCBCbG9nPC9wPicpO1xuICAgICAgICB3aW5kb3cub3Blbih3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgJy9kb2N0b3ItcGxhdGZvcm0vcHJldmlldy8/cG9zdD0nICsgcmVzcG9uc2UuZGF0YS5wICsgJyZwcmV2aWV3PXRydWUnLCAnX2JsYW5rJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCcjanMtZWRpdC1ibG9nZ2luZy1hcnRpY2xlJykuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPicgKyByZXNwb25zZS5kYXRhICsgJzwvcD4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmFsc2U7XG59XG4vKiBBamF4IFB1Ymxpc2ggQXJ0aWNsZSBieSBMaW5rICovXG5cblxuZnVuY3Rpb24gRm9ybUxpbmtTdWJtaXQoKSB7XG4gIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2FjdGlvbicsICdzYXZlX2xpbmtfYmxvZycpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ3N0YXR1cycsICdwZW5kaW5nJyk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnIHBvc3RfaWQnLCAkKCcjcG9zdF9pZCcpLmF0dHIoJ2RhdGEtaWQnKSk7XG4gIGpRdWVyeS5hamF4KHtcbiAgICBjYWNoZTogZmFsc2UsXG4gICAgdXJsOiBkbXNfdmFycy5hamF4dXJsLFxuICAgIHR5cGU6ICdQT1NUJyxcbiAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uIGJlZm9yZVNlbmQoKSB7XG4gICAgICAkKCcjanMtZWRpdC1ibG9nZ2luZy1hcnRpY2xlJykuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LWluZm9cIj5TZW5kaW5nLi4uPC9wPicpO1xuICAgICAgJCgnLmJ0bi1zYXZlJykuYWRkQ2xhc3MoJ2xvYWRpbmcgaGlkZGVuQnRuJykucmVtb3ZlQ2xhc3MoJ2RvbmUnKTtcbiAgICB9LFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICQoJy5idG4tc2F2ZScpLnJlbW92ZUNsYXNzKCdsb2FkaW5nIGhpZGRlbkJ0bicpLmFkZENsYXNzKCdkb25lJyk7XG5cbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICQoJyNqcy1tc2otYXJ0aWNsZScpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+JyArIHJlc3BvbnNlLmRhdGEubWVzc2FnZSArICc8L3A+Jyk7XG5cbiAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuc3RhdHVzID09ICdwdWJsaXNoJykge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHJlc3BvbnNlLmRhdGEucmVkaXJlY3QpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCcjanMtbXNqLWFydGljbGUnKS5odG1sKCc8cCBjbGFzcz1cInRleHQtZGFuZ2VyXCI+JyArIHJlc3BvbnNlLm1lc3NhZ2UgKyAnPC9wPicpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmYWxzZTtcbn1cbi8qKlxyXG4gKiBBamF4IERlbGV0ZSBBcnRpY2xlXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGRlbGV0ZUFydGljbGUoc3RhdHVzLCBwb3N0X2lkKSB7XG4gIHZhciBvcGNpb24gPSBjb25maXJtKFwiWW91IHN1cmUgd2FudCB0byBkZWxldGUgdGhlIGJsb2c/XCIpO1xuXG4gIGlmIChvcGNpb24gPT0gdHJ1ZSkge1xuICAgIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnYWN0aW9uJywgJ2RlbGV0ZV9hcnRpY2xlJyk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCdzdGF0dXMnLCBzdGF0dXMpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnIHBvc3RfaWQnLCBwb3N0X2lkKTtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICB1cmw6IGRtc192YXJzLmFqYXh1cmwsXG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG4vKipcclxuICogRGlzYWJsZWQgbGluayBwcmV2aWV3XHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGRlc2hhYmlsaXRhcihsaW5rKSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGxpbmsuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgbGluay5zdHlsZS5wb2ludGVyRXZlbnRzID0gbnVsbDtcbiAgbGluay5zdHlsZS5jb2xvciA9ICcjY2NjJztcbiAgbGluay5zdHlsZS5ib3JkZXJCb3R0b20gPSAnMXB4IHNvbGlkICNjY2MnO1xuICBqUXVlcnkoJyNqcy1jdGEtcG9zdC1wcmV2aWV3IHNwYW4nKS5zaG93KCk7XG59XG5cbmpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICBqUXVlcnkoJyNjb250ZW50X2lmcicpLmtleXVwKGZ1bmN0aW9uICgpIHtcbiAgICBqUXVlcnkoJyN0aW55bWNlJykudmFsdWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpLnZhbHVlLnN1YnN0cmluZygwLCAxMCk7XG4gICAgY29uc29sZS5sb2coalF1ZXJ5KHRoaXMpLnZhbHVlKTtcbiAgfSk7XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXHJcbiAqIFZlcmlmeSBlbWFpbFxyXG4gKi9cbmZ1bmN0aW9uIGRvY3RvcnNGb3Jnb3RWZXJpZnlFbWFpbCgpIHtcbiAgdmFyIGVtYWlsID0gJCgnI3VzZXJfZW1haWwnKS52YWwoKTtcbiAgdmFyIGVtYWlsUmVnZXggPSAvXlstXFx3LiUrXXsxLDY0fUAoPzpbQS1aMC05LV17MSw2M31cXC4pezEsMTI1fVtBLVpdezIsNjN9JC9pO1xuXG4gIGlmIChlbWFpbFJlZ2V4LnRlc3QoZW1haWwpKSB7XG4gICAgJChcIiNqcy1mb3Jnb3QtbWVzc2FnZUZvcm1cIikuaHRtbCgnJyk7XG4gICAgJCgnI3VzZXJfZW1haWwnKS5yZW1vdmVDbGFzcygnc3R5bGVzLWRhbmdlcicpLmFkZENsYXNzKCdzdHlsZXMtc3VjY2VzcycpO1xuICB9IGVsc2Uge1xuICAgICQoXCIjanMtZm9yZ290LW1lc3NhZ2VGb3JtXCIpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1kYW5nZXJcIj5FbWFpbCBpcyBub3QgY29ycmVjdDwvcD4nKTtcbiAgICAkKCcjdXNlcl9lbWFpbCcpLnJlbW92ZUNsYXNzKCdzdHlsZXMtc3VjY2VzcycpLmFkZENsYXNzKCdzdHlsZXMtZGFuZ2VyJyk7XG4gICAgcmV0dXJuO1xuICB9XG59XG4vKipcclxuICogQWpheFxyXG4gKi9cblxuXG5qUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgalF1ZXJ5KCcjanMtZm9yZ290LXBhc3N3b3JkJykuc3VibWl0KGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZiAoJCgnI3VzZXJfZW1haWwnKS52YWwoKSA9PSAnJykge1xuICAgICAgJChcIiNqcy1mb3Jnb3QtbWVzc2FnZUZvcm1cIikuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPlBsZWFzZSBjb21wbGV0ZSBFbWFpbDwvcD4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgc2VyaWFsaXplID0gJCh0aGlzKS5zZXJpYWxpemVBcnJheSgpO1xuICAgIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnYWN0aW9uJywgJ3ZlcmlmeVVzZXJFbWFpbCcpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgndXNlcl9lbWFpbCcsIHNlcmlhbGl6ZVswXS52YWx1ZSk7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgdXJsOiAkKCcjanMtZm9yZ290LXBhc3N3b3JkJykuYXR0cignYWN0aW9uJyksXG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uIGJlZm9yZVNlbmQoKSB7XG4gICAgICAgICQoXCIjanMtZm9yZ290LW1lc3NhZ2VGb3JtXCIpLmZhZGVJbignZmFzdCcpO1xuICAgICAgICAkKFwiI2pzLWZvcmdvdC1tZXNzYWdlRm9ybVwiKS5odG1sKCc8cCBjbGFzcz1cInRleHQtaW5mb1wiPlNlbmRpbmcuLi4uPC9wPicpO1xuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MgPT0gdHJ1ZSkge1xuICAgICAgICAgICQoXCIjanMtZm9yZ290LW1lc3NhZ2VGb3JtXCIpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+JyArIHJlc3BvbnNlLmRhdGEgKyAnPC9wPicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQoXCIjanMtZm9yZ290LW1lc3NhZ2VGb3JtXCIpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1kYW5nZXJcIj4nICsgcmVzcG9uc2UuZGF0YSArICc8L3A+Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxyXG4gKiBMb2dpbiBQbGF0Zm9ybSB3aXRoIEFqYXhcclxuICovXG5qUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgalF1ZXJ5KCcjanMtYmxvZ2dpbmctbG9naW4nKS5zdWJtaXQoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmICgkKCcjdXNlcl9sb2dpbicpLnZhbCgpID09ICcnKSB7XG4gICAgICAkKFwiI2pzLW1lc3NhZ2VGb3JtXCIpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1kYW5nZXJcIj5QbGVhc2UgY29tcGxldGUgRW1haWw8L3A+Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCQoJyN1c2VyX3Bhc3MnKS52YWwoKSA9PSAnJykge1xuICAgICAgJChcIiNqcy1tZXNzYWdlRm9ybVwiKS5odG1sKCc8cCBjbGFzcz1cInRleHQtZGFuZ2VyXCI+UGxlYXNlIGNvbXBsZXRlIFBhc3N3b3JkPC9wPicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnYWN0aW9uJywgJ2Jsb2dnaW5nX2xvZ2luJyk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCd1c2VyX2xvZ2luJywgJCgnI3VzZXJfbG9naW4nKS52YWwoKSk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCd1c2VyX3Bhc3MnLCAkKCcjdXNlcl9wYXNzJykudmFsKCkpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnc2VjdXJpdHknLCAkKCcjc2VjdXJpdHknKS52YWwoKSk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCdfd3BfaHR0cF9yZWZlcmVyJywgJCgnaW5wdXRbbmFtZT1cIl93cF9odHRwX3JlZmVyZXJcIl0nKS52YWwoKSk7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgdXJsOiAkKCcjanMtYmxvZ2dpbmctbG9naW4nKS5hdHRyKCdhY3Rpb24nKSxcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gYmVmb3JlU2VuZCgpIHtcbiAgICAgICAgJChcIiNqcy1tZXNzYWdlRm9ybVwiKS5mYWRlSW4oJ2Zhc3QnKTtcbiAgICAgICAgJChcIiNqcy1tZXNzYWdlRm9ybVwiKS5odG1sKCc8cCBjbGFzcz1cInRleHQtaW5mb1wiPlNlbmRpbmcuLi4uPC9wPicpO1xuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEubG9nZ2VkaW4gPT0gdHJ1ZSkge1xuICAgICAgICAgICQoXCIjanMtbWVzc2FnZUZvcm1cIikuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LXN1Y2Nlc3NcIj4nICsgcmVzcG9uc2UuZGF0YS5tZXNzYWdlICsgJzwvcD4nKTtcbiAgICAgICAgICAkKFwiI2pzLXJlZ2lzdGVyLXN1Ym1pdFwiKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gICAgICAgICAgJChsb2NhdGlvbikuYXR0cignaHJlZicsICcuLi9kb2N0b3ItcHJvZmlsZS8nICsgcmVzcG9uc2UuZGF0YS51c2VyX25pY2VuYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKFwiI2pzLW1lc3NhZ2VGb3JtXCIpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1kYW5nZXJcIj4nICsgcmVzcG9uc2UuZGF0YS5tZXNzYWdlICsgJzwvcD4nKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbiBlcnJvcihYTUxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgJChcIiNqcy1tZXNzYWdlRm9ybVwiKS5odG1sKCc8cCBjbGFzcz1cInRleHQtZGFuZ2VyXCI+QmFkIHNlbmQsIHBsZWFzZSByZWZyZXNoIHBhZ2UgYW5kIHRyeSBhZ2FpbjwvcD4nKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXHJcbiAqIFZlcmlmeSBlbWFpbFxyXG4gKi9cbmZ1bmN0aW9uIGRvY3RvcnNWZXJpZnlFbWFpbCgpIHtcbiAgdmFyIGVtYWlsID0gJCgnI3VzZXJfZW1haWwnKS52YWwoKTtcbiAgdmFyIGVtYWlsUmVnZXggPSAvXlstXFx3LiUrXXsxLDY0fUAoPzpbQS1aMC05LV17MSw2M31cXC4pezEsMTI1fVtBLVpdezIsNjN9JC9pO1xuXG4gIGlmIChlbWFpbFJlZ2V4LnRlc3QoZW1haWwpKSB7XG4gICAgJChcIiNqcy1yZWdpc3Rlci1tZXNzYWdlRm9ybVwiKS5odG1sKCcnKTtcbiAgICAkKCcjdXNlcl9lbWFpbCcpLnJlbW92ZUNsYXNzKCdzdHlsZXMtZGFuZ2VyJykuYWRkQ2xhc3MoJ3N0eWxlcy1zdWNjZXNzJyk7XG4gIH0gZWxzZSB7XG4gICAgJChcIiNqcy1yZWdpc3Rlci1tZXNzYWdlRm9ybVwiKS5odG1sKCc8cCBjbGFzcz1cInRleHQtZGFuZ2VyXCI+RW1haWwgaXMgbm90IGNvcnJlY3Q8L3A+Jyk7XG4gICAgJCgnI3VzZXJfZW1haWwnKS5yZW1vdmVDbGFzcygnc3R5bGVzLXN1Y2Nlc3MnKS5hZGRDbGFzcygnc3R5bGVzLWRhbmdlcicpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gICQuYWpheCh7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICB1cmw6IGxvY2F0aW9uLm9yaWdpbiArICcvd3AtY29udGVudC9wbHVnaW5zL2Jsb2dnaW5nLXBsYXRmb3JtL2luYy92ZXJpZnktZW1haWwucGhwJyxcbiAgICBkYXRhOiB7XG4gICAgICBlbWFpbDogZW1haWxcbiAgICB9LFxuICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uIGJlZm9yZVNlbmQoKSB7XG4gICAgICAkKFwiI2pzLXJlZ2lzdGVyLW1lc3NhZ2VGb3JtXCIpLmZhZGVJbignZmFzdCcpO1xuICAgICAgJChcIiNqcy1yZWdpc3Rlci1tZXNzYWdlRm9ybVwiKS5odG1sKCc8cCBjbGFzcz1cInRleHQtaW5mb1wiPkNoZWNraW5nLi4uLjwvcD4nKTtcbiAgICB9LFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgIHZhciBvYmogPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcblxuICAgICAgaWYgKG9iai5kYXRhID09ICdlcnJvcicpIHtcbiAgICAgICAgJCgnI3VzZXJfZW1haWwnKS5yZW1vdmVDbGFzcygnc3R5bGVzLXN1Y2Nlc3MnKS5hZGRDbGFzcygnc3R5bGVzLWRhbmdlcicpO1xuICAgICAgICAkKCcjYXR0YWNoLWNvbmZpcm0tZW1haWwnKS5yZW1vdmVDbGFzcygnc3R5bGVzLXN1Y2Nlc3MnKS5hZGRDbGFzcygnc3R5bGVzLWRhbmdlcicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCgnI3VzZXJfZW1haWwnKS5yZW1vdmVDbGFzcygnc3R5bGVzLWRhbmdlcicpLmFkZENsYXNzKCdzdHlsZXMtc3VjY2VzcycpO1xuICAgICAgICAkKCcjYXR0YWNoLWNvbmZpcm0tZW1haWwnKS5yZW1vdmVDbGFzcygnc3R5bGVzLWRhbmdlcicpLmFkZENsYXNzKCdzdHlsZXMtc3VjY2VzcycpO1xuICAgICAgfVxuXG4gICAgICAkKFwiI2pzLXJlZ2lzdGVyLW1lc3NhZ2VGb3JtXCIpLmh0bWwob2JqLm1lc3NhZ2UpO1xuICAgIH1cbiAgfSk7XG59XG4vKipcclxuICogQHBhcmFtIFN0cmluZyBuYW1lXHJcbiAqIEByZXR1cm4gU3RyaW5nXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldFBhcmFtZXRlckJ5TmFtZShuYW1lKSB7XG4gIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtdLywgXCJcXFxcW1wiKS5yZXBsYWNlKC9bXFxdXS8sIFwiXFxcXF1cIik7XG4gIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbXFxcXD8mXVwiICsgbmFtZSArIFwiPShbXiYjXSopXCIpLFxuICAgICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWMobG9jYXRpb24uc2VhcmNoKTtcbiAgcmV0dXJuIHJlc3VsdHMgPT09IG51bGwgPyBcIlwiIDogZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMV0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSk7XG59XG4vKipcclxuICogQWpheFxyXG4gKi9cblxuXG5qUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgdmFyIHVzZXJFbWFpbDtcblxuICBpZiAodXNlckVtYWlsID0gZ2V0UGFyYW1ldGVyQnlOYW1lKCdlbWFpbCcpKSB7XG4gICAgJCgnI3VzZXJfZW1haWwnKS52YWwodXNlckVtYWlsKTtcbiAgfVxuXG4gIGpRdWVyeSgnI2pzLWJsb2dnaW5nLXJlZ2lzdGVyJykuc3VibWl0KGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZiAoJCgnI3VzZXJfZmlzdG5hbWUnKS52YWwoKSA9PSAnJykge1xuICAgICAgJChcIiNqcy1yZWdpc3Rlci1tZXNzYWdlRm9ybVwiKS5odG1sKCc8cCBjbGFzcz1cInRleHQtZGFuZ2VyXCI+UGxlYXNlIGNvbXBsZXRlIEZpc3QgTmFtZTwvcD4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoJCgnI3VzZXJfbGFzdG5hbWUnKS52YWwoKSA9PSAnJykge1xuICAgICAgJChcIiNqcy1yZWdpc3Rlci1tZXNzYWdlRm9ybVwiKS5odG1sKCc8cCBjbGFzcz1cInRleHQtZGFuZ2VyXCI+UGxlYXNlIGNvbXBsZXRlIExhc3QgTmFtZTwvcD4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoJCgnI3VzZXJfZW1haWwnKS52YWwoKSA9PSAnJykge1xuICAgICAgJChcIiNqcy1yZWdpc3Rlci1tZXNzYWdlRm9ybVwiKS5odG1sKCc8cCBjbGFzcz1cInRleHQtZGFuZ2VyXCI+UGxlYXNlIGNvbXBsZXRlIEVtYWlsPC9wPicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICgkKCcjdXNlcl9wYXNzJykudmFsKCkgPT0gJycpIHtcbiAgICAgICQoXCIjanMtcmVnaXN0ZXItbWVzc2FnZUZvcm1cIikuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPlBsZWFzZSBjb21wbGV0ZSBQYXNzd29yZDwvcD4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoJCgnI3VzZXJfcmVwYXNzJykudmFsKCkgPT0gJycpIHtcbiAgICAgICQoXCIjanMtcmVnaXN0ZXItbWVzc2FnZUZvcm1cIikuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPlBsZWFzZSBjb21wbGV0ZSBDb25maXJtIFBhc3N3b3JkPC9wPicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICgkKCcjdXNlcl9yZXBhc3MnKS52YWwoKSAhPT0gJCgnI3VzZXJfcGFzcycpLnZhbCgpKSB7XG4gICAgICAkKFwiI2pzLXJlZ2lzdGVyLW1lc3NhZ2VGb3JtXCIpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1kYW5nZXJcIj5QYXNzd29yZHMgZG9uXFwndCBtYXRjaDwvcD4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaG93X3RvID0gJCgnI2hvd190bycpLnZhbCgpO1xuXG4gICAgaWYgKGhvd190by50cmltKCkgPT0gJycpIHtcbiAgICAgICQoXCIjanMtcmVnaXN0ZXItbWVzc2FnZUZvcm1cIikuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPlBsZWFzZSBjb21wbGV0ZSBmaWVsZCwgSG93IGRpZCB5b3UgaGVhciBhYm91dCBEb2N0b3JwZWRpYT88L3A+Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8qaWYgKCAkKCcjdXNlcl9ucGknKS52YWwoKSA9PSAnJyApIHtcclxuICAgICAgICAkKFwiI2pzLXJlZ2lzdGVyLW1lc3NhZ2VGb3JtXCIpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1kYW5nZXJcIj5QbGVhc2UgY29tcGxldGUgTlBJIyA8YnI+IChJZiBOL0EsIHBsZWFzZSBwcm92aWRlIGFsdGVybmF0aXZlIHZlcmlmaWNhdGlvbik8L3A+Jyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgIGlmICggJCgnI3VzZXJfaW52aXRlJykudmFsKCkgPT0gJycgKSB7XHJcbiAgICAgICAgJChcIiNqcy1yZWdpc3Rlci1tZXNzYWdlRm9ybVwiKS5odG1sKCc8cCBjbGFzcz1cInRleHQtZGFuZ2VyXCI+UGxlYXNlIGNvbXBsZXRlIEludml0ZSBDb2RlPC9wPicpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gKi9cblxuICAgIC8qICBpZiAoICQoJyN1c2VyX2ludml0ZV9jb250cm9sJykudmFsKCkgIT09ICd2YWxpZCcpIHtcclxuICAgICAgICAgJChcIiNqcy1yZWdpc3Rlci1tZXNzYWdlRm9ybVwiKS5odG1sKCc8cCBjbGFzcz1cInRleHQtZGFuZ2VyXCI+UGxlYXNlIGVudGVyIGEgdmFsaWQgaW52aXRhdGlvbiBjb2RlPC9wPicpO1xyXG4gICAgICAgICByZXR1cm47XHJcbiAgICAgfSAqL1xuXG5cbiAgICBpZiAoJCgnI3Rlcm1zJykuaXMoJzpjaGVja2VkJykpIHt9IGVsc2Uge1xuICAgICAgJChcIiNqcy1yZWdpc3Rlci1tZXNzYWdlRm9ybVwiKS5odG1sKCc8cCBjbGFzcz1cInRleHQtZGFuZ2VyXCI+UGxlYXNlIEFjY2VwdCBUZXJtcyAmIENvbmRpdGlvbnM8L3A+Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCdhY3Rpb24nLCAnYmxvZ2dpbmdfUmVnaXN0ZXInKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ3VzZXJfZmlzdG5hbWUnLCAkKCcjdXNlcl9maXN0bmFtZScpLnZhbCgpKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ3VzZXJfbGFzdG5hbWUnLCAkKCcjdXNlcl9sYXN0bmFtZScpLnZhbCgpKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ3VzZXJfZW1haWwnLCAkKCcjdXNlcl9lbWFpbCcpLnZhbCgpKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ3VzZXJfcGFzcycsICQoJyN1c2VyX3Bhc3MnKS52YWwoKSk7IC8vZm9ybURhdGEuYXBwZW5kKCd1c2VyX25waScsICQoJyN1c2VyX25waScpLnZhbCgpICk7XG5cbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2hvd190bycsICQoJyNob3dfdG8nKS52YWwoKSk7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgdXJsOiAkKCcjanMtYmxvZ2dpbmctcmVnaXN0ZXInKS5hdHRyKCdhY3Rpb24nKSxcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gYmVmb3JlU2VuZCgpIHtcbiAgICAgICAgJChcIiNqcy1yZWdpc3Rlci1tZXNzYWdlRm9ybVwiKS5mYWRlSW4oJ2Zhc3QnKTtcbiAgICAgICAgJChcIiNqcy1yZWdpc3Rlci1tZXNzYWdlRm9ybVwiKS5odG1sKCc8cCBjbGFzcz1cInRleHQtaW5mb1wiPlNlbmRpbmcuLi4uPC9wPicpO1xuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MgPT0gdHJ1ZSkge1xuICAgICAgICAgICQoXCIjanMtcmVnaXN0ZXItbWVzc2FnZUZvcm1cIikuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LXN1Y2Nlc3NcIj4nICsgcmVzcG9uc2UuZGF0YSArICc8L3A+Jyk7IC8vJChcIiNqcy1yZWdpc3Rlci1zdWJtaXRcIikuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuXG4gICAgICAgICAgJChsb2NhdGlvbikuYXR0cignaHJlZicsICcvZG9jdG9yLXBsYXRmb3JtL2NvbXBsZXRlLWJpby8nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKFwiI2pzLXJlZ2lzdGVyLW1lc3NhZ2VGb3JtXCIpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1kYW5nZXJcIj4nICsgcmVzcG9uc2UuZGF0YSArICc8L3A+Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xufSk7XG4vKipcclxuICogT3BlbiBtb2RhbCB0ZXJtc1xyXG4gKi9cblxuZnVuY3Rpb24gb3Blbl9tb2RhbF90ZXJtcygpIHtcbiAgY29uc29sZS5sb2coJ09QRU4gTU9EQUwnKTtcbiAgJCgnI2pzLXRlcm1zLWNvbmRpdGlvbnMnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XG4gICQoJyNqcy10ZXJtcy1jb25kaXRpb25zLWZvcm0nKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XG59XG4vKipcclxuICogQ2xvc2UgbW9kYWwgdGVybXNcclxuICovXG5cblxuZnVuY3Rpb24gSGlkZVRlcm1zTW9kYWwoKSB7XG4gICQoJyNqcy10ZXJtcy1jb25kaXRpb25zJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAkKCcjanMtdGVybXMtY29uZGl0aW9ucy1mb3JtJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAkKCcjdGVybXMnKS5wcm9wKFwiY2hlY2tlZFwiLCB0cnVlKTtcbiAgY29uc29sZS5sb2coJ0hJREUnKTtcbn1cblxuZnVuY3Rpb24gY2xvc2VUZXJtc01vZGFsUmVnaXN0ZXIoKSB7XG4gICQoJyNqcy10ZXJtcy1jb25kaXRpb25zJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAkKCcjanMtdGVybXMtY29uZGl0aW9ucy1mb3JtJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xufVxuLyoqXHJcbiAqIFZlcmlmeSBpbnZpdGUgQ29kZVxyXG4gKi9cblxuXG5mdW5jdGlvbiBkb2N0b3JzVmVyaWZ5Q29kZSgpIHtcbiAgdmFyIGludml0ZUNvZGUgPSAkKCcjdXNlcl9pbnZpdGUnKS52YWwoKTtcbiAgJC5hamF4KHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHVybDogbG9jYXRpb24ub3JpZ2luICsgJy93cC1jb250ZW50L3BsdWdpbnMvYmxvZ2dpbmctcGxhdGZvcm0vaW5jL3ZlcmlmeS1pbnZpdGUtY29kZS5waHAnLFxuICAgIGRhdGE6IHtcbiAgICAgIGludml0ZUNvZGU6IGludml0ZUNvZGVcbiAgICB9LFxuICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uIGJlZm9yZVNlbmQoKSB7XG4gICAgICAkKFwiI2pzLXJlZ2lzdGVyLW1lc3NhZ2VGb3JtXCIpLmZhZGVJbignZmFzdCcpO1xuICAgICAgJChcIiNqcy1yZWdpc3Rlci1tZXNzYWdlRm9ybVwiKS5odG1sKCc8cCBjbGFzcz1cInRleHQtaW5mb1wiPkNoZWNraW5nLi4uLjwvcD4nKTtcbiAgICB9LFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgIHZhciBvYmogPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcblxuICAgICAgaWYgKG9iai5kYXRhID09ICdlcnJvcicpIHtcbiAgICAgICAgJCgnI3VzZXJfaW52aXRlJykucmVtb3ZlQ2xhc3MoJ3N0eWxlcy1zdWNjZXNzJykuYWRkQ2xhc3MoJ3N0eWxlcy1kYW5nZXInKTtcbiAgICAgICAgJCgnI2F0dGFjaC1jb25maXJtLWVtYWlsJykucmVtb3ZlQ2xhc3MoJ3N0eWxlcy1zdWNjZXNzJykuYWRkQ2xhc3MoJ3N0eWxlcy1kYW5nZXInKTtcbiAgICAgICAgJCgnI2pzLXJlZ2lzdGVyLXN1Ym1pdCcpLmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCcjdXNlcl9pbnZpdGUnKS5yZW1vdmVDbGFzcygnc3R5bGVzLWRhbmdlcicpLmFkZENsYXNzKCdzdHlsZXMtc3VjY2VzcycpO1xuICAgICAgICAkKCcjYXR0YWNoLWNvbmZpcm0tZW1haWwnKS5yZW1vdmVDbGFzcygnc3R5bGVzLWRhbmdlcicpLmFkZENsYXNzKCdzdHlsZXMtc3VjY2VzcycpO1xuICAgICAgICAkKCcjdXNlcl9pbnZpdGVfY29udHJvbCcpLnZhbCgndmFsaWQnKTtcbiAgICAgICAgJCgnI2pzLXJlZ2lzdGVyLXN1Ym1pdCcpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJyk7XG4gICAgICB9XG5cbiAgICAgICQoXCIjanMtcmVnaXN0ZXItbWVzc2FnZUZvcm1cIikuaHRtbChvYmoubWVzc2FnZSk7XG4gICAgfVxuICB9KTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gZm9ybVNldHRpbmdSZXF1aXJlcygpIHtcbiAgaWYgKCQoJyN1c2VyX3Bhc3N3b3JkJykudmFsKCkgPT0gJycpIHtcbiAgICAkKFwiI2pzLXNldHRpbmdzLW1zalwiKS5odG1sKCc8cCBjbGFzcz1cInRleHQtZGFuZ2VyXCI+UGxlYXNlIGNvbXBsZXRlIFBhc3N3b3JkPC9wPicpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICgkKCcjdXNlcl9jb25maXJtJykudmFsKCkgPT0gJycpIHtcbiAgICAkKFwiI2pzLXNldHRpbmdzLW1zalwiKS5odG1sKCc8cCBjbGFzcz1cInRleHQtZGFuZ2VyXCI+UGxlYXNlIENvbmZpcm0gUGFzc3dvcmQ8L3A+Jyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCQoJyN1c2VyX3Bhc3N3b3JkJykudmFsKCkgIT09ICQoJyN1c2VyX2NvbmZpcm0nKS52YWwoKSkge1xuICAgICQoXCIjanMtc2V0dGluZ3MtbXNqXCIpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1kYW5nZXJcIj5QYXNzd29yZHMgZG9uXFwndCBtYXRjaDwvcD4nKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cbi8qKlxyXG4gKiBBamF4IFVwZGF0ZSBCaW9cclxuICovXG5cblxuZnVuY3Rpb24gRm9ybVNldHRpbmdTdWJtaXQoKSB7XG4gIGlmICghZm9ybVNldHRpbmdSZXF1aXJlcygpKSByZXR1cm47XG4gIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2FjdGlvbicsICdzZXRfcGFzc3dvcmQnKTtcbiAgZm9ybURhdGEuYXBwZW5kKCd1c2VyX2VtYWlsJywgJCgnI3VzZXJfZW1haWwnKS52YWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgndXNlcl9wYXNzd29yZCcsICQoJyN1c2VyX3Bhc3N3b3JkJykudmFsKCkpO1xuICBqUXVlcnkuYWpheCh7XG4gICAgY2FjaGU6IGZhbHNlLFxuICAgIHVybDogYmJfdmFycy5hamF4dXJsLFxuICAgIHR5cGU6ICdQT1NUJyxcbiAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uIGJlZm9yZVNlbmQoKSB7XG4gICAgICAvKiAkKCAnI2pzLXNldHRpbmdzLW1zaicgKS5odG1sKCAnPHAgY2xhc3M9XCJ0ZXh0LWluZm9cIj5TZW5kaW5nLi4uPC9wPicgKTsgKi9cbiAgICAgICQoJy5qcy1zYXZlLWFuaW1hdGlvbicpLmFkZENsYXNzKCdsb2FkaW5nIGhpZGRlbkJ0bicpLnJlbW92ZUNsYXNzKCdkb25lJyk7XG4gICAgfSxcbiAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAkKCcuanMtc2F2ZS1hbmltYXRpb24nKS5yZW1vdmVDbGFzcygnbG9hZGluZyBoaWRkZW5CdG4nKS5hZGRDbGFzcygnZG9uZScpO1xuXG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAkKCcjanMtc2V0dGluZ3MtbXNqJykuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LXN1Y2Nlc3NcIj4nICsgcmVzcG9uc2UuZGF0YSArICc8L3A+Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCcjanMtc2V0dGluZ3MtbXNqJykuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPicgKyByZXNwb25zZS5kYXRhICsgJzwvcD4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmFsc2U7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIHNob3dWaWRlb01vZGFsKCkge1xuICBpZiAoJChcIiNmZWF0dXJlZEltYWdlXCIpWzBdLmZpbGVzWzBdID09IHVuZGVmaW5lZCkge1xuICAgICQoJyNqcy12aWRlby1yZXF1aXJlZCcpLmFkZENsYXNzKCd0ZXh0LWRhbmdlcicpO1xuICAgICQoJyNqcy12aWRlby1yZXF1aXJlZCcpLnJlbW92ZUNsYXNzKCd0ZXh0LW11dGVkJyk7XG4gICAgJCgnI2pzLXZpZGVvLXJlcXVpcmVkJykuaHRtbCgnVmlkZW8gaXMgcmVxdWlyZWQhJyk7XG4gICAgJCgnI2pzLWluc2VydC12aWRlby1tb2RhbCcpLmFkZENsYXNzKCdkLW5vbmUnKTtcbiAgICAkKCcjanMtcHJvZ3Jlc3NiYXItdmlkZW8tbW9kYWwnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gICAgJCgnI2pzLXB1Ymxpc2gtYXJ0aWNsZScpLnJlbW92ZUNsYXNzKCdkb25lIGhpZGRlbkJ0bicpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gICQoJyNqcy12aWRlby1yZXF1aXJlZCcpLnJlbW92ZUNsYXNzKCd0ZXh0LWRhbmdlcicpO1xuICAkKCcjanMtaW5zZXJ0LXZpZGVvLW1vZGFsJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xufVxuXG5mdW5jdGlvbiBvcGVuVmVyaWZpZWR2aWRlb01vZGFsKCkge1xuICAkKCcjanMtaW5zZXJ0LXZpZGVvLW1vZGFsJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAkKCcjanMtcHJvZ3Jlc3NiYXItdmlkZW8tbW9kYWwnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XG4gIEZvcm1TdWJtaXRWaWRlbygncGVuZGluZycpO1xufVxuXG5mdW5jdGlvbiByZWFkVmlkZW9VUkwoaW5wdXQpIHtcbiAgaWYgKGlucHV0LmZpbGVzICYmIGlucHV0LmZpbGVzWzBdKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICQoJyNqcy12aWRlby1wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xuICAgICAgJCgnI2pzLXZpZGVvLXByZXZpZXcnKS5hdHRyKCdzcmMnLCBlLnRhcmdldC5yZXN1bHQpO1xuICAgICAgJCgnI2pzLXZpZGVvLXByZXZpZXcgc291cmNlJykuYXR0cignc3JjJywgZS50YXJnZXQucmVzdWx0KTtcbiAgICAgICQoJyNqcy1jdGEtdmlkZW9zJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAgICAgJCgnI2pzLWN0YS12aWRlb3MtYWZ0ZXInKS5hZGRDbGFzcygnZC1mbGV4JykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xuICAgIH07XG5cbiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChpbnB1dC5maWxlc1swXSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2xvc2VWaWRlb01vZGFsKCkge1xuICAkKCcjanMtc2F2ZWQtdmlkZW8nKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gIHZhciByZWRpcmVjdCA9ICQoJyNqcy1zYXZlZC12aWRlbycpLmF0dHIoJ2RhdGEtcmVkaXJlY3QnKTtcbiAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UocmVkaXJlY3QpO1xufVxuLyoqXHJcbiAqIFN0YXJ0IFVwbG9hZCBWaWRlbyB0byBTM1xyXG4gKi9cblxuXG5mdW5jdGlvbiBGb3JtU3VibWl0VmlkZW8oc3RhdHVzKSB7XG4gIHZhciBiYXIgPSAkKCcjYmFyJyk7XG4gIHZhciAkYWpheENhbGwgPSBudWxsO1xuICB2YXIgcGVyY2VudCA9ICQoJyNwZXJjZW50Jyk7XG4gIHZhciBtZXRob2QgPSAkKCcjbWV0aG9kJykudmFsKCk7XG4gIHZhciBkb2N0b3JfbWV0aG9kID0gJCgnI2RvY3Rvcl9tZXRob2QnKS52YWwoKTtcbiAgdmFyIGZpbGVWaWRlbyA9ICQoXCIjZmVhdHVyZWRJbWFnZVwiKVswXS5maWxlc1swXTtcbiAgLyoqXHJcbiAgICogQ2FuY2VsIFVwbG9hZFxyXG4gICAqL1xuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuY2FuY2VsLXVwbG9hZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgJGFqYXhDYWxsLmFib3J0KCk7XG4gICAgRGVsZXRlQ2FuY2VsVmlkZW8oKTtcbiAgICAkKCcjanMtcHJvZ3Jlc3NiYXItdmlkZW8tbW9kYWwnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gICAgJCgnI2pzLXZpZGVvLXByZXZpZXcnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gICAgY29uc29sZS5sb2coXCJDYW5jZWxlZFwiKTtcbiAgfSk7XG5cbiAgaWYgKG1ldGhvZCAmJiBkb2N0b3JfbWV0aG9kKSB7XG4gICAgLy8gdXJsaWZlIFN0b3JhZ2VcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByb2dyZXNzX2RpdlwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIHZhciBwZXJjZW50VmFsID0gJzAlJztcbiAgICBiYXIud2lkdGgocGVyY2VudFZhbCk7XG4gICAgcGVyY2VudC5odG1sKHBlcmNlbnRWYWwpO1xuICAgIGdldFRva2VuKHN0YXR1cywgZmlsZVZpZGVvKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMb2NhbCBTdG9yYWdlXG4gICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCdhY3Rpb24nLCAnc2F2ZV92aWRlbycpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnc3RhdHVzJywgc3RhdHVzKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ3RpdGxlJywgJCgnI3RpdGxlJykudmFsKCkpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnY29udGVudCcsICQoJy5xbC1lZGl0b3InKS5odG1sKCkpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnbWV0aG9kJywgJ2xvY2FsJyk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCdmZWF0dXJlZEltYWdlJywgJChcIiNmZWF0dXJlZEltYWdlXCIpWzBdLmZpbGVzWzBdKTtcbiAgICAkYWpheENhbGwgPSBqUXVlcnkuYWpheCh7XG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICB1cmw6IGRtc192YXJzLmFqYXh1cmwsXG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgIHhocjogZnVuY3Rpb24geGhyKCkge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByb2dyZXNzX2RpdlwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB2YXIgcGVyY2VudFZhbCA9ICcwJSc7XG4gICAgICAgIGJhci53aWR0aChwZXJjZW50VmFsKTtcbiAgICAgICAgcGVyY2VudC5odG1sKHBlcmNlbnRWYWwpO1xuICAgICAgICB2YXIgeGhyID0gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoXCJwcm9ncmVzc1wiLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgaWYgKGV2dC5sZW5ndGhDb21wdXRhYmxlKSB7XG4gICAgICAgICAgICB2YXIgcGVyY2VudENvbXBsZXRlID0gZXZ0LmxvYWRlZCAvIGV2dC50b3RhbDtcbiAgICAgICAgICAgIHBlcmNlbnRDb21wbGV0ZSA9IHBhcnNlSW50KHBlcmNlbnRDb21wbGV0ZSAqIDEwMCk7XG4gICAgICAgICAgICB2YXIgcGVyY2VudFZhbCA9IHBlcmNlbnRDb21wbGV0ZSArICclJztcbiAgICAgICAgICAgIGJhci53aWR0aChwZXJjZW50VmFsKTtcbiAgICAgICAgICAgIHBlcmNlbnQuaHRtbChwZXJjZW50VmFsKTtcblxuICAgICAgICAgICAgaWYgKHBlcmNlbnRDb21wbGV0ZSA9PT0gMTAwKSB7Ly8gZG8gc3VtZXRoaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIHJldHVybiB4aHI7XG4gICAgICB9LFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICB2YXIgcGVyY2VudFZhbCA9ICcxMDAlJztcbiAgICAgICAgYmFyLndpZHRoKHBlcmNlbnRWYWwpO1xuICAgICAgICBwZXJjZW50Lmh0bWwocGVyY2VudFZhbCk7XG4gICAgICAgICQoJyNqcy1wcm9ncmVzc2Jhci12aWRlby1tb2RhbCcpLmFkZENsYXNzKCdkLW5vbmUnKTtcbiAgICAgICAgJCgnI2pzLWN0YS12aWRlby11cGxvYWRpbmcnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XG4gICAgICAgICQoJyNqcy12aWRlby1wcm9ncmVzcy1iYXItc3RhdHVzJykuYXBwZW5kKCc8ZGl2IGNsYXNzPVwiZC1mbGV4IGFsaWduLWNvbnRlbnQtY2VudGVyIG10LTFcIj48c3BhbiBjbGFzcz1cIm1yLTFcIj5Db21wbGV0ZWQ8L3NwYW4+IDxpbWcgc3JjPVwiLi4vLi4vd3AtY29udGVudC9wbHVnaW5zL2Jsb2dnaW5nLXBsYXRmb3JtL2Fzc2V0cy9pbWcvdmlkZW8tY29tcGxldGUuc3ZnXCI+PC9kaXY+Jyk7XG4gICAgICAgICQoJyNqcy1zYXZlZC12aWRlbycpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcbiAgICAgICAgJCgnLmpzLWNvbmZpcm0tbW9kYWwnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XG4gICAgICAgICQoJy5tb2RhbC1uZXdfYXJ0aWNsZV9fYm94LXRpdGxlJykuaHRtbChyZXNwb25zZS5kYXRhLm1lc3NhZ2UpO1xuICAgICAgICAkKCcjanMtc2F2ZWQtdmlkZW8nKS5hdHRyKCdkYXRhLXJlZGlyZWN0JywgcmVzcG9uc2UuZGF0YS5nb2JhY2spO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbiBlcnJvcihYTUxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgJCgnI2pzLXByb2dyZXNzYmFyLXZpZGVvLW1vZGFsJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAgICAgICAkKCcjanMtZXJyb3ItdmlkZW8tbW9kYWwnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XG4gICAgICAgICQoJyNqcy12aWRlby1wcmV2aWV3JykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAgICAgICAkKCcjanMtZXJyb3ItdmlkZW8tbW9kYWwgLnByb2dyZXNzLXRpdGxlJykuaHRtbCgnU29ycnksIHNvbWV0aGluZyB3ZW50IHdyb25nJyk7XG4gICAgICAgICQoJyNqcy1lcnJvci12aWRlby1tb2RhbCAucHJvZ3Jlc3MtY29weScpLmh0bWwoJ1BsZWFzZSB0cnkgYWdhaW4gaW4gYSBtb21lbnQnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuLyoqXHJcbiAqIEdldCBUb2tlbiBBUElcclxuICovXG5cblxuZnVuY3Rpb24gZ2V0VG9rZW4oc3RhdHVzLCBmaWxlVmlkZW8pIHtcbiAgdmFyIGJhciA9ICQoJyNiYXInKTtcbiAgdmFyIHBlcmNlbnQgPSAkKCcjcGVyY2VudCcpO1xuICB2YXIgJGFqYXhDYWxsID0gbnVsbDtcbiAgLyoqXHJcbiAgICogQ2FuY2VsIFVwbG9hZFxyXG4gICAqL1xuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuY2FuY2VsLXVwbG9hZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgJGFqYXhDYWxsLmFib3J0KCk7XG4gICAgRGVsZXRlQ2FuY2VsVmlkZW8oKTtcbiAgICAkKCcjanMtcHJvZ3Jlc3NiYXItdmlkZW8tbW9kYWwnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gICAgJCgnI2pzLXZpZGVvLXByZXZpZXcnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gICAgY29uc29sZS5sb2coXCJDYW5jZWxlZFwiKTtcbiAgfSk7XG4gIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2FjdGlvbicsICdnZXRfdG9rZW5zJyk7XG4gICRhamF4Q2FsbCA9IGpRdWVyeS5hamF4KHtcbiAgICBjYWNoZTogZmFsc2UsXG4gICAgdXJsOiBkbXNfdmFycy5hamF4dXJsLFxuICAgIHR5cGU6ICdQT1NUJyxcbiAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgIHZhciBwZXJjZW50VmFsID0gJzElJztcbiAgICAgIGJhci53aWR0aChwZXJjZW50VmFsKTtcbiAgICAgIHBlcmNlbnQuaHRtbChwZXJjZW50VmFsKTtcbiAgICAgIHZhciBjcmVkZW50aWFscyA9IHJlc3BvbnNlLmRhdGEuZGF0YTtcbiAgICAgIHZhciBzMyA9IHNldENvZ25pdG9JZGVudGl0eShyZXNwb25zZS5kYXRhLmRhdGEpO1xuICAgICAgY29uc29sZS5sb2coJzo6OjpHRVQgVE9LRU4gQU5EIFNFVCBDT0dOSVRPOjo6Jyk7XG5cbiAgICAgIGlmIChzMykge1xuICAgICAgICBnZXRQcm9qZWN0c0FXUyhzdGF0dXMsIHMzLCBjcmVkZW50aWFscywgZmlsZVZpZGVvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVycm9yUHJvY2VzcygpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG4vKipcclxuICogTG9naW4gQ29nbml0byBUb2tlblxyXG4gKi9cblxuXG5mdW5jdGlvbiBzZXRDb2duaXRvSWRlbnRpdHkoY3JlZGVudGlhbHMpIHtcbiAgdmFyIGJhciA9ICQoJyNiYXInKTtcbiAgdmFyIHBlcmNlbnQgPSAkKCcjcGVyY2VudCcpO1xuICBBV1MuY29uZmlnLmNyZWRlbnRpYWxzID0gbmV3IEFXUy5Db2duaXRvSWRlbnRpdHlDcmVkZW50aWFscyh7XG4gICAgSWRlbnRpdHlJZDogY3JlZGVudGlhbHMuSWRlbnRpdHlJZCxcbiAgICBMb2dpbnM6IHtcbiAgICAgICdjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb20nOiBjcmVkZW50aWFscy5Ub2tlblxuICAgIH1cbiAgfSk7XG4gIEFXUy5jb25maWcudXBkYXRlKHtcbiAgICByZWdpb246ICd1cy13ZXN0LTInXG4gIH0pO1xuICB2YXIgczMgPSBuZXcgQVdTLlMzKHtcbiAgICBhcGlWZXJzaW9uOiAnMjAwNi0wMy0wMScsXG4gICAgcGFyYW1zOiB7XG4gICAgICBCdWNrZXQ6ICdjb20udXJsaWZlbWVkaWEuYmV0YSdcbiAgICB9XG4gIH0pO1xuICB2YXIgcGVyY2VudFZhbCA9ICcyJSc7XG4gIGJhci53aWR0aChwZXJjZW50VmFsKTtcbiAgcGVyY2VudC5odG1sKHBlcmNlbnRWYWwpO1xuICByZXR1cm4gczM7XG59XG4vKipcclxuICogR2V0IFByb2plY3RzXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldFByb2plY3RzQVdTKHN0YXR1cywgczMsIGNyZWRlbnRpYWxzLCBmaWxlVmlkZW8pIHtcbiAgdmFyIGJhciA9ICQoJyNiYXInKTtcbiAgdmFyIHBlcmNlbnQgPSAkKCcjcGVyY2VudCcpO1xuICB2YXIgJGFqYXhDYWxsID0gbnVsbDtcbiAgLyoqXHJcbiAgICogQ2FuY2VsIFVwbG9hZFxyXG4gICAqL1xuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuY2FuY2VsLXVwbG9hZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgJGFqYXhDYWxsLmFib3J0KCk7XG4gICAgRGVsZXRlQ2FuY2VsVmlkZW8oKTtcbiAgICAkKCcjanMtcHJvZ3Jlc3NiYXItdmlkZW8tbW9kYWwnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gICAgJCgnI2pzLXZpZGVvLXByZXZpZXcnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gICAgY29uc29sZS5sb2coXCJDYW5jZWxlZFwiKTtcbiAgfSk7XG4gIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2FjdGlvbicsICdnZXRfcHJvamVjdHMnKTtcbiAgJGFqYXhDYWxsID0galF1ZXJ5LmFqYXgoe1xuICAgIGNhY2hlOiBmYWxzZSxcbiAgICB1cmw6IGRtc192YXJzLmFqYXh1cmwsXG4gICAgdHlwZTogJ1BPU1QnLFxuICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgdmFyIHBlcmNlbnRWYWwgPSAnMyUnO1xuICAgICAgYmFyLndpZHRoKHBlcmNlbnRWYWwpO1xuICAgICAgcGVyY2VudC5odG1sKHBlcmNlbnRWYWwpO1xuICAgICAgdmFyIHByb2plY3QgPSByZXNwb25zZS5kYXRhO1xuICAgICAgY29uc29sZS5sb2coJzo6OjpHRVQgUFJPSkVDVDo6OicpO1xuXG4gICAgICBpZiAocHJvamVjdCAmJiBwcm9qZWN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjcmVhdGVQcm9qZWN0c1NLVShzdGF0dXMsIHMzLCBwcm9qZWN0LCBjcmVkZW50aWFscywgZmlsZVZpZGVvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVycm9yUHJvY2VzcygpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uIGVycm9yKFhNTEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgZXJyb3JQcm9jZXNzKCk7XG4gICAgfVxuICB9KTtcbn1cbi8qKlxyXG4gKiBcclxuICogQ3JlYXRlIHByb2plY3Rza1VcclxuICovXG5cblxuZnVuY3Rpb24gY3JlYXRlUHJvamVjdHNTS1Uoc3RhdHVzLCBzMywgcHJvamVjdCwgY3JlZGVudGlhbHMsIGZpbGVWaWRlbykge1xuICB2YXIgYmFyID0gJCgnI2JhcicpO1xuICB2YXIgcGVyY2VudCA9ICQoJyNwZXJjZW50Jyk7XG4gIHZhciAkYWpheENhbGwgPSBudWxsO1xuICAvKipcclxuICAgKiBDYW5jZWwgVXBsb2FkXHJcbiAgICovXG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5jYW5jZWwtdXBsb2FkJywgZnVuY3Rpb24gKGUpIHtcbiAgICAkYWpheENhbGwuYWJvcnQoKTtcbiAgICBEZWxldGVDYW5jZWxWaWRlbygpO1xuICAgICQoJyNqcy1wcm9ncmVzc2Jhci12aWRlby1tb2RhbCcpLmFkZENsYXNzKCdkLW5vbmUnKTtcbiAgICAkKCcjanMtdmlkZW8tcHJldmlldycpLmFkZENsYXNzKCdkLW5vbmUnKTtcbiAgICBjb25zb2xlLmxvZyhcIkNhbmNlbGVkXCIpO1xuICB9KTtcbiAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnYWN0aW9uJywgJ2NyZWF0ZV9wcm9qZWN0X3NrdScpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ3Byb2plY3RfaWQnLCBwcm9qZWN0KTtcbiAgJGFqYXhDYWxsID0galF1ZXJ5LmFqYXgoe1xuICAgIGNhY2hlOiBmYWxzZSxcbiAgICB1cmw6IGRtc192YXJzLmFqYXh1cmwsXG4gICAgdHlwZTogJ1BPU1QnLFxuICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgdmFyIHBlcmNlbnRWYWwgPSAnNCUnO1xuICAgICAgYmFyLndpZHRoKHBlcmNlbnRWYWwpO1xuICAgICAgcGVyY2VudC5odG1sKHBlcmNlbnRWYWwpO1xuICAgICAgdmFyIHByb2plY3RTS1UgPSByZXNwb25zZS5kYXRhO1xuICAgICAgY29uc29sZS5sb2coJzo6OjpDUkVBVEUgUFJPSkVDVCBTS1U6OjonKTtcblxuICAgICAgaWYgKHByb2plY3RTS1UgJiYgcHJvamVjdFNLVSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY3JlYXRlRmlsZShzdGF0dXMsIHMzLCBwcm9qZWN0LCBwcm9qZWN0U0tVLCBjcmVkZW50aWFscywgZmlsZVZpZGVvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVycm9yUHJvY2VzcygpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG4vKipcclxuICogXHJcbiAqIENyZWF0ZSBmaWxlIFVSTGlmZVxyXG4gKi9cblxuXG5mdW5jdGlvbiBjcmVhdGVGaWxlKHN0YXR1cywgczMsIHByb2plY3QsIHByb2plY3RTS1UsIGNyZWRlbnRpYWxzLCBmaWxlVmlkZW8pIHtcbiAgdmFyIGJhciA9ICQoJyNiYXInKTtcbiAgdmFyIHBlcmNlbnQgPSAkKCcjcGVyY2VudCcpO1xuICB2YXIgJGFqYXhDYWxsID0gbnVsbDtcbiAgLyoqXHJcbiAgICogQ2FuY2VsIFVwbG9hZFxyXG4gICAqL1xuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuY2FuY2VsLXVwbG9hZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgJGFqYXhDYWxsLmFib3J0KCk7XG4gICAgRGVsZXRlQ2FuY2VsVmlkZW8oKTtcbiAgICAkKCcjanMtcHJvZ3Jlc3NiYXItdmlkZW8tbW9kYWwnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gICAgJCgnI2pzLXZpZGVvLXByZXZpZXcnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gICAgY29uc29sZS5sb2coXCJDYW5jZWxlZFwiKTtcbiAgfSk7XG4gIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2FjdGlvbicsICdjcmVhdGVGaWxlVVJMaWZlJyk7XG4gIGZvcm1EYXRhLmFwcGVuZCgncHJvamVjdF9pZCcsIHByb2plY3QpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ3Byb2plY3Rfc2t1JywgcHJvamVjdFNLVSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnZmlsZU5hbWUnLCBmaWxlVmlkZW8ubmFtZSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnZmlsZU1pbWVUeXBlJywgZmlsZVZpZGVvLnR5cGUpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ3RpdGxlJywgJCgnI3RpdGxlJykudmFsKCkpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2Rlc2NyaXB0aW9uJywgJCgnLnFsLWVkaXRvcicpLmh0bWwoKSk7XG4gICRhamF4Q2FsbCA9IGpRdWVyeS5hamF4KHtcbiAgICBjYWNoZTogZmFsc2UsXG4gICAgdXJsOiBkbXNfdmFycy5hamF4dXJsLFxuICAgIHR5cGU6ICdQT1NUJyxcbiAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgIHZhciBwZXJjZW50VmFsID0gJzUlJztcbiAgICAgIGJhci53aWR0aChwZXJjZW50VmFsKTtcbiAgICAgIHBlcmNlbnQuaHRtbChwZXJjZW50VmFsKTsgLy92YXIgZmlsZVVSTGlmZSA9IHJlc3BvbnNlLmRhdGEuZGF0YVswXS5pZDtcblxuICAgICAgdmFyIGZpbGVVUkxpZmUgPSByZXNwb25zZS5kYXRhLmRhdGFbMF07XG4gICAgICBjb25zb2xlLmxvZygnOjo6OkNSRUFURSBGSUxFOjo6Jyk7XG5cbiAgICAgIGlmIChmaWxlVVJMaWZlICYmIGZpbGVVUkxpZmUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdXBsb2FkRmlsZUFXUyhzdGF0dXMsIHMzLCBwcm9qZWN0LCBjcmVkZW50aWFscywgZmlsZVVSTGlmZSwgZmlsZVZpZGVvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVycm9yUHJvY2VzcygpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG4vKipcclxuICogVXBsb2FkIEZpbGUgdG8gQVdTIFMzXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIHVwbG9hZEZpbGVBV1Moc3RhdHVzLCBzMywgcHJvamVjdCwgY3JlZGVudGlhbHMsIGZpbGVVUkxpZmUsIGZpbGVWaWRlbykge1xuICB2YXIgYmFyID0gJCgnI2JhcicpO1xuICB2YXIgcGVyY2VudCA9ICQoJyNwZXJjZW50Jyk7XG4gIHZhciBmaWxlTmFtZSA9IGZpbGVWaWRlby5uYW1lO1xuICB2YXIgZmlsZUV4dCA9IGZpbGVOYW1lLnNwbGl0KFwiLlwiKS5wb3AoKTtcbiAgdmFyIGZpbGVLZXkgPSAndXBsb2Fkcy8nICsgY3JlZGVudGlhbHMuSWRlbnRpdHlJZCArICcvcHJvamVjdC8nICsgZmlsZVVSTGlmZS5pZCArICcuJyArIGZpbGVVUkxpZmUuZmlsZUV4dDsgLy92YXIgZmlsZUtleSA9ICd1cGxvYWRzLycgKyBjcmVkZW50aWFscy5JZGVudGl0eUlkICsgJy8nICsgZmlsZVVSTGlmZS5pZCArICcuJyArIGZpbGVVUkxpZmUuZmlsZUV4dDtcblxuICBzMy51cGxvYWQoe1xuICAgIEJ1Y2tldDogJ2NvbS51cmxpZmVtZWRpYS5iZXRhJyxcbiAgICBLZXk6IGZpbGVLZXksXG4gICAgQm9keTogZmlsZVZpZGVvLFxuICAgIEFDTDogJ3B1YmxpYy1yZWFkJ1xuICB9LCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIGVycm9yUHJvY2VzcygpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCc6Ojo6VVBMT0FEIEZJTEU6OjonKTtcbiAgICBzZW5kRGF0YVdQKHN0YXR1cywgZmlsZVVSTGlmZSwgZmlsZVZpZGVvLCBwcm9qZWN0LCBkYXRhKTtcbiAgfSkub24oJ2h0dHBVcGxvYWRQcm9ncmVzcycsIGZ1bmN0aW9uIChwcm9ncmVzcykge1xuICAgIHZhciBwZXJjZW50Q29tcGxldGUgPSBwcm9ncmVzcy5sb2FkZWQgLyBwcm9ncmVzcy50b3RhbDtcbiAgICBwZXJjZW50Q29tcGxldGUgPSBwYXJzZUludChwZXJjZW50Q29tcGxldGUgKiAxMDApICsgMTU7XG5cbiAgICBpZiAocGVyY2VudENvbXBsZXRlIDwgMTAwKSB7XG4gICAgICB2YXIgcGVyY2VudFZhbCA9IHBlcmNlbnRDb21wbGV0ZSArICclJztcbiAgICAgIGJhci53aWR0aChwZXJjZW50VmFsKTtcbiAgICAgIHBlcmNlbnQuaHRtbChwZXJjZW50VmFsKTtcbiAgICB9XG4gIH0pO1xufVxuLyoqXHJcbiAqIFNlbmQgRGF0YSB0byBXUFxyXG4gKi9cblxuXG5mdW5jdGlvbiBzZW5kRGF0YVdQKHN0YXR1cywgZmlsZVVSTGlmZSwgZmlsZVZpZGVvLCBwcm9qZWN0LCBkYXRhKSB7XG4gIHZhciBiYXIgPSAkKCcjYmFyJyk7XG4gIHZhciBwZXJjZW50ID0gJCgnI3BlcmNlbnQnKTtcbiAgdmFyICRhamF4Q2FsbCA9IG51bGw7XG4gIC8qKlxyXG4gICAqIENhbmNlbCBVcGxvYWRcclxuICAgKi9cblxuICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmNhbmNlbC11cGxvYWQnLCBmdW5jdGlvbiAoZSkge1xuICAgICRhamF4Q2FsbC5hYm9ydCgpO1xuICAgIERlbGV0ZUNhbmNlbFZpZGVvKCk7XG4gICAgJCgnI2pzLXByb2dyZXNzYmFyLXZpZGVvLW1vZGFsJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAgICQoJyNqcy12aWRlby1wcmV2aWV3JykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAgIGNvbnNvbGUubG9nKFwiQ2FuY2VsZWRcIik7XG4gIH0pO1xuICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdhY3Rpb24nLCAnc2F2ZV92aWRlbycpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ3N0YXR1cycsIHN0YXR1cyk7XG4gIGZvcm1EYXRhLmFwcGVuZCgndGl0bGUnLCAkKCcjdGl0bGUnKS52YWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnbG9jYXRpb24nLCBkYXRhLkxvY2F0aW9uKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdjb250ZW50JywgJCgnLnFsLWVkaXRvcicpLmh0bWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnZmlsZU5hbWUnLCBmaWxlVmlkZW8ubmFtZSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnZmlsZU1pbWVUeXBlJywgZmlsZVVSTGlmZS5maWxlRXh0KTtcbiAgZm9ybURhdGEuYXBwZW5kKCdwcm9qZWN0X2lkJywgcHJvamVjdCk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnZmlsZV9pZCcsIGZpbGVVUkxpZmUuaWQpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ21ldGhvZCcsICd1cmxpZmUnKTtcbiAgJGFqYXhDYWxsID0galF1ZXJ5LmFqYXgoe1xuICAgIGNhY2hlOiBmYWxzZSxcbiAgICB1cmw6IGRtc192YXJzLmFqYXh1cmwsXG4gICAgdHlwZTogJ1BPU1QnLFxuICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG5cbiAgICAvKiB4aHI6IGZ1bmN0aW9uKCkgeyAgICAgICAgICAgICAgICBcclxuICAgICAgICB2YXIgeGhyID0gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHhoci51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcihcInByb2dyZXNzXCIsIGZ1bmN0aW9uKGV2dCkge1xyXG4gICAgICAgICAgICBpZiAoZXZ0Lmxlbmd0aENvbXB1dGFibGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50Q29tcGxldGUgPSBldnQubG9hZGVkIC8gZXZ0LnRvdGFsO1xyXG4gICAgICAgICAgICAgICAgcGVyY2VudENvbXBsZXRlID0gcGFyc2VJbnQocGVyY2VudENvbXBsZXRlICogMTAwKTtcclxuICAgICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRWYWwgPSBwZXJjZW50Q29tcGxldGUgKyAnJSc7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFyLndpZHRoKHBlcmNlbnRWYWwpXHJcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudC5odG1sKHBlcmNlbnRWYWwpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKHBlcmNlbnRDb21wbGV0ZSA9PT0gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZG8gc3VtZXRoaW5nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICBcclxuICAgICAgICByZXR1cm4geGhyO1xyXG4gICAgfSwgKi9cbiAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICB2YXIgcGVyY2VudFZhbCA9ICcxMDAlJztcbiAgICAgIGJhci53aWR0aChwZXJjZW50VmFsKTtcbiAgICAgIHBlcmNlbnQuaHRtbChwZXJjZW50VmFsKTtcbiAgICAgIGNvbnNvbGUubG9nKCc6Ojo6VVBEQVRFIEZJTEU6OjonKTtcbiAgICAgICQoJyNqcy1wcm9ncmVzc2Jhci12aWRlby1tb2RhbCcpLmFkZENsYXNzKCdkLW5vbmUnKTtcbiAgICAgICQoJyNqcy1jdGEtdmlkZW8tdXBsb2FkaW5nJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xuICAgICAgJCgnI2pzLXZpZGVvLXByb2dyZXNzLWJhci1zdGF0dXMnKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJkLWZsZXggYWxpZ24tY29udGVudC1jZW50ZXIgbXQtMVwiPjxzcGFuIGNsYXNzPVwibXItMVwiPkNvbXBsZXRlZDwvc3Bhbj4gPGltZyBzcmM9XCIuLi8uLi93cC1jb250ZW50L3BsdWdpbnMvYmxvZ2dpbmctcGxhdGZvcm0vYXNzZXRzL2ltZy92aWRlby1jb21wbGV0ZS5zdmdcIj48L2Rpdj4nKTtcbiAgICAgICQoJyNqcy1zYXZlZC12aWRlbycpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcbiAgICAgICQoJy5qcy1jb25maXJtLW1vZGFsJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xuICAgICAgJCgnLm1vZGFsLW5ld19hcnRpY2xlX19ib3gtdGl0bGUnKS5odG1sKHJlc3BvbnNlLmRhdGEubWVzc2FnZSk7XG4gICAgICAkKCcjanMtc2F2ZWQtdmlkZW8nKS5hdHRyKCdkYXRhLXJlZGlyZWN0JywgcmVzcG9uc2UuZGF0YS5nb2JhY2spO1xuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uIGVycm9yKFhNTEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgZXJyb3JQcm9jZXNzKCk7XG4gICAgfVxuICB9KTtcbn1cbi8qKlxyXG4gKiBBamF4IFNhdmUgZGF0YSBOb3QgdXBsb2FkXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIERlbGV0ZUNhbmNlbFZpZGVvKCkge1xuICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdhY3Rpb24nLCAnZGVsZXRlX2NhbmNlbF92aWRlbycpO1xuICBqUXVlcnkuYWpheCh7XG4gICAgY2FjaGU6IGZhbHNlLFxuICAgIHVybDogZG1zX3ZhcnMuYWpheHVybCxcbiAgICB0eXBlOiAnUE9TVCcsXG4gICAgZGF0YTogZm9ybURhdGEsXG4gICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7Ly8gRG8gc29tZXRoaW5nXG4gICAgfVxuICB9KTtcbn1cbi8qKlxyXG4gKiBBamF4IFNhdmUgZGF0YSBOb3QgdXBsb2FkXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIEZvcm1TYXZlVmlkZW8oc3RhdHVzKSB7XG4gIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2FjdGlvbicsICdlZGl0X3ZpZGVvJyk7XG4gIGZvcm1EYXRhLmFwcGVuZCgndGl0bGUnLCAkKCcjdGl0bGUnKS52YWwoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgncG9zdF9pZCcsICQoJyNwb3N0X2lkJykudmFsKCkpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2NvbnRlbnQnLCAkKCcucWwtZWRpdG9yJykuaHRtbCgpKTtcbiAgalF1ZXJ5LmFqYXgoe1xuICAgIGNhY2hlOiBmYWxzZSxcbiAgICB1cmw6IGRtc192YXJzLmFqYXh1cmwsXG4gICAgdHlwZTogJ1BPU1QnLFxuICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgJCgnI2pzLWluc2VydC12aWRlby1tb2RhbCcpLmFkZENsYXNzKCdkLW5vbmUnKTtcbiAgICAgICQoJyNqcy1zYXZlLWRhdGEtdmlkZW8tbW9kYWwnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XG4gICAgICAkKCcjanMtdmlkZW8tbWVzc2FnZScpLmh0bWwocmVzcG9uc2UuZGF0YS5tZXNzYWdlKTtcbiAgICAgICQoJyNqcy1zYXZlZC12aWRlbycpLmF0dHIoJ2RhdGEtcmVkaXJlY3QnLCByZXNwb25zZS5kYXRhLmdvYmFjayk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuLyoqXHJcbiAqIEFqYXggRGVsZXRlIFZpZGVvXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGRlbGV0ZVZpZGVvKHN0YXR1cywgcG9zdF9pZCkge1xuICB2YXIgb3BjaW9uID0gY29uZmlybShcIllvdSBzdXJlIHdhbnQgdG8gZGVsZXRlIHRoZSB2aWRlbz9cIik7XG5cbiAgaWYgKG9wY2lvbiA9PSB0cnVlKSB7XG4gICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCdhY3Rpb24nLCAnZGVsZXRlX3ZpZGVvJyk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCdzdGF0dXMnLCBzdGF0dXMpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnIHBvc3RfaWQnLCBwb3N0X2lkKTtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICB1cmw6IGRtc192YXJzLmFqYXh1cmwsXG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG4vKipcclxuICogRXJyb3JcclxuICovXG5cblxuZnVuY3Rpb24gZXJyb3JQcm9jZXNzKCkge1xuICAkKCcjanMtcHJvZ3Jlc3NiYXItdmlkZW8tbW9kYWwnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gICQoJyNqcy1lcnJvci12aWRlby1tb2RhbCcpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcbiAgJCgnI2pzLXZpZGVvLXByZXZpZXcnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gICQoJyNqcy1lcnJvci12aWRlby1tb2RhbCAucHJvZ3Jlc3MtdGl0bGUnKS5odG1sKCdTb3JyeSwgc29tZXRoaW5nIHdlbnQgd3JvbmcnKTtcbiAgJCgnI2pzLWVycm9yLXZpZGVvLW1vZGFsIC5wcm9ncmVzcy1jb3B5JykuaHRtbCgnUGxlYXNlIHRyeSBhZ2FpbiBpbiBhIG1vbWVudCcpO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG4vKiBOaWNFZGl0IC0gTWljcm8gSW5saW5lIFdZU0lXWUdcclxuICogQ29weXJpZ2h0IDIwMDctMjAwOCBCcmlhbiBLaXJjaG9mZlxyXG4gKlxyXG4gKiBOaWNFZGl0IGlzIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgTUlUIGxpY2Vuc2VcclxuICogRm9yIG1vcmUgaW5mb3JtYXRpb24gdmlzaXQgaHR0cDovL25pY2VkaXQuY29tL1xyXG4gKiBEbyBub3QgcmVtb3ZlIHRoaXMgY29weXJpZ2h0IG1lc3NhZ2VcclxuICovXG52YXIgYmtFeHRlbmQgPSBmdW5jdGlvbiBia0V4dGVuZCgpIHtcbiAgdmFyIEEgPSBhcmd1bWVudHM7XG5cbiAgaWYgKEEubGVuZ3RoID09IDEpIHtcbiAgICBBID0gW3RoaXMsIEFbMF1dO1xuICB9XG5cbiAgZm9yICh2YXIgQiBpbiBBWzFdKSB7XG4gICAgQVswXVtCXSA9IEFbMV1bQl07XG4gIH1cblxuICByZXR1cm4gQVswXTtcbn07XG5cbmZ1bmN0aW9uIGJrQ2xhc3MoKSB7fVxuXG5ia0NsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3QgPSBmdW5jdGlvbiAoKSB7fTtcblxuYmtDbGFzcy5leHRlbmQgPSBmdW5jdGlvbiAoQykge1xuICB2YXIgQSA9IGZ1bmN0aW9uIEEoKSB7XG4gICAgaWYgKGFyZ3VtZW50c1swXSAhPT0gYmtDbGFzcykge1xuICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBCID0gbmV3IHRoaXMoYmtDbGFzcyk7XG4gIGJrRXh0ZW5kKEIsIEMpO1xuICBBLnByb3RvdHlwZSA9IEI7XG4gIEEuZXh0ZW5kID0gdGhpcy5leHRlbmQ7XG4gIHJldHVybiBBO1xufTtcblxudmFyIGJrRWxlbWVudCA9IGJrQ2xhc3MuZXh0ZW5kKHtcbiAgY29uc3RydWN0OiBmdW5jdGlvbiBjb25zdHJ1Y3QoQiwgQSkge1xuICAgIGlmICh0eXBlb2YgQiA9PSBcInN0cmluZ1wiKSB7XG4gICAgICBCID0gKEEgfHwgZG9jdW1lbnQpLmNyZWF0ZUVsZW1lbnQoQik7XG4gICAgfVxuXG4gICAgQiA9ICRCSyhCKTtcbiAgICByZXR1cm4gQjtcbiAgfSxcbiAgYXBwZW5kVG86IGZ1bmN0aW9uIGFwcGVuZFRvKEEpIHtcbiAgICBBLmFwcGVuZENoaWxkKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBhcHBlbmRCZWZvcmU6IGZ1bmN0aW9uIGFwcGVuZEJlZm9yZShBKSB7XG4gICAgQS5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLCBBKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgYWRkRXZlbnQ6IGZ1bmN0aW9uIGFkZEV2ZW50KEIsIEEpIHtcbiAgICBia0xpYi5hZGRFdmVudCh0aGlzLCBCLCBBKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgc2V0Q29udGVudDogZnVuY3Rpb24gc2V0Q29udGVudChBKSB7XG4gICAgdGhpcy5pbm5lckhUTUwgPSBBO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBwb3M6IGZ1bmN0aW9uIHBvcygpIHtcbiAgICB2YXIgQyA9IGN1cnRvcCA9IDA7XG4gICAgdmFyIEIgPSBvYmogPSB0aGlzO1xuXG4gICAgaWYgKG9iai5vZmZzZXRQYXJlbnQpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgQyArPSBvYmoub2Zmc2V0TGVmdDtcbiAgICAgICAgY3VydG9wICs9IG9iai5vZmZzZXRUb3A7XG4gICAgICB9IHdoaWxlIChvYmogPSBvYmoub2Zmc2V0UGFyZW50KTtcbiAgICB9XG5cbiAgICB2YXIgQSA9ICF3aW5kb3cub3BlcmEgPyBwYXJzZUludCh0aGlzLmdldFN0eWxlKFwiYm9yZGVyLXdpZHRoXCIpIHx8IHRoaXMuc3R5bGUuYm9yZGVyKSB8fCAwIDogMDtcbiAgICByZXR1cm4gW0MgKyBBLCBjdXJ0b3AgKyBBICsgdGhpcy5vZmZzZXRIZWlnaHRdO1xuICB9LFxuICBub1NlbGVjdDogZnVuY3Rpb24gbm9TZWxlY3QoKSB7XG4gICAgYmtMaWIubm9TZWxlY3QodGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIHBhcmVudFRhZzogZnVuY3Rpb24gcGFyZW50VGFnKEEpIHtcbiAgICB2YXIgQiA9IHRoaXM7XG5cbiAgICBkbyB7XG4gICAgICBpZiAoQiAmJiBCLm5vZGVOYW1lICYmIEIubm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PSBBKSB7XG4gICAgICAgIHJldHVybiBCO1xuICAgICAgfVxuXG4gICAgICBCID0gQi5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKEIpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBoYXNDbGFzczogZnVuY3Rpb24gaGFzQ2xhc3MoQSkge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTmFtZS5tYXRjaChuZXcgUmVnRXhwKFwiKFxcXFxzfF4pbmljRWRpdC1cIiArIEEgKyBcIihcXFxcc3wkKVwiKSk7XG4gIH0sXG4gIGFkZENsYXNzOiBmdW5jdGlvbiBhZGRDbGFzcyhBKSB7XG4gICAgaWYgKCF0aGlzLmhhc0NsYXNzKEEpKSB7XG4gICAgICB0aGlzLmNsYXNzTmFtZSArPSBcIiBuaWNFZGl0LVwiICsgQTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uIHJlbW92ZUNsYXNzKEEpIHtcbiAgICBpZiAodGhpcy5oYXNDbGFzcyhBKSkge1xuICAgICAgdGhpcy5jbGFzc05hbWUgPSB0aGlzLmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoXFxcXHN8XiluaWNFZGl0LVwiICsgQSArIFwiKFxcXFxzfCQpXCIpLCBcIiBcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIHNldFN0eWxlOiBmdW5jdGlvbiBzZXRTdHlsZShBKSB7XG4gICAgdmFyIEIgPSB0aGlzLnN0eWxlO1xuXG4gICAgZm9yICh2YXIgQyBpbiBBKSB7XG4gICAgICBzd2l0Y2ggKEMpIHtcbiAgICAgICAgY2FzZSBcImZsb2F0XCI6XG4gICAgICAgICAgQi5jc3NGbG9hdCA9IEIuc3R5bGVGbG9hdCA9IEFbQ107XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIm9wYWNpdHlcIjpcbiAgICAgICAgICBCLm9wYWNpdHkgPSBBW0NdO1xuICAgICAgICAgIEIuZmlsdGVyID0gXCJhbHBoYShvcGFjaXR5PVwiICsgTWF0aC5yb3VuZChBW0NdICogMTAwKSArIFwiKVwiO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJjbGFzc05hbWVcIjpcbiAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IEFbQ107XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBCW0NdID0gQVtDXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgZ2V0U3R5bGU6IGZ1bmN0aW9uIGdldFN0eWxlKEEsIEMpIHtcbiAgICB2YXIgQiA9ICFDID8gZG9jdW1lbnQuZGVmYXVsdFZpZXcgOiBDO1xuXG4gICAgaWYgKHRoaXMubm9kZVR5cGUgPT0gMSkge1xuICAgICAgcmV0dXJuIEIgJiYgQi5nZXRDb21wdXRlZFN0eWxlID8gQi5nZXRDb21wdXRlZFN0eWxlKHRoaXMsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoQSkgOiB0aGlzLmN1cnJlbnRTdHlsZVtia0xpYi5jYW1lbGl6ZShBKV07XG4gICAgfVxuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICB0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIHNldEF0dHJpYnV0ZXM6IGZ1bmN0aW9uIHNldEF0dHJpYnV0ZXMoQSkge1xuICAgIGZvciAodmFyIEIgaW4gQSkge1xuICAgICAgdGhpc1tCXSA9IEFbQl07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xudmFyIGJrTGliID0ge1xuICBpc01TSUU6IG5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoXCJNU0lFXCIpICE9IC0xLFxuICBhZGRFdmVudDogZnVuY3Rpb24gYWRkRXZlbnQoQywgQiwgQSkge1xuICAgIEMuYWRkRXZlbnRMaXN0ZW5lciA/IEMuYWRkRXZlbnRMaXN0ZW5lcihCLCBBLCBmYWxzZSkgOiBDLmF0dGFjaEV2ZW50KFwib25cIiArIEIsIEEpO1xuICB9LFxuICB0b0FycmF5OiBmdW5jdGlvbiB0b0FycmF5KEMpIHtcbiAgICB2YXIgQiA9IEMubGVuZ3RoLFxuICAgICAgICBBID0gbmV3IEFycmF5KEIpO1xuXG4gICAgd2hpbGUgKEItLSkge1xuICAgICAgQVtCXSA9IENbQl07XG4gICAgfVxuXG4gICAgcmV0dXJuIEE7XG4gIH0sXG4gIG5vU2VsZWN0OiBmdW5jdGlvbiBub1NlbGVjdChCKSB7XG4gICAgaWYgKEIuc2V0QXR0cmlidXRlICYmIEIubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPSBcImlucHV0XCIgJiYgQi5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9IFwidGV4dGFyZWFcIikge1xuICAgICAgQi5zZXRBdHRyaWJ1dGUoXCJ1bnNlbGVjdGFibGVcIiwgXCJvblwiKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBBID0gMDsgQSA8IEIuY2hpbGROb2Rlcy5sZW5ndGg7IEErKykge1xuICAgICAgYmtMaWIubm9TZWxlY3QoQi5jaGlsZE5vZGVzW0FdKTtcbiAgICB9XG4gIH0sXG4gIGNhbWVsaXplOiBmdW5jdGlvbiBjYW1lbGl6ZShBKSB7XG4gICAgcmV0dXJuIEEucmVwbGFjZSgvXFwtKC4pL2csIGZ1bmN0aW9uIChCLCBDKSB7XG4gICAgICByZXR1cm4gQy50b1VwcGVyQ2FzZSgpO1xuICAgIH0pO1xuICB9LFxuICBpbkFycmF5OiBmdW5jdGlvbiBpbkFycmF5KEEsIEIpIHtcbiAgICByZXR1cm4gYmtMaWIuc2VhcmNoKEEsIEIpICE9IG51bGw7XG4gIH0sXG4gIHNlYXJjaDogZnVuY3Rpb24gc2VhcmNoKEEsIEMpIHtcbiAgICBmb3IgKHZhciBCID0gMDsgQiA8IEEubGVuZ3RoOyBCKyspIHtcbiAgICAgIGlmIChBW0JdID09IEMpIHtcbiAgICAgICAgcmV0dXJuIEI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIGNhbmNlbEV2ZW50OiBmdW5jdGlvbiBjYW5jZWxFdmVudChBKSB7XG4gICAgQSA9IEEgfHwgd2luZG93LmV2ZW50O1xuXG4gICAgaWYgKEEucHJldmVudERlZmF1bHQgJiYgQS5zdG9wUHJvcGFnYXRpb24pIHtcbiAgICAgIEEucHJldmVudERlZmF1bHQoKTtcbiAgICAgIEEuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBkb21Mb2FkOiBbXSxcbiAgZG9tTG9hZGVkOiBmdW5jdGlvbiBkb21Mb2FkZWQoKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5jYWxsZWUuZG9uZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGFyZ3VtZW50cy5jYWxsZWUuZG9uZSA9IHRydWU7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgYmtMaWIuZG9tTG9hZC5sZW5ndGg7IGkrKykge1xuICAgICAgYmtMaWIuZG9tTG9hZFtpXSgpO1xuICAgIH1cbiAgfSxcbiAgb25Eb21Mb2FkZWQ6IGZ1bmN0aW9uIG9uRG9tTG9hZGVkKEEpIHtcbiAgICB0aGlzLmRvbUxvYWQucHVzaChBKTtcblxuICAgIGlmIChkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBia0xpYi5kb21Mb2FkZWQsIG51bGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYmtMaWIuaXNNU0lFKSB7XG4gICAgICAgIGRvY3VtZW50LndyaXRlKFwiPHN0eWxlPi5uaWNFZGl0LW1haW4gcCB7IG1hcmdpbjogMDsgfTwvc3R5bGU+PHNjcmlwdCBpZD1fX2llX29ubG9hZCBkZWZlciBcIiArIChsb2NhdGlvbi5wcm90b2NvbCA9PSBcImh0dHBzOlwiID8gXCJzcmM9J2phdmFzY3JpcHQ6dm9pZCgwKSdcIiA6IFwic3JjPS8vMFwiKSArIFwiPjxcXC9zY3JpcHQ+XCIpO1xuXG4gICAgICAgICRCSyhcIl9faWVfb25sb2FkXCIpLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09IFwiY29tcGxldGVcIikge1xuICAgICAgICAgICAgYmtMaWIuZG9tTG9hZGVkKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy5vbmxvYWQgPSBia0xpYi5kb21Mb2FkZWQ7XG4gIH1cbn07XG5cbmZ1bmN0aW9uICRCSyhBKSB7XG4gIGlmICh0eXBlb2YgQSA9PSBcInN0cmluZ1wiKSB7XG4gICAgQSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEEpO1xuICB9XG5cbiAgcmV0dXJuIEEgJiYgIUEuYXBwZW5kVG8gPyBia0V4dGVuZChBLCBia0VsZW1lbnQucHJvdG90eXBlKSA6IEE7XG59XG5cbnZhciBia0V2ZW50ID0ge1xuICBhZGRFdmVudDogZnVuY3Rpb24gYWRkRXZlbnQoQSwgQikge1xuICAgIGlmIChCKSB7XG4gICAgICB0aGlzLmV2ZW50TGlzdCA9IHRoaXMuZXZlbnRMaXN0IHx8IHt9O1xuICAgICAgdGhpcy5ldmVudExpc3RbQV0gPSB0aGlzLmV2ZW50TGlzdFtBXSB8fCBbXTtcbiAgICAgIHRoaXMuZXZlbnRMaXN0W0FdLnB1c2goQik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGZpcmVFdmVudDogZnVuY3Rpb24gZmlyZUV2ZW50KCkge1xuICAgIHZhciBBID0gYmtMaWIudG9BcnJheShhcmd1bWVudHMpLFxuICAgICAgICBDID0gQS5zaGlmdCgpO1xuXG4gICAgaWYgKHRoaXMuZXZlbnRMaXN0ICYmIHRoaXMuZXZlbnRMaXN0W0NdKSB7XG4gICAgICBmb3IgKHZhciBCID0gMDsgQiA8IHRoaXMuZXZlbnRMaXN0W0NdLmxlbmd0aDsgQisrKSB7XG4gICAgICAgIHRoaXMuZXZlbnRMaXN0W0NdW0JdLmFwcGx5KHRoaXMsIEEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gX18oQSkge1xuICByZXR1cm4gQTtcbn1cblxuRnVuY3Rpb24ucHJvdG90eXBlLmNsb3N1cmUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBBID0gdGhpcyxcbiAgICAgIEIgPSBia0xpYi50b0FycmF5KGFyZ3VtZW50cyksXG4gICAgICBDID0gQi5zaGlmdCgpO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0eXBlb2YgYmtMaWIgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuIEEuYXBwbHkoQywgQi5jb25jYXQoYmtMaWIudG9BcnJheShhcmd1bWVudHMpKSk7XG4gICAgfVxuICB9O1xufTtcblxuRnVuY3Rpb24ucHJvdG90eXBlLmNsb3N1cmVMaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIEEgPSB0aGlzLFxuICAgICAgQyA9IGJrTGliLnRvQXJyYXkoYXJndW1lbnRzKSxcbiAgICAgIEIgPSBDLnNoaWZ0KCk7XG4gIHJldHVybiBmdW5jdGlvbiAoRSkge1xuICAgIEUgPSBFIHx8IHdpbmRvdy5ldmVudDtcblxuICAgIGlmIChFLnRhcmdldCkge1xuICAgICAgdmFyIEQgPSBFLnRhcmdldDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIEQgPSBFLnNyY0VsZW1lbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIEEuYXBwbHkoQiwgW0UsIERdLmNvbmNhdChDKSk7XG4gIH07XG59O1xuXG52YXIgbmljRWRpdG9yQ29uZmlnID0gYmtDbGFzcy5leHRlbmQoe1xuICBidXR0b25zOiB7XG4gICAgJ2JvbGQnOiB7XG4gICAgICBuYW1lOiBfXygnQ2xpY2sgdG8gQm9sZCcpLFxuICAgICAgY29tbWFuZDogJ0JvbGQnLFxuICAgICAgdGFnczogWydCJywgJ1NUUk9ORyddLFxuICAgICAgY3NzOiB7XG4gICAgICAgICdmb250LXdlaWdodCc6ICdib2xkJ1xuICAgICAgfSxcbiAgICAgIGtleTogJ2InXG4gICAgfSxcbiAgICAnaXRhbGljJzoge1xuICAgICAgbmFtZTogX18oJ0NsaWNrIHRvIEl0YWxpYycpLFxuICAgICAgY29tbWFuZDogJ0l0YWxpYycsXG4gICAgICB0YWdzOiBbJ0VNJywgJ0knXSxcbiAgICAgIGNzczoge1xuICAgICAgICAnZm9udC1zdHlsZSc6ICdpdGFsaWMnXG4gICAgICB9LFxuICAgICAga2V5OiAnaSdcbiAgICB9LFxuICAgICd1bmRlcmxpbmUnOiB7XG4gICAgICBuYW1lOiBfXygnQ2xpY2sgdG8gVW5kZXJsaW5lJyksXG4gICAgICBjb21tYW5kOiAnVW5kZXJsaW5lJyxcbiAgICAgIHRhZ3M6IFsnVSddLFxuICAgICAgY3NzOiB7XG4gICAgICAgICd0ZXh0LWRlY29yYXRpb24nOiAndW5kZXJsaW5lJ1xuICAgICAgfSxcbiAgICAgIGtleTogJ3UnXG4gICAgfSxcbiAgICAnbGVmdCc6IHtcbiAgICAgIG5hbWU6IF9fKCdMZWZ0IEFsaWduJyksXG4gICAgICBjb21tYW5kOiAnanVzdGlmeWxlZnQnLFxuICAgICAgbm9BY3RpdmU6IHRydWVcbiAgICB9LFxuICAgICdjZW50ZXInOiB7XG4gICAgICBuYW1lOiBfXygnQ2VudGVyIEFsaWduJyksXG4gICAgICBjb21tYW5kOiAnanVzdGlmeWNlbnRlcicsXG4gICAgICBub0FjdGl2ZTogdHJ1ZVxuICAgIH0sXG4gICAgJ3JpZ2h0Jzoge1xuICAgICAgbmFtZTogX18oJ1JpZ2h0IEFsaWduJyksXG4gICAgICBjb21tYW5kOiAnanVzdGlmeXJpZ2h0JyxcbiAgICAgIG5vQWN0aXZlOiB0cnVlXG4gICAgfSxcbiAgICAnanVzdGlmeSc6IHtcbiAgICAgIG5hbWU6IF9fKCdKdXN0aWZ5IEFsaWduJyksXG4gICAgICBjb21tYW5kOiAnanVzdGlmeWZ1bGwnLFxuICAgICAgbm9BY3RpdmU6IHRydWVcbiAgICB9LFxuICAgICdvbCc6IHtcbiAgICAgIG5hbWU6IF9fKCdJbnNlcnQgT3JkZXJlZCBMaXN0JyksXG4gICAgICBjb21tYW5kOiAnaW5zZXJ0b3JkZXJlZGxpc3QnLFxuICAgICAgdGFnczogWydPTCddXG4gICAgfSxcbiAgICAndWwnOiB7XG4gICAgICBuYW1lOiBfXygnSW5zZXJ0IFVub3JkZXJlZCBMaXN0JyksXG4gICAgICBjb21tYW5kOiAnaW5zZXJ0dW5vcmRlcmVkbGlzdCcsXG4gICAgICB0YWdzOiBbJ1VMJ11cbiAgICB9LFxuICAgICdzdWJzY3JpcHQnOiB7XG4gICAgICBuYW1lOiBfXygnQ2xpY2sgdG8gU3Vic2NyaXB0JyksXG4gICAgICBjb21tYW5kOiAnc3Vic2NyaXB0JyxcbiAgICAgIHRhZ3M6IFsnU1VCJ11cbiAgICB9LFxuICAgICdzdXBlcnNjcmlwdCc6IHtcbiAgICAgIG5hbWU6IF9fKCdDbGljayB0byBTdXBlcnNjcmlwdCcpLFxuICAgICAgY29tbWFuZDogJ3N1cGVyc2NyaXB0JyxcbiAgICAgIHRhZ3M6IFsnU1VQJ11cbiAgICB9LFxuICAgICdzdHJpa2V0aHJvdWdoJzoge1xuICAgICAgbmFtZTogX18oJ0NsaWNrIHRvIFN0cmlrZSBUaHJvdWdoJyksXG4gICAgICBjb21tYW5kOiAnc3RyaWtlVGhyb3VnaCcsXG4gICAgICBjc3M6IHtcbiAgICAgICAgJ3RleHQtZGVjb3JhdGlvbic6ICdsaW5lLXRocm91Z2gnXG4gICAgICB9XG4gICAgfSxcbiAgICAncmVtb3ZlZm9ybWF0Jzoge1xuICAgICAgbmFtZTogX18oJ1JlbW92ZSBGb3JtYXR0aW5nJyksXG4gICAgICBjb21tYW5kOiAncmVtb3ZlZm9ybWF0JyxcbiAgICAgIG5vQWN0aXZlOiB0cnVlXG4gICAgfSxcbiAgICAnaW5kZW50Jzoge1xuICAgICAgbmFtZTogX18oJ0luZGVudCBUZXh0JyksXG4gICAgICBjb21tYW5kOiAnaW5kZW50JyxcbiAgICAgIG5vQWN0aXZlOiB0cnVlXG4gICAgfSxcbiAgICAnb3V0ZGVudCc6IHtcbiAgICAgIG5hbWU6IF9fKCdSZW1vdmUgSW5kZW50JyksXG4gICAgICBjb21tYW5kOiAnb3V0ZGVudCcsXG4gICAgICBub0FjdGl2ZTogdHJ1ZVxuICAgIH0sXG4gICAgJ2hyJzoge1xuICAgICAgbmFtZTogX18oJ0hvcml6b250YWwgUnVsZScpLFxuICAgICAgY29tbWFuZDogJ2luc2VydEhvcml6b250YWxSdWxlJyxcbiAgICAgIG5vQWN0aXZlOiB0cnVlXG4gICAgfVxuICB9LFxuICBpY29uc1BhdGg6ICdodHRwOi8vanMubmljZWRpdC5jb20vbmljRWRpdEljb25zLWxhdGVzdC5naWYnLFxuICBidXR0b25MaXN0OiBbJ3NhdmUnLCAnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ2xlZnQnLCAnY2VudGVyJywgJ3JpZ2h0JywgJ2p1c3RpZnknLCAnb2wnLCAndWwnLCAnZm9udFNpemUnLCAnZm9udEZhbWlseScsICdmb250Rm9ybWF0JywgJ2luZGVudCcsICdvdXRkZW50JywgJ2ltYWdlJywgJ3VwbG9hZCcsICdsaW5rJywgJ3VubGluaycsICdmb3JlY29sb3InLCAnYmdjb2xvciddLFxuICBpY29uTGlzdDoge1xuICAgIFwieGh0bWxcIjogMSxcbiAgICBcImJnY29sb3JcIjogMixcbiAgICBcImZvcmVjb2xvclwiOiAzLFxuICAgIFwiYm9sZFwiOiA0LFxuICAgIFwiY2VudGVyXCI6IDUsXG4gICAgXCJoclwiOiA2LFxuICAgIFwiaW5kZW50XCI6IDcsXG4gICAgXCJpdGFsaWNcIjogOCxcbiAgICBcImp1c3RpZnlcIjogOSxcbiAgICBcImxlZnRcIjogMTAsXG4gICAgXCJvbFwiOiAxMSxcbiAgICBcIm91dGRlbnRcIjogMTIsXG4gICAgXCJyZW1vdmVmb3JtYXRcIjogMTMsXG4gICAgXCJyaWdodFwiOiAxNCxcbiAgICBcInNhdmVcIjogMjUsXG4gICAgXCJzdHJpa2V0aHJvdWdoXCI6IDE2LFxuICAgIFwic3Vic2NyaXB0XCI6IDE3LFxuICAgIFwic3VwZXJzY3JpcHRcIjogMTgsXG4gICAgXCJ1bFwiOiAxOSxcbiAgICBcInVuZGVybGluZVwiOiAyMCxcbiAgICBcImltYWdlXCI6IDIxLFxuICAgIFwibGlua1wiOiAyMixcbiAgICBcInVubGlua1wiOiAyMyxcbiAgICBcImNsb3NlXCI6IDI0LFxuICAgIFwiYXJyb3dcIjogMjYsXG4gICAgXCJ1cGxvYWRcIjogMjdcbiAgfVxufSk7XG47XG52YXIgbmljRWRpdG9ycyA9IHtcbiAgbmljUGx1Z2luczogW10sXG4gIGVkaXRvcnM6IFtdLFxuICByZWdpc3RlclBsdWdpbjogZnVuY3Rpb24gcmVnaXN0ZXJQbHVnaW4oQiwgQSkge1xuICAgIHRoaXMubmljUGx1Z2lucy5wdXNoKHtcbiAgICAgIHA6IEIsXG4gICAgICBvOiBBXG4gICAgfSk7XG4gIH0sXG4gIGFsbFRleHRBcmVhczogZnVuY3Rpb24gYWxsVGV4dEFyZWFzKEMpIHtcbiAgICB2YXIgQSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGV4dGFyZWFcIik7XG5cbiAgICBmb3IgKHZhciBCID0gMDsgQiA8IEEubGVuZ3RoOyBCKyspIHtcbiAgICAgIG5pY0VkaXRvcnMuZWRpdG9ycy5wdXNoKG5ldyBuaWNFZGl0b3IoQykucGFuZWxJbnN0YW5jZShBW0JdKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5pY0VkaXRvcnMuZWRpdG9ycztcbiAgfSxcbiAgZmluZEVkaXRvcjogZnVuY3Rpb24gZmluZEVkaXRvcihDKSB7XG4gICAgdmFyIEIgPSBuaWNFZGl0b3JzLmVkaXRvcnM7XG5cbiAgICBmb3IgKHZhciBBID0gMDsgQSA8IEIubGVuZ3RoOyBBKyspIHtcbiAgICAgIGlmIChCW0FdLmluc3RhbmNlQnlJZChDKSkge1xuICAgICAgICByZXR1cm4gQltBXS5pbnN0YW5jZUJ5SWQoQyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xudmFyIG5pY0VkaXRvciA9IGJrQ2xhc3MuZXh0ZW5kKHtcbiAgY29uc3RydWN0OiBmdW5jdGlvbiBjb25zdHJ1Y3QoQykge1xuICAgIHRoaXMub3B0aW9ucyA9IG5ldyBuaWNFZGl0b3JDb25maWcoKTtcbiAgICBia0V4dGVuZCh0aGlzLm9wdGlvbnMsIEMpO1xuICAgIHRoaXMubmljSW5zdGFuY2VzID0gbmV3IEFycmF5KCk7XG4gICAgdGhpcy5sb2FkZWRQbHVnaW5zID0gbmV3IEFycmF5KCk7XG4gICAgdmFyIEEgPSBuaWNFZGl0b3JzLm5pY1BsdWdpbnM7XG5cbiAgICBmb3IgKHZhciBCID0gMDsgQiA8IEEubGVuZ3RoOyBCKyspIHtcbiAgICAgIHRoaXMubG9hZGVkUGx1Z2lucy5wdXNoKG5ldyBBW0JdLnAodGhpcywgQVtCXS5vKSk7XG4gICAgfVxuXG4gICAgbmljRWRpdG9ycy5lZGl0b3JzLnB1c2godGhpcyk7XG4gICAgYmtMaWIuYWRkRXZlbnQoZG9jdW1lbnQuYm9keSwgXCJtb3VzZWRvd25cIiwgdGhpcy5zZWxlY3RDaGVjay5jbG9zdXJlTGlzdGVuZXIodGhpcykpO1xuICB9LFxuICBwYW5lbEluc3RhbmNlOiBmdW5jdGlvbiBwYW5lbEluc3RhbmNlKEIsIEMpIHtcbiAgICBCID0gdGhpcy5jaGVja1JlcGxhY2UoJEJLKEIpKTtcbiAgICB2YXIgQSA9IG5ldyBia0VsZW1lbnQoXCJESVZcIikuc2V0U3R5bGUoe1xuICAgICAgd2lkdGg6IChwYXJzZUludChCLmdldFN0eWxlKFwid2lkdGhcIikpIHx8IEIuY2xpZW50V2lkdGgpICsgXCJweFwiXG4gICAgfSkuYXBwZW5kQmVmb3JlKEIpO1xuICAgIHRoaXMuc2V0UGFuZWwoQSk7XG4gICAgcmV0dXJuIHRoaXMuYWRkSW5zdGFuY2UoQiwgQyk7XG4gIH0sXG4gIGNoZWNrUmVwbGFjZTogZnVuY3Rpb24gY2hlY2tSZXBsYWNlKEIpIHtcbiAgICB2YXIgQSA9IG5pY0VkaXRvcnMuZmluZEVkaXRvcihCKTtcblxuICAgIGlmIChBKSB7XG4gICAgICBBLnJlbW92ZUluc3RhbmNlKEIpO1xuICAgICAgQS5yZW1vdmVQYW5lbCgpO1xuICAgIH1cblxuICAgIHJldHVybiBCO1xuICB9LFxuICBhZGRJbnN0YW5jZTogZnVuY3Rpb24gYWRkSW5zdGFuY2UoQiwgQykge1xuICAgIEIgPSB0aGlzLmNoZWNrUmVwbGFjZSgkQksoQikpO1xuXG4gICAgaWYgKEIuY29udGVudEVkaXRhYmxlIHx8ICEhd2luZG93Lm9wZXJhKSB7XG4gICAgICB2YXIgQSA9IG5ldyBuaWNFZGl0b3JJbnN0YW5jZShCLCBDLCB0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIEEgPSBuZXcgbmljRWRpdG9ySUZyYW1lSW5zdGFuY2UoQiwgQywgdGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy5uaWNJbnN0YW5jZXMucHVzaChBKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgcmVtb3ZlSW5zdGFuY2U6IGZ1bmN0aW9uIHJlbW92ZUluc3RhbmNlKEMpIHtcbiAgICBDID0gJEJLKEMpO1xuICAgIHZhciBCID0gdGhpcy5uaWNJbnN0YW5jZXM7XG5cbiAgICBmb3IgKHZhciBBID0gMDsgQSA8IEIubGVuZ3RoOyBBKyspIHtcbiAgICAgIGlmIChCW0FdLmUgPT0gQykge1xuICAgICAgICBCW0FdLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLm5pY0luc3RhbmNlcy5zcGxpY2UoQSwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICByZW1vdmVQYW5lbDogZnVuY3Rpb24gcmVtb3ZlUGFuZWwoQSkge1xuICAgIGlmICh0aGlzLm5pY1BhbmVsKSB7XG4gICAgICB0aGlzLm5pY1BhbmVsLnJlbW92ZSgpO1xuICAgICAgdGhpcy5uaWNQYW5lbCA9IG51bGw7XG4gICAgfVxuICB9LFxuICBpbnN0YW5jZUJ5SWQ6IGZ1bmN0aW9uIGluc3RhbmNlQnlJZChDKSB7XG4gICAgQyA9ICRCSyhDKTtcbiAgICB2YXIgQiA9IHRoaXMubmljSW5zdGFuY2VzO1xuXG4gICAgZm9yICh2YXIgQSA9IDA7IEEgPCBCLmxlbmd0aDsgQSsrKSB7XG4gICAgICBpZiAoQltBXS5lID09IEMpIHtcbiAgICAgICAgcmV0dXJuIEJbQV07XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBzZXRQYW5lbDogZnVuY3Rpb24gc2V0UGFuZWwoQSkge1xuICAgIHRoaXMubmljUGFuZWwgPSBuZXcgbmljRWRpdG9yUGFuZWwoJEJLKEEpLCB0aGlzLm9wdGlvbnMsIHRoaXMpO1xuICAgIHRoaXMuZmlyZUV2ZW50KFwicGFuZWxcIiwgdGhpcy5uaWNQYW5lbCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIG5pY0NvbW1hbmQ6IGZ1bmN0aW9uIG5pY0NvbW1hbmQoQiwgQSkge1xuICAgIGlmICh0aGlzLnNlbGVjdGVkSW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbnN0YW5jZS5uaWNDb21tYW5kKEIsIEEpO1xuICAgIH1cbiAgfSxcbiAgZ2V0SWNvbjogZnVuY3Rpb24gZ2V0SWNvbihELCBBKSB7XG4gICAgdmFyIEMgPSB0aGlzLm9wdGlvbnMuaWNvbkxpc3RbRF07XG4gICAgdmFyIEIgPSBBLmljb25GaWxlcyA/IEEuaWNvbkZpbGVzW0RdIDogXCJcIjtcbiAgICByZXR1cm4ge1xuICAgICAgYmFja2dyb3VuZEltYWdlOiBcInVybCgnXCIgKyAoQyA/IHRoaXMub3B0aW9ucy5pY29uc1BhdGggOiBCKSArIFwiJylcIixcbiAgICAgIGJhY2tncm91bmRQb3NpdGlvbjogKEMgPyAoQyAtIDEpICogLTE4IDogMCkgKyBcInB4IDBweFwiXG4gICAgfTtcbiAgfSxcbiAgc2VsZWN0Q2hlY2s6IGZ1bmN0aW9uIHNlbGVjdENoZWNrKEMsIEEpIHtcbiAgICB2YXIgQiA9IGZhbHNlO1xuXG4gICAgZG8ge1xuICAgICAgaWYgKEEuY2xhc3NOYW1lICYmIEEuY2xhc3NOYW1lLmluZGV4T2YoXCJuaWNFZGl0XCIpICE9IC0xKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IHdoaWxlIChBID0gQS5wYXJlbnROb2RlKTtcblxuICAgIHRoaXMuZmlyZUV2ZW50KFwiYmx1clwiLCB0aGlzLnNlbGVjdGVkSW5zdGFuY2UsIEEpO1xuICAgIHRoaXMubGFzdFNlbGVjdGVkSW5zdGFuY2UgPSB0aGlzLnNlbGVjdGVkSW5zdGFuY2U7XG4gICAgdGhpcy5zZWxlY3RlZEluc3RhbmNlID0gbnVsbDtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn0pO1xubmljRWRpdG9yID0gbmljRWRpdG9yLmV4dGVuZChia0V2ZW50KTtcbnZhciBuaWNFZGl0b3JJbnN0YW5jZSA9IGJrQ2xhc3MuZXh0ZW5kKHtcbiAgaXNTZWxlY3RlZDogZmFsc2UsXG4gIGNvbnN0cnVjdDogZnVuY3Rpb24gY29uc3RydWN0KEcsIEQsIEMpIHtcbiAgICB0aGlzLm5lID0gQztcbiAgICB0aGlzLmVsbSA9IHRoaXMuZSA9IEc7XG4gICAgdGhpcy5vcHRpb25zID0gRCB8fCB7fTtcbiAgICBuZXdYID0gcGFyc2VJbnQoRy5nZXRTdHlsZShcIndpZHRoXCIpKSB8fCBHLmNsaWVudFdpZHRoO1xuICAgIG5ld1kgPSBwYXJzZUludChHLmdldFN0eWxlKFwiaGVpZ2h0XCIpKSB8fCBHLmNsaWVudEhlaWdodDtcbiAgICB0aGlzLmluaXRpYWxIZWlnaHQgPSBuZXdZIC0gODtcbiAgICB2YXIgSCA9IEcubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PSBcInRleHRhcmVhXCI7XG5cbiAgICBpZiAoSCB8fCB0aGlzLm9wdGlvbnMuaGFzUGFuZWwpIHtcbiAgICAgIHZhciBCID0gYmtMaWIuaXNNU0lFICYmICEodHlwZW9mIGRvY3VtZW50LmJvZHkuc3R5bGUubWF4SGVpZ2h0ICE9IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnQuY29tcGF0TW9kZSA9PSBcIkNTUzFDb21wYXRcIik7XG4gICAgICB2YXIgRSA9IHtcbiAgICAgICAgd2lkdGg6IG5ld1ggKyBcInB4XCIsXG4gICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgI2NjY1wiLFxuICAgICAgICBib3JkZXJUb3A6IDAsXG4gICAgICAgIG92ZXJmbG93WTogXCJhdXRvXCIsXG4gICAgICAgIG92ZXJmbG93WDogXCJoaWRkZW5cIlxuICAgICAgfTtcbiAgICAgIEVbQiA/IFwiaGVpZ2h0XCIgOiBcIm1heEhlaWdodFwiXSA9IHRoaXMubmUub3B0aW9ucy5tYXhIZWlnaHQgPyB0aGlzLm5lLm9wdGlvbnMubWF4SGVpZ2h0ICsgXCJweFwiIDogbnVsbDtcbiAgICAgIHRoaXMuZWRpdG9yQ29udGFpbiA9IG5ldyBia0VsZW1lbnQoXCJESVZcIikuc2V0U3R5bGUoRSkuYXBwZW5kQmVmb3JlKEcpO1xuICAgICAgdmFyIEEgPSBuZXcgYmtFbGVtZW50KFwiRElWXCIpLnNldFN0eWxlKHtcbiAgICAgICAgd2lkdGg6IG5ld1ggLSA4ICsgXCJweFwiLFxuICAgICAgICBtYXJnaW46IFwiNHB4XCIsXG4gICAgICAgIG1pbkhlaWdodDogbmV3WSArIFwicHhcIlxuICAgICAgfSkuYWRkQ2xhc3MoXCJtYWluXCIpLmFwcGVuZFRvKHRoaXMuZWRpdG9yQ29udGFpbik7XG4gICAgICBHLnNldFN0eWxlKHtcbiAgICAgICAgZGlzcGxheTogXCJub25lXCJcbiAgICAgIH0pO1xuICAgICAgQS5pbm5lckhUTUwgPSBHLmlubmVySFRNTDtcblxuICAgICAgaWYgKEgpIHtcbiAgICAgICAgQS5zZXRDb250ZW50KEcudmFsdWUpO1xuICAgICAgICB0aGlzLmNvcHlFbG0gPSBHO1xuICAgICAgICB2YXIgRiA9IEcucGFyZW50VGFnKFwiRk9STVwiKTtcblxuICAgICAgICBpZiAoRikge1xuICAgICAgICAgIGJrTGliLmFkZEV2ZW50KEYsIFwic3VibWl0XCIsIHRoaXMuc2F2ZUNvbnRlbnQuY2xvc3VyZSh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgQS5zZXRTdHlsZShCID8ge1xuICAgICAgICBoZWlnaHQ6IG5ld1kgKyBcInB4XCJcbiAgICAgIH0gOiB7XG4gICAgICAgIG92ZXJmbG93OiBcImhpZGRlblwiXG4gICAgICB9KTtcbiAgICAgIHRoaXMuZWxtID0gQTtcbiAgICB9XG5cbiAgICB0aGlzLm5lLmFkZEV2ZW50KFwiYmx1clwiLCB0aGlzLmJsdXIuY2xvc3VyZSh0aGlzKSk7XG4gICAgdGhpcy5pbml0KCk7XG4gICAgdGhpcy5ibHVyKCk7XG4gIH0sXG4gIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdGhpcy5lbG0uc2V0QXR0cmlidXRlKFwiY29udGVudEVkaXRhYmxlXCIsIFwidHJ1ZVwiKTtcblxuICAgIGlmICh0aGlzLmdldENvbnRlbnQoKSA9PSBcIlwiKSB7XG4gICAgICB0aGlzLnNldENvbnRlbnQoXCI8YnIgLz5cIik7XG4gICAgfVxuXG4gICAgdGhpcy5pbnN0YW5jZURvYyA9IGRvY3VtZW50LmRlZmF1bHRWaWV3O1xuICAgIHRoaXMuZWxtLmFkZEV2ZW50KFwibW91c2Vkb3duXCIsIHRoaXMuc2VsZWN0ZWQuY2xvc3VyZUxpc3RlbmVyKHRoaXMpKS5hZGRFdmVudChcImtleXByZXNzXCIsIHRoaXMua2V5RG93bi5jbG9zdXJlTGlzdGVuZXIodGhpcykpLmFkZEV2ZW50KFwiZm9jdXNcIiwgdGhpcy5zZWxlY3RlZC5jbG9zdXJlKHRoaXMpKS5hZGRFdmVudChcImJsdXJcIiwgdGhpcy5ibHVyLmNsb3N1cmUodGhpcykpLmFkZEV2ZW50KFwia2V5dXBcIiwgdGhpcy5zZWxlY3RlZC5jbG9zdXJlKHRoaXMpKTtcbiAgICB0aGlzLm5lLmZpcmVFdmVudChcImFkZFwiLCB0aGlzKTtcbiAgfSxcbiAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgdGhpcy5zYXZlQ29udGVudCgpO1xuXG4gICAgaWYgKHRoaXMuY29weUVsbSB8fCB0aGlzLm9wdGlvbnMuaGFzUGFuZWwpIHtcbiAgICAgIHRoaXMuZWRpdG9yQ29udGFpbi5yZW1vdmUoKTtcbiAgICAgIHRoaXMuZS5zZXRTdHlsZSh7XG4gICAgICAgIGRpc3BsYXk6IFwiYmxvY2tcIlxuICAgICAgfSk7XG4gICAgICB0aGlzLm5lLnJlbW92ZVBhbmVsKCk7XG4gICAgfVxuXG4gICAgdGhpcy5kaXNhYmxlKCk7XG4gICAgdGhpcy5uZS5maXJlRXZlbnQoXCJyZW1vdmVcIiwgdGhpcyk7XG4gIH0sXG4gIGRpc2FibGU6IGZ1bmN0aW9uIGRpc2FibGUoKSB7XG4gICAgdGhpcy5lbG0uc2V0QXR0cmlidXRlKFwiY29udGVudEVkaXRhYmxlXCIsIFwiZmFsc2VcIik7XG4gIH0sXG4gIGdldFNlbDogZnVuY3Rpb24gZ2V0U2VsKCkge1xuICAgIHJldHVybiB3aW5kb3cuZ2V0U2VsZWN0aW9uID8gd2luZG93LmdldFNlbGVjdGlvbigpIDogZG9jdW1lbnQuc2VsZWN0aW9uO1xuICB9LFxuICBnZXRSbmc6IGZ1bmN0aW9uIGdldFJuZygpIHtcbiAgICB2YXIgQSA9IHRoaXMuZ2V0U2VsKCk7XG5cbiAgICBpZiAoIUEgfHwgQS5yYW5nZUNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIEEucmFuZ2VDb3VudCA+IDAgPyBBLmdldFJhbmdlQXQoMCkgOiBBLmNyZWF0ZVJhbmdlKCk7XG4gIH0sXG4gIHNlbFJuZzogZnVuY3Rpb24gc2VsUm5nKEEsIEIpIHtcbiAgICBpZiAod2luZG93LmdldFNlbGVjdGlvbikge1xuICAgICAgQi5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgIEIuYWRkUmFuZ2UoQSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIEEuc2VsZWN0KCk7XG4gICAgfVxuICB9LFxuICBzZWxFbG06IGZ1bmN0aW9uIHNlbEVsbSgpIHtcbiAgICB2YXIgQyA9IHRoaXMuZ2V0Um5nKCk7XG5cbiAgICBpZiAoIUMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoQy5zdGFydENvbnRhaW5lcikge1xuICAgICAgdmFyIEQgPSBDLnN0YXJ0Q29udGFpbmVyO1xuXG4gICAgICBpZiAoQy5jbG9uZUNvbnRlbnRzKCkuY2hpbGROb2Rlcy5sZW5ndGggPT0gMSkge1xuICAgICAgICBmb3IgKHZhciBCID0gMDsgQiA8IEQuY2hpbGROb2Rlcy5sZW5ndGg7IEIrKykge1xuICAgICAgICAgIHZhciBBID0gRC5jaGlsZE5vZGVzW0JdLm93bmVyRG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgICBBLnNlbGVjdE5vZGUoRC5jaGlsZE5vZGVzW0JdKTtcblxuICAgICAgICAgIGlmIChDLmNvbXBhcmVCb3VuZGFyeVBvaW50cyhSYW5nZS5TVEFSVF9UT19TVEFSVCwgQSkgIT0gMSAmJiBDLmNvbXBhcmVCb3VuZGFyeVBvaW50cyhSYW5nZS5FTkRfVE9fRU5ELCBBKSAhPSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuICRCSyhELmNoaWxkTm9kZXNbQl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gJEJLKEQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJEJLKHRoaXMuZ2V0U2VsKCkudHlwZSA9PSBcIkNvbnRyb2xcIiA/IEMuaXRlbSgwKSA6IEMucGFyZW50RWxlbWVudCgpKTtcbiAgICB9XG4gIH0sXG4gIHNhdmVSbmc6IGZ1bmN0aW9uIHNhdmVSbmcoKSB7XG4gICAgdGhpcy5zYXZlZFJhbmdlID0gdGhpcy5nZXRSbmcoKTtcbiAgICB0aGlzLnNhdmVkU2VsID0gdGhpcy5nZXRTZWwoKTtcbiAgfSxcbiAgcmVzdG9yZVJuZzogZnVuY3Rpb24gcmVzdG9yZVJuZygpIHtcbiAgICBpZiAodGhpcy5zYXZlZFJhbmdlKSB7XG4gICAgICB0aGlzLnNlbFJuZyh0aGlzLnNhdmVkUmFuZ2UsIHRoaXMuc2F2ZWRTZWwpO1xuICAgIH1cbiAgfSxcbiAga2V5RG93bjogZnVuY3Rpb24ga2V5RG93bihCLCBBKSB7XG4gICAgaWYgKEIuY3RybEtleSkge1xuICAgICAgdGhpcy5uZS5maXJlRXZlbnQoXCJrZXlcIiwgdGhpcywgQik7XG4gICAgfVxuICB9LFxuICBzZWxlY3RlZDogZnVuY3Rpb24gc2VsZWN0ZWQoQywgQSkge1xuICAgIGlmICghQSAmJiAhKEEgPSB0aGlzLnNlbEVsbSkpIHtcbiAgICAgIEEgPSB0aGlzLnNlbEVsbSgpO1xuICAgIH1cblxuICAgIGlmICghQy5jdHJsS2V5KSB7XG4gICAgICB2YXIgQiA9IHRoaXMubmUuc2VsZWN0ZWRJbnN0YW5jZTtcblxuICAgICAgaWYgKEIgIT0gdGhpcykge1xuICAgICAgICBpZiAoQikge1xuICAgICAgICAgIHRoaXMubmUuZmlyZUV2ZW50KFwiYmx1clwiLCBCLCBBKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubmUuc2VsZWN0ZWRJbnN0YW5jZSA9IHRoaXM7XG4gICAgICAgIHRoaXMubmUuZmlyZUV2ZW50KFwiZm9jdXNcIiwgQiwgQSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubmUuZmlyZUV2ZW50KFwic2VsZWN0ZWRcIiwgQiwgQSk7XG4gICAgICB0aGlzLmlzRm9jdXNlZCA9IHRydWU7XG4gICAgICB0aGlzLmVsbS5hZGRDbGFzcyhcInNlbGVjdGVkXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgYmx1cjogZnVuY3Rpb24gYmx1cigpIHtcbiAgICB0aGlzLmlzRm9jdXNlZCA9IGZhbHNlO1xuICAgIHRoaXMuZWxtLnJlbW92ZUNsYXNzKFwic2VsZWN0ZWRcIik7XG4gIH0sXG4gIHNhdmVDb250ZW50OiBmdW5jdGlvbiBzYXZlQ29udGVudCgpIHtcbiAgICBpZiAodGhpcy5jb3B5RWxtIHx8IHRoaXMub3B0aW9ucy5oYXNQYW5lbCkge1xuICAgICAgdGhpcy5uZS5maXJlRXZlbnQoXCJzYXZlXCIsIHRoaXMpO1xuICAgICAgdGhpcy5jb3B5RWxtID8gdGhpcy5jb3B5RWxtLnZhbHVlID0gdGhpcy5nZXRDb250ZW50KCkgOiB0aGlzLmUuaW5uZXJIVE1MID0gdGhpcy5nZXRDb250ZW50KCk7XG4gICAgfVxuICB9LFxuICBnZXRFbG06IGZ1bmN0aW9uIGdldEVsbSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbG07XG4gIH0sXG4gIGdldENvbnRlbnQ6IGZ1bmN0aW9uIGdldENvbnRlbnQoKSB7XG4gICAgdGhpcy5jb250ZW50ID0gdGhpcy5nZXRFbG0oKS5pbm5lckhUTUw7XG4gICAgdGhpcy5uZS5maXJlRXZlbnQoXCJnZXRcIiwgdGhpcyk7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudDtcbiAgfSxcbiAgc2V0Q29udGVudDogZnVuY3Rpb24gc2V0Q29udGVudChBKSB7XG4gICAgdGhpcy5jb250ZW50ID0gQTtcbiAgICB0aGlzLm5lLmZpcmVFdmVudChcInNldFwiLCB0aGlzKTtcbiAgICB0aGlzLmVsbS5pbm5lckhUTUwgPSB0aGlzLmNvbnRlbnQ7XG4gIH0sXG4gIG5pY0NvbW1hbmQ6IGZ1bmN0aW9uIG5pY0NvbW1hbmQoQiwgQSkge1xuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKEIsIGZhbHNlLCBBKTtcbiAgfVxufSk7XG52YXIgbmljRWRpdG9ySUZyYW1lSW5zdGFuY2UgPSBuaWNFZGl0b3JJbnN0YW5jZS5leHRlbmQoe1xuICBzYXZlZFN0eWxlczogW10sXG4gIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdmFyIEIgPSB0aGlzLmVsbS5pbm5lckhUTUwucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgXCJcIik7XG4gICAgdGhpcy5lbG0uaW5uZXJIVE1MID0gXCJcIjtcbiAgICAhQiA/IEIgPSBcIjxiciAvPlwiIDogQjtcbiAgICB0aGlzLmluaXRpYWxDb250ZW50ID0gQjtcbiAgICB0aGlzLmVsbUZyYW1lID0gbmV3IGJrRWxlbWVudChcImlmcmFtZVwiKS5zZXRBdHRyaWJ1dGVzKHtcbiAgICAgIHNyYzogXCJqYXZhc2NyaXB0OjtcIixcbiAgICAgIGZyYW1lQm9yZGVyOiAwLFxuICAgICAgYWxsb3dUcmFuc3BhcmVuY3k6IFwidHJ1ZVwiLFxuICAgICAgc2Nyb2xsaW5nOiBcIm5vXCJcbiAgICB9KS5zZXRTdHlsZSh7XG4gICAgICBoZWlnaHQ6IFwiMTAwcHhcIixcbiAgICAgIHdpZHRoOiBcIjEwMCVcIlxuICAgIH0pLmFkZENsYXNzKFwiZnJhbWVcIikuYXBwZW5kVG8odGhpcy5lbG0pO1xuXG4gICAgaWYgKHRoaXMuY29weUVsbSkge1xuICAgICAgdGhpcy5lbG1GcmFtZS5zZXRTdHlsZSh7XG4gICAgICAgIHdpZHRoOiB0aGlzLmVsbS5vZmZzZXRXaWR0aCAtIDQgKyBcInB4XCJcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBBID0gW1wiZm9udC1zaXplXCIsIFwiZm9udC1mYW1pbHlcIiwgXCJmb250LXdlaWdodFwiLCBcImNvbG9yXCJdO1xuXG4gICAgZm9yIChpdG0gaW4gQSkge1xuICAgICAgdGhpcy5zYXZlZFN0eWxlc1tia0xpYi5jYW1lbGl6ZShpdG0pXSA9IHRoaXMuZWxtLmdldFN0eWxlKGl0bSk7XG4gICAgfVxuXG4gICAgc2V0VGltZW91dCh0aGlzLmluaXRGcmFtZS5jbG9zdXJlKHRoaXMpLCA1MCk7XG4gIH0sXG4gIGRpc2FibGU6IGZ1bmN0aW9uIGRpc2FibGUoKSB7XG4gICAgdGhpcy5lbG0uaW5uZXJIVE1MID0gdGhpcy5nZXRDb250ZW50KCk7XG4gIH0sXG4gIGluaXRGcmFtZTogZnVuY3Rpb24gaW5pdEZyYW1lKCkge1xuICAgIHZhciBCID0gJEJLKHRoaXMuZWxtRnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudCk7XG4gICAgQi5kZXNpZ25Nb2RlID0gXCJvblwiO1xuICAgIEIub3BlbigpO1xuICAgIHZhciBBID0gdGhpcy5uZS5vcHRpb25zLmV4dGVybmFsQ1NTO1xuICAgIEIud3JpdGUoXCI8aHRtbD48aGVhZD5cIiArIChBID8gJzxsaW5rIGhyZWY9XCInICsgQSArICdcIiByZWw9XCJzdHlsZXNoZWV0XCIgdHlwZT1cInRleHQvY3NzXCIgLz4nIDogXCJcIikgKyAnPC9oZWFkPjxib2R5IGlkPVwibmljRWRpdENvbnRlbnRcIiBzdHlsZT1cIm1hcmdpbjogMCAhaW1wb3J0YW50OyBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1wiPicgKyB0aGlzLmluaXRpYWxDb250ZW50ICsgXCI8L2JvZHk+PC9odG1sPlwiKTtcbiAgICBCLmNsb3NlKCk7XG4gICAgdGhpcy5mcmFtZURvYyA9IEI7XG4gICAgdGhpcy5mcmFtZVdpbiA9ICRCSyh0aGlzLmVsbUZyYW1lLmNvbnRlbnRXaW5kb3cpO1xuICAgIHRoaXMuZnJhbWVDb250ZW50ID0gJEJLKHRoaXMuZnJhbWVXaW4uZG9jdW1lbnQuYm9keSkuc2V0U3R5bGUodGhpcy5zYXZlZFN0eWxlcyk7XG4gICAgdGhpcy5pbnN0YW5jZURvYyA9IHRoaXMuZnJhbWVXaW4uZG9jdW1lbnQuZGVmYXVsdFZpZXc7XG4gICAgdGhpcy5oZWlnaHRVcGRhdGUoKTtcbiAgICB0aGlzLmZyYW1lRG9jLmFkZEV2ZW50KFwibW91c2Vkb3duXCIsIHRoaXMuc2VsZWN0ZWQuY2xvc3VyZUxpc3RlbmVyKHRoaXMpKS5hZGRFdmVudChcImtleXVwXCIsIHRoaXMuaGVpZ2h0VXBkYXRlLmNsb3N1cmVMaXN0ZW5lcih0aGlzKSkuYWRkRXZlbnQoXCJrZXlkb3duXCIsIHRoaXMua2V5RG93bi5jbG9zdXJlTGlzdGVuZXIodGhpcykpLmFkZEV2ZW50KFwia2V5dXBcIiwgdGhpcy5zZWxlY3RlZC5jbG9zdXJlKHRoaXMpKTtcbiAgICB0aGlzLm5lLmZpcmVFdmVudChcImFkZFwiLCB0aGlzKTtcbiAgfSxcbiAgZ2V0RWxtOiBmdW5jdGlvbiBnZXRFbG0oKSB7XG4gICAgcmV0dXJuIHRoaXMuZnJhbWVDb250ZW50O1xuICB9LFxuICBzZXRDb250ZW50OiBmdW5jdGlvbiBzZXRDb250ZW50KEEpIHtcbiAgICB0aGlzLmNvbnRlbnQgPSBBO1xuICAgIHRoaXMubmUuZmlyZUV2ZW50KFwic2V0XCIsIHRoaXMpO1xuICAgIHRoaXMuZnJhbWVDb250ZW50LmlubmVySFRNTCA9IHRoaXMuY29udGVudDtcbiAgICB0aGlzLmhlaWdodFVwZGF0ZSgpO1xuICB9LFxuICBnZXRTZWw6IGZ1bmN0aW9uIGdldFNlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5mcmFtZVdpbiA/IHRoaXMuZnJhbWVXaW4uZ2V0U2VsZWN0aW9uKCkgOiB0aGlzLmZyYW1lRG9jLnNlbGVjdGlvbjtcbiAgfSxcbiAgaGVpZ2h0VXBkYXRlOiBmdW5jdGlvbiBoZWlnaHRVcGRhdGUoKSB7XG4gICAgdGhpcy5lbG1GcmFtZS5zdHlsZS5oZWlnaHQgPSBNYXRoLm1heCh0aGlzLmZyYW1lQ29udGVudC5vZmZzZXRIZWlnaHQsIHRoaXMuaW5pdGlhbEhlaWdodCkgKyBcInB4XCI7XG4gIH0sXG4gIG5pY0NvbW1hbmQ6IGZ1bmN0aW9uIG5pY0NvbW1hbmQoQiwgQSkge1xuICAgIHRoaXMuZnJhbWVEb2MuZXhlY0NvbW1hbmQoQiwgZmFsc2UsIEEpO1xuICAgIHNldFRpbWVvdXQodGhpcy5oZWlnaHRVcGRhdGUuY2xvc3VyZSh0aGlzKSwgMTAwKTtcbiAgfVxufSk7XG52YXIgbmljRWRpdG9yUGFuZWwgPSBia0NsYXNzLmV4dGVuZCh7XG4gIGNvbnN0cnVjdDogZnVuY3Rpb24gY29uc3RydWN0KEUsIEIsIEEpIHtcbiAgICB0aGlzLmVsbSA9IEU7XG4gICAgdGhpcy5vcHRpb25zID0gQjtcbiAgICB0aGlzLm5lID0gQTtcbiAgICB0aGlzLnBhbmVsQnV0dG9ucyA9IG5ldyBBcnJheSgpO1xuICAgIHRoaXMuYnV0dG9uTGlzdCA9IGJrRXh0ZW5kKFtdLCB0aGlzLm5lLm9wdGlvbnMuYnV0dG9uTGlzdCk7XG4gICAgdGhpcy5wYW5lbENvbnRhaW4gPSBuZXcgYmtFbGVtZW50KFwiRElWXCIpLnNldFN0eWxlKHtcbiAgICAgIG92ZXJmbG93OiBcImhpZGRlblwiLFxuICAgICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCAjY2NjY2NjXCIsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI2VmZWZlZlwiXG4gICAgfSkuYWRkQ2xhc3MoXCJwYW5lbENvbnRhaW5cIik7XG4gICAgdGhpcy5wYW5lbEVsbSA9IG5ldyBia0VsZW1lbnQoXCJESVZcIikuc2V0U3R5bGUoe1xuICAgICAgbWFyZ2luOiBcIjJweFwiLFxuICAgICAgbWFyZ2luVG9wOiBcIjBweFwiLFxuICAgICAgem9vbTogMSxcbiAgICAgIG92ZXJmbG93OiBcImhpZGRlblwiXG4gICAgfSkuYWRkQ2xhc3MoXCJwYW5lbFwiKS5hcHBlbmRUbyh0aGlzLnBhbmVsQ29udGFpbik7XG4gICAgdGhpcy5wYW5lbENvbnRhaW4uYXBwZW5kVG8oRSk7XG4gICAgdmFyIEMgPSB0aGlzLm5lLm9wdGlvbnM7XG4gICAgdmFyIEQgPSBDLmJ1dHRvbnM7XG5cbiAgICBmb3IgKGJ1dHRvbiBpbiBEKSB7XG4gICAgICB0aGlzLmFkZEJ1dHRvbihidXR0b24sIEMsIHRydWUpO1xuICAgIH1cblxuICAgIHRoaXMucmVvcmRlcigpO1xuICAgIEUubm9TZWxlY3QoKTtcbiAgfSxcbiAgYWRkQnV0dG9uOiBmdW5jdGlvbiBhZGRCdXR0b24oYnV0dG9uTmFtZSwgb3B0aW9ucywgbm9PcmRlcikge1xuICAgIHZhciBidXR0b24gPSBvcHRpb25zLmJ1dHRvbnNbYnV0dG9uTmFtZV07XG4gICAgdmFyIHR5cGUgPSBidXR0b24udHlwZSA/IGV2YWwoXCIodHlwZW9mKFwiICsgYnV0dG9uLnR5cGUgKyAnKSA9PSBcInVuZGVmaW5lZFwiKSA/IG51bGwgOiAnICsgYnV0dG9uLnR5cGUgKyBcIjtcIikgOiBuaWNFZGl0b3JCdXR0b247XG4gICAgdmFyIGhhc0J1dHRvbiA9IGJrTGliLmluQXJyYXkodGhpcy5idXR0b25MaXN0LCBidXR0b25OYW1lKTtcblxuICAgIGlmICh0eXBlICYmIChoYXNCdXR0b24gfHwgdGhpcy5uZS5vcHRpb25zLmZ1bGxQYW5lbCkpIHtcbiAgICAgIHRoaXMucGFuZWxCdXR0b25zLnB1c2gobmV3IHR5cGUodGhpcy5wYW5lbEVsbSwgYnV0dG9uTmFtZSwgb3B0aW9ucywgdGhpcy5uZSkpO1xuXG4gICAgICBpZiAoIWhhc0J1dHRvbikge1xuICAgICAgICB0aGlzLmJ1dHRvbkxpc3QucHVzaChidXR0b25OYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGZpbmRCdXR0b246IGZ1bmN0aW9uIGZpbmRCdXR0b24oQikge1xuICAgIGZvciAodmFyIEEgPSAwOyBBIDwgdGhpcy5wYW5lbEJ1dHRvbnMubGVuZ3RoOyBBKyspIHtcbiAgICAgIGlmICh0aGlzLnBhbmVsQnV0dG9uc1tBXS5uYW1lID09IEIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFuZWxCdXR0b25zW0FdO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcmVvcmRlcjogZnVuY3Rpb24gcmVvcmRlcigpIHtcbiAgICB2YXIgQyA9IHRoaXMuYnV0dG9uTGlzdDtcblxuICAgIGZvciAodmFyIEIgPSAwOyBCIDwgQy5sZW5ndGg7IEIrKykge1xuICAgICAgdmFyIEEgPSB0aGlzLmZpbmRCdXR0b24oQ1tCXSk7XG5cbiAgICAgIGlmIChBKSB7XG4gICAgICAgIHRoaXMucGFuZWxFbG0uYXBwZW5kQ2hpbGQoQS5tYXJnaW4pO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgdGhpcy5lbG0ucmVtb3ZlKCk7XG4gIH1cbn0pO1xudmFyIG5pY0VkaXRvckJ1dHRvbiA9IGJrQ2xhc3MuZXh0ZW5kKHtcbiAgY29uc3RydWN0OiBmdW5jdGlvbiBjb25zdHJ1Y3QoRCwgQSwgQywgQikge1xuICAgIHRoaXMub3B0aW9ucyA9IEMuYnV0dG9uc1tBXTtcbiAgICB0aGlzLm5hbWUgPSBBO1xuICAgIHRoaXMubmUgPSBCO1xuICAgIHRoaXMuZWxtID0gRDtcbiAgICB0aGlzLm1hcmdpbiA9IG5ldyBia0VsZW1lbnQoXCJESVZcIikuc2V0U3R5bGUoe1xuICAgICAgXCJmbG9hdFwiOiBcImxlZnRcIixcbiAgICAgIG1hcmdpblRvcDogXCIycHhcIlxuICAgIH0pLmFwcGVuZFRvKEQpO1xuICAgIHRoaXMuY29udGFpbiA9IG5ldyBia0VsZW1lbnQoXCJESVZcIikuc2V0U3R5bGUoe1xuICAgICAgd2lkdGg6IFwiMjBweFwiLFxuICAgICAgaGVpZ2h0OiBcIjIwcHhcIlxuICAgIH0pLmFkZENsYXNzKFwiYnV0dG9uQ29udGFpblwiKS5hcHBlbmRUbyh0aGlzLm1hcmdpbik7XG4gICAgdGhpcy5ib3JkZXIgPSBuZXcgYmtFbGVtZW50KFwiRElWXCIpLnNldFN0eWxlKHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjZWZlZmVmXCIsXG4gICAgICBib3JkZXI6IFwiMXB4IHNvbGlkICNlZmVmZWZcIlxuICAgIH0pLmFwcGVuZFRvKHRoaXMuY29udGFpbik7XG4gICAgdGhpcy5idXR0b24gPSBuZXcgYmtFbGVtZW50KFwiRElWXCIpLnNldFN0eWxlKHtcbiAgICAgIHdpZHRoOiBcIjE4cHhcIixcbiAgICAgIGhlaWdodDogXCIxOHB4XCIsXG4gICAgICBvdmVyZmxvdzogXCJoaWRkZW5cIixcbiAgICAgIHpvb206IDEsXG4gICAgICBjdXJzb3I6IFwicG9pbnRlclwiXG4gICAgfSkuYWRkQ2xhc3MoXCJidXR0b25cIikuc2V0U3R5bGUodGhpcy5uZS5nZXRJY29uKEEsIEMpKS5hcHBlbmRUbyh0aGlzLmJvcmRlcik7XG4gICAgdGhpcy5idXR0b24uYWRkRXZlbnQoXCJtb3VzZW92ZXJcIiwgdGhpcy5ob3Zlck9uLmNsb3N1cmUodGhpcykpLmFkZEV2ZW50KFwibW91c2VvdXRcIiwgdGhpcy5ob3Zlck9mZi5jbG9zdXJlKHRoaXMpKS5hZGRFdmVudChcIm1vdXNlZG93blwiLCB0aGlzLm1vdXNlQ2xpY2suY2xvc3VyZSh0aGlzKSkubm9TZWxlY3QoKTtcblxuICAgIGlmICghd2luZG93Lm9wZXJhKSB7XG4gICAgICB0aGlzLmJ1dHRvbi5vbm1vdXNlZG93biA9IHRoaXMuYnV0dG9uLm9uY2xpY2sgPSBia0xpYi5jYW5jZWxFdmVudDtcbiAgICB9XG5cbiAgICBCLmFkZEV2ZW50KFwic2VsZWN0ZWRcIiwgdGhpcy5lbmFibGUuY2xvc3VyZSh0aGlzKSkuYWRkRXZlbnQoXCJibHVyXCIsIHRoaXMuZGlzYWJsZS5jbG9zdXJlKHRoaXMpKS5hZGRFdmVudChcImtleVwiLCB0aGlzLmtleS5jbG9zdXJlKHRoaXMpKTtcbiAgICB0aGlzLmRpc2FibGUoKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfSxcbiAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHt9LFxuICBoaWRlOiBmdW5jdGlvbiBoaWRlKCkge1xuICAgIHRoaXMuY29udGFpbi5zZXRTdHlsZSh7XG4gICAgICBkaXNwbGF5OiBcIm5vbmVcIlxuICAgIH0pO1xuICB9LFxuICB1cGRhdGVTdGF0ZTogZnVuY3Rpb24gdXBkYXRlU3RhdGUoKSB7XG4gICAgaWYgKHRoaXMuaXNEaXNhYmxlZCkge1xuICAgICAgdGhpcy5zZXRCZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5pc0hvdmVyKSB7XG4gICAgICAgIHRoaXMuc2V0QmcoXCJob3ZlclwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmlzQWN0aXZlKSB7XG4gICAgICAgICAgdGhpcy5zZXRCZyhcImFjdGl2ZVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldEJnKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHNldEJnOiBmdW5jdGlvbiBzZXRCZyhBKSB7XG4gICAgc3dpdGNoIChBKSB7XG4gICAgICBjYXNlIFwiaG92ZXJcIjpcbiAgICAgICAgdmFyIEIgPSB7XG4gICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCAjNjY2XCIsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNkZGRcIlxuICAgICAgICB9O1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcImFjdGl2ZVwiOlxuICAgICAgICB2YXIgQiA9IHtcbiAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkICM2NjZcIixcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI2NjY1wiXG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgQiA9IHtcbiAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkICNlZmVmZWZcIixcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI2VmZWZlZlwiXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5ib3JkZXIuc2V0U3R5bGUoQikuYWRkQ2xhc3MoXCJidXR0b24tXCIgKyBBKTtcbiAgfSxcbiAgY2hlY2tOb2RlczogZnVuY3Rpb24gY2hlY2tOb2RlcyhBKSB7XG4gICAgdmFyIEIgPSBBO1xuXG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy50YWdzICYmIGJrTGliLmluQXJyYXkodGhpcy5vcHRpb25zLnRhZ3MsIEIubm9kZU5hbWUpKSB7XG4gICAgICAgIHRoaXMuYWN0aXZhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoQiA9IEIucGFyZW50Tm9kZSAmJiBCLmNsYXNzTmFtZSAhPSBcIm5pY0VkaXRcIik7XG5cbiAgICBCID0gJEJLKEEpO1xuXG4gICAgd2hpbGUgKEIubm9kZVR5cGUgPT0gMykge1xuICAgICAgQiA9ICRCSyhCLnBhcmVudE5vZGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuY3NzKSB7XG4gICAgICBmb3IgKGl0bSBpbiB0aGlzLm9wdGlvbnMuY3NzKSB7XG4gICAgICAgIGlmIChCLmdldFN0eWxlKGl0bSwgdGhpcy5uZS5zZWxlY3RlZEluc3RhbmNlLmluc3RhbmNlRG9jKSA9PSB0aGlzLm9wdGlvbnMuY3NzW2l0bV0pIHtcbiAgICAgICAgICB0aGlzLmFjdGl2YXRlKCk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIGFjdGl2YXRlOiBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICBpZiAoIXRoaXMuaXNEaXNhYmxlZCkge1xuICAgICAgdGhpcy5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICB0aGlzLnVwZGF0ZVN0YXRlKCk7XG4gICAgICB0aGlzLm5lLmZpcmVFdmVudChcImJ1dHRvbkFjdGl2YXRlXCIsIHRoaXMpO1xuICAgIH1cbiAgfSxcbiAgZGVhY3RpdmF0ZTogZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy51cGRhdGVTdGF0ZSgpO1xuXG4gICAgaWYgKCF0aGlzLmlzRGlzYWJsZWQpIHtcbiAgICAgIHRoaXMubmUuZmlyZUV2ZW50KFwiYnV0dG9uRGVhY3RpdmF0ZVwiLCB0aGlzKTtcbiAgICB9XG4gIH0sXG4gIGVuYWJsZTogZnVuY3Rpb24gZW5hYmxlKEEsIEIpIHtcbiAgICB0aGlzLmlzRGlzYWJsZWQgPSBmYWxzZTtcbiAgICB0aGlzLmNvbnRhaW4uc2V0U3R5bGUoe1xuICAgICAgb3BhY2l0eTogMVxuICAgIH0pLmFkZENsYXNzKFwiYnV0dG9uRW5hYmxlZFwiKTtcbiAgICB0aGlzLnVwZGF0ZVN0YXRlKCk7XG4gICAgdGhpcy5jaGVja05vZGVzKEIpO1xuICB9LFxuICBkaXNhYmxlOiBmdW5jdGlvbiBkaXNhYmxlKEEsIEIpIHtcbiAgICB0aGlzLmlzRGlzYWJsZWQgPSB0cnVlO1xuICAgIHRoaXMuY29udGFpbi5zZXRTdHlsZSh7XG4gICAgICBvcGFjaXR5OiAwLjZcbiAgICB9KS5yZW1vdmVDbGFzcyhcImJ1dHRvbkVuYWJsZWRcIik7XG4gICAgdGhpcy51cGRhdGVTdGF0ZSgpO1xuICB9LFxuICB0b2dnbGVBY3RpdmU6IGZ1bmN0aW9uIHRvZ2dsZUFjdGl2ZSgpIHtcbiAgICB0aGlzLmlzQWN0aXZlID8gdGhpcy5kZWFjdGl2YXRlKCkgOiB0aGlzLmFjdGl2YXRlKCk7XG4gIH0sXG4gIGhvdmVyT246IGZ1bmN0aW9uIGhvdmVyT24oKSB7XG4gICAgaWYgKCF0aGlzLmlzRGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuaXNIb3ZlciA9IHRydWU7XG4gICAgICB0aGlzLnVwZGF0ZVN0YXRlKCk7XG4gICAgICB0aGlzLm5lLmZpcmVFdmVudChcImJ1dHRvbk92ZXJcIiwgdGhpcyk7XG4gICAgfVxuICB9LFxuICBob3Zlck9mZjogZnVuY3Rpb24gaG92ZXJPZmYoKSB7XG4gICAgdGhpcy5pc0hvdmVyID0gZmFsc2U7XG4gICAgdGhpcy51cGRhdGVTdGF0ZSgpO1xuICAgIHRoaXMubmUuZmlyZUV2ZW50KFwiYnV0dG9uT3V0XCIsIHRoaXMpO1xuICB9LFxuICBtb3VzZUNsaWNrOiBmdW5jdGlvbiBtb3VzZUNsaWNrKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY29tbWFuZCkge1xuICAgICAgdGhpcy5uZS5uaWNDb21tYW5kKHRoaXMub3B0aW9ucy5jb21tYW5kLCB0aGlzLm9wdGlvbnMuY29tbWFuZEFyZ3MpO1xuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5ub0FjdGl2ZSkge1xuICAgICAgICB0aGlzLnRvZ2dsZUFjdGl2ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubmUuZmlyZUV2ZW50KFwiYnV0dG9uQ2xpY2tcIiwgdGhpcyk7XG4gIH0sXG4gIGtleTogZnVuY3Rpb24ga2V5KEEsIEIpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmtleSAmJiBCLmN0cmxLZXkgJiYgU3RyaW5nLmZyb21DaGFyQ29kZShCLmtleUNvZGUgfHwgQi5jaGFyQ29kZSkudG9Mb3dlckNhc2UoKSA9PSB0aGlzLm9wdGlvbnMua2V5KSB7XG4gICAgICB0aGlzLm1vdXNlQ2xpY2soKTtcblxuICAgICAgaWYgKEIucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgQi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG52YXIgbmljUGx1Z2luID0gYmtDbGFzcy5leHRlbmQoe1xuICBjb25zdHJ1Y3Q6IGZ1bmN0aW9uIGNvbnN0cnVjdChCLCBBKSB7XG4gICAgdGhpcy5vcHRpb25zID0gQTtcbiAgICB0aGlzLm5lID0gQjtcbiAgICB0aGlzLm5lLmFkZEV2ZW50KFwicGFuZWxcIiwgdGhpcy5sb2FkUGFuZWwuY2xvc3VyZSh0aGlzKSk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH0sXG4gIGxvYWRQYW5lbDogZnVuY3Rpb24gbG9hZFBhbmVsKEMpIHtcbiAgICB2YXIgQiA9IHRoaXMub3B0aW9ucy5idXR0b25zO1xuXG4gICAgZm9yICh2YXIgQSBpbiBCKSB7XG4gICAgICBDLmFkZEJ1dHRvbihBLCB0aGlzLm9wdGlvbnMpO1xuICAgIH1cblxuICAgIEMucmVvcmRlcigpO1xuICB9LFxuICBpbml0OiBmdW5jdGlvbiBpbml0KCkge31cbn0pO1xudmFyIG5pY1BhbmVPcHRpb25zID0ge307XG52YXIgbmljRWRpdG9yUGFuZSA9IGJrQ2xhc3MuZXh0ZW5kKHtcbiAgY29uc3RydWN0OiBmdW5jdGlvbiBjb25zdHJ1Y3QoRCwgQywgQiwgQSkge1xuICAgIHRoaXMubmUgPSBDO1xuICAgIHRoaXMuZWxtID0gRDtcbiAgICB0aGlzLnBvcyA9IEQucG9zKCk7XG4gICAgdGhpcy5jb250YWluID0gbmV3IGJrRWxlbWVudChcImRpdlwiKS5zZXRTdHlsZSh7XG4gICAgICB6SW5kZXg6IFwiOTk5OTlcIixcbiAgICAgIG92ZXJmbG93OiBcImhpZGRlblwiLFxuICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgICAgIGxlZnQ6IHRoaXMucG9zWzBdICsgXCJweFwiLFxuICAgICAgdG9wOiB0aGlzLnBvc1sxXSArIFwicHhcIlxuICAgIH0pO1xuICAgIHRoaXMucGFuZSA9IG5ldyBia0VsZW1lbnQoXCJkaXZcIikuc2V0U3R5bGUoe1xuICAgICAgZm9udFNpemU6IFwiMTJweFwiLFxuICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCAjY2NjXCIsXG4gICAgICBvdmVyZmxvdzogXCJoaWRkZW5cIixcbiAgICAgIHBhZGRpbmc6IFwiNHB4XCIsXG4gICAgICB0ZXh0QWxpZ246IFwibGVmdFwiLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNmZmZmYzlcIlxuICAgIH0pLmFkZENsYXNzKFwicGFuZVwiKS5zZXRTdHlsZShCKS5hcHBlbmRUbyh0aGlzLmNvbnRhaW4pO1xuXG4gICAgaWYgKEEgJiYgIUEub3B0aW9ucy5ub0Nsb3NlKSB7XG4gICAgICB0aGlzLmNsb3NlID0gbmV3IGJrRWxlbWVudChcImRpdlwiKS5zZXRTdHlsZSh7XG4gICAgICAgIFwiZmxvYXRcIjogXCJyaWdodFwiLFxuICAgICAgICBoZWlnaHQ6IFwiMTZweFwiLFxuICAgICAgICB3aWR0aDogXCIxNnB4XCIsXG4gICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCJcbiAgICAgIH0pLnNldFN0eWxlKHRoaXMubmUuZ2V0SWNvbihcImNsb3NlXCIsIG5pY1BhbmVPcHRpb25zKSkuYWRkRXZlbnQoXCJtb3VzZWRvd25cIiwgQS5yZW1vdmVQYW5lLmNsb3N1cmUodGhpcykpLmFwcGVuZFRvKHRoaXMucGFuZSk7XG4gICAgfVxuXG4gICAgdGhpcy5jb250YWluLm5vU2VsZWN0KCkuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG4gICAgdGhpcy5wb3NpdGlvbigpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9LFxuICBpbml0OiBmdW5jdGlvbiBpbml0KCkge30sXG4gIHBvc2l0aW9uOiBmdW5jdGlvbiBwb3NpdGlvbigpIHtcbiAgICBpZiAodGhpcy5uZS5uaWNQYW5lbCkge1xuICAgICAgdmFyIEIgPSB0aGlzLm5lLm5pY1BhbmVsLmVsbTtcbiAgICAgIHZhciBBID0gQi5wb3MoKTtcbiAgICAgIHZhciBDID0gQVswXSArIHBhcnNlSW50KEIuZ2V0U3R5bGUoXCJ3aWR0aFwiKSkgLSAocGFyc2VJbnQodGhpcy5wYW5lLmdldFN0eWxlKFwid2lkdGhcIikpICsgOCk7XG5cbiAgICAgIGlmIChDIDwgdGhpcy5wb3NbMF0pIHtcbiAgICAgICAgdGhpcy5jb250YWluLnNldFN0eWxlKHtcbiAgICAgICAgICBsZWZ0OiBDICsgXCJweFwiXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgdG9nZ2xlOiBmdW5jdGlvbiB0b2dnbGUoKSB7XG4gICAgdGhpcy5pc1Zpc2libGUgPSAhdGhpcy5pc1Zpc2libGU7XG4gICAgdGhpcy5jb250YWluLnNldFN0eWxlKHtcbiAgICAgIGRpc3BsYXk6IHRoaXMuaXNWaXNpYmxlID8gXCJibG9ja1wiIDogXCJub25lXCJcbiAgICB9KTtcbiAgfSxcbiAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgaWYgKHRoaXMuY29udGFpbikge1xuICAgICAgdGhpcy5jb250YWluLnJlbW92ZSgpO1xuICAgICAgdGhpcy5jb250YWluID0gbnVsbDtcbiAgICB9XG4gIH0sXG4gIGFwcGVuZDogZnVuY3Rpb24gYXBwZW5kKEEpIHtcbiAgICBBLmFwcGVuZFRvKHRoaXMucGFuZSk7XG4gIH0sXG4gIHNldENvbnRlbnQ6IGZ1bmN0aW9uIHNldENvbnRlbnQoQSkge1xuICAgIHRoaXMucGFuZS5zZXRDb250ZW50KEEpO1xuICB9XG59KTtcbnZhciBuaWNTZWxlY3RPcHRpb25zID0ge1xuICBidXR0b25zOiB7XG4gICAgJ2ZvbnRTaXplJzoge1xuICAgICAgbmFtZTogX18oJ1NlbGVjdCBGb250IFNpemUnKSxcbiAgICAgIHR5cGU6ICduaWNFZGl0b3JGb250U2l6ZVNlbGVjdCcsXG4gICAgICBjb21tYW5kOiAnZm9udHNpemUnXG4gICAgfSxcbiAgICAnZm9udEZhbWlseSc6IHtcbiAgICAgIG5hbWU6IF9fKCdTZWxlY3QgRm9udCBGYW1pbHknKSxcbiAgICAgIHR5cGU6ICduaWNFZGl0b3JGb250RmFtaWx5U2VsZWN0JyxcbiAgICAgIGNvbW1hbmQ6ICdmb250bmFtZSdcbiAgICB9LFxuICAgICdmb250Rm9ybWF0Jzoge1xuICAgICAgbmFtZTogX18oJ1NlbGVjdCBGb250IEZvcm1hdCcpLFxuICAgICAgdHlwZTogJ25pY0VkaXRvckZvbnRGb3JtYXRTZWxlY3QnLFxuICAgICAgY29tbWFuZDogJ2Zvcm1hdEJsb2NrJ1xuICAgIH1cbiAgfVxufTtcbnZhciBuaWNFZGl0b3JTZWxlY3QgPSBia0NsYXNzLmV4dGVuZCh7XG4gIGNvbnN0cnVjdDogZnVuY3Rpb24gY29uc3RydWN0KEQsIEEsIEMsIEIpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBDLmJ1dHRvbnNbQV07XG4gICAgdGhpcy5lbG0gPSBEO1xuICAgIHRoaXMubmUgPSBCO1xuICAgIHRoaXMubmFtZSA9IEE7XG4gICAgdGhpcy5zZWxPcHRpb25zID0gbmV3IEFycmF5KCk7XG4gICAgdGhpcy5tYXJnaW4gPSBuZXcgYmtFbGVtZW50KFwiZGl2XCIpLnNldFN0eWxlKHtcbiAgICAgIFwiZmxvYXRcIjogXCJsZWZ0XCIsXG4gICAgICBtYXJnaW46IFwiMnB4IDFweCAwIDFweFwiXG4gICAgfSkuYXBwZW5kVG8odGhpcy5lbG0pO1xuICAgIHRoaXMuY29udGFpbiA9IG5ldyBia0VsZW1lbnQoXCJkaXZcIikuc2V0U3R5bGUoe1xuICAgICAgd2lkdGg6IFwiOTBweFwiLFxuICAgICAgaGVpZ2h0OiBcIjIwcHhcIixcbiAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICBvdmVyZmxvdzogXCJoaWRkZW5cIlxuICAgIH0pLmFkZENsYXNzKFwic2VsZWN0Q29udGFpblwiKS5hZGRFdmVudChcImNsaWNrXCIsIHRoaXMudG9nZ2xlLmNsb3N1cmUodGhpcykpLmFwcGVuZFRvKHRoaXMubWFyZ2luKTtcbiAgICB0aGlzLml0ZW1zID0gbmV3IGJrRWxlbWVudChcImRpdlwiKS5zZXRTdHlsZSh7XG4gICAgICBvdmVyZmxvdzogXCJoaWRkZW5cIixcbiAgICAgIHpvb206IDEsXG4gICAgICBib3JkZXI6IFwiMXB4IHNvbGlkICNjY2NcIixcbiAgICAgIHBhZGRpbmdMZWZ0OiBcIjNweFwiLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuICAgIH0pLmFwcGVuZFRvKHRoaXMuY29udGFpbik7XG4gICAgdGhpcy5jb250cm9sID0gbmV3IGJrRWxlbWVudChcImRpdlwiKS5zZXRTdHlsZSh7XG4gICAgICBvdmVyZmxvdzogXCJoaWRkZW5cIixcbiAgICAgIFwiZmxvYXRcIjogXCJyaWdodFwiLFxuICAgICAgaGVpZ2h0OiBcIjE4cHhcIixcbiAgICAgIHdpZHRoOiBcIjE2cHhcIlxuICAgIH0pLmFkZENsYXNzKFwic2VsZWN0Q29udHJvbFwiKS5zZXRTdHlsZSh0aGlzLm5lLmdldEljb24oXCJhcnJvd1wiLCBDKSkuYXBwZW5kVG8odGhpcy5pdGVtcyk7XG4gICAgdGhpcy50eHQgPSBuZXcgYmtFbGVtZW50KFwiZGl2XCIpLnNldFN0eWxlKHtcbiAgICAgIG92ZXJmbG93OiBcImhpZGRlblwiLFxuICAgICAgXCJmbG9hdFwiOiBcImxlZnRcIixcbiAgICAgIHdpZHRoOiBcIjY2cHhcIixcbiAgICAgIGhlaWdodDogXCIxNHB4XCIsXG4gICAgICBtYXJnaW5Ub3A6IFwiMXB4XCIsXG4gICAgICBmb250RmFtaWx5OiBcInNhbnMtc2VyaWZcIixcbiAgICAgIHRleHRBbGlnbjogXCJjZW50ZXJcIixcbiAgICAgIGZvbnRTaXplOiBcIjEycHhcIlxuICAgIH0pLmFkZENsYXNzKFwic2VsZWN0VHh0XCIpLmFwcGVuZFRvKHRoaXMuaXRlbXMpO1xuXG4gICAgaWYgKCF3aW5kb3cub3BlcmEpIHtcbiAgICAgIHRoaXMuY29udGFpbi5vbm1vdXNlZG93biA9IHRoaXMuY29udHJvbC5vbm1vdXNlZG93biA9IHRoaXMudHh0Lm9ubW91c2Vkb3duID0gYmtMaWIuY2FuY2VsRXZlbnQ7XG4gICAgfVxuXG4gICAgdGhpcy5tYXJnaW4ubm9TZWxlY3QoKTtcbiAgICB0aGlzLm5lLmFkZEV2ZW50KFwic2VsZWN0ZWRcIiwgdGhpcy5lbmFibGUuY2xvc3VyZSh0aGlzKSkuYWRkRXZlbnQoXCJibHVyXCIsIHRoaXMuZGlzYWJsZS5jbG9zdXJlKHRoaXMpKTtcbiAgICB0aGlzLmRpc2FibGUoKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfSxcbiAgZGlzYWJsZTogZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgICB0aGlzLmlzRGlzYWJsZWQgPSB0cnVlO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLmNvbnRhaW4uc2V0U3R5bGUoe1xuICAgICAgb3BhY2l0eTogMC42XG4gICAgfSk7XG4gIH0sXG4gIGVuYWJsZTogZnVuY3Rpb24gZW5hYmxlKEEpIHtcbiAgICB0aGlzLmlzRGlzYWJsZWQgPSBmYWxzZTtcbiAgICB0aGlzLmNsb3NlKCk7XG4gICAgdGhpcy5jb250YWluLnNldFN0eWxlKHtcbiAgICAgIG9wYWNpdHk6IDFcbiAgICB9KTtcbiAgfSxcbiAgc2V0RGlzcGxheTogZnVuY3Rpb24gc2V0RGlzcGxheShBKSB7XG4gICAgdGhpcy50eHQuc2V0Q29udGVudChBKTtcbiAgfSxcbiAgdG9nZ2xlOiBmdW5jdGlvbiB0b2dnbGUoKSB7XG4gICAgaWYgKCF0aGlzLmlzRGlzYWJsZWQpIHtcbiAgICAgIHRoaXMucGFuZSA/IHRoaXMuY2xvc2UoKSA6IHRoaXMub3BlbigpO1xuICAgIH1cbiAgfSxcbiAgb3BlbjogZnVuY3Rpb24gb3BlbigpIHtcbiAgICB0aGlzLnBhbmUgPSBuZXcgbmljRWRpdG9yUGFuZSh0aGlzLml0ZW1zLCB0aGlzLm5lLCB7XG4gICAgICB3aWR0aDogXCI4OHB4XCIsXG4gICAgICBwYWRkaW5nOiBcIjBweFwiLFxuICAgICAgYm9yZGVyVG9wOiAwLFxuICAgICAgYm9yZGVyTGVmdDogXCIxcHggc29saWQgI2NjY1wiLFxuICAgICAgYm9yZGVyUmlnaHQ6IFwiMXB4IHNvbGlkICNjY2NcIixcbiAgICAgIGJvcmRlckJvdHRvbTogXCIwcHhcIixcbiAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcbiAgICB9KTtcblxuICAgIGZvciAodmFyIEMgPSAwOyBDIDwgdGhpcy5zZWxPcHRpb25zLmxlbmd0aDsgQysrKSB7XG4gICAgICB2YXIgX2JrRWxlbWVudCRzZXRTdHlsZTtcblxuICAgICAgdmFyIEIgPSB0aGlzLnNlbE9wdGlvbnNbQ107XG4gICAgICB2YXIgQSA9IG5ldyBia0VsZW1lbnQoXCJkaXZcIikuc2V0U3R5bGUoKF9ia0VsZW1lbnQkc2V0U3R5bGUgPSB7XG4gICAgICAgIG92ZXJmbG93OiBcImhpZGRlblwiLFxuICAgICAgICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkICNjY2NcIixcbiAgICAgICAgd2lkdGg6IFwiODhweFwiLFxuICAgICAgICB0ZXh0QWxpZ246IFwibGVmdFwiXG4gICAgICB9LCBfZGVmaW5lUHJvcGVydHkoX2JrRWxlbWVudCRzZXRTdHlsZSwgXCJvdmVyZmxvd1wiLCBcImhpZGRlblwiKSwgX2RlZmluZVByb3BlcnR5KF9ia0VsZW1lbnQkc2V0U3R5bGUsIFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKSwgX2JrRWxlbWVudCRzZXRTdHlsZSkpO1xuICAgICAgdmFyIEQgPSBuZXcgYmtFbGVtZW50KFwiZGl2XCIpLnNldFN0eWxlKHtcbiAgICAgICAgcGFkZGluZzogXCIwcHggNHB4XCJcbiAgICAgIH0pLnNldENvbnRlbnQoQlsxXSkuYXBwZW5kVG8oQSkubm9TZWxlY3QoKTtcbiAgICAgIEQuYWRkRXZlbnQoXCJjbGlja1wiLCB0aGlzLnVwZGF0ZS5jbG9zdXJlKHRoaXMsIEJbMF0pKS5hZGRFdmVudChcIm1vdXNlb3ZlclwiLCB0aGlzLm92ZXIuY2xvc3VyZSh0aGlzLCBEKSkuYWRkRXZlbnQoXCJtb3VzZW91dFwiLCB0aGlzLm91dC5jbG9zdXJlKHRoaXMsIEQpKS5zZXRBdHRyaWJ1dGVzKFwiaWRcIiwgQlswXSk7XG4gICAgICB0aGlzLnBhbmUuYXBwZW5kKEEpO1xuXG4gICAgICBpZiAoIXdpbmRvdy5vcGVyYSkge1xuICAgICAgICBELm9ubW91c2Vkb3duID0gYmtMaWIuY2FuY2VsRXZlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgaWYgKHRoaXMucGFuZSkge1xuICAgICAgdGhpcy5wYW5lID0gdGhpcy5wYW5lLnJlbW92ZSgpO1xuICAgIH1cbiAgfSxcbiAgb3ZlcjogZnVuY3Rpb24gb3ZlcihBKSB7XG4gICAgQS5zZXRTdHlsZSh7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI2NjY1wiXG4gICAgfSk7XG4gIH0sXG4gIG91dDogZnVuY3Rpb24gb3V0KEEpIHtcbiAgICBBLnNldFN0eWxlKHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcbiAgICB9KTtcbiAgfSxcbiAgYWRkOiBmdW5jdGlvbiBhZGQoQiwgQSkge1xuICAgIHRoaXMuc2VsT3B0aW9ucy5wdXNoKG5ldyBBcnJheShCLCBBKSk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKEEpIHtcbiAgICB0aGlzLm5lLm5pY0NvbW1hbmQodGhpcy5vcHRpb25zLmNvbW1hbmQsIEEpO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxufSk7XG52YXIgbmljRWRpdG9yRm9udFNpemVTZWxlY3QgPSBuaWNFZGl0b3JTZWxlY3QuZXh0ZW5kKHtcbiAgc2VsOiB7XG4gICAgMTogXCIxJm5ic3A7KDhwdClcIixcbiAgICAyOiBcIjImbmJzcDsoMTBwdClcIixcbiAgICAzOiBcIjMmbmJzcDsoMTJwdClcIixcbiAgICA0OiBcIjQmbmJzcDsoMTRwdClcIixcbiAgICA1OiBcIjUmbmJzcDsoMThwdClcIixcbiAgICA2OiBcIjYmbmJzcDsoMjRwdClcIlxuICB9LFxuICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xuICAgIHRoaXMuc2V0RGlzcGxheShcIkZvbnQmbmJzcDtTaXplLi4uXCIpO1xuXG4gICAgZm9yIChpdG0gaW4gdGhpcy5zZWwpIHtcbiAgICAgIHRoaXMuYWRkKGl0bSwgJzxmb250IHNpemU9XCInICsgaXRtICsgJ1wiPicgKyB0aGlzLnNlbFtpdG1dICsgXCI8L2ZvbnQ+XCIpO1xuICAgIH1cbiAgfVxufSk7XG52YXIgbmljRWRpdG9yRm9udEZhbWlseVNlbGVjdCA9IG5pY0VkaXRvclNlbGVjdC5leHRlbmQoe1xuICBzZWw6IHtcbiAgICBhcmlhbDogXCJBcmlhbFwiLFxuICAgIFwiY29taWMgc2FucyBtc1wiOiBcIkNvbWljIFNhbnNcIixcbiAgICBcImNvdXJpZXIgbmV3XCI6IFwiQ291cmllciBOZXdcIixcbiAgICBnZW9yZ2lhOiBcIkdlb3JnaWFcIixcbiAgICBoZWx2ZXRpY2E6IFwiSGVsdmV0aWNhXCIsXG4gICAgaW1wYWN0OiBcIkltcGFjdFwiLFxuICAgIFwidGltZXMgbmV3IHJvbWFuXCI6IFwiVGltZXNcIixcbiAgICBcInRyZWJ1Y2hldCBtc1wiOiBcIlRyZWJ1Y2hldFwiLFxuICAgIHZlcmRhbmE6IFwiVmVyZGFuYVwiXG4gIH0sXG4gIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdGhpcy5zZXREaXNwbGF5KFwiRm9udCZuYnNwO0ZhbWlseS4uLlwiKTtcblxuICAgIGZvciAoaXRtIGluIHRoaXMuc2VsKSB7XG4gICAgICB0aGlzLmFkZChpdG0sICc8Zm9udCBmYWNlPVwiJyArIGl0bSArICdcIj4nICsgdGhpcy5zZWxbaXRtXSArIFwiPC9mb250PlwiKTtcbiAgICB9XG4gIH1cbn0pO1xudmFyIG5pY0VkaXRvckZvbnRGb3JtYXRTZWxlY3QgPSBuaWNFZGl0b3JTZWxlY3QuZXh0ZW5kKHtcbiAgc2VsOiB7XG4gICAgcDogXCJQYXJhZ3JhcGhcIixcbiAgICBwcmU6IFwiUHJlXCIsXG4gICAgaDY6IFwiSGVhZGluZyZuYnNwOzZcIixcbiAgICBoNTogXCJIZWFkaW5nJm5ic3A7NVwiLFxuICAgIGg0OiBcIkhlYWRpbmcmbmJzcDs0XCIsXG4gICAgaDM6IFwiSGVhZGluZyZuYnNwOzNcIixcbiAgICBoMjogXCJIZWFkaW5nJm5ic3A7MlwiLFxuICAgIGgxOiBcIkhlYWRpbmcmbmJzcDsxXCJcbiAgfSxcbiAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB0aGlzLnNldERpc3BsYXkoXCJGb250Jm5ic3A7Rm9ybWF0Li4uXCIpO1xuXG4gICAgZm9yIChpdG0gaW4gdGhpcy5zZWwpIHtcbiAgICAgIHZhciBBID0gaXRtLnRvVXBwZXJDYXNlKCk7XG4gICAgICB0aGlzLmFkZChcIjxcIiArIEEgKyBcIj5cIiwgXCI8XCIgKyBpdG0gKyAnIHN0eWxlPVwicGFkZGluZzogMHB4OyBtYXJnaW46IDBweDtcIj4nICsgdGhpcy5zZWxbaXRtXSArIFwiPC9cIiArIEEgKyBcIj5cIik7XG4gICAgfVxuICB9XG59KTtcbm5pY0VkaXRvcnMucmVnaXN0ZXJQbHVnaW4obmljUGx1Z2luLCBuaWNTZWxlY3RPcHRpb25zKTtcbnZhciBuaWNCdXR0b25UaXBzID0gYmtDbGFzcy5leHRlbmQoe1xuICBjb25zdHJ1Y3Q6IGZ1bmN0aW9uIGNvbnN0cnVjdChBKSB7XG4gICAgdGhpcy5uZSA9IEE7XG4gICAgQS5hZGRFdmVudChcImJ1dHRvbk92ZXJcIiwgdGhpcy5zaG93LmNsb3N1cmUodGhpcykpLmFkZEV2ZW50KFwiYnV0dG9uT3V0XCIsIHRoaXMuaGlkZS5jbG9zdXJlKHRoaXMpKTtcbiAgfSxcbiAgc2hvdzogZnVuY3Rpb24gc2hvdyhBKSB7XG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQodGhpcy5jcmVhdGUuY2xvc3VyZSh0aGlzLCBBKSwgNDAwKTtcbiAgfSxcbiAgY3JlYXRlOiBmdW5jdGlvbiBjcmVhdGUoQSkge1xuICAgIHRoaXMudGltZXIgPSBudWxsO1xuXG4gICAgaWYgKCF0aGlzLnBhbmUpIHtcbiAgICAgIHRoaXMucGFuZSA9IG5ldyBuaWNFZGl0b3JQYW5lKEEuYnV0dG9uLCB0aGlzLm5lLCB7XG4gICAgICAgIGZvbnRTaXplOiBcIjEycHhcIixcbiAgICAgICAgbWFyZ2luVG9wOiBcIjVweFwiXG4gICAgICB9KTtcbiAgICAgIHRoaXMucGFuZS5zZXRDb250ZW50KEEub3B0aW9ucy5uYW1lKTtcbiAgICB9XG4gIH0sXG4gIGhpZGU6IGZ1bmN0aW9uIGhpZGUoQSkge1xuICAgIGlmICh0aGlzLnRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFuZSkge1xuICAgICAgdGhpcy5wYW5lID0gdGhpcy5wYW5lLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxufSk7XG5uaWNFZGl0b3JzLnJlZ2lzdGVyUGx1Z2luKG5pY0J1dHRvblRpcHMpO1xudmFyIG5pY0VkaXRvckFkdmFuY2VkQnV0dG9uID0gbmljRWRpdG9yQnV0dG9uLmV4dGVuZCh7XG4gIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdGhpcy5uZS5hZGRFdmVudChcInNlbGVjdGVkXCIsIHRoaXMucmVtb3ZlUGFuZS5jbG9zdXJlKHRoaXMpKS5hZGRFdmVudChcImJsdXJcIiwgdGhpcy5yZW1vdmVQYW5lLmNsb3N1cmUodGhpcykpO1xuICB9LFxuICBtb3VzZUNsaWNrOiBmdW5jdGlvbiBtb3VzZUNsaWNrKCkge1xuICAgIGlmICghdGhpcy5pc0Rpc2FibGVkKSB7XG4gICAgICBpZiAodGhpcy5wYW5lICYmIHRoaXMucGFuZS5wYW5lKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlUGFuZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wYW5lID0gbmV3IG5pY0VkaXRvclBhbmUodGhpcy5jb250YWluLCB0aGlzLm5lLCB7XG4gICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGggfHwgXCIyNzBweFwiLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHRoaXMuYWRkUGFuZSgpO1xuICAgICAgICB0aGlzLm5lLnNlbGVjdGVkSW5zdGFuY2Uuc2F2ZVJuZygpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgYWRkRm9ybTogZnVuY3Rpb24gYWRkRm9ybShDLCBHKSB7XG4gICAgdGhpcy5mb3JtID0gbmV3IGJrRWxlbWVudChcImZvcm1cIikuYWRkRXZlbnQoXCJzdWJtaXRcIiwgdGhpcy5zdWJtaXQuY2xvc3VyZUxpc3RlbmVyKHRoaXMpKTtcbiAgICB0aGlzLnBhbmUuYXBwZW5kKHRoaXMuZm9ybSk7XG4gICAgdGhpcy5pbnB1dHMgPSB7fTtcblxuICAgIGZvciAoaXRtIGluIEMpIHtcbiAgICAgIHZhciBEID0gQ1tpdG1dO1xuICAgICAgdmFyIEYgPSBcIlwiO1xuXG4gICAgICBpZiAoRykge1xuICAgICAgICBGID0gRy5nZXRBdHRyaWJ1dGUoaXRtKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFGKSB7XG4gICAgICAgIEYgPSBELnZhbHVlIHx8IFwiXCI7XG4gICAgICB9XG5cbiAgICAgIHZhciBBID0gQ1tpdG1dLnR5cGU7XG5cbiAgICAgIGlmIChBID09IFwidGl0bGVcIikge1xuICAgICAgICBuZXcgYmtFbGVtZW50KFwiZGl2XCIpLnNldENvbnRlbnQoRC50eHQpLnNldFN0eWxlKHtcbiAgICAgICAgICBmb250U2l6ZTogXCIxNHB4XCIsXG4gICAgICAgICAgZm9udFdlaWdodDogXCJib2xkXCIsXG4gICAgICAgICAgcGFkZGluZzogXCIwcHhcIixcbiAgICAgICAgICBtYXJnaW46IFwiMnB4IDBcIlxuICAgICAgICB9KS5hcHBlbmRUbyh0aGlzLmZvcm0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIEIgPSBuZXcgYmtFbGVtZW50KFwiZGl2XCIpLnNldFN0eWxlKHtcbiAgICAgICAgICBvdmVyZmxvdzogXCJoaWRkZW5cIixcbiAgICAgICAgICBjbGVhcjogXCJib3RoXCJcbiAgICAgICAgfSkuYXBwZW5kVG8odGhpcy5mb3JtKTtcblxuICAgICAgICBpZiAoRC50eHQpIHtcbiAgICAgICAgICBuZXcgYmtFbGVtZW50KFwibGFiZWxcIikuc2V0QXR0cmlidXRlcyh7XG4gICAgICAgICAgICBcImZvclwiOiBpdG1cbiAgICAgICAgICB9KS5zZXRDb250ZW50KEQudHh0KS5zZXRTdHlsZSh7XG4gICAgICAgICAgICBtYXJnaW46IFwiMnB4IDRweFwiLFxuICAgICAgICAgICAgZm9udFNpemU6IFwiMTNweFwiLFxuICAgICAgICAgICAgd2lkdGg6IFwiNTBweFwiLFxuICAgICAgICAgICAgbGluZUhlaWdodDogXCIyMHB4XCIsXG4gICAgICAgICAgICB0ZXh0QWxpZ246IFwicmlnaHRcIixcbiAgICAgICAgICAgIFwiZmxvYXRcIjogXCJsZWZ0XCJcbiAgICAgICAgICB9KS5hcHBlbmRUbyhCKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAoQSkge1xuICAgICAgICAgIGNhc2UgXCJ0ZXh0XCI6XG4gICAgICAgICAgICB0aGlzLmlucHV0c1tpdG1dID0gbmV3IGJrRWxlbWVudChcImlucHV0XCIpLnNldEF0dHJpYnV0ZXMoe1xuICAgICAgICAgICAgICBpZDogaXRtLFxuICAgICAgICAgICAgICB2YWx1ZTogRixcbiAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCJcbiAgICAgICAgICAgIH0pLnNldFN0eWxlKHtcbiAgICAgICAgICAgICAgbWFyZ2luOiBcIjJweCAwXCIsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiBcIjEzcHhcIixcbiAgICAgICAgICAgICAgXCJmbG9hdFwiOiBcImxlZnRcIixcbiAgICAgICAgICAgICAgaGVpZ2h0OiBcIjIwcHhcIixcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCAjY2NjXCIsXG4gICAgICAgICAgICAgIG92ZXJmbG93OiBcImhpZGRlblwiXG4gICAgICAgICAgICB9KS5zZXRTdHlsZShELnN0eWxlKS5hcHBlbmRUbyhCKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSBcInNlbGVjdFwiOlxuICAgICAgICAgICAgdGhpcy5pbnB1dHNbaXRtXSA9IG5ldyBia0VsZW1lbnQoXCJzZWxlY3RcIikuc2V0QXR0cmlidXRlcyh7XG4gICAgICAgICAgICAgIGlkOiBpdG1cbiAgICAgICAgICAgIH0pLnNldFN0eWxlKHtcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCAjY2NjXCIsXG4gICAgICAgICAgICAgIFwiZmxvYXRcIjogXCJsZWZ0XCIsXG4gICAgICAgICAgICAgIG1hcmdpbjogXCIycHggMFwiXG4gICAgICAgICAgICB9KS5hcHBlbmRUbyhCKTtcblxuICAgICAgICAgICAgZm9yIChvcHQgaW4gRC5vcHRpb25zKSB7XG4gICAgICAgICAgICAgIHZhciBFID0gbmV3IGJrRWxlbWVudChcIm9wdGlvblwiKS5zZXRBdHRyaWJ1dGVzKHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogb3B0LFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkOiBvcHQgPT0gRiA/IFwic2VsZWN0ZWRcIiA6IFwiXCJcbiAgICAgICAgICAgICAgfSkuc2V0Q29udGVudChELm9wdGlvbnNbb3B0XSkuYXBwZW5kVG8odGhpcy5pbnB1dHNbaXRtXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSBcImNvbnRlbnRcIjpcbiAgICAgICAgICAgIHRoaXMuaW5wdXRzW2l0bV0gPSBuZXcgYmtFbGVtZW50KFwidGV4dGFyZWFcIikuc2V0QXR0cmlidXRlcyh7XG4gICAgICAgICAgICAgIGlkOiBpdG1cbiAgICAgICAgICAgIH0pLnNldFN0eWxlKHtcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCAjY2NjXCIsXG4gICAgICAgICAgICAgIFwiZmxvYXRcIjogXCJsZWZ0XCJcbiAgICAgICAgICAgIH0pLnNldFN0eWxlKEQuc3R5bGUpLmFwcGVuZFRvKEIpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dHNbaXRtXS52YWx1ZSA9IEY7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBuZXcgYmtFbGVtZW50KFwiaW5wdXRcIikuc2V0QXR0cmlidXRlcyh7XG4gICAgICB0eXBlOiBcInN1Ym1pdFwiXG4gICAgfSkuc2V0U3R5bGUoe1xuICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNlZmVmZWZcIixcbiAgICAgIGJvcmRlcjogXCIxcHggc29saWQgI2NjY1wiLFxuICAgICAgbWFyZ2luOiBcIjNweCAwXCIsXG4gICAgICBcImZsb2F0XCI6IFwibGVmdFwiLFxuICAgICAgY2xlYXI6IFwiYm90aFwiXG4gICAgfSkuYXBwZW5kVG8odGhpcy5mb3JtKTtcbiAgICB0aGlzLmZvcm0ub25zdWJtaXQgPSBia0xpYi5jYW5jZWxFdmVudDtcbiAgfSxcbiAgc3VibWl0OiBmdW5jdGlvbiBzdWJtaXQoKSB7fSxcbiAgZmluZEVsbTogZnVuY3Rpb24gZmluZEVsbShCLCBBLCBFKSB7XG4gICAgdmFyIEQgPSB0aGlzLm5lLnNlbGVjdGVkSW5zdGFuY2UuZ2V0RWxtKCkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoQik7XG5cbiAgICBmb3IgKHZhciBDID0gMDsgQyA8IEQubGVuZ3RoOyBDKyspIHtcbiAgICAgIGlmIChEW0NdLmdldEF0dHJpYnV0ZShBKSA9PSBFKSB7XG4gICAgICAgIHJldHVybiAkQksoRFtDXSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICByZW1vdmVQYW5lOiBmdW5jdGlvbiByZW1vdmVQYW5lKCkge1xuICAgIGlmICh0aGlzLnBhbmUpIHtcbiAgICAgIHRoaXMucGFuZS5yZW1vdmUoKTtcbiAgICAgIHRoaXMucGFuZSA9IG51bGw7XG4gICAgICB0aGlzLm5lLnNlbGVjdGVkSW5zdGFuY2UucmVzdG9yZVJuZygpO1xuICAgIH1cbiAgfVxufSk7XG52YXIgbmljTGlua09wdGlvbnMgPSB7XG4gIGJ1dHRvbnM6IHtcbiAgICAnbGluayc6IHtcbiAgICAgIG5hbWU6ICdBZGQgTGluaycsXG4gICAgICB0eXBlOiAnbmljTGlua0J1dHRvbicsXG4gICAgICB0YWdzOiBbJ0EnXVxuICAgIH0sXG4gICAgJ3VubGluayc6IHtcbiAgICAgIG5hbWU6ICdSZW1vdmUgTGluaycsXG4gICAgICBjb21tYW5kOiAndW5saW5rJyxcbiAgICAgIG5vQWN0aXZlOiB0cnVlXG4gICAgfVxuICB9XG59O1xudmFyIG5pY0xpbmtCdXR0b24gPSBuaWNFZGl0b3JBZHZhbmNlZEJ1dHRvbi5leHRlbmQoe1xuICBhZGRQYW5lOiBmdW5jdGlvbiBhZGRQYW5lKCkge1xuICAgIHRoaXMubG4gPSB0aGlzLm5lLnNlbGVjdGVkSW5zdGFuY2Uuc2VsRWxtKCkucGFyZW50VGFnKFwiQVwiKTtcbiAgICB0aGlzLmFkZEZvcm0oe1xuICAgICAgXCJcIjoge1xuICAgICAgICB0eXBlOiBcInRpdGxlXCIsXG4gICAgICAgIHR4dDogXCJBZGQvRWRpdCBMaW5rXCJcbiAgICAgIH0sXG4gICAgICBocmVmOiB7XG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICB0eHQ6IFwiVVJMXCIsXG4gICAgICAgIHZhbHVlOiBcImh0dHA6Ly9cIixcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICB3aWR0aDogXCIxNTBweFwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0aXRsZToge1xuICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgdHh0OiBcIlRpdGxlXCJcbiAgICAgIH0sXG4gICAgICB0YXJnZXQ6IHtcbiAgICAgICAgdHlwZTogXCJzZWxlY3RcIixcbiAgICAgICAgdHh0OiBcIk9wZW4gSW5cIixcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIFwiXCI6IFwiQ3VycmVudCBXaW5kb3dcIixcbiAgICAgICAgICBfYmxhbms6IFwiTmV3IFdpbmRvd1wiXG4gICAgICAgIH0sXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgd2lkdGg6IFwiMTAwcHhcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcy5sbik7XG4gIH0sXG4gIHN1Ym1pdDogZnVuY3Rpb24gc3VibWl0KEMpIHtcbiAgICB2YXIgQSA9IHRoaXMuaW5wdXRzLmhyZWYudmFsdWU7XG5cbiAgICBpZiAoQSA9PSBcImh0dHA6Ly9cIiB8fCBBID09IFwiXCIpIHtcbiAgICAgIGFsZXJ0KFwiWW91IG11c3QgZW50ZXIgYSBVUkwgdG8gQ3JlYXRlIGEgTGlua1wiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLnJlbW92ZVBhbmUoKTtcblxuICAgIGlmICghdGhpcy5sbikge1xuICAgICAgdmFyIEIgPSBcImphdmFzY3JpcHQ6bmljVGVtcCgpO1wiO1xuICAgICAgdGhpcy5uZS5uaWNDb21tYW5kKFwiY3JlYXRlbGlua1wiLCBCKTtcbiAgICAgIHRoaXMubG4gPSB0aGlzLmZpbmRFbG0oXCJBXCIsIFwiaHJlZlwiLCBCKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5sbikge1xuICAgICAgdGhpcy5sbi5zZXRBdHRyaWJ1dGVzKHtcbiAgICAgICAgaHJlZjogdGhpcy5pbnB1dHMuaHJlZi52YWx1ZSxcbiAgICAgICAgdGl0bGU6IHRoaXMuaW5wdXRzLnRpdGxlLnZhbHVlLFxuICAgICAgICB0YXJnZXQ6IHRoaXMuaW5wdXRzLnRhcmdldC5vcHRpb25zW3RoaXMuaW5wdXRzLnRhcmdldC5zZWxlY3RlZEluZGV4XS52YWx1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59KTtcbm5pY0VkaXRvcnMucmVnaXN0ZXJQbHVnaW4obmljUGx1Z2luLCBuaWNMaW5rT3B0aW9ucyk7XG52YXIgbmljQ29sb3JPcHRpb25zID0ge1xuICBidXR0b25zOiB7XG4gICAgJ2ZvcmVjb2xvcic6IHtcbiAgICAgIG5hbWU6IF9fKCdDaGFuZ2UgVGV4dCBDb2xvcicpLFxuICAgICAgdHlwZTogJ25pY0VkaXRvckNvbG9yQnV0dG9uJyxcbiAgICAgIG5vQ2xvc2U6IHRydWVcbiAgICB9LFxuICAgICdiZ2NvbG9yJzoge1xuICAgICAgbmFtZTogX18oJ0NoYW5nZSBCYWNrZ3JvdW5kIENvbG9yJyksXG4gICAgICB0eXBlOiAnbmljRWRpdG9yQmdDb2xvckJ1dHRvbicsXG4gICAgICBub0Nsb3NlOiB0cnVlXG4gICAgfVxuICB9XG59O1xudmFyIG5pY0VkaXRvckNvbG9yQnV0dG9uID0gbmljRWRpdG9yQWR2YW5jZWRCdXR0b24uZXh0ZW5kKHtcbiAgYWRkUGFuZTogZnVuY3Rpb24gYWRkUGFuZSgpIHtcbiAgICB2YXIgRCA9IHtcbiAgICAgIDA6IFwiMDBcIixcbiAgICAgIDE6IFwiMzNcIixcbiAgICAgIDI6IFwiNjZcIixcbiAgICAgIDM6IFwiOTlcIixcbiAgICAgIDQ6IFwiQ0NcIixcbiAgICAgIDU6IFwiRkZcIlxuICAgIH07XG4gICAgdmFyIEggPSBuZXcgYmtFbGVtZW50KFwiRElWXCIpLnNldFN0eWxlKHtcbiAgICAgIHdpZHRoOiBcIjI3MHB4XCJcbiAgICB9KTtcblxuICAgIGZvciAodmFyIEEgaW4gRCkge1xuICAgICAgZm9yICh2YXIgRiBpbiBEKSB7XG4gICAgICAgIGZvciAodmFyIEUgaW4gRCkge1xuICAgICAgICAgIHZhciBJID0gXCIjXCIgKyBEW0FdICsgRFtFXSArIERbRl07XG4gICAgICAgICAgdmFyIEMgPSBuZXcgYmtFbGVtZW50KFwiRElWXCIpLnNldFN0eWxlKHtcbiAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICBoZWlnaHQ6IFwiMTVweFwiLFxuICAgICAgICAgICAgXCJmbG9hdFwiOiBcImxlZnRcIlxuICAgICAgICAgIH0pLmFwcGVuZFRvKEgpO1xuICAgICAgICAgIHZhciBHID0gbmV3IGJrRWxlbWVudChcIkRJVlwiKS5zZXRTdHlsZSh7XG4gICAgICAgICAgICBib3JkZXI6IFwiMnB4IHNvbGlkIFwiICsgSVxuICAgICAgICAgIH0pLmFwcGVuZFRvKEMpO1xuICAgICAgICAgIHZhciBCID0gbmV3IGJrRWxlbWVudChcIkRJVlwiKS5zZXRTdHlsZSh7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IEksXG4gICAgICAgICAgICBvdmVyZmxvdzogXCJoaWRkZW5cIixcbiAgICAgICAgICAgIHdpZHRoOiBcIjExcHhcIixcbiAgICAgICAgICAgIGhlaWdodDogXCIxMXB4XCJcbiAgICAgICAgICB9KS5hZGRFdmVudChcImNsaWNrXCIsIHRoaXMuY29sb3JTZWxlY3QuY2xvc3VyZSh0aGlzLCBJKSkuYWRkRXZlbnQoXCJtb3VzZW92ZXJcIiwgdGhpcy5vbi5jbG9zdXJlKHRoaXMsIEcpKS5hZGRFdmVudChcIm1vdXNlb3V0XCIsIHRoaXMub2ZmLmNsb3N1cmUodGhpcywgRywgSSkpLmFwcGVuZFRvKEcpO1xuXG4gICAgICAgICAgaWYgKCF3aW5kb3cub3BlcmEpIHtcbiAgICAgICAgICAgIEMub25tb3VzZWRvd24gPSBCLm9ubW91c2Vkb3duID0gYmtMaWIuY2FuY2VsRXZlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wYW5lLmFwcGVuZChILm5vU2VsZWN0KCkpO1xuICB9LFxuICBjb2xvclNlbGVjdDogZnVuY3Rpb24gY29sb3JTZWxlY3QoQSkge1xuICAgIHRoaXMubmUubmljQ29tbWFuZChcImZvcmVDb2xvclwiLCBBKTtcbiAgICB0aGlzLnJlbW92ZVBhbmUoKTtcbiAgfSxcbiAgb246IGZ1bmN0aW9uIG9uKEEpIHtcbiAgICBBLnNldFN0eWxlKHtcbiAgICAgIGJvcmRlcjogXCIycHggc29saWQgIzAwMFwiXG4gICAgfSk7XG4gIH0sXG4gIG9mZjogZnVuY3Rpb24gb2ZmKEEsIEIpIHtcbiAgICBBLnNldFN0eWxlKHtcbiAgICAgIGJvcmRlcjogXCIycHggc29saWQgXCIgKyBCXG4gICAgfSk7XG4gIH1cbn0pO1xudmFyIG5pY0VkaXRvckJnQ29sb3JCdXR0b24gPSBuaWNFZGl0b3JDb2xvckJ1dHRvbi5leHRlbmQoe1xuICBjb2xvclNlbGVjdDogZnVuY3Rpb24gY29sb3JTZWxlY3QoQSkge1xuICAgIHRoaXMubmUubmljQ29tbWFuZChcImhpbGl0ZUNvbG9yXCIsIEEpO1xuICAgIHRoaXMucmVtb3ZlUGFuZSgpO1xuICB9XG59KTtcbm5pY0VkaXRvcnMucmVnaXN0ZXJQbHVnaW4obmljUGx1Z2luLCBuaWNDb2xvck9wdGlvbnMpO1xudmFyIG5pY0ltYWdlT3B0aW9ucyA9IHtcbiAgYnV0dG9uczoge1xuICAgICdpbWFnZSc6IHtcbiAgICAgIG5hbWU6ICdBZGQgSW1hZ2UnLFxuICAgICAgdHlwZTogJ25pY0ltYWdlQnV0dG9uJyxcbiAgICAgIHRhZ3M6IFsnSU1HJ11cbiAgICB9XG4gIH1cbn07XG52YXIgbmljSW1hZ2VCdXR0b24gPSBuaWNFZGl0b3JBZHZhbmNlZEJ1dHRvbi5leHRlbmQoe1xuICBhZGRQYW5lOiBmdW5jdGlvbiBhZGRQYW5lKCkge1xuICAgIHRoaXMuaW0gPSB0aGlzLm5lLnNlbGVjdGVkSW5zdGFuY2Uuc2VsRWxtKCkucGFyZW50VGFnKFwiSU1HXCIpO1xuICAgIHRoaXMuYWRkRm9ybSh7XG4gICAgICBcIlwiOiB7XG4gICAgICAgIHR5cGU6IFwidGl0bGVcIixcbiAgICAgICAgdHh0OiBcIkFkZC9FZGl0IEltYWdlXCJcbiAgICAgIH0sXG4gICAgICBzcmM6IHtcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgIHR4dDogXCJVUkxcIixcbiAgICAgICAgdmFsdWU6IFwiaHR0cDovL1wiLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIHdpZHRoOiBcIjE1MHB4XCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGFsdDoge1xuICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgdHh0OiBcIkFsdCBUZXh0XCIsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgd2lkdGg6IFwiMTAwcHhcIlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYWxpZ246IHtcbiAgICAgICAgdHlwZTogXCJzZWxlY3RcIixcbiAgICAgICAgdHh0OiBcIkFsaWduXCIsXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICBub25lOiBcIkRlZmF1bHRcIixcbiAgICAgICAgICBsZWZ0OiBcIkxlZnRcIixcbiAgICAgICAgICByaWdodDogXCJSaWdodFwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzLmltKTtcbiAgfSxcbiAgc3VibWl0OiBmdW5jdGlvbiBzdWJtaXQoQikge1xuICAgIHZhciBDID0gdGhpcy5pbnB1dHMuc3JjLnZhbHVlO1xuXG4gICAgaWYgKEMgPT0gXCJcIiB8fCBDID09IFwiaHR0cDovL1wiKSB7XG4gICAgICBhbGVydChcIllvdSBtdXN0IGVudGVyIGEgSW1hZ2UgVVJMIHRvIGluc2VydFwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLnJlbW92ZVBhbmUoKTtcblxuICAgIGlmICghdGhpcy5pbSkge1xuICAgICAgdmFyIEEgPSBcImphdmFzY3JpcHQ6bmljSW1UZW1wKCk7XCI7XG4gICAgICB0aGlzLm5lLm5pY0NvbW1hbmQoXCJpbnNlcnRJbWFnZVwiLCBBKTtcbiAgICAgIHRoaXMuaW0gPSB0aGlzLmZpbmRFbG0oXCJJTUdcIiwgXCJzcmNcIiwgQSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW0pIHtcbiAgICAgIHRoaXMuaW0uc2V0QXR0cmlidXRlcyh7XG4gICAgICAgIHNyYzogdGhpcy5pbnB1dHMuc3JjLnZhbHVlLFxuICAgICAgICBhbHQ6IHRoaXMuaW5wdXRzLmFsdC52YWx1ZSxcbiAgICAgICAgYWxpZ246IHRoaXMuaW5wdXRzLmFsaWduLnZhbHVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pO1xubmljRWRpdG9ycy5yZWdpc3RlclBsdWdpbihuaWNQbHVnaW4sIG5pY0ltYWdlT3B0aW9ucyk7XG52YXIgbmljU2F2ZU9wdGlvbnMgPSB7XG4gIGJ1dHRvbnM6IHtcbiAgICAnc2F2ZSc6IHtcbiAgICAgIG5hbWU6IF9fKCdTYXZlIHRoaXMgY29udGVudCcpLFxuICAgICAgdHlwZTogJ25pY0VkaXRvclNhdmVCdXR0b24nXG4gICAgfVxuICB9XG59O1xudmFyIG5pY0VkaXRvclNhdmVCdXR0b24gPSBuaWNFZGl0b3JCdXR0b24uZXh0ZW5kKHtcbiAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBpZiAoIXRoaXMubmUub3B0aW9ucy5vblNhdmUpIHtcbiAgICAgIHRoaXMubWFyZ2luLnNldFN0eWxlKHtcbiAgICAgICAgZGlzcGxheTogXCJub25lXCJcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgbW91c2VDbGljazogZnVuY3Rpb24gbW91c2VDbGljaygpIHtcbiAgICB2YXIgQiA9IHRoaXMubmUub3B0aW9ucy5vblNhdmU7XG4gICAgdmFyIEEgPSB0aGlzLm5lLnNlbGVjdGVkSW5zdGFuY2U7XG4gICAgQihBLmdldENvbnRlbnQoKSwgQS5lbG0uaWQsIEEpO1xuICB9XG59KTtcbm5pY0VkaXRvcnMucmVnaXN0ZXJQbHVnaW4obmljUGx1Z2luLCBuaWNTYXZlT3B0aW9ucyk7XG52YXIgbmljWEhUTUwgPSBia0NsYXNzLmV4dGVuZCh7XG4gIHN0cmlwQXR0cmlidXRlczogW1wiX21vel9kaXJ0eVwiLCBcIl9tb3pfcmVzaXppbmdcIiwgXCJfZXh0ZW5kZWRcIl0sXG4gIG5vU2hvcnQ6IFtcInN0eWxlXCIsIFwidGl0bGVcIiwgXCJzY3JpcHRcIiwgXCJ0ZXh0YXJlYVwiLCBcImFcIl0sXG4gIGNzc1JlcGxhY2U6IHtcbiAgICBcImZvbnQtd2VpZ2h0OmJvbGQ7XCI6IFwic3Ryb25nXCIsXG4gICAgXCJmb250LXN0eWxlOml0YWxpYztcIjogXCJlbVwiXG4gIH0sXG4gIHNpemVzOiB7XG4gICAgMTogXCJ4eC1zbWFsbFwiLFxuICAgIDI6IFwieC1zbWFsbFwiLFxuICAgIDM6IFwic21hbGxcIixcbiAgICA0OiBcIm1lZGl1bVwiLFxuICAgIDU6IFwibGFyZ2VcIixcbiAgICA2OiBcIngtbGFyZ2VcIlxuICB9LFxuICBjb25zdHJ1Y3Q6IGZ1bmN0aW9uIGNvbnN0cnVjdChBKSB7XG4gICAgdGhpcy5uZSA9IEE7XG5cbiAgICBpZiAodGhpcy5uZS5vcHRpb25zLnhodG1sKSB7XG4gICAgICBBLmFkZEV2ZW50KFwiZ2V0XCIsIHRoaXMuY2xlYW51cC5jbG9zdXJlKHRoaXMpKTtcbiAgICB9XG4gIH0sXG4gIGNsZWFudXA6IGZ1bmN0aW9uIGNsZWFudXAoQSkge1xuICAgIHZhciBCID0gQS5nZXRFbG0oKTtcbiAgICB2YXIgQyA9IHRoaXMudG9YSFRNTChCKTtcbiAgICBBLmNvbnRlbnQgPSBDO1xuICB9LFxuICB0b1hIVE1MOiBmdW5jdGlvbiB0b1hIVE1MKEMsIEEsIEwpIHtcbiAgICB2YXIgRyA9IFwiXCI7XG4gICAgdmFyIE8gPSBcIlwiO1xuICAgIHZhciBQID0gXCJcIjtcbiAgICB2YXIgSSA9IEMubm9kZVR5cGU7XG4gICAgdmFyIFEgPSBDLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFyIE4gPSBDLmhhc0NoaWxkTm9kZXMgJiYgQy5oYXNDaGlsZE5vZGVzKCk7XG4gICAgdmFyIEIgPSBuZXcgQXJyYXkoKTtcblxuICAgIHN3aXRjaCAoSSkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICB2YXIgSCA9IEMuYXR0cmlidXRlcztcblxuICAgICAgICBzd2l0Y2ggKFEpIHtcbiAgICAgICAgICBjYXNlIFwiYlwiOlxuICAgICAgICAgICAgUSA9IFwic3Ryb25nXCI7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgXCJpXCI6XG4gICAgICAgICAgICBRID0gXCJlbVwiO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIFwiZm9udFwiOlxuICAgICAgICAgICAgUSA9IFwic3BhblwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQSkge1xuICAgICAgICAgIGZvciAodmFyIEYgPSAwOyBGIDwgSC5sZW5ndGg7IEYrKykge1xuICAgICAgICAgICAgdmFyIEsgPSBIW0ZdO1xuICAgICAgICAgICAgdmFyIE0gPSBLLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB2YXIgRCA9IEsubm9kZVZhbHVlO1xuXG4gICAgICAgICAgICBpZiAoIUsuc3BlY2lmaWVkIHx8ICFEIHx8IGJrTGliLmluQXJyYXkodGhpcy5zdHJpcEF0dHJpYnV0ZXMsIE0pIHx8IHR5cGVvZiBEID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3dpdGNoIChNKSB7XG4gICAgICAgICAgICAgIGNhc2UgXCJzdHlsZVwiOlxuICAgICAgICAgICAgICAgIHZhciBKID0gRC5yZXBsYWNlKC8gL2csIFwiXCIpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChpdG0gaW4gdGhpcy5jc3NSZXBsYWNlKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoSi5pbmRleE9mKGl0bSkgIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgQi5wdXNoKHRoaXMuY3NzUmVwbGFjZVtpdG1dKTtcbiAgICAgICAgICAgICAgICAgICAgSiA9IEoucmVwbGFjZShpdG0sIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIFAgKz0gSjtcbiAgICAgICAgICAgICAgICBEID0gXCJcIjtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICBjYXNlIFwiY2xhc3NcIjpcbiAgICAgICAgICAgICAgICBEID0gRC5yZXBsYWNlKFwiQXBwbGUtc3R5bGUtc3BhblwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICBjYXNlIFwic2l6ZVwiOlxuICAgICAgICAgICAgICAgIFAgKz0gXCJmb250LXNpemU6XCIgKyB0aGlzLnNpemVzW0RdICsgXCI7XCI7XG4gICAgICAgICAgICAgICAgRCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChEKSB7XG4gICAgICAgICAgICAgIE8gKz0gXCIgXCIgKyBNICsgJz1cIicgKyBEICsgJ1wiJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoUCkge1xuICAgICAgICAgICAgTyArPSAnIHN0eWxlPVwiJyArIFAgKyAnXCInO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAodmFyIEYgPSAwOyBGIDwgQi5sZW5ndGg7IEYrKykge1xuICAgICAgICAgICAgRyArPSBcIjxcIiArIEJbRl0gKyBcIj5cIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoTyA9PSBcIlwiICYmIFEgPT0gXCJzcGFuXCIpIHtcbiAgICAgICAgICAgIEEgPSBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoQSkge1xuICAgICAgICAgICAgRyArPSBcIjxcIiArIFE7XG5cbiAgICAgICAgICAgIGlmIChRICE9IFwiYnJcIikge1xuICAgICAgICAgICAgICBHICs9IE87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFOICYmICFia0xpYi5pbkFycmF5KHRoaXMubm9TaG9ydCwgTSkpIHtcbiAgICAgICAgICBpZiAoQSkge1xuICAgICAgICAgICAgRyArPSBcIiAvPlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoQSkge1xuICAgICAgICAgICAgRyArPSBcIj5cIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKHZhciBGID0gMDsgRiA8IEMuY2hpbGROb2Rlcy5sZW5ndGg7IEYrKykge1xuICAgICAgICAgICAgdmFyIEUgPSB0aGlzLnRvWEhUTUwoQy5jaGlsZE5vZGVzW0ZdLCB0cnVlLCB0cnVlKTtcblxuICAgICAgICAgICAgaWYgKEUpIHtcbiAgICAgICAgICAgICAgRyArPSBFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBICYmIE4pIHtcbiAgICAgICAgICBHICs9IFwiPC9cIiArIFEgKyBcIj5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIEYgPSAwOyBGIDwgQi5sZW5ndGg7IEYrKykge1xuICAgICAgICAgIEcgKz0gXCI8L1wiICsgQltGXSArIFwiPlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgRyArPSBDLm5vZGVWYWx1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIEc7XG4gIH1cbn0pO1xubmljRWRpdG9ycy5yZWdpc3RlclBsdWdpbihuaWNYSFRNTCk7XG52YXIgbmljQ29kZU9wdGlvbnMgPSB7XG4gIGJ1dHRvbnM6IHtcbiAgICAneGh0bWwnOiB7XG4gICAgICBuYW1lOiAnRWRpdCBIVE1MJyxcbiAgICAgIHR5cGU6ICduaWNDb2RlQnV0dG9uJ1xuICAgIH1cbiAgfVxufTtcbnZhciBuaWNDb2RlQnV0dG9uID0gbmljRWRpdG9yQWR2YW5jZWRCdXR0b24uZXh0ZW5kKHtcbiAgd2lkdGg6IFwiMzUwcHhcIixcbiAgYWRkUGFuZTogZnVuY3Rpb24gYWRkUGFuZSgpIHtcbiAgICB0aGlzLmFkZEZvcm0oe1xuICAgICAgXCJcIjoge1xuICAgICAgICB0eXBlOiBcInRpdGxlXCIsXG4gICAgICAgIHR4dDogXCJFZGl0IEhUTUxcIlxuICAgICAgfSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgdHlwZTogXCJjb250ZW50XCIsXG4gICAgICAgIHZhbHVlOiB0aGlzLm5lLnNlbGVjdGVkSW5zdGFuY2UuZ2V0Q29udGVudCgpLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIHdpZHRoOiBcIjM0MHB4XCIsXG4gICAgICAgICAgaGVpZ2h0OiBcIjIwMHB4XCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBzdWJtaXQ6IGZ1bmN0aW9uIHN1Ym1pdChCKSB7XG4gICAgdmFyIEEgPSB0aGlzLmlucHV0cy5jb2RlLnZhbHVlO1xuICAgIHRoaXMubmUuc2VsZWN0ZWRJbnN0YW5jZS5zZXRDb250ZW50KEEpO1xuICAgIHRoaXMucmVtb3ZlUGFuZSgpO1xuICB9XG59KTtcbm5pY0VkaXRvcnMucmVnaXN0ZXJQbHVnaW4obmljUGx1Z2luLCBuaWNDb2RlT3B0aW9ucyk7XG52YXIgbmljQkJDb2RlID0gYmtDbGFzcy5leHRlbmQoe1xuICBjb25zdHJ1Y3Q6IGZ1bmN0aW9uIGNvbnN0cnVjdChBKSB7XG4gICAgdGhpcy5uZSA9IEE7XG5cbiAgICBpZiAodGhpcy5uZS5vcHRpb25zLmJiQ29kZSkge1xuICAgICAgQS5hZGRFdmVudChcImdldFwiLCB0aGlzLmJiR2V0LmNsb3N1cmUodGhpcykpO1xuICAgICAgQS5hZGRFdmVudChcInNldFwiLCB0aGlzLmJiU2V0LmNsb3N1cmUodGhpcykpO1xuICAgICAgdmFyIEIgPSB0aGlzLm5lLmxvYWRlZFBsdWdpbnM7XG5cbiAgICAgIGZvciAoaXRtIGluIEIpIHtcbiAgICAgICAgaWYgKEJbaXRtXS50b1hIVE1MKSB7XG4gICAgICAgICAgdGhpcy54aHRtbCA9IEJbaXRtXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgYmJHZXQ6IGZ1bmN0aW9uIGJiR2V0KEEpIHtcbiAgICB2YXIgQiA9IHRoaXMueGh0bWwudG9YSFRNTChBLmdldEVsbSgpKTtcbiAgICBBLmNvbnRlbnQgPSB0aGlzLnRvQkJDb2RlKEIpO1xuICB9LFxuICBiYlNldDogZnVuY3Rpb24gYmJTZXQoQSkge1xuICAgIEEuY29udGVudCA9IHRoaXMuZnJvbUJCQ29kZShBLmNvbnRlbnQpO1xuICB9LFxuICB0b0JCQ29kZTogZnVuY3Rpb24gdG9CQkNvZGUoQikge1xuICAgIGZ1bmN0aW9uIEEoRCwgQykge1xuICAgICAgQiA9IEIucmVwbGFjZShELCBDKTtcbiAgICB9XG5cbiAgICBBKC9cXG4vZ2ksIFwiXCIpO1xuICAgIEEoLzxzdHJvbmc+KC4qPyk8XFwvc3Ryb25nPi9naSwgXCJbYl0kMVsvYl1cIik7XG4gICAgQSgvPGVtPiguKj8pPFxcL2VtPi9naSwgXCJbaV0kMVsvaV1cIik7XG4gICAgQSgvPHNwYW4uKj9zdHlsZT1cInRleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmU7XCI+KC4qPyk8XFwvc3Bhbj4vZ2ksIFwiW3VdJDFbL3VdXCIpO1xuICAgIEEoLzx1bD4oLio/KTxcXC91bD4vZ2ksIFwiW2xpc3RdJDFbL2xpc3RdXCIpO1xuICAgIEEoLzxsaT4oLio/KTxcXC9saT4vZ2ksIFwiWypdJDFbXVwiKTtcbiAgICBBKC88b2w+KC4qPyk8XFwvb2w+L2dpLCBcIltsaXN0PTFdJDFbL2xpc3RdXCIpO1xuICAgIEEoLzxpbWcuKj9zcmM9XCIoLio/KVwiLio/Pi9naSwgXCJbaW1nXSQxWy9pbWddXCIpO1xuICAgIEEoLzxhLio/aHJlZj1cIiguKj8pXCIuKj8+KC4qPyk8XFwvYT4vZ2ksIFwiW3VybD0kMV0kMlsvdXJsXVwiKTtcbiAgICBBKC88YnIuKj8+L2dpLCBcIlxcblwiKTtcbiAgICBBKC88Lio/Pi4qPzxcXC8uKj8+L2dpLCBcIlwiKTtcbiAgICByZXR1cm4gQjtcbiAgfSxcbiAgZnJvbUJCQ29kZTogZnVuY3Rpb24gZnJvbUJCQ29kZShBKSB7XG4gICAgZnVuY3Rpb24gQihELCBDKSB7XG4gICAgICBBID0gQS5yZXBsYWNlKEQsIEMpO1xuICAgIH1cblxuICAgIEIoL1xcW2JcXF0oLio/KVxcW1xcL2JcXF0vZ2ksIFwiPHN0cm9uZz4kMTwvc3Ryb25nPlwiKTtcbiAgICBCKC9cXFtpXFxdKC4qPylcXFtcXC9pXFxdL2dpLCBcIjxlbT4kMTwvZW0+XCIpO1xuICAgIEIoL1xcW3VcXF0oLio/KVxcW1xcL3VcXF0vZ2ksICc8c3BhbiBzdHlsZT1cInRleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmU7XCI+JDE8L3NwYW4+Jyk7XG4gICAgQigvXFxbbGlzdFxcXSguKj8pXFxbXFwvbGlzdFxcXS9naSwgXCI8dWw+JDE8L3VsPlwiKTtcbiAgICBCKC9cXFtsaXN0PTFcXF0oLio/KVxcW1xcL2xpc3RcXF0vZ2ksIFwiPG9sPiQxPC9vbD5cIik7XG4gICAgQigvXFxbXFwqXFxdKC4qPylcXFtcXC9cXCpcXF0vZ2ksIFwiPGxpPiQxPC9saT5cIik7XG4gICAgQigvXFxbaW1nXFxdKC4qPylcXFtcXC9pbWdcXF0vZ2ksICc8aW1nIHNyYz1cIiQxXCIgLz4nKTtcbiAgICBCKC9cXFt1cmw9KC4qPylcXF0oLio/KVxcW1xcL3VybFxcXS9naSwgJzxhIGhyZWY9XCIkMVwiPiQyPC9hPicpO1xuICAgIEIoL1xcbi9naSwgXCI8YnIgLz5cIik7XG4gICAgcmV0dXJuIEE7XG4gIH1cbn0pO1xubmljRWRpdG9ycy5yZWdpc3RlclBsdWdpbihuaWNCQkNvZGUpO1xudmFyIG5pY1VwbG9hZE9wdGlvbnMgPSB7XG4gIGJ1dHRvbnM6IHtcbiAgICAndXBsb2FkJzoge1xuICAgICAgbmFtZTogJ1VwbG9hZCBJbWFnZScsXG4gICAgICB0eXBlOiAnbmljVXBsb2FkQnV0dG9uJ1xuICAgIH1cbiAgfVxufTtcbnZhciBuaWNVcGxvYWRCdXR0b24gPSBuaWNFZGl0b3JBZHZhbmNlZEJ1dHRvbi5leHRlbmQoe1xuICBuaWNVUkk6IFwiaHR0cHM6Ly9hcGkuaW1ndXIuY29tLzMvaW1hZ2VcIixcbiAgZXJyb3JUZXh0OiBcIkZhaWxlZCB0byB1cGxvYWQgaW1hZ2VcIixcbiAgYWRkUGFuZTogZnVuY3Rpb24gYWRkUGFuZSgpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5Gb3JtRGF0YSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuIHRoaXMub25FcnJvcihcIkltYWdlIHVwbG9hZHMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyLCB1c2UgQ2hyb21lLCBGaXJlZm94LCBvciBTYWZhcmkgaW5zdGVhZC5cIik7XG4gICAgfVxuXG4gICAgdGhpcy5pbSA9IHRoaXMubmUuc2VsZWN0ZWRJbnN0YW5jZS5zZWxFbG0oKS5wYXJlbnRUYWcoXCJJTUdcIik7XG4gICAgdmFyIEEgPSBuZXcgYmtFbGVtZW50KFwiZGl2XCIpLnNldFN0eWxlKHtcbiAgICAgIHBhZGRpbmc6IFwiMTBweFwiXG4gICAgfSkuYXBwZW5kVG8odGhpcy5wYW5lLnBhbmUpO1xuICAgIG5ldyBia0VsZW1lbnQoXCJkaXZcIikuc2V0U3R5bGUoe1xuICAgICAgZm9udFNpemU6IFwiMTRweFwiLFxuICAgICAgZm9udFdlaWdodDogXCJib2xkXCIsXG4gICAgICBwYWRkaW5nQm90dG9tOiBcIjVweFwiXG4gICAgfSkuc2V0Q29udGVudChcIkluc2VydCBhbiBJbWFnZVwiKS5hcHBlbmRUbyhBKTtcbiAgICB0aGlzLmZpbGVJbnB1dCA9IG5ldyBia0VsZW1lbnQoXCJpbnB1dFwiKS5zZXRBdHRyaWJ1dGVzKHtcbiAgICAgIHR5cGU6IFwiZmlsZVwiXG4gICAgfSkuYXBwZW5kVG8oQSk7XG4gICAgdGhpcy5wcm9ncmVzcyA9IG5ldyBia0VsZW1lbnQoXCJwcm9ncmVzc1wiKS5zZXRTdHlsZSh7XG4gICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICBkaXNwbGF5OiBcIm5vbmVcIlxuICAgIH0pLnNldEF0dHJpYnV0ZXMoXCJtYXhcIiwgMTAwKS5hcHBlbmRUbyhBKTtcbiAgICB0aGlzLmZpbGVJbnB1dC5vbmNoYW5nZSA9IHRoaXMudXBsb2FkRmlsZS5jbG9zdXJlKHRoaXMpO1xuICB9LFxuICBvbkVycm9yOiBmdW5jdGlvbiBvbkVycm9yKEEpIHtcbiAgICB0aGlzLnJlbW92ZVBhbmUoKTtcbiAgICBhbGVydChBIHx8IFwiRmFpbGVkIHRvIHVwbG9hZCBpbWFnZVwiKTtcbiAgfSxcbiAgdXBsb2FkRmlsZTogZnVuY3Rpb24gdXBsb2FkRmlsZSgpIHtcbiAgICB2YXIgQiA9IHRoaXMuZmlsZUlucHV0LmZpbGVzWzBdO1xuXG4gICAgaWYgKCFCIHx8ICFCLnR5cGUubWF0Y2goL2ltYWdlLiovKSkge1xuICAgICAgdGhpcy5vbkVycm9yKFwiT25seSBpbWFnZSBmaWxlcyBjYW4gYmUgdXBsb2FkZWRcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5maWxlSW5wdXQuc2V0U3R5bGUoe1xuICAgICAgZGlzcGxheTogXCJub25lXCJcbiAgICB9KTtcbiAgICB0aGlzLnNldFByb2dyZXNzKDApO1xuICAgIHZhciBBID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgQS5hcHBlbmQoXCJpbWFnZVwiLCBCKTtcbiAgICB2YXIgQyA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIEMub3BlbihcIlBPU1RcIiwgdGhpcy5uZS5vcHRpb25zLnVwbG9hZFVSSSB8fCB0aGlzLm5pY1VSSSk7XG5cbiAgICBDLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBEID0gSlNPTi5wYXJzZShDLnJlc3BvbnNlVGV4dCkuZGF0YTtcbiAgICAgIH0gY2F0Y2ggKEUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25FcnJvcigpO1xuICAgICAgfVxuXG4gICAgICBpZiAoRC5lcnJvcikge1xuICAgICAgICByZXR1cm4gdGhpcy5vbkVycm9yKEQuZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm9uVXBsb2FkZWQoRCk7XG4gICAgfS5jbG9zdXJlKHRoaXMpO1xuXG4gICAgQy5vbmVycm9yID0gdGhpcy5vbkVycm9yLmNsb3N1cmUodGhpcyk7XG5cbiAgICBDLnVwbG9hZC5vbnByb2dyZXNzID0gZnVuY3Rpb24gKEQpIHtcbiAgICAgIHRoaXMuc2V0UHJvZ3Jlc3MoRC5sb2FkZWQgLyBELnRvdGFsKTtcbiAgICB9LmNsb3N1cmUodGhpcyk7XG5cbiAgICBDLnNldFJlcXVlc3RIZWFkZXIoXCJBdXRob3JpemF0aW9uXCIsIFwiQ2xpZW50LUlEIGMzN2ZjMDUxOTlhMDViN1wiKTtcbiAgICBDLnNlbmQoQSk7XG4gIH0sXG4gIHNldFByb2dyZXNzOiBmdW5jdGlvbiBzZXRQcm9ncmVzcyhBKSB7XG4gICAgdGhpcy5wcm9ncmVzcy5zZXRTdHlsZSh7XG4gICAgICBkaXNwbGF5OiBcImJsb2NrXCJcbiAgICB9KTtcblxuICAgIGlmIChBIDwgMC45OCkge1xuICAgICAgdGhpcy5wcm9ncmVzcy52YWx1ZSA9IEE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvZ3Jlc3MucmVtb3ZlQXR0cmlidXRlKFwidmFsdWVcIik7XG4gICAgfVxuICB9LFxuICBvblVwbG9hZGVkOiBmdW5jdGlvbiBvblVwbG9hZGVkKEIpIHtcbiAgICB0aGlzLnJlbW92ZVBhbmUoKTtcbiAgICB2YXIgRCA9IEIubGluaztcblxuICAgIGlmICghdGhpcy5pbSkge1xuICAgICAgdGhpcy5uZS5zZWxlY3RlZEluc3RhbmNlLnJlc3RvcmVSbmcoKTtcbiAgICAgIHZhciBDID0gXCJqYXZhc2NyaXB0Om5pY0ltVGVtcCgpO1wiO1xuICAgICAgdGhpcy5uZS5uaWNDb21tYW5kKFwiaW5zZXJ0SW1hZ2VcIiwgRCk7XG4gICAgICB0aGlzLmltID0gdGhpcy5maW5kRWxtKFwiSU1HXCIsIFwic3JjXCIsIEQpO1xuICAgIH1cblxuICAgIHZhciBBID0gcGFyc2VJbnQodGhpcy5uZS5zZWxlY3RlZEluc3RhbmNlLmVsbS5nZXRTdHlsZShcIndpZHRoXCIpKTtcblxuICAgIGlmICh0aGlzLmltKSB7XG4gICAgICB0aGlzLmltLnNldEF0dHJpYnV0ZXMoe1xuICAgICAgICBzcmM6IEQsXG4gICAgICAgIHdpZHRoOiBBICYmIEIud2lkdGggPyBNYXRoLm1pbihBLCBCLndpZHRoKSA6IFwiXCJcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG5uaWNFZGl0b3JzLnJlZ2lzdGVyUGx1Z2luKG5pY1BsdWdpbiwgbmljVXBsb2FkT3B0aW9ucyk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxyXG4gKiBTd2l0Y2ggc2hvdyBwYXNzd29yZFxyXG4gKi9cbmZ1bmN0aW9uIHNob3dQYXNzd29yZChleWUsIGlkKSB7XG4gIHZhciB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXG4gIGlmICh4LnR5cGUgPT09IFwicGFzc3dvcmRcIikge1xuICAgIHgudHlwZSA9IFwidGV4dFwiO1xuICAgICQoZXllKS5hZGRDbGFzcygnZmEtZXllLXNsYXNoJykucmVtb3ZlQ2xhc3MoJ2ZhLWV5ZScpO1xuICB9IGVsc2Uge1xuICAgIHgudHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICAkKGV5ZSkuYWRkQ2xhc3MoJ2ZhLWV5ZScpLnJlbW92ZUNsYXNzKCdmYS1leWUtc2xhc2gnKTtcbiAgfVxufVxuLyoqXHJcbiAqIFJlYWQgTW9yZVxyXG4gKi9cblxuXG5mdW5jdGlvbiByZWFkTW9yZShpZCkge1xuICAkKCcjanMtc2hvdy0nICsgaWQpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJyNqcy1tb3JlLScgKyBpZCkucmVtb3ZlQ2xhc3MoJ2Qtbm9uZSAnKTtcbn1cbi8qKlxyXG4qIFJlYWQgTGVzc1xyXG4qL1xuXG5cbmZ1bmN0aW9uIHJlYWRMZXNzKGlkKSB7XG4gICQoJyNqcy1tb3JlLScgKyBpZCkuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAkKCcjanMtc2hvdy0nICsgaWQpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xufVxuLyoqXHJcbiAqIE1vZGFsIFNob3dcclxuICovXG5cblxuZnVuY3Rpb24gc2hvd0RvY3Rvck1vZGFsKGNvbXBsZXRlbmFtZSwgdXNlcm5hbWUsIHVzZXJlbWFpbCkge1xuICAvL2lucHV0IGNvbXBsZXRlbmFtZVxuICAkKCcjYWNmLWZpZWxkXzVkNjQ1ZGRjMGFiMmMtZ3JvdXBfcmlwMjMyMjMyMicpLnZhbChjb21wbGV0ZW5hbWUpOyAvL2lucHV0IHVzZXJuYW1lXG5cbiAgJCgnI2FjZi1maWVsZF81ZDY0NWRkYzBhYjJjLWdyb3VwX3JpcDUyMjMyMicpLnZhbCh1c2VybmFtZSk7IC8vaW5wdXQgdXNlcmVtYWlsXG5cbiAgJCgnI2FjZi1maWVsZF81ZDY0NWRkYzBhYjJjLWdyb3VwX3JpcDU0MzIyJykudmFsKHVzZXJlbWFpbCk7XG4gICQoJyNqcy1pbnNlcnQtcmV2aWV3LW1vZGFsJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xuICAkKCcjYWNmLWZvcm0tZGF0YScpLmFkZENsYXNzKCdhY2YtaGlkZGVuJyk7XG4gICQoJy5tb2RhbC1oZWFkZXInKS5jc3Moe1xuICAgICd2aXNpYmlsaXR5JzogJ3Zpc2libGUnXG4gIH0pO1xuICAkKCcjYWNmLWZpZWxkXzVkNjQ1ZGRjMGFiMmMtZ3JvdXBfcm9wNTQzMTItWWVzJykuYXR0cignY2hlY2tlZCcsICdjaGVja2VkJyk7XG59XG5cbmZ1bmN0aW9uIHNob3dBcHBSZXZpZXdzTW9kYWwoY29tcGxldGVuYW1lLCB1c2VybmFtZSwgdXNlcmVtYWlsLCBhcHAsIGFwcF9saW5rKSB7XG4gIC8vaW5wdXQgY29tcGxldGVuYW1lXG4gICQoJyNhY2YtZmllbGRfNWQ2NDVkZGMwYWIyYy1ncm91cF9yaXAyMzIyMzIyJykudmFsKGNvbXBsZXRlbmFtZSk7IC8vaW5wdXQgdXNlcm5hbWVcblxuICAkKCcjYWNmLWZpZWxkXzVkNjQ1ZGRjMGFiMmMtZ3JvdXBfcmlwNTIyMzIyJykudmFsKHVzZXJuYW1lKTsgLy9pbnB1dCB1c2VyZW1haWxcblxuICAkKCcjYWNmLWZpZWxkXzVkNjQ1ZGRjMGFiMmMtZ3JvdXBfcmlwNTQzMjInKS52YWwodXNlcmVtYWlsKTsgLy9hZGQgb3B0aW9uIHRvIHNlbGVjdFxuICAvLyQoICcjYWNmLWZpZWxkXzVkNjQ2MjllZGUyOTcnICkuYXBwZW5kKGA8b3B0aW9uIHZhbHVlPVwiJHthcHB9XCI+JHthcHB9PC9vcHRpb24+YCk7IFxuICAvL2F1dG8gc2VsZWN0IG9wdGlvblxuXG4gICQoJyNhY2YtZmllbGRfNWQ2NDYyOWVkZTI5NycpLnZhbChhcHApLmNoYW5nZSgpOyAvL3Nob3cgbW9kYWxcblxuICAkKCcjanMtaW5zZXJ0LXJldmlldy1tb2RhbCcpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcbiAgJCgnI2FjZi1mb3JtLWRhdGEnKS5yZW1vdmVDbGFzcygnYWNmLWhpZGRlbicpO1xuICAkKCcjanMtYXBwLXJldmlld3MtbW9kYWwtdGl0bGUnKS5yZW1vdmUoKTtcbiAgJCgnI2FjZi1mb3JtLWRhdGEnKS5hcHBlbmQoJzxkaXYgaWQ9XCJqcy1hcHAtcmV2aWV3cy1tb2RhbC10aXRsZVwiIGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93IGp1c3RpZnktY29udGVudC1iZXR3ZWVuXCI+PGgyPicgKyBhcHAgKyAnPC9oMj48YSBocmVmPVwiJyArIGFwcF9saW5rICsgJ1wiIHRhcmdldD1cIl9ibGFua1wiIGNsYXNzPVwidGV4dC1kYW5nZXIgbXQtMlwiPlZpZXcgQXBwPC9hPjwvZGl2PicpO1xuICAkKCcubW9kYWwtaGVhZGVyJykuY3NzKHtcbiAgICAndmlzaWJpbGl0eSc6ICdoaWRkZW4nXG4gIH0pO1xuICAkKCcjYWNmLWZpZWxkXzVkNjQ1ZGRjMGFiMmMtZ3JvdXBfcm9wNTQzMTItWWVzJykuYXR0cignY2hlY2tlZCcsICdjaGVja2VkJyk7XG59XG4vKipcclxuKiBNb2RhbCBIaWRlXHJcbiovXG5cblxuZnVuY3Rpb24gaGlkZU1vZGFsKCkge1xuICAkKCcjanMtaW5zZXJ0LXJldmlld3MtbW9kYWwnKS5hZGRDbGFzcygnZC1ub25lJyk7XG59XG4vKipcclxuICogTW9kYWwgTWFwIEhpZGVcclxuICovXG5cblxuZnVuY3Rpb24gaGlkZU1vZGFsTWFwKCkge1xuICAkKCcjYmlvLWNsaW5pYycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbn1cbi8qKlxyXG4gKiBTdGFycyBpbiBJbnB1dCB0eXBlIFJhbmdlXHJcbiAqL1xuXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgdmFyICRzMWlucHV0ID0gJCgnI2FjZi1maWVsZF81ZDY0NTMzZGMwYWIyYy1maWVsZF9hcHAyMmMwN2VhMjBjZjknKTtcbiAgJCgnLmFjZi1maWVsZC1hcHAyMmMwN2VhMjBjZjkgLmFjZi1yYW5nZS13cmFwJykuaGlkZSgpO1xuICAkKCcuYWNmLWZpZWxkLWFwcDIyYzA3ZWEyMGNmOSAuYWNmLWlucHV0Jykuc3RhcnJyKHtcbiAgICBtYXg6IDUsXG4gICAgcmF0aW5nOiAkczFpbnB1dC52YWwoKSxcbiAgICBjaGFuZ2U6IGZ1bmN0aW9uIGNoYW5nZShlLCB2YWx1ZSkge1xuICAgICAgJHMxaW5wdXQudmFsKHZhbHVlKS50cmlnZ2VyKCdpbnB1dCcpO1xuICAgIH1cbiAgfSk7XG4gIHZhciAkczJpbnB1dCA9ICQoJyNhY2YtZmllbGRfNWQ2NDUzM2RjMGFiMmMtZmllbGRfYXBwMXcxYzdlYTIwY2Y5Jyk7XG4gICQoJy5hY2YtZmllbGQtYXBwMXcxYzdlYTIwY2Y5IC5hY2YtcmFuZ2Utd3JhcCcpLmhpZGUoKTtcbiAgJCgnLmFjZi1maWVsZC1hcHAxdzFjN2VhMjBjZjkgLmFjZi1pbnB1dCcpLnN0YXJycih7XG4gICAgbWF4OiA1LFxuICAgIHJhdGluZzogJHMyaW5wdXQudmFsKCksXG4gICAgY2hhbmdlOiBmdW5jdGlvbiBjaGFuZ2UoZSwgdmFsdWUpIHtcbiAgICAgICRzMmlucHV0LnZhbCh2YWx1ZSkudHJpZ2dlcignaW5wdXQnKTtcbiAgICB9XG4gIH0pO1xuICB2YXIgJHMzaW5wdXQgPSAkKCcjYWNmLWZpZWxkXzVkNjQ1MzNkYzBhYjJjLWZpZWxkX2FwcDN3MzA3ZWEyMGNmOScpO1xuICAkKCcuYWNmLWZpZWxkLWFwcDN3MzA3ZWEyMGNmOSAuYWNmLXJhbmdlLXdyYXAnKS5oaWRlKCk7XG4gICQoJy5hY2YtZmllbGQtYXBwM3czMDdlYTIwY2Y5IC5hY2YtaW5wdXQnKS5zdGFycnIoe1xuICAgIG1heDogNSxcbiAgICByYXRpbmc6ICRzM2lucHV0LnZhbCgpLFxuICAgIGNoYW5nZTogZnVuY3Rpb24gY2hhbmdlKGUsIHZhbHVlKSB7XG4gICAgICAkczNpbnB1dC52YWwodmFsdWUpLnRyaWdnZXIoJ2lucHV0Jyk7XG4gICAgfVxuICB9KTtcbiAgdmFyICRzNGlucHV0ID0gJCgnI2FjZi1maWVsZF81ZDY0NTMzZGMwYWIyYy1maWVsZF9hcHAzdzMwNzIzNDIwY2Y5Jyk7XG4gICQoJy5hY2YtZmllbGQtYXBwM3czMDcyMzQyMGNmOSAuYWNmLXJhbmdlLXdyYXAnKS5oaWRlKCk7XG4gICQoJy5hY2YtZmllbGQtYXBwM3czMDcyMzQyMGNmOSAuYWNmLWlucHV0Jykuc3RhcnJyKHtcbiAgICBtYXg6IDUsXG4gICAgcmF0aW5nOiAkczRpbnB1dC52YWwoKSxcbiAgICBjaGFuZ2U6IGZ1bmN0aW9uIGNoYW5nZShlLCB2YWx1ZSkge1xuICAgICAgJHM0aW5wdXQudmFsKHZhbHVlKS50cmlnZ2VyKCdpbnB1dCcpO1xuICAgIH1cbiAgfSk7XG4gIHZhciAkczVpbnB1dCA9ICQoJyNhY2YtZmllbGRfNWQ2NDUzM2RjMGFiMmMtZmllbGRfYXBwM3JlZDdlYTIwY2Y5Jyk7XG4gICQoJy5hY2YtZmllbGQtYXBwM3JlZDdlYTIwY2Y5IC5hY2YtcmFuZ2Utd3JhcCcpLmhpZGUoKTtcbiAgJCgnLmFjZi1maWVsZC1hcHAzcmVkN2VhMjBjZjkgLmFjZi1pbnB1dCcpLnN0YXJycih7XG4gICAgbWF4OiA1LFxuICAgIHJhdGluZzogJHM1aW5wdXQudmFsKCksXG4gICAgY2hhbmdlOiBmdW5jdGlvbiBjaGFuZ2UoZSwgdmFsdWUpIHtcbiAgICAgICRzNWlucHV0LnZhbCh2YWx1ZSkudHJpZ2dlcignaW5wdXQnKTtcbiAgICB9XG4gIH0pO1xufSk7XG4vKipcclxuICogSGlkZSBpbnB1dHMgQUNGX0ZPUk1cclxuICovXG5cbiQoJy5hY2YtZmllbGQtZ3JvdXAtcm9wNTQzMTInKS5jc3Moe1xuICAnZGlzcGxheSc6ICdub25lJ1xufSk7XG4kKCcuYWNmLWZpZWxkLWdyb3VwLXJ1cDUyMjMyMicpLmNzcyh7XG4gICdkaXNwbGF5JzogJ25vbmUnXG59KTtcbi8qKlxyXG4gKiBTdWNjZXNzIFN1Ym1pdFxyXG4gKi9cblxuJCgnI2pzLWFwcC1yZXZpZXdlZC1jYW5jZWwnKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICQoJyNqcy1hcHAtcmV2aWV3ZWQtc3VjY2VzcycpLmNzcyh7XG4gICAgJ2Rpc3BsYXknOiAnbm9uZSdcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gc2hvd0FydGljbGVzTW9kYWwoKSB7XG4gICQoJyNqcy1pbnNlcnQtYXJ0aWNsZS1tb2RhbCcpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcbn1cblxuZnVuY3Rpb24gb3BlblZlcmlmaWVkTW9kYWwoKSB7XG4gICQoJy5qcy1jb25maXJtLW1vZGFsJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAkKCcuanMtY29uZmlybS1tb2RhbCcpLnJlbW92ZUNsYXNzKCdkLWZsZXgnKTtcbiAgJCgnI2pzLWluc2VydC1hcnRpY2xlLW1vZGFsJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICBGb3JtU3VibWl0KCdwZW5kaW5nJyk7XG59XG5cbmZ1bmN0aW9uIG9wZW5WZXJpZmllZEFydGljbGVNb2RhbCgpIHtcbiAgJCgnLmpzLWNvbmZpcm0tbW9kYWwnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gICQoJy5qcy1jb25maXJtLW1vZGFsJykucmVtb3ZlQ2xhc3MoJ2QtZmxleCcpO1xuICAkKCcjanMtaW5zZXJ0LWFydGljbGUtbW9kYWwnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gICQoJyNqcy1pbnNlcnQtYXJ0aWNsZS1tb2RhbCcpLmFkZENsYXNzKCdkLW5vbmUnKTtcbiAgRm9ybVN1Ym1pdEFydGljbGUoJ3BlbmRpbmcnKTtcbn1cblxuZnVuY3Rpb24gY2xvc2VEcmFmdE1vZGFsKCkge1xuICAkKCcjanMtZHJhZnQtbW9kYWwnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gICQoJyNqcy1lZGl0LWJsb2dnaW5nLWFydGljbGUnKS5odG1sKCc8cCBjbGFzcz1cInRleHQtaW5mb1wiPlJlZnJlc2hpbmcgcGFnZS4uLjwvcD4nKTtcbiAgdmFyIHJlZGlyZWN0ID0gJCgnI2pzLWRyYWZ0LW1vZGFsJykuYXR0cignZGF0YS1yZWRpcmVjdCcpO1xuICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShyZWRpcmVjdCk7XG59XG5cbmZ1bmN0aW9uIHNob3dBcnRpY2xlRHJhZnRNb2RhbCgpIHtcbiAgJCgnI2pzLWRyYWZ0LWFydGljbGUtbW9kYWwnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XG59XG5cbmZ1bmN0aW9uIG9wZW5WZXJpZmllZERyYWZ0TW9kYWwoKSB7XG4gICQoJy5qcy1jb25maXJtLW1vZGFsJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAkKCcuanMtY29uZmlybS1tb2RhbCcpLnJlbW92ZUNsYXNzKCdkLWZsZXgnKTtcbiAgJCgnI2pzLWRyYWZ0LWFydGljbGUtbW9kYWwnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gIEZvcm1TdWJtaXQoJ2RyYWZ0Jyk7XG59XG5cbmZ1bmN0aW9uIG9wZW5WZXJpZmllZERyYWZ0QXJ0aWNsZU1vZGFsKCkge1xuICAkKCcuanMtY29uZmlybS1tb2RhbCcpLmFkZENsYXNzKCdkLW5vbmUnKTtcbiAgJCgnLmpzLWNvbmZpcm0tbW9kYWwnKS5yZW1vdmVDbGFzcygnZC1mbGV4Jyk7XG4gICQoJyNqcy1kcmFmdC1hcnRpY2xlLW1vZGFsJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICBGb3JtU3VibWl0QXJ0aWNsZSgnZHJhZnQnKTtcbn1cblxuZnVuY3Rpb24gb3BlbkFydGljbGVzSW1nKCkge1xuICAkKCcjanMtaW5zZXJ0LWFydGljbGVzLWltZy1tb2RhbCcpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcbn1cblxuZnVuY3Rpb24gY2hvb3NlQW5JbWFnZSgpIHtcbiAgJCgnI2pzLWRvY3RvcnBlZGlhLWNob29zZScpLnJlbW92ZUNsYXNzKCdkLWZsZXgnKTtcbiAgJCgnI2pzLWRvY3RvcnBlZGlhLWNob29zZScpLmFkZENsYXNzKCdkLW5vbmUnKTtcbiAgJCgnI2pzLWZlYXR1cmVkLWltYWdlLWFydGljbGUnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XG4gICQoJyNqcy1mZWF0dXJlZC1pbWFnZS1hcnRpY2xlJykuYWRkQ2xhc3MoJ2QtZmxleCcpO1xuICBvcGVuQXJ0aWNsZXNJbWcoKTtcbn1cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAkKCcuaXNEaXNhYmxlZCcpLmNsaWNrKGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIG9wZW5WZXJpZmllZExpbmtNb2RhbCgpIHtcbiAgJCgnLmpzLWNvbmZpcm0tbW9kYWwnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gICQoJy5qcy1jb25maXJtLW1vZGFsJykucmVtb3ZlQ2xhc3MoJ2QtZmxleCcpO1xuICAkKCcjanMtaW5zZXJ0LWFydGljbGUtbW9kYWwnKS5hZGRDbGFzcygnZC1ub25lJyk7XG4gIEZvcm1MaW5rU3VibWl0KCk7XG59XG5cbmZ1bmN0aW9uIG9wZW5BcnRpY2xlVmVyaWZpZWRMaW5rTW9kYWwoKSB7XG4gICQoJy5qcy1jb25maXJtLW1vZGFsJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICAkKCcuanMtY29uZmlybS1tb2RhbCcpLnJlbW92ZUNsYXNzKCdkLWZsZXgnKTtcbiAgJCgnI2pzLWluc2VydC1hcnRpY2xlLW1vZGFsJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xuICBGb3JtU2luZ2xlTGlua1N1Ym1pdCgpO1xufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
