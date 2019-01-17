import React, { Component } from 'react';
import 'assets/css/App.css';
import axios from 'axios';
import Headerx from './layout/Headerx.js';
import Footerx from './layout/Footerx.js';

class App extends Component {

	state = {
		myLocations: [
			// A sample
			// 0: {
			//   venue: {
			//		name: "Olde Magoun Saloon",
			//      location: {
			//			address: "518 Medford St"
			//			cc:"US"
			//			city:"Somerville"
			//			country:"United States"
			//			distance:67
			//			formattedAddress: Array[3]
			//			labeledLatLngs:Array[1]
			//			lat:42.396805429907445
			//			lng:-71.10399688926768
			//			postalCode:"02145"
			//			state:"MA"
			//		},
			//		photos: {},
			//		venuepage: {}
			//   }		
			// }
		]
	}

	lat = 42.397359;
	lng = -71.104336;
	myMap = {};
	myBounds = {};
	myMarkersArray
	polygon = null;


	initMap = () => {
		this.myMap = new window.google.maps.Map(
			document.getElementById("map"),
			{
				center: { "lat": this.lat, "lng": this.lng },
				zoom: 15,
				mapTypeControlOptions: { mapTypeIds: ['roadmap', 'styled_myMap',] }
			}
		);

		const myMapStyle = new window.google.maps.StyledMapType([
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
		this.myMap.mapTypes.set('styled_myMap', myMapStyle);
		this.myMap.setMapTypeId('styled_myMap');

		const makeMyMarkerIcon = (markerColor) => {
			console.log("Create some custom icons");
			const markerImage = new window.google.maps.MarkerImage(
				'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
				'|40|_|%E2%80%A2',
				new window.google.maps.Size(21, 34),
				new window.google.maps.Point(0, 0),
				new window.google.maps.Point(10, 34),
				new window.google.maps.Size(21, 34));
			return markerImage;
		}
		const defaultIcon = makeMyMarkerIcon('0091ff');
		const highlightedIcon = makeMyMarkerIcon('FFFF24');

		// see https://developers.google.com/maps/documentation/javascript/reference/marker
		this.myMarkersArray = this.state.myLocations.map((location, index) => {
			return new window.google.maps.Marker({
				animation: window.google.maps.Animation.DROP,
				icon: defaultIcon,
				id: index,
				map: this.myMap,
				position: {lat: location.venue.location.lat, lng:location.venue.location.lng},
				title: location.venue.name
			})
		}) 

		// see https://developers.google.com/maps/documentation/javascript/reference/info-window
		const myInfoWindow = new window.google.maps.InfoWindow();
		console.log("This is my info window object: ", myInfoWindow);
		const populateMyInfoWindow = (infoWind, marker, map) => {
			if (infoWind !== marker) {
				// this will be an item from the myMarkersArray
				infoWind.marker = marker;
				infoWind.setContent(`${marker.title}`);
				infoWind.open(map, marker);
				infoWind.addListener("closeclick", () => infoWind.marker = null);
			}
		}

		this.myMarkersArray.forEach((marker, index) => {
			console.log("Call populate info window on each marker and set the marker icons")
			marker.addListener("click", () => populateMyInfoWindow(myInfoWindow, marker, this.myMap));
			marker.addListener('mouseover', () => marker.setIcon(highlightedIcon));
			marker.addListener('mouseout', () => marker.setIcon(defaultIcon));
		});

		// const myDrawingMngr = new window.google.maps.Drawing.DrawingManager({
		// 	drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
		// 	drawingControl: true,
		// 	drawingControlOptions: {
		// 		position: window.google.maps.ControlPosition.TOP_LEFT,
		// 		drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
		// 	},
		// });

		// this.toggleDrawing = () => {
		// 	if (myDrawingMngr.map) {
		// 		myDrawingMngr.setMap(null);
		// 		if (this.polygon) this.polygon.setMap(null);
		// 	} else {
		// 		myDrawingMngr.setMap(this.myMap);
		// 	}
		// }

	}

	showListings = () => {
		this.myBounds = new window.google.maps.LatLngBounds();
		this.myMarkersArray.forEach(marker => {
			marker.setMap(this.myMap);
			this.myBounds.extend(marker.position);
		});
		this.myMap.fitBounds(this.myBounds);
	}

	hideListings = () => this.myMarkersArray.forEach(marker => marker.setMap(null));

	loadMap = () => {
		const key = "AIzaSyAKidTbGki0g1eG1laz79qvkDVLMYVxLOU";
		//const libraries = ["drawing", "geometry", "geocoder"];
		const version = "3";
		// When the script loads, it will look in the window object for a function called initMap, so we need to assign window.initMap to our initMap function.
		window.initMap = this.initMap
		loadScript(`https://maps.googleapis.com/maps/api/js?key=${key}&libraries=drawing,geometry,geocoder&v=${version}&callback=initMap`);

	}

	loadData = () => {
		const endpoint = "https://api.foursquare.com/v2/venues/explore?";
		const params = {
			client_id: "W5EAA4B3DHWV1ZLG3OATVOZYTYZNI5WWG0LRLPHBHVHC3JV3",
			client_secret: "3ZTMTTP43WP4OXWOAKITGOYLIVPVW1NDQHPZ0I342VH4R5X0",
			v: 20190117,
			ll: `${this.lat},${this.lng}`,
			//near: "",
			//radius: "",
			//section: "",
			query: "bars"
		}
		axios.get(endpoint + new URLSearchParams(params))
			.then((response) => this.setState({myLocations: response.data.response.groups[0].items}))
			.catch((error) => console.log(error));
	}

	componentDidMount() {
		this.loadData();
		setTimeout(this.loadMap, 2000);
	}

	render() {
		return (
			<div className="App">
				<Headerx />
				<main>
					<div id="options-box">
						<input id="show-listings" onClick={this.showListings} type="button" value="Show Locations" />
						<input id="hide-listings" onClick={this.hideListings} type="button" value="Hide Locations" />

						<input id="toggle-drawing" /*onClick={this.toggleDrawing}*/ type="button" value="Drawing Tools" />

						<input id="zoom-to-area-text" type="text" placeholder="Enter an area" />
						<input id="zoom-to-area" /*onClick={zoomToArea}*/ type="button" value="zoom" />

						<div>
							<span className="text"> Within </span>
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
							<span className="text">of</span>
							<input id="search-within-time-text" type="text" placeholder="Ex: blah blah" />
							<input id="search-within-time" /*onClick={searchWithinTime}*/ type="button" value="Go" />
						</div>
					</div>

					<div id="map" style={{ height: "50vh" }}>
					</div>
				</main>

				<Footerx />
			</div>
		)
	}
}

const loadScript = (url) => {
	const indexjs = window.document.getElementsByTagName("script")[0];
	const script = window.document.createElement("script");
	script.src = url;
	script.async = true;
	script.defer = true;
	indexjs.parentNode.insertBefore(script, indexjs);
}

export default App;
