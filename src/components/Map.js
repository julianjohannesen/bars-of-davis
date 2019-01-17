import React, { Component } from 'react';

export default class Map extends Component {

	state = {
		myLocations: [
			{ title: "Landing Site 1", location: { lat: 40.719526, lng: -74.0089934 } },
			{ title: "Forward Base Alpha", location: { lat: 40.720313, lng: -74.0085313 } },
			{ title: "Forward Base Beta", location: { lat: 40.722311, lng: -74.008511 } },
		]
	}

	polygon = null;

	myMap = new google.maps.Map(
		document.getElementById("map"),
		{
			center: { "lat": 40.719526, "lng": -74.0089934 },
			zoom: 12,
			mapTypeControlOptions: { mapTypeIds: ['roadmap', 'styled_myMap',] }
		}
	);

	myMapStyle = new google.maps.StyledMapType([
		{ elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
		{ elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
		{ elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
		{
			featureType: 'administrative.locality',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#d59563' }]
		},
		{
			featureType: 'poi',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#d59563' }]
		},
		{
			featureType: 'poi.business',
			stylers: [{ visibility: 'off' }]
		},
		{
			featureType: 'poi.park',
			elementType: 'geometry',
			stylers: [{ color: '#263c3f' }]
		},
		{
			featureType: 'poi.park',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#6b9a76' }]
		},
		{
			// Turn off all Points of Interest
			"featureType": "poi",
			"elementType": "all",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			featureType: 'road',
			elementType: 'geometry',
			stylers: [{ color: '#38414e' }]
		},
		{
			featureType: 'road',
			elementType: 'geometry.stroke',
			stylers: [{ color: '#212a37' }]
		},
		{
			featureType: 'road',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#9ca5b3' }]
		},
		{
			featureType: 'road.highway',
			elementType: 'geometry',
			stylers: [{ color: '#746855' }]
		},
		{
			featureType: 'road.highway',
			elementType: 'geometry.stroke',
			stylers: [{ color: '#1f2835' }]
		},
		{
			featureType: 'road.highway',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#f3d19c' }]
		},
		{
			featureType: 'transit',
			elementType: 'geometry',
			stylers: [{ color: '#2f3948' }]
		},
		{
			featureType: 'transit.station',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#d59563' }]
		},
		{
			featureType: 'water',
			elementType: 'geometry',
			stylers: [{ color: '#17263c' }]
		},
		{
			featureType: 'water',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#515c6d' }]
		},
		{
			featureType: 'water',
			elementType: 'labels.text.stroke',
			stylers: [{ color: '#17263c' }]
		}
	],
		{ name: "Night Mode" });
	myMap.mapTypes.set('styled_myMap', myMapStyle);
	this.myMap.setMapTypeId('styled_myMap');

	const makeMyMarkerIcon = (markerColor) => {
		const markerImage = new google.maps.MarkerImage(
			'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
			'|40|_|%E2%80%A2',
			new google.maps.Size(21, 34),
			new google.maps.Point(0, 0),
			new google.maps.Point(10, 34),
			new google.maps.Size(21, 34));
		return markerImage;
	}
	const defaultIcon = makeMyMarkerIcon('0091ff');
	const highlightedIcon = makeMyMarkerIcon('FFFF24');

	const myMarkersArray = this.state.myLocations.map((location, index) => new google.maps.Marker({
		animation: google.maps.Animation.DROP,
		icon: defaultIcon,
		id: index,
		position: location.location,
		title: location.title
	}));

	const myInfoWindow = new google.maps.InfoWindow()
	const popInfoWin = (infoWind, marker, map) => {
		if (infoWind !== marker) {
			infoWind.marker = marker;
			infoWind.setContent(`${marker.title} <br> Latitude: ${marker.position.lat}, Longitude: ${marker.position.lng}`);
			infoWind.open(map, marker);
			infoWind.addListener("closeclick", () => infoWind.marker = null);
		}
	}

	myMarkersArray.forEach((marker, index) => {
		marker.addListener("click", () => popInfoWin(myInfoWindow, marker, myMap));
		marker.addListener('mouseover', () => marker.setIcon(highlightedIcon));
		marker.addListener('mouseout', () => marker.setIcon(defaultIcon));
	});

	const myDrawingMngr = new google.maps.drawing.DrawingManager({
		drawingMode: google.maps.drawing.OverlayType.POLYGON,
		drawingControl: true,
		drawingControlOptions: {
			position: google.maps.ControlPosition.TOP_LEFT,
			drawingModes: [google.maps.drawing.OverlayType.POLYGON],
		},
	});

	const toggleDrawing = () => {
		if (myDrawingMngr.map) {
			myDrawingMngr.setMap(null);
			if (this.polygon) this.polygon.setMap(null);
		} else {
			myDrawingMngr.setMap(myMap);
		}
	}

	const handlePolygon = (event) => {

		const searchWithinPolygon = (markers) => {
			for (let i = 0; i < markers.length; i++) {
				google.maps.geometry.poly.containsLocation(markers[i].position, this.polygon)
					?
					markers[i].setMap(myMap)
					:
					markers[i].setMap(null);
			}
		}

		if (this.polygon) {
			this.polygon.setMap(null);
			hideListings();
		}
		myDrawingMngr.setDrawingMode(null);
		this.polygon = event.overlay;
		this.polygon.setEditable(true);
		searchWithinPolygon(myMarkersArray);
		this.polygon.getPath().addListener('set_at', searchWithinPolygon);
		this.polygon.getPath().addListener('insert_at', searchWithinPolygon);
	}
	myDrawingMngr.addListener('overlaycomplete', handlePolygon);

	const showListings = () => {
		const myBounds = new google.maps.LatLngBounds();
		myMarkersArray.forEach(marker => {
			marker.setMap(myMap);
			myBounds.extend(marker.position);
		});
		myMap.fitBounds(myBounds);
	}

	const hideListings = () => myMarkersArray.forEach(marker => marker.setMap(null));

	const zoomToArea = () => {
		const myGeocoder = new google.maps.Geocoder();
		const myAddress = document.getElementById("zoom-to-area-text").value;
		console.log("zoomToArea fires and the value of address is: " + myAddress);
		if (myAddress == '') { window.alert("You must enter an area or address.") }
		else {

			const myGeocodeOpts = {
				address: myAddress,
				componentRestrictions: { locality: "New York" },
			};
			const callback = (results, status) => {
				if (status === google.maps.GeocoderStatus.OK) {
					myMap.setCenter(results[0].geometry.location);
					myMap.setZoom(15);
				} else {
					window.alert("We could not find the location. Please try entering a more specific location.");
				}
			}
			myGeocoder.geocode(myGeocodeOpts, callback);
		}
	}

render() {
	return (
		<div id="container">

			<div id="options-box">
				<div>

					<input id="show-listings" onClick={showListings} type="button" value="Show Locations" />
					<input id="hide-listings" onClick={HideListings} type="button" value="Hide Locations" />

					<input id="toggle-drawing" onClick={toggleDrawing(myDrawingMngr)} type="button" value="Drawing Tools" />

					<input id="zoom-to-area-text" type="text" placeholder="Enter an area" />
					<input id="zoom-to-area" onClick={zoomToArea} type="button" value="zoom" />

					<div>
						<span class="text"> Within </span>
						<select id="max-duration">
							<option value="10">10 min</option>
							<option value="15">15 min</option>
							<option value="30">30 min</option>
							<option value="60">1 hour</option>
						</select>
						<select id="mode">
							<option value="DRIVING">drive</option>
							<option value="WALKING">walk</option>
							<option value="BICYCLING">bike</option>
							<option value="TRANSIT">transit ride</option>
						</select>
						<span class="text">of</span>
						<input id="search-within-time-text" type="text" placeholder="Ex: blah blah" />
						<input id="search-within-time" onClick={searchWithinTime} type="button" value="Go" />
					</div>
				</div>
			</div>

			<div id="map"></div>

		</div>
	)
}
}
