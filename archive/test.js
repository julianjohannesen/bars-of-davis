handlePolygon = (event) => {
    const searchWithinPolygon = (markers) => {
			for (let i = 0; i < markers.length; i++) {
                const containsLocation = blahblah.containsLocation(markers[i].position, polygon);
                if(containsLocation){markers[i].setMap(davisMap) } 
                else {markers[i].setMap(null);}
			}
	}
    if (polygon) {
        this.setState({
            polygon: (()=>{
                polygon.setMap(null);
                return polygon;
            })(),
        })
        this.hideListings();
    }
    drawingMngr.setDrawingMode(null);
    this.setState({ polygon: event.overlay, })
    polygon.setEditable(true);

    searchWithinPolygon(barMarkers);
    
    //getPath will return an array of LatLng objects that define the polygon, so here we're adding a listener to that array of LatLng objects. When the polygon is edited, i.e., when there's a change to the array of LatLng objects that define the polgyon, the set_at and insert_at events are fired. When those events fire, that's when we want to searchWithinPolgyon.
    polygon.getPath().addListener('set_at', searchWithinPolygon);
    polygon.getPath().addListener('insert_at', searchWithinPolygon);
}