<?php $user_data = get_user_blog_data(); ?>

<?php if ( $user_data['acf']['clinic_location'] ) :?>

<script src="https://maps.googleapis.com/maps/api/js?libraries=places&key=<?php echo GMAPS_API_KEY?>"></script>

<script type="text/javascript">

    google.maps.event.addDomListener(window, 'load', init);

    // Rendered points on the map
    function init() {

        <?php $location = $user_data['acf']['clinic_location']; ?>
        
        var mapOptions = {
            zoom: 12,
            scrollwheel: false,
            center: new google.maps.LatLng(<?php echo $location["lat"]?>,<?php echo $location["lng"]?>),
        };

        var mapElement = document.getElementById('map');
        var map = new google.maps.Map(mapElement, mapOptions);
        var infoWindow = new google.maps.InfoWindow(), marker, i;
        
        marker = new google.maps.Marker({
            position: {lat: <?php echo $location["lat"]?>, lng: <?php echo $location["lng"]?>},
            map: map,
            animation: google.maps.Animation.DROP,
            title: "<?php echo $user_data['acf']['clinic_name']; ?>",
            icon: "<?php echo IMAGES?>/icons/map-marker.svg",
        });

        google.maps.event.addListener(marker, "click", (function(marker, i) {
            return function() {

                $("#bio-clinic").addClass("active");

            }
        })(marker, i));
    }//end init

</script>

<div class="doctor-dashboard__bio-content body-clinic d-block">
    
    <div class="map-container row">

        <div class="map" id="map"></div>

        <!-- Location Description -->
        <div class="location-description sinlgle-expert-descrip active" id="bio-clinic">

            <img src="<?php echo IMAGES?>/icons/close.svg" alt="Close Icon" onclick="hideModalMap();">

            <div class="header header-map-expert">

                <h1 id="clinic_name"><?php echo $user_data['acf']['clinic_name']; ?></h1>

                <p id="full_address"><?php echo $user_data['acf']['clinic_location']['address']; ?></p>

                <p id="phone"><?php echo $user_data['acf']['clinic_phone']; ?></p>

                <p id="open"><?php echo $user_data['acf']['clinic_open']; ?></p>

            </div>

            <div class="call-to-actions">

                <?php if ( $user_data['acf']['clinic_email'] ) : ?>

                    <a href="mailto:<?php echo $user_data['acf']['clinic_email']; ?>" target="_blank">Schedule An Appointment</a>

                <?php endif; ?>

                <?php if ( $user_data['acf']['clinic_website'] ) : ?>

                    <a id="website" href="<?php echo $user_data['acf']['clinic_website']; ?>">Visit Website</a>
                
                <?php endif; ?>

            </div>

        </div>

    </div>

</div>

<?php else : ?>

    <div class="doctor-dashboard__bio-content d-flex">

        <div class="doctor-dashboard__bio-description">
            
            <div class="doctor-dashboard__bio-description-copy">
                
                <p>Please, go to <a href="<?php  echo esc_url( home_url( 'doctors-dashboard/bio-edit' ) ); ?>">Edit profile</a> and complete your profile.</p>

            </div>

        </div>

    </div>

<?php endif; ?>