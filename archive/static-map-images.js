

const key = 'AIzaSyAKidTbGki0g1eG1laz79qvkDVLMYVxLOU';
const lat = 41.40315;
const long = 2.17380;
const location = `${lat},${long}`;
const size = '500x500';
const heading = 40; 
const pitch = 40;
const fov = 90;

const url = `http://maps.googleapis.com/maps/api/streetview?location=${location}&size=${size}&heading=${heading}&fov=${fov}&pitch=${pitch}&key=${key}`;