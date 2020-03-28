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
function initMap(rows) {
	// Create variable with OSU coordinates
	var oregonState = {lat: 44.564466, lng: -123.279528};
	var centerOfUSA = {lat: 39.8283, lng: -98.5795};
	// Creates map, centered at OSU
	var map = new google.maps.Map(
		document.getElementById('map'), {
			zoom: 4, 
			center: {
				lat: parseFloat(centerOfUSA.lat),
				lng: parseFloat(centerOfUSA.lng)
			},
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

	var oregonStateMarker = [
		{
		  id: 0,
		  latitude: oregonState.lat,
		  longitude: oregonState.lng,
		  city: 'Corvallis',
		  state: 'Oregon',
		  email: 'OSU@osu.edu',
		  animation: google.maps.Animation.DROP, 
		  icon: '../files/osu_logo_50x50.png'
		}
	]

	// var rows = [
	// 	{
	// 	  id: 0,
	// 	  latitude: 47.600227,
	// 	  longitude: -122.310827,
	// 	  city: 'Seattle',
	// 	  state: 'Washington',
	// 	  email: 'email@email.com'
	// 	},
	// 	{
	// 	  id: 2,
	// 	  latitude: 47.600227,
	// 	  longitude: -122.310827,
	// 	  city: 'Seattle',
	// 	  state: 'Washington',
	// 	  email: 'email@email.com'
	// 	},
	// 	{
	// 	  id: 3,
	// 	  latitude: 39.4398657,
	// 	  longitude: -98.69859749999999,
	// 	  city: 'Osborne',
	// 	  state: 'Kansas',
	// 	  email: 'email@email.com'
	// 	}
	//   ]

	//   console.log(rows);

	populateMap(oregonStateMarker, map);
	populateMap(rows, map);

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
		var marker = new google.maps.Marker({
			position: {
				lat: parseFloat(mapData[i].latitude),
				lng: parseFloat(mapData[i].longitude)
			},
			map: map,
			animation: mapData[i].animation,
			icon: mapData[i].icon
		});

		attachInfoWindow(marker, mapData[i].email);
	}
	
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


