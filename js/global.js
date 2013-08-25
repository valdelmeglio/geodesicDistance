
$(function () {

    initialize_map();
});


var map;
var directionDisplay;
var directionsService = new google.maps.DirectionsService();
/**************************
 *
 *	Google Maps API
 *
 **************************/

function initialize_map() {
    var mapOptions = {
        zoom: 5,
        scrollwheel: true,
        navigationControl: false,
        scaleControl: false,
        streetViewControl: false,
        draggable: true,
        mapTypeControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $('#map_canvas').height($(window).height());
    map = new google.maps.Map(document.getElementById('map_canvas'),
        mapOptions);

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);

            var asTheCrowFliesCoordinates = [
                new google.maps.LatLng(51.522199, -0.109762),
                pos
            ];
            var asTheCrowFliesPath = new google.maps.Polyline({
                path: asTheCrowFliesCoordinates,
                strokeColor: '#11385f',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: 'Current location'
            });

            map.setCenter(pos);
            asTheCrowFliesPath.setMap(map);
        }, function () {
            handleNoGeolocation(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(51.52219930, -0.10976180),
        map: map,
        title: 'Given address'


    });
    var styles = [{
        stylers: [{
            hue: "#F9F9F9"
        }, {
            saturation: -500
        }, {
            gamma: 0.99
        }]
    }, {
        featureType: "road",
        elementType: "geometry",
        stylers: [{
            lightness: 100
        }, {
            visibility: "simplified"
        }]
    }, {
        featureType: 'water',
        elementType: 'all',
        stylers: [{
            hue: '#B8CCCA'
        }, {
            saturation: -64
        }, {
            gamma: 0.99
        }, {
            lightness: 0
        }, {
            visibility: 'on'
        }]
    }, {
        featureType: "road",
        elementType: "labels",
        stylers: [{
            visibility: "off"
        }]
    }];
    var style1s = [{
        featureType: "administrative",
        elementType: "all",
        stylers: [{
            visibility: "off"
        }]
    }, {
        featureType: "poi",
        elementType: "all",
        stylers: [{
            visibility: "on"
        }]
    }, {
        featureType: "road",
        elementType: "all",
        stylers: [{
            lightness: 100
        }, {
            visibility: "simplified"
        }]
    }, {
        featureType: "transit",
        elementType: "all",
        stylers: [{
            visibility: "on"
        }]
    }, {
        featureType: "landscape",
        elementType: "all",
        stylers: [{
            hue: "#F9F9F9"
        }, {
            lightness: 100
        }, {
            gamma: 0.01
        }]
    }, {
        featureType: "water",
        elementType: "all",
        stylers: [{
            visibility: "simplified"
        }]
    }];
    map.setOptions({
        styles: styles
    });
}