const request = require("postman-request");

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=528bfd5ee97a7d25dd8949337bb07175&query=${latitude},${longitude}&units=f`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service.", undefined);
    } else if (body.error) {
      callback(
        /*"Unable to find weather for this location."*/ console.log(body.error),
        undefined
      );
    } else {
      callback(
        undefined,
        `${body.current.weather_descriptions[0]} and ${body.current.temperature}f. It feels like ${body.current.feelslike}f. The chance of rain is ${body.current.precip}%.`
      );
    }
  });
};

module.exports = forecast;
