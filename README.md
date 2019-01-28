# The Bars of Davis Square

## What is this?

The Bars of Davis Square is a loving tribute to the bars, pubs, breweries, and etc. in and around Davis Square, Somerville. 

Users can enter the name of a bar in the search box at the top right of the page to find a specific bar or they can use the map tools to (1) find bars in an area of their choosing, (2) zoom in on a particular area, or (3) find all of the bars within walking distance of a particular address. 

## Getting Started

Fork and clone the [repository](https://github.com/julianjohannesen/neighborhood_map). Bars of Davis Square was created with Create React App. From within the Bars of Davis Square directory:

```npm
npm install
```
and then
```npm
npm start
```
Navigate to the app in your browser.

## Issues

Please report any issues [here](https://github.com/julianjohannesen/neighborhood_map/issues).

## Details

The Bars of Davis Square was created using React and Bulma CSS. The information that appears on the map and the map itself are made possible by FourSquare's API and  Google's Google Maps JavaScript API. The application first fetches a list of Davis Square area bars from FourSquare's API, and, after setting state to capture the response data, calls a function that fetches and loads our map. Map markers are generated and assigned to each venue returned by FourSquare and a single Info Window instance is populated with the relevant information whenever a user clicks on a marker. The drawing tools, zoom functionality, and search-within-time-by-mode functionality are accomplished with the Google Maps API.

## Thanks

I'd like to thank Yahya Elharony for his series of tutorials on using the FourSquare and Google Maps APIs together.