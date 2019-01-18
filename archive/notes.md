# Notes

## Google Maps API Key

Key: AIzaSyAKidTbGki0g1eG1laz79qvkDVLMYVxLOU
URL: 

## Library Thing API

Key: 45d7feef950cfcbdc6859f11ff455693

### LibraryThing Web Services API - Version 1.1

BASIC DOCS: https://www.librarything.com/services/

GET WORK: http://www.librarything.com/services/rest/documentation/1.1/librarything.ck.getwork.php
Returned by GET WORK: http://www.librarything.com/commonknowledge/



The current stable release version for the LibraryThing Services API is 1.1. 
You may direct your API calls to a specific version by changing the path in the request.

### Request formats
REST - This format is a simple HTTP GET or POST action and expects method information. Requests follow the following format:

```js
const version = "1.1";
const method_name = [ "ck.getwork", "ck.getauthor", "local.getvenuesnear", "local.getvenue", "local.searchvenues", "local.geteventsnear", "local.searchevents"]
const apiKey = ;
const other = {};
const url = `http://www.librarything.com/services/rest/${version}/?librarything.${method_name[0]}&${Object.keys(other) !== 0 ? other : ""}&apikey=${}`;
```

example: http://www.librarything.com/services/rest/1.1/?method=librarything.ck.getwork&id=1060&apikey=d231aa37c9b4f5d304a60a3d0ad1dad4

By default, REST requests will send a REST response.

### Response formats
REST - This response is an XML block.

Here is an (example REST response)[./library_thing_response_example.xml] for the work Jonathan Strange & Mr. Norrell

JSON (coming soon)
This response is a text string in Javascript Object Notation (JSON). 
Although originally designed to be a portable data solution for Javascript most other languages can also make use of the format.

Notes
Limits - You are limited to a maximum of 1,000 requests per day.

## Marvel API key

Limit of 3000 requests per day.

Your public key
c14c3e20f1dbdae6c0e76e11044f7884
Your private key
16f24b82f6a1296513c03538f4ad8bd352963a10

### Server Side versus Client Side

### Endpoint Notes

- The Marvel Comics API’s base endpoint is http(s)://gateway.marvel.com/
- All API endpoints are documented as machine-readable representations using the swagger-doc specification. These representations are available at http://gateway.marvel.com/docs.
- All endpoints currently accept only HTTP GET requests.

### Headers Notes Re: ETags, If-None-Match, and Accept-Encoding: Gzip

#### Initial request:

```js
Request Url: http://gateway.marvel.com/v1/public/comics
Request Method: GET
Params: {
	"apikey": "your api key",
	"ts": "a timestamp",
	"hash": "your hash"
}
Headers: {
    Accept: */*
    Accept-Encoding:gzip
}
```

#### Initial response:

```js
Status Code: 200
Access-Control-Allow-Origin: *
Date: Wed, 18 Dec 2013 22:00:55 GMT
Connection: keep-alive
ETag: f0fbae65eb2f8f28bdeea0a29be8749a4e67acb3
Content-Length: 54943
Content-Type: application/json
Content-Encoding: gzip
```

#### Subsequent request:

```js
Request Url: http://gateway.marvel.com/v1/public/comics
Request Method: GET
Params: {
  "apikey": "your api key",
  "ts": "a timestamp",
  "hash": "your hash"
}
Headers: {
  Accept: */*
  Accept-Encoding:gzip
  If-None-Match: f0fbae65eb2f8f28bdeea0a29be8749a4e67acb3
}
```

#### Subsequent response:

```js
Status Code: 304
Access-Control-Allow-Origin: *
Date: Wed, 18 Dec 2013 22:03:20 GMT
Connection: keep-alive
ETag: f0fbae65eb2f8f28bdeea0a29be8749a4e67acb3
```
### CORS Notes

#### Without a callback:

```js
Request: GET http://gateway.marvel.com/v1/public/comics?apikey=yourAPIKEY
Response: 
{
  "code": 200,
  "status": "Ok",
  "etag": "f0fbae65eb2f8f28bdeea0a29be8749a4e67acb3",
  "data": {
  … [other data points]
}
```

#### With a callback

```js
Request: GET http://gateway.marvel.com/v1/public/comics?apikey=yourAPIKEY&callback=callback_param
Response: 
callback_param({
  "code": 200,
  "status": "Ok",
  "etag": "f0fbae65eb2f8f28bdeea0a29be8749a4e67acb3",
  "data": {
  … [other data points]
})
```
### Notes about Entity Types and Images

Look here: https://developer.marvel.com/documentation/entity_types
and here: https://developer.marvel.com/documentation/images

### Example API Calls

Find them here: https://developer.marvel.com/docs