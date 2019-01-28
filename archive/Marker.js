import React, { Component } from 'react'

export default class Marker extends Component {

    // locations.array will come from the API but in app and will then get passed down as a prop
    locationsArray = [
        { title: "Landing Site 1", location: { lat: 40.719526, lng: -74.0089934 } },
        { title: "Forward Base Alpha", location: { lat: 40.720313, lng: -74.0085313 } },
        { title: "Forward Base Beta", location: { lat: 40.722311, lng: -74.008511 } },
    ];

    /* This function takes in a COLOR, and then creates a new marker icon of that color. The icon will be 21 px wide by 34 high, have an origin of 0, 0 and be anchored at 10, 34. */
    makeMarkerIcon = (markerColor) => {
        const markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34)
        );
        return markerImage;
    }

    /* Style the markers a bit. This will be our listing marker icon. */
    defaultIcon = this.makeMarkerIcon('0091ff');

    /* Create a "highlighted location" marker color for when the user mouses over the marker. */
    highlightedIcon = this.makeMarkerIcon('FFFF24');

    /* Map over the locations from the API and create a marker for each location, storing it in the markers array. Expand the boundary of the map if necessary. */
    markersArray = locationsArray.map((location, index) => {
        // Create a marker for this location
        return new google.maps.Marker({
            // This animation isn't working.
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: index,
            // To show markers on load, set the map property here, e.g. map: map. Otherwise, set it before boundary.extend.
            // These will need to change depending on the API
            position: location.location,
            title: location.title,
        });
	});

	// Create an info window instance without any details
	theInfoWindow = new google.maps.InfoWindow()

	// Add the title, etc. to the info window and then clear it again on close
	populateInfoWindow = (infoWind, marker, map) => {
		if (infoWind !== marker) {
			infoWind.marker = marker;
			// Set the info window content to the title plus the location in lat/lng.
			// I'll probably want data from the API here
			infoWind.setContent(`${marker.title} <br> Latitude: ${marker.position.lat}, Longitude: ${marker.position.lng}`);
			// Open the info window.
			infoWind.open(map, marker);
			// Clear marker property when info window is closed.
			infoWind.addListener("closeclick", () => infoWind.marker = null);
		}
	}

	// Add a listener for each marker. The callback creates the window and populates it
	this.markersArray.forEach((marker, index) => {
		marker.addListener(
			"click",
			() => populateInfoWindow(theInfoWindow, marker, this.props.map)
		);
	});

	// Two event listeners - one for icon mouseover, and one for icon mouseout, to change the colors back and forth.
	marker.addListener('mouseover', () => this.setIcon(highlightedIcon));
	marker.addListener('mouseout', () => this.setIcon(defaultIcon));

	// showListins will show all markers and expand the map if necessary
	showListings = () => {

		// Ensure that no matter where our markers are placed, the map will expand to encompass them
		bounds = new google.maps.LatLngBounds();

		// Extend the map boundary to encompass all markers. This has to happen after the markers have been created.
		markersArray.forEach((marker) => {
			/* If you want to hide all markers, not just the ones that are out of bounds of your map given the center and zoom level that you set, then you need to not set the map when you create the markers and instead set the map here. */
			marker.setMap(this.props.map);
			bounds.extend(marker.position);
		});

		// Expand the map with fitBounds.
		this.props.map.fitBounds(bounds);

	}

	// hideListings will hide any listings when called
	// by the hide listings button's event listener.
	hideListings = () => {
		// For each marker, set its map to null. The 
		// markers still exist, they just aren't 
		// assigned to a map
		markersArray.forEach(marker => {
			marker.setMap(null);
		});
	}

	// Add the event listeners for clicking on the show or
	// hide listings buttons.
	document.getElementById("show-listings").addEventListener("click", showListings);
	document.getElementById("hide-listings").addEventListener("click", hideListings);
	
	render() {
        return(
			<div>
				Hello!
			</div>
    	)
	}
}
