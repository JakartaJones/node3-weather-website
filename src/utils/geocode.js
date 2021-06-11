const request = require("postman-request");

const geocode = (address, callback) => {
  const geocodeURL = (address) => {
    const encodedAddress = encodeURIComponent(address); //formats special characters for URL compatibility
    return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=pk.eyJ1IjoiamFrYXJ0YWpvbmVzIiwiYSI6ImNrcDh6b3R0bjA0d20yeHA5bDhyYjMzaDUifQ.aQTnxD-YJtNF7Ev1LT48hw&limit=1`;
  };

  const url = geocodeURL(address);

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to location services.", undefined);
    } else if (body.features.length === 0) {
      callback("Unable to find location.", undefined);
    } else {
      callback(undefined, {
        location: body.features[0].place_name,
        latitude: body.features[0].center[1],
        longitude: body.features[0].center[0],
      });
    }
  });
};

module.exports = geocode;
