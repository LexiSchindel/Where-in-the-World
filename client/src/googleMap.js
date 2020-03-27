// Initialize and add the map
function initMap() {
	// The location of OSU
	var oregonState = {lat: 44.564466, lng: -123.279528};
	// The map, centered at OSU
	var map = new google.maps.Map(
		document.getElementById('map'), {zoom: 4, center: oregonState});
	// The marker, positioned at Uluru
	var marker = new google.maps.Marker({position: oregonState, map: map});

  }