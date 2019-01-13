# Issues

## Zoom Level
I'm having a problem with the map zoom level. I've been able to display multiple locations, each with a marker and info window. However, the zoom level is not correct. One issue that I've read about that can cause this is the async nature of the API. At some point, there has to be an API call to get the map data and then sometime later there has to be another call to get some more data (I think), if you've added locations to your map that did not fall within the bounds of the map when you created it. If you try to expand the bounds of the map before the map data is received and rendered, that would be a problem. But my markers and info windows are showing up just fine, and in the code, they appear before my attempt to expand the map. Doesn't the map data have to be received and rendered before the markers and info windows can be placed. Or is there some promise stuff happening, where the API makes sure that the map is rendered before placing markers? If that were true, why wouldn't it be true for expanding the map boundaries?

The solution I read about suggested adding an idle event listener to make sure that the map was done before attempting to expand it. I did that and it did make a difference, but only a partial difference. I'm now zoomed in on NY, but not zoomed in on Tribeca, which I was before attempting to "expand" and "fit" my map boundary.

```js
 google.maps.event.addListenerOnce(map1, 'idle', () => map1.fitBounds(bounds1));
 ```

I also tried removing the "async" and "defer" commands in the script element that loads the Google maps API. That seemed to make no difference.

I also tried adding a single new location with boundary.extend and map.fitBounds. That had a different unexpected behavior. But that's not what I want to do anyway. In the tutorial, extend is called on each marker.

This issue got resolved when I added a button to "show listings." This button caused the map to zoom out from it's defined center to encompass all of the markers on the map. The code within the event handler was the same code I was using before. I think this gives more evidence for the theory that extends() or fitBounds was not being called at the right time previously.

I also addedd a "hide listings" button where I used setMap(null) on each marker to hide all of the markers.

What if I want to show the map, but not show any markers until you hit show listings? In that case you need to make sure that you _don't set the map property_ when you're creating your markers. _Instead, you can use marker.setMap()_ to set the map right before your boundary.extend() call in the "show listings" event handler. 

