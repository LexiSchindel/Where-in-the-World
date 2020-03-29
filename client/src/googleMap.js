/*******************************************************************************
 * 
 * File:	googleMaps.js
 * Author:	Team Divided by 0
 * Date:	3/27/2020
 * 
 * Description: 
 * This file contains code that creates a map using the google maps API and 
 * populates the map using data from our database.
 * 		
 ******************************************************************************/

/**
 * 
 * function initMap(rows)
 * 
 * Summary: 
 * 		Initializes the map
 * 
 * Parameters:	
 * 		Object containing rows of location data
 * 
 * Returns:	
 * 		nothing
 * 
 * Description:
 * 		Initializes the map, centered at OSU and pins OSU to map. Populates
 * 		the map with data from the database.
 * 
 **/
function initMap(rows) {
	// Create variable with OSU coordinates
	var oregonState = {lat: 44.564466, lng: -123.279528};
	// Create variable with Center of USA coordinates
	var centerOfUSA = {lat: 39.8283, lng: -98.5795};
	
	// Creates map, centered at variable
	var map = new google.maps.Map(
		document.getElementById('map'), {
			zoom: 4, 
			center: {
				lat: parseFloat(centerOfUSA.lat),
				lng: parseFloat(centerOfUSA.lng)
			},
			disableDefaultUI: true,
			zoomControl: true
		});

	// Create OSU marker and populate the map
	var oregonStateMarker = [
		{
		  id: 0,
		  latitude: oregonState.lat,
		  longitude: oregonState.lng,
		  city: 'Corvallis',
		  state: 'Oregon',
		  email: 'ecampus@oregonstate.edu',
		  animation: google.maps.Animation.DROP, 
		  icon: '../files/osu_logo_50x50.png'
		}
	]
	populateMap(oregonStateMarker, map);


	// Request data from server and populate the map
	let url = "/getData";
	let req = new XMLHttpRequest();
	let getResponse;

	req.open('GET', url, true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			
			getResponse = JSON.parse(req.responseText);
			
			populateMap(JSON.parse(getResponse.results), map);

		} else {
			console.log("Error in network request: " + req.statusText);
		}});
	req.send(null);
}

/**
 * 
 * function populateMap(mapData, map)
 * 
 * Summary: 
 * 		This function populates the map using JSON data and adds an infoWindow
 * 		with event listener to each marker.
 * 
 * Parameters:	
 * 		an object containing latitude and longitude data
 * 		a map object
 * 
 * Returns:	
 * 		nothing
 * 
 * Description:
 * 		Iterates through object and creates a marker for each element 
 * 		using the lat and lng data. Adds an event listener and infowindow
 * 		for each marker. Organizes the data into clusters
 * 
 **/
function populateMap(mapData, map){

	var infoWindow = new google.maps.InfoWindow();

	var markers = [];

	for (var i=0; i < mapData.length; i++)
	{
		var marker = new google.maps.Marker({
			position: {
				lat: parseFloat(mapData[i].latitude),
				lng: parseFloat(mapData[i].longitude)
			},
			map: map,
			animation: mapData[i].animation,
			icon: mapData[i].icon
		});

		markers.push(marker);
		attachInfoWindow(marker, mapData[i].email);
	}

	// Add a marker clusterer to manage the markers.
	var markerCluster = new MarkerClusterer(map, markers,
		{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

	function attachInfoWindow(marker, email) {
		var infowindow = new google.maps.InfoWindow({
			content: email,
			position: {
				lat: parseFloat(marker.position.lat),
				lng: parseFloat(marker.position.lng)
			}
		});
	
		marker.addListener('click', function() {
			infowindow.open(marker.get('map'), marker);
		}); 
	}
}




