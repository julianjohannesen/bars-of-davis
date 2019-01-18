import React, { Component } from 'react';
import 'assets/css/bulma.min.css';
import 'assets/css/App.css';
import axios from 'axios';
import Navbar from './layout/Navbar.js';
import Hero from './layout/Hero.js';
import Footerx from './layout/Footerx.js';

class App extends Component {

	state = {
		bars: [
			// A sample
			// 0: {
			//   venue: {
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
			//		name: "Olde Magoun Saloon",
			//		photos: {},
			//		venuepage: {}
			//   }		
			// }
		]
	}

	// The center of the intersection of Broadway and Medford
	lat = 42.3973445;
	lng = -71.1044484;
	magounMap = {};
	bounds = {};
	barMarkers = [];
	drawingMngr = {};
	polygon = null;

	initMap = () => {
		this.magounMap = new window.google.maps.Map(
			document.getElementById("map"),
			{
				center: { "lat": this.lat, "lng": this.lng },
				zoom: 15,
				mapTypeControlOptions: { mapTypeIds: ['styled_magounMap','roadmap', ] }
			}
		);

		const magounMapStyle = new window.google.maps.StyledMapType([
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
		this.magounMap.mapTypes.set('styled_magounMap', magounMapStyle);
		this.magounMap.setMapTypeId('styled_magounMap');

		const makeMarkerIcon = (markerColor) => {
			const markerImage = new window.google.maps.MarkerImage(
				'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
				'|40|_|%E2%80%A2',
				new window.google.maps.Size(21, 34),
				new window.google.maps.Point(0, 0),
				new window.google.maps.Point(10, 34),
				new window.google.maps.Size(21, 34));
			return markerImage;
		}
		const defaultIcon = makeMarkerIcon('0091ff');
		const highlightedIcon = makeMarkerIcon('FFFF24');

		// see https://developers.google.com/maps/documentation/javascript/reference/marker
		this.barMarkers = this.state.bars.map((bar, index) => {
			return new window.google.maps.Marker({
				animation: window.google.maps.Animation.DROP,
				icon: defaultIcon,
				id: index,
				map: this.magounMap,
				position: {lat: bar.venue.location.lat, lng:bar.venue.location.lng},
				title: `${bar.venue.name} at ${bar.venue.location.address}`
			})
		}) 

		// see https://developers.google.com/maps/documentation/javascript/reference/info-window
		const barInfo = new window.google.maps.InfoWindow();
		const populateBarInfo = (info, marker, map) => {
			if (info !== marker) {
				// this will be an item from the barMarkers
				info.marker = marker;
				info.setContent(`${marker.title}`);
				info.open(map, marker);
				info.addListener("closeclick", () => info.marker = null);
			}
		}

		this.barMarkers.forEach((marker, index) => {
			marker.addListener("click", () => populateBarInfo(barInfo, marker, this.magounMap));
			marker.addListener('mouseover', () => marker.setIcon(highlightedIcon));
			marker.addListener('mouseout', () => marker.setIcon(defaultIcon));
		});

		this.drawingMngr = new window.google.maps.drawing.DrawingManager({
			drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
			drawingControl: true,
			drawingControlOptions: {
				position: window.google.maps.ControlPosition.TOP_LEFT,
				drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
			},
		});

	}

	showListings = () => {
		this.bounds = new window.google.maps.LatLngBounds();
		this.barMarkers.forEach(marker => {
			marker.setMap(this.magounMap);
			this.bounds.extend(marker.position);
		});
		this.magounMap.fitBounds(this.bounds);
	}

	hideListings = () => this.barMarkers.forEach(marker => marker.setMap(null));

	handlePolygon = (event) => {
		const searchWithinPolygon = (markers) => {
			for (let i = 0; i < markers.length; i++) {
				if(window.google.maps.geometry.poly.containsLocation(markers[i].position, this.polygon)) {
					markers[i].setMap(this.magounMap) 
				} else {
					markers[i].setMap(null);
				}
			}
		}

		if (this.polygon) {
			this.polygon.setMap(null);
			this.hideListings();
		}
		this.drawingMngr.setDrawingMode(null);
		this.polygon = event.overlay;
		this.polygon.setEditable(true);
		searchWithinPolygon(this.barMarkers);
		this.polygon.getPath().addListener('set_at', searchWithinPolygon);
		this.polygon.getPath().addListener('insert_at', searchWithinPolygon);
	}

	toggleDrawing = () => {
		if (this.drawingMngr.map) {
			this.drawingMngr.setMap(null);
			if (this.polygon) this.polygon.setMap(null);
		} else {
			this.drawingMngr.setMap(this.magounMap);
			this.drawingMngr.addListener('overlaycomplete', this.handlePolygon);
		}
	}

	loadScript = (url) => {
		const indexjs = window.document.getElementsByTagName("script")[0];
		const script = window.document.createElement("script");
		script.src = url;
		script.async = true;
		script.defer = true;
		indexjs.parentNode.insertBefore(script, indexjs);
	}

	loadMap = () => {
		const key = "AIzaSyAKidTbGki0g1eG1laz79qvkDVLMYVxLOU";
		const libraries = ["drawing", "geometry", "geocoder"];
		const version = "3";
		// Something I never would have figured out without Yahya, When the script loads, it will look in the window object for a function called initMap, so we need to assign window.initMap to our initMap function.
		window.initMap = this.initMap
		this.loadScript(`https://maps.googleapis.com/maps/api/js?key=${key}&libraries=${libraries.join(",")}&v=${version}&callback=initMap`);

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
			// One of the most useful things I learned in Yahya Elharony's tutorial video series was that we can supply an optional callback to setState that will execute after state is set. Here we load the map, only after successfully fetching our locations from Four Square.
			.then((response) => this.setState({bars: response.data.response.groups[0].items}, this.loadMap))
			.catch((error) => console.log(error));
	}

	componentDidMount() {
		this.loadData();
	}

	render() {
		return (
			<div className="App">
				<Navbar />
				<Hero />
				<main>
					<div id="options-box">
						<input id="show-listings" onClick={this.showListings} type="button" value="Show Locations" />
						<input id="hide-listings" onClick={this.hideListings} type="button" value="Hide Locations" />

						<input id="toggle-drawing" onClick={this.toggleDrawing} type="button" value="Drawing Tools" />

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

export default App;
