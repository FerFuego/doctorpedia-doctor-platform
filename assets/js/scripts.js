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
function readMore(id){
  $( '#js-show-' + id ).css( 'display', 'none' );
  $( '#js-more-' + id ).removeClass( 'd-none ');
}

/**
* Read Less
*/
function readLess(id){
  $( '#js-more-' + id ).addClass( 'd-none' );
  $( '#js-show-' + id ).css( 'display', 'block' );
}

/**
 * Modal Show
 */
function showDoctorModal( completename, username, useremail ) {
  //input completename
  $( '#acf-field_5d645ddc0ab2c-group_rip2322322').val( completename );
  //input username
  $( '#acf-field_5d645ddc0ab2c-group_rip522322').val( username );
  //input useremail
  $( '#acf-field_5d645ddc0ab2c-group_rip54322' ).val( useremail );

  $( '#js-insert-review-modal' ).removeClass( 'd-none' );

  $('#acf-form-data').addClass('acf-hidden');

  $('.modal-header').css({'visibility':'visible'});

  $('#acf-field_5d645ddc0ab2c-group_rop54312-Yes').attr('checked', 'checked');

}

function showAppReviewsModal( completename, username, useremail, app, app_link ) {
  //input completename
  $( '#acf-field_5d645ddc0ab2c-group_rip2322322').val( completename );
  //input username
  $( '#acf-field_5d645ddc0ab2c-group_rip522322').val( username );
  //input useremail
  $( '#acf-field_5d645ddc0ab2c-group_rip54322' ).val( useremail );
  //add option to select
  //$( '#acf-field_5d64629ede297' ).append(`<option value="${app}">${app}</option>`); 
  //auto select option
  $( '#acf-field_5d64629ede297' ).val(app).change();
  //show modal
  $( '#js-insert-review-modal' ).removeClass( 'd-none' );

  $('#acf-form-data').removeClass('acf-hidden');

  $('#js-app-reviews-modal-title').remove();

  $('#acf-form-data').append('<div id="js-app-reviews-modal-title" class="d-flex flex-row justify-content-between"><h2>' + app + '</h2><a href="' + app_link + '" target="_blank" class="text-danger mt-2">View App</a></div>');
  
  $('.modal-header').css({'visibility':'hidden'});

  $('#acf-field_5d645ddc0ab2c-group_rop54312-Yes').attr('checked', 'checked');

}
/**
* Modal Hide
*/
function hideModal() {
  $( '#js-insert-reviews-modal' ).addClass('d-none');
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
$(document).ready(function() {
  var $s1input = $('#acf-field_5d64533dc0ab2c-field_app22c07ea20cf9');
  $('.acf-field-app22c07ea20cf9 .acf-range-wrap').hide();
  $('.acf-field-app22c07ea20cf9 .acf-input').starrr({
      max: 5,
      rating: $s1input.val(),
      change: function(e, value){
          $s1input.val(value).trigger('input');
      }
  });
  
  var $s2input = $('#acf-field_5d64533dc0ab2c-field_app1w1c7ea20cf9');
  $('.acf-field-app1w1c7ea20cf9 .acf-range-wrap').hide();
  $('.acf-field-app1w1c7ea20cf9 .acf-input').starrr({
      max: 5,
      rating: $s2input.val(),
      change: function(e, value){
          $s2input.val(value).trigger('input');
      }
  });
  
  var $s3input = $('#acf-field_5d64533dc0ab2c-field_app3w307ea20cf9');
  $('.acf-field-app3w307ea20cf9 .acf-range-wrap').hide();
  $('.acf-field-app3w307ea20cf9 .acf-input').starrr({
      max: 5,
      rating: $s3input.val(),
      change: function(e, value){
          $s3input.val(value).trigger('input');
      }
  });
  
  var $s4input = $('#acf-field_5d64533dc0ab2c-field_app3w30723420cf9');
  $('.acf-field-app3w30723420cf9 .acf-range-wrap').hide();
  $('.acf-field-app3w30723420cf9 .acf-input').starrr({
      max: 5,
      rating: $s4input.val(),
      change: function(e, value){
          $s4input.val(value).trigger('input');
      }
  });
  
  var $s5input = $('#acf-field_5d64533dc0ab2c-field_app3red7ea20cf9');
  $('.acf-field-app3red7ea20cf9 .acf-range-wrap').hide();
  $('.acf-field-app3red7ea20cf9 .acf-input').starrr({
      max: 5,
      rating: $s5input.val(),
      change: function(e, value){
          $s5input.val(value).trigger('input');
      }
  });
});

/**
 * Hide inputs ACF_FORM
 */
$('.acf-field-group-rop54312').css({'display':'none'});
$('.acf-field-group-rup522322').css({'display':'none'});

/**
 * Success Submit
 */
$('#js-app-reviewed-cancel').click(function(){
    $('#js-app-reviewed-success').css({'display':'none'});
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
  let redirect = $('#js-draft-modal').attr('data-redirect');
  window.location.replace( redirect );
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

  openArticlesImg()
}

$( document ).ready( function() {
  $('.isDisabled').click(function( event ) {
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