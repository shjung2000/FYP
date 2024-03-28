function initMap() {
    var options = {
        center: { lat: 38.3460, lng: -0.4907 },
        zoom: 8
    }

    map = new google.maps.Map(document.getElementById('map'), options)
}

// testing the map