/*******************************************************************************
 * 
 * File:	googleMaps.js
 * Author:	Team Divided by 0, Kelley Neubauer
 * Date:	3/27/2020
 * 
 * Description: 
 * This file contains code that creates a map using the google maps API and 
 * populates the map using data from our database.
 * 		
 ******************************************************************************/


/**
 * 
 * function initMap()
 * 
 * Summary: 
 * 		Initializes the map
 * 
 * Parameters:	
 * 		none
 * 
 * Returns:	
 * 		nothing
 * 
 * Description:
 * 		Initializes the map, centered at OSU and pins OSU to map. Populates
 * 		the map with data from the database.
 * 
 **/
function initMap() {
	// Create variable with OSU coordinates
	var oregonState = {lat: 44.564466, lng: -123.279528};
	var centerOfUSA = {lat: 39.8283, lng: -98.5795};
	// Creates map, centered at OSU
	var map = new google.maps.Map(
		document.getElementById('map'), {
			zoom: 4, 
			center: centerOfUSA,
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
			  }
		});

	
	// Creates a marker, positioned at Oregon State
	// var marker = new google.maps.Marker({
	// 	position: oregonState, 
	// 	animation: google.maps.Animation.DROP,
	// 	// label: 'OSU',
	// 	map: map
	// });

	// TESTING
	// var text = '{ "JSONdata" : [' +
	// '{ "email":"portland@email.com" , "lat":"45.5051" , "lng":"-122.6750" },' +
	// '{ "email":"seattle@email.com" ,"lat":"47.617165" , "lng":"-122.338949" },' +
	// '{ "email":"kansas@email.com" ,"lat":"39.0119" , "lng":"-98.4842" },' +
	// '{ "email":"la@email.com" ,"lat":"34.019770" , "lng":"-118.497292" } ]}';
  
	// var obj = JSON.parse(text);

	var obj = 
	[
		{email: 'OSU.edu', lat: oregonState.lat, lng: oregonState.lng, animation: google.maps.Animation.DROP, icon: '../files/osu_logo_50x50.png'},
		{email: 'portland@email.com', lat: 45.5051, lng: -122.6750},
		{email: 'seattle@email.com', lat: 47.617165, lng: -122.338949},
		{email: 'shoreline@email.com', lat: 47.7560, lng: -122.3457},
		{email: 'kansas@email.com', lat: 39.0119, lng: -98.4842},
	]

	populateMap(obj, map);

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
 * 		a JSON object containing lat and lng data
 * 		a map object
 * 
 * Returns:	
 * 		nothing
 * 
 * Description:
 * 		Iterates through JSON object and creates a marker for each element 
 * 		using the lat and lng data.
 * 
 **/
function populateMap(mapData, map){

	var infoWindow = new google.maps.InfoWindow();

	for (var i=0; i < mapData.length; i++)
	{
		var latLng = new google.maps.LatLng(mapData[i].lat, mapData[i].lng);
		var marker = new google.maps.Marker({
			position: latLng,
			map: map,
			animation: mapData[i].animation,
			icon: mapData[i].icon
		});

		attachInfoWindow(marker, mapData[i].email);
	}
	
	function attachInfoWindow(marker, email) {
		var infowindow = new google.maps.InfoWindow({
			content: mapData[i].email,
			position: marker
		});
	
		marker.addListener('click', function() {
			infowindow.open(marker.get('map'), marker);
			// alert(marker.position);
		}); 
	}
	
}




