// main
// curl --location -g --request GET 'http://api.airvisual.com/v2/countries?key={{653679f0-9720-4210-8c84-4a81d7434e3c}}'

// {
//   "status": "success",
//   "data": {
//     "name": "Eilat Harbor",
//     "city": "Eilat",
//     "state": "South District",
//     "country": "Israel",
//     "location": {
//       "type": "Point",
//       "coordinates": [
//         34.939443,
//         29.531814
//       ]
//     },
//     "forecasts": [ //object containing forecast information
//       {
//         "ts": "2017-02-01T03:00:00.000Z",  //timestamp
//         "aqius": 21, //AQI value based on US EPA standard
//         "aqicn": 7, //AQI value based on China MEP standard
//         "tp": 8, //temperature in Celsius
//         "tp_min": 6, //minimum temperature in Celsius
//         "pr": 976,  //atmospheric pressure in hPa
//         "hu": 100, //humidity %
//         "ws": 3, //wind speed (m/s)
//         "wd": 313, //wind direction, as an angle of 360° (N=0, E=90, S=180, W=270)
//         "ic": "10n" //weather icon code, see below for icon index
//       }, 
//     …  // contains more forecast data for upcoming 76 hours
//     ]
//     "current": {
//       "weather": {
//         "ts": "2017-02-01T01:00:00.000Z",
//         "tp": 12,
//         "pr": 1020,
//         "hu": 62,
//         "ws": 2,
//         "wd": 320,
//         "ic": "01n"
//       },
//       "pollution": {
//         "ts": "2017-02-01T01:15:00.000Z",
//         "aqius": 18,
//         "mainus": "p1", //main pollutant for US AQI
//         "aqicn": 20,
//         "maincn": "p1",  //main pollutant for Chinese AQI
//         "p1": {   //pollutant details, concentration and appropriate AQIs
//           "conc": 20,
//           "aqius": 18,
//           "aqicn": 20
//         }
//       }
//     },
//     "history": { //object containing weather and pollution history information
//       "weather": [
//         {
//           "ts": "2017-02-01T01:00:00.000Z",
//           "tp": 12,
//           "pr": 1020,
//           "hu": 62,
//           "ws": 2,
//           "wd": 320,
//           "ic": "01n"
//         },
//         … // contains more weather historical data for past 48 hours

//       ]
//       "pollution": [
//         {
//           "ts": "2017-02-01T01:15:00.000Z",
//           "aqius": 18,
//           "mainus": "p1",
//           "aqicn": 20,
//           "maincn": "p1",
//           "p1": {
//             "conc": 20,
//             "aqius": 18,
//             "aqicn": 20
//           }
//         },
//       …  // contains more pollution historical data for past 48 hours

//       ]
//     },
//     "units": { //object containing units information
//       "p2": "ugm3", //pm2.5
//       "p1": "ugm3", //pm10
//       "o3": "ppb", //Ozone O3
//       "n2": "ppb", //Nitrogen dioxide NO2 
//       "s2": "ppb", //Sulfur dioxide SO2 
//       "co": "ppm" //Carbon monoxide CO 
//     }
//   }
// }


function getAPIdata() {
    var url = 'https://api.openweathermap.org/data/2.5/forecast';
    var apiKey ='7eb951ddb27d51591fcd0b4ec42b1353';
    var city = 'the%20Hague';

    // construct request
    var request = url + '?' + 'appid=' + apiKey + '&' + 'q=' + city;
    
    // get weather forecast
    fetch(request)

    // parse to JSON format
    .then(function(response) {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
    })
    
    // render weather per day
    .then(function(response) {
        console.log(response);
        // render weatherCondition
        onAPISucces(response);
    })
    
    // catch error
    .catch(function (error) {
        // onAPIError();
        console.error('Request failed', error);
    });
}

/**
 * Render weather listing
 */
function onAPISucces(response) {

    var weatherList = response.list;
    var weatherBox = document.getElementById('weather');

    for(var i=0; i< weatherList.length; i++){
        //console.log(weatherList[i].main.temp - 273.15);

        var dateTime = new Date(weatherList[i].dt_txt);
        var date = formDate(dateTime);
        var time = formTime(dateTime);
        var temp = Math.floor(weatherList[i].main.temp - 273.15);

        forecastMessage =  '<div class="forecastMoment">';
        forecastMessage +=   '<div class="date"> '+date+' </div>';
        forecastMessage +=   '<div class="time"> '+time+' </div>';
        forecastMessage +=   '<div class="temp"> '+temp+'&#176;C </div>';
        forecastMessage += '</div>';

        weatherBox.innerHTML += forecastMessage;
    }
}

/**
 * Error
 */
function updateUIError() {
    var weatherBox = document.getElementById('weather');
    weatherBox.className = 'hidden'; 
}

/**
 * Format date
 */
function formDate(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    return day +' / '+ month;
}

/**
 * Format time
 */
function formTime(date) {
    var hours = date.getHours();
    if(hours<10){
        hours = '0'+hours;
    }
    var minutes = date.getMinutes();
    if(minutes < 10){
        minutes = '0'+ minutes;
    }
    return hours +':'+ minutes;
}

// init data stream
getAPIdata();
// Set api token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2lkYWxpYW1hZGVpcmEiLCJhIjoiY2tta2pmemFoMTF1ZjMxcWsycmp5c21oNyJ9.2iIcxexQ22cTZ2kN7--HRw';

// Initialate map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/cidaliamadeira/ckmuevf8336ja17k7jj3w5maj',
  center: [4.3007, 52.0705],
  zoom: 7
});

// wacht tot de map en styles geladen zijn
map.on('load', function () {

  // laad een extern bestand
  map.loadImage('https://cdn.iconscout.com/icon/free/png-256/location-1542-675835.png', function (error, image) {

      // voeg image toe
      map.addImage('location', image);

      // defineer een punt in het geheugen
      map.addSource('point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [4.32284, 52.067101]
            }
          }]
        }
      });

      // plak de nieuwe source 'point' op de kaart in een eigen layer
      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: 'point',
        layout: {
          'icon-image': 'location',
          'icon-size': 0.25
        }
      });
    }
  );
});