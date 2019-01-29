import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'assets/css/App.css';
import axios from 'axios';
import Navbar from './components/layout/Navbar.js';
import Footerx from './components/layout/Footerx.js';
import Mapx from './components/Mapx.js';
import About from './pages/About';
import NoMatch from './pages/NoMatch';

class App extends Component {

	state = {
		bars: [
			// A sample
			// 0: {
			//   venue: {
			//		categories: []
			//		id: asdf
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
		],
		//barDetails: []
		barMarkers: [],
		bounds: {},
		davisMap: {},
		polygon: [],
	}

	// Davis Square lat long
	lat = 42.396365;
	lng = -71.122262;

	initMap = () => {
		
		// mapOpts contains our map options
		const mapOpts = {
			center: { "lat": this.lat, "lng": this.lng },
			mapTypeControlOptions: {
				mapTypeIds: ['styled_davisMap', 'roadmap',]
			},
			zoom: 16,
		}
		// Create the map, bounds, info window, and drawing manager instances
		this.setState({
			davisMap: new window.google.maps.Map(document.getElementById("map"), mapOpts),
			bounds: new window.google.maps.LatLngBounds(),
			barInfo: new window.google.maps.InfoWindow(),
			drawingMngr: new window.google.maps.drawing.DrawingManager({
				drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
				drawingControl: true,
				drawingControlOptions: {
					position: window.google.maps.ControlPosition.TOP_LEFT,
					drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
				},
			}),
		});

		// Create a custom style instance and set our map type and map type ID.
		const davisMapStyle = new window.google.maps.StyledMapType([
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
		// We're adjusting the map state without notifying React. We should be setting state. Not sure how yet.
		this.state.davisMap.mapTypes.set('styled_davisMap', davisMapStyle);
		this.state.davisMap.setMapTypeId('styled_davisMap');

		// TODO: Need to find a way to create color for default and highlighted marker icons

		// Map over our data and create a marker for each bar datum.
		// see https://developers.google.com/maps/documentation/javascript/reference/marker
		this.setState({
			barMarkers: this.state.bars.map((bar, index) => {

				const image = {
					url: 'https://maps.google.com/mapfiles/ms/micons/bar.png',
					size: new window.google.maps.Size(32, 32),
					origin: new window.google.maps.Point(0, 0),
					anchor: new window.google.maps.Point(16, 32),
					//scaledSize: new window.google.maps.Size(16, 16)
				};
				const shape = {
					coords: [1, 1, 1, 32, 16, 32, 16, 1],
					type: 'poly'
				};

				return new window.google.maps.Marker({
					animation: window.google.maps.Animation.DROP,
					barData: bar,
					icon: image,
					id: index,
					map: this.state.davisMap,
					position: { lat: bar.venue.location.lat, lng: bar.venue.location.lng },
					shape: shape,
					title: bar.venue.name,
					visible: true,
					zIndex: 10 + index,
				})
			})
		});

		// For each bar marker, add a click listener to populate the info window with the appropriate information. Also add mouse event listeners to toggle the icon color
		// Changing state here by adding listeners, but using the Google Maps API's addListener to add map listeners. How do you notify react of this change?
		this.state.barMarkers.forEach((marker, index) => {
			marker.addListener("click", () => this.populateBarInfo(this.state.barInfo, marker, this.state.davisMap));

			//marker.addListener('mouseover', () => marker.setIcon(highlightedIcon));
			//marker.addListener('mouseout', () => marker.setIcon(defaultIcon));
		});
	}

	// Create an info window instance and a function to populate the info window with the approriate information, e.g. the name of the bar, and to open the window. Also add a "closeclick" listener to empty the info window and prepare it for the next time it will be used.
	// see https://developers.google.com/maps/documentation/javascript/reference/info-window
	populateBarInfo = (info, marker, map) => {
		const updateInfoWin = () => {
			info.marker = marker;
			info.setContent(`<h3>${marker.title}</h3><p>${marker.barData.venue.location.address}</p>`);
			info.open(map, marker);
			info.addListener("closeclick", () => info.marker = null);
			return info;
		}
		const toggleBounce = () => {
			if (marker.getAnimation() !== null) {
				marker.setAnimation(null);
			} else {
				marker.setAnimation(window.google.maps.Animation.BOUNCE);
			}
		}
		if (info !== marker) {
			this.setState({
				barInfo: updateInfoWin(),
				barMakers: this.state.barMarkers.map( (markerItem) => {
					if(markerItem.barData.id === marker.barData.id){
						markerItem.animation = toggleBounce();
						return marker
					} else {
						return marker
					}
				}),
			});
		}
	}

	///////////////
	// MAP Tools //
	///////////////

	// handleSearch fires on change to the search input and attempts to match any word entered to a word in venue name, toggling the visible property for that venue's marker to true.
	handleSearch = (event) => {
		// Set the state of barMarkers to show matching bars and hide non-matching bars using marker.visible
		this.setState({
			// Loop through each marker and examine the venue name. If the venue name partially or completely matches the search term, then set that marker's visible property to true. If there's no match, then set it to false.
			barMarkers: this.state.barMarkers.map((marker) => {
				let atLeastOne = false;
				if (marker.barData.venue.name.toLowerCase().includes(event.target.value.toLowerCase())) {
					marker.visible = true;
					atLeastOne = true;
				} else {
					marker.visible= false;
				}
				
				return marker;
			}),
		});
	}

	// A function to show our bar markers on the click of a button. We can do this by setting the map property of each marker and extending the bounds of our map to ensure that our map encompasses all of our markers.
	showListings = () => {
		this.setState({
			barMarkers: this.state.barMarkers.map(marker => {
				marker.setMap(this.state.davisMap);
				this.state.bounds.extend(marker.position);
				// A flag I added to enable the venue list view functionality
				marker.visible = true;
				return marker;
			}),
		})
		// Changing state without notifying react. I tried including this in setState setting the state on davisMap to the result of an anonymous function that fitbounds and then returned the map, but I got some errors I couldn't resolve. 
		this.state.davisMap.fitBounds(this.state.bounds);
	}

	// A function to hide our bar markers by setting the map property back to null.
	hideListings = () => this.setState({
		barMarkers: this.state.barMarkers.map(marker => {
			marker.setMap(null);
			marker.visible = false;
			return marker;
		}),
	})

	/* 
	handlePolygon shows only markers that are within a polgyon.
	
	First, if there is already a polgyon on the map, handlePolgyon removes it and all of the map markers from the map. It then sets the drawing mode to null. This will set the cursor to non-drawing mode.
	
	We then overwrite the polygon with event.overlay.

	Next, we call searchWithinPolygon, passing in the barMarkers array. This will add back to the map just the markers that are within the polygon.

	searchWithinPolygon takes an array of markers and loops through those markers performing a check (with containsLocation) on each marker to see if it is within the polygon. If the answer is yes, then that marker is added to the map. If the answer is no, then that marker is removed from the map. This involves changing the markers state.

	Finally, we also need to add listeners for the events that fire when the polygon is edited and call searchWithinPolgyon when that happens. The listeners are set on the array of LatLng objects that define any polygon, which we can get with getPath(). When the polygon is edited, i.e., when there's a change to the array of LatLng objects that define the polgyon, the set_at and insert_at events are fired. When those events fire, that's when we want to searchWithinPolgyon.

	toggleDrawing will eventually add a listener to the drawing manager to call handlePolygon on the overlaycomplete event.
	*/

	// PROBLEMS: 
	// 1. Editing the polygon by expanding it's boundaries does not show new new markers. I need to call the handle function on each edit.
	// 2. Old polygon's stick around when you draw a new one. At start of drawing, I need to clear previous polygons.

	handlePolygon = (event) => {
		const searchWithinPolygon = (markers) => {
			this.setState({
				barMarkers: (() => {
					for (let i = 0; i < markers.length; i++) {
						const cL = window.google.maps.geometry.poly.containsLocation(markers[i].position, this.state.polygon);
						if (cL) {
							markers[i].setMap(this.state.davisMap);
							markers[i].visible = true;
						} else {
							markers[i].setMap(null);
							markers[i].visible = false;
						}
					}
					return markers;
				})(),
			});
		}

		if (this.state.polygon.length > 0) {
			this.setState({
				polygon: (() => {
					this.state.polygon.setMap(null);
					return this.state.polygon;
				})(),
			})
			this.hideListings();
		}
		// Changing drawingMngr's state without notifying react
		this.state.drawingMngr.setDrawingMode(null);
		this.setState({
			polygon: (() => {
				event.overlay.setEditable(true);
				return event.overlay;
			})(),
		})

		searchWithinPolygon(this.state.barMarkers);

		this.state.polygon.getPath().addListener('set_at', searchWithinPolygon);
		this.state.polygon.getPath().addListener('insert_at', searchWithinPolygon);
	}

	// A function to toggle the drawing controls on the map
	toggleDrawing = () => {
		console.log("Here's the drawing manager object: ", this.state.drawingMngr)
		if (this.state.drawingMngr.map) {
			this.state.drawingMngr.setMap(null);
			if (this.state.polygon) this.state.polygon.setMap(null);
		} else {
			this.state.drawingMngr.setMap(this.state.davisMap);
			this.state.drawingMngr.addListener('overlaycomplete', this.handlePolygon);
		}
	}

	zoomToArea = () => {
		const geocoder = new window.google.maps.Geocoder();
		const address = document.getElementById("zoom-to-area-text").value;
		if (address === '') { window.alert("You must enter an area or address.") }
		else {
			const geocodeOpts = {
				address: address,
				componentRestrictions: { locality: "Somerville" },
			};
			const zoomTo = (results, status) => {
				if (status === window.google.maps.GeocoderStatus.OK) {
					this.davisMap.setCenter(results[0].geometry.location);
					this.davisMap.setZoom(18);
				} else {
					window.alert("We could not find the location. Please try entering a more specific location.");
				}
			}
			geocoder.geocode(geocodeOpts, zoomTo);
		}
	}

	displayMarkersWithinTime = (response) => {
		const maxDuration = document.getElementById("max-duration").value;
		const origins = response.originAddresses;
		const destinations = response.destinationAddresses;
		let atLeastOne = false;
		for (let i = 0; i < origins.length; i++) {
			const results = response.rows[i].elements;
			for (let j = 0; j < destinations.length; j++) {
				const element = results[j];
				if (element.status === "OK") {
					const distanceText = element.distance.text;
					const duration = element.duration.value / 60;
					const durationText = element.duration.text;
					if (duration <= maxDuration) {
						this.barMarkers[i].setMap(this.davisMap);
						atLeastOne = true;
						const infoWindow = new window.google.maps.InfoWindow({
							content: durationText + " away " + distanceText,
						});
						infoWindow.open(this.davisMap, this.barMarkers[i]);
						this.barMarkers[i].infoWindow = infoWindow;
						window.google.maps.event.addListener(this.barMarkers[i], "click", () => infoWindow.close());
					}
				}
			}
		}
	}

	// A function to search from an origin within a radius determined by time and mode of travel
	searchWithinTime = () => {
		const distanceMatrixService = new window.google.maps.DistanceMatrixService();
		const address = document.getElementById("search-within-time-text").value;
		if (address === "") {
			window.alert("Please enter an address.");
		} else {
			this.hideListings();
			const origins = [];
			// There's a limit of 25 origins/destinations per call, otherwise this line would include i < this.barMarkers.length, not i < 25
			for (let i = 0; i < 25; i++) {
				origins[i] = this.barMarkers[i].position;
			}
			const destination = address;
			const mode = document.getElementById("mode").value;
			distanceMatrixService.getDistanceMatrix({
				// There's a limit of 25 origins and destinations per call
				origins: origins,
				destinations: [destination],
				travelMode: window.google.maps.TravelMode[mode],
				unitSystem: window.google.maps.UnitSystem.IMPERIAL,
			}, (response, status) => {
				if (status !== window.google.maps.DistanceMatrixStatus.OK) {
					window.alert("Error has status" + status);
				} else {
					this.displayMarkersWithinTime(response);
				}
			});
		}
	}

	// PROBLEMS: 
	// 1. zooming on the map does not effect which venues are showing in the list view. On zoom, I need to update each marker's visible property.
	listClick = (event) => {
		this.state.barMarkers.forEach((marker) => {
			if (marker.barData.venue.id === event.target.id) {
				this.populateBarInfo(this.state.barInfo, marker, this.state.davisMap)
			}
		});
	}


	////////////////////////////////////////////////
	// INSERT SCRIPT TAG AND LOAD GOOGLE MAPS API //
	////////////////////////////////////////////////
	// A function to load our google maps api script
	loadScript = (url) => {
		const indexjs = window.document.getElementsByTagName("script")[0];
		const script = window.document.createElement("script");
		script.src = url;
		script.async = true;
		script.defer = true;
		indexjs.parentNode.insertBefore(script, indexjs);
	}

	// A function to load our map by calling loadScript with our URL details
	loadMap = () => {
		console.log("loadMap fired")
		const key = "AIzaSyAKidTbGki0g1eG1laz79qvkDVLMYVxLOU";
		const libraries = ["drawing", "geometry", "geocoder"];
		const version = "3";
		// Something I never would have figured out without Yahya, When the script loads, it will look in the window object for a function called initMap, so we need to assign window.initMap to our initMap function.
		window.initMap = this.initMap
		this.loadScript(`https://maps.googleapis.com/maps/api/js?key=${key}&libraries=${libraries.join(",")}&v=${version}&callback=initMap`);

	}

	////////////////////////////
	// FETCH FOUR SQUARE DATA //
	////////////////////////////

	// A function to fetch our FourSquare data using axios
	loadData = () => {
		const endpoint = "https://api.foursquare.com/v2/venues/explore?";
		const params = {
			client_id: "W5EAA4B3DHWV1ZLG3OATVOZYTYZNI5WWG0LRLPHBHVHC3JV3",
			client_secret: "3ZTMTTP43WP4OXWOAKITGOYLIVPVW1NDQHPZ0I342VH4R5X0",
			v: 20190117,
			ll: `${this.lat},${this.lng}`,
			section: "drinks",
		}
		axios.get(endpoint + new URLSearchParams(params))
			// One of the most useful things I learned in Yahya Elharony's tutorial video series was that we can supply an optional callback to setState that will execute after state is set. Here we load the map, only after successfully fetching our locations from FourSquare.
			.then((response) => this.setState({ bars: response.data.response.groups[0].items }, this.loadMap))
			.catch((error) => console.log(error));
	}

	// TODO: A function to fetch details for a bar. This won't work as is. It depends on the bar's FourSquare id, which you need to search for and find first. Only then can you get bar details. 
	// NOTE: FourSquare's generosity only stretches so far, so I need to watch for status 429 - too many requests.
	loadDetails = (event) => {
		const endpoint = "https://api.foursquare.com/v2/venues/";
		const params = {
			client_id: "W5EAA4B3DHWV1ZLG3OATVOZYTYZNI5WWG0LRLPHBHVHC3JV3",
			client_secret: "3ZTMTTP43WP4OXWOAKITGOYLIVPVW1NDQHPZ0I342VH4R5X0",
			v: 20190117,
		}

		let theId = event.target.venue.id + "?";
		let urlParams = new URLSearchParams(params);
		let theUrl = endpoint + theId + urlParams;
		axios.get(theUrl)
			.then((response) => {
				// I'm setting state for each bar detail item that's being fetched and that triggers a lot of unnecessary rerenders. What can I do about that?
				console.log("The URL was: ", theUrl, "The successful response is: ", response)
				this.setState({ barDetails: response.data.response.venue })
			})
			.catch((error) => console.log(error));
		this.loadMap();
	}

	// Call loadData (and thus loadMap), as soon as our component renders.
	componentDidMount() {
		this.loadData();
	}

	render() {
		return (
			<Router basename="bars-of-davis">
				<div className="App">
					<Navbar handleSearch={this.handleSearch} />
					<Switch>
						<Route exact path="/" render={() => <Mapx
							// barDetails={this.state.barDetails}
							barMarkers={this.state.barMarkers}
							showListings={this.showListings}
							hideListings={this.hideListings}
							toggleDrawing={this.toggleDrawing}
							zoomToArea={this.zoomToArea}
							searchWithinTime={this.searchWithinTime}
							listClick={this.listClick}
						/>} />
						<Route exact path="/About" component={About} />
						<Route render={props => <NoMatch {...props} theLocation={this.props.location} />} />
					</Switch>
					<Footerx />
				</div>
			</Router>
		)
	}
}

export default App;
