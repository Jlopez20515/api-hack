const STORE = {
  tempQueryAPIParameter: '&apikey=iLVflnmtCAdI8CSd9fnIgEh5Ys2jx2iY',
  tempQueryAPIParameter2: 'apikey=iLVflnmtCAdI8CSd9fnIgEh5Ys2jx2iY',
  cities: [],
  currentConditions: {},
  geoPositionData: {}
}
const autocompleteUrl = 'http://dataservice.accuweather.com/locations/v1/cities/autocomplete?language=en-us&q=';
const getCurrentConditions = 'http://dataservice.accuweather.com/currentconditions/v1/';
const geoPositionUrl = 'http://dataservice.accuweather.com/locations/v1/';
// apikey=6OZLurgb9tXTUxFourfGrlDeE3pIVPLU';
// apikey=iLVflnmtCAdI8CSd9fnIgEh5Ys2jx2iY';

function getGeoPosition(highestRankedCityKey) {
  let geoUrl = geoPositionUrl
             + highestRankedCityKey
             + '?'
             + STORE.tempQueryAPIParameter;
  console.log('Geo Position Url: ' + geoUrl);
  fetch(geoUrl, {
      method: 'GET',
      headers: {"Accept": "application/json"},
      mode: 'cors'
    }).then((response) => {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        return response.json();
    }).then((data) => {
        STORE.geoPositionData = data;
        initMap(STORE.geoPositionData.GeoPosition.Latitude, STORE.geoPositionData.GeoPosition.Longitude);
        console.log('GeoPosition Data: ', STORE.geoPositionData);
    }).catch(function(err) {
      console.log('getWeather() error', err);
      return err;
    });
}

function showWeatherInfo() {
  let temperature = STORE.currentConditions.Temperature.Imperial.Value;
  let tempUnit = STORE.currentConditions.Temperature.Imperial.Unit;
  let weatherText = STORE.currentConditions.WeatherText;
  let city = STORE.cities[0].LocalizedName;
  let state = STORE.cities[0].AdministrativeArea.LocalizedName;
  let country = STORE.cities[0].Country.LocalizedName;
  $('.weather').html(`Temperature: ${temperature}º ${tempUnit}`);
  $('.forecast').html(weatherText);
  $('.location').html(`Location: ${city}, ${state}, ${country}`);
}

function getWeather(highestRankedCityKey) {
  let currentConditionsUrl = getCurrentConditions
                           + highestRankedCityKey
                           + '?'
                           + STORE.tempQueryAPIParameter2;
  console.log('Current Conditions URL: ', currentConditionsUrl);
  fetch(currentConditionsUrl, {
      method: 'GET',
      headers: {"Accept": "application/json"},
      mode: 'cors'
    }).then((response) => {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        return response.json();
    }).then((data) => {
        console.log('Current Weather Condiitons: ', data);
        STORE.currentConditions = data[0];
        showWeatherInfo();
    }).catch(function(err) {
      console.log('getWeather() error', err);
      return err;
    });
}

function getCityInfo(queryUrl) {
  console.log('City Info URL: ', queryUrl);
  fetch(queryUrl, {
      method: 'GET',
      headers: {"Accept": "application/json"},
      mode: 'cors'
    }).then((response) => {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        return response.json();
    }).then((data) => {
        STORE.cities = data;
        console.log('Array of Cities: ', STORE.cities);
        let highestRankedCityKey = STORE.cities[0].Key;
        getGeoPosition(highestRankedCityKey);
        // let state = STORE.cities[0].AdministrativeArea.LocalizedName;
        // let country = STORE.cities[0].Country.LocalizedName;
        // let city = STORE.cities[0].LocalizedName;
        getWeather(highestRankedCityKey);
    }).catch(function(err) {
      console.log('goFetch() Error :-S', err);
      return err;
    });
}

function formUrl(cityInput) {
  let queryUrl = autocompleteUrl + cityInput + STORE.tempQueryAPIParameter;
  getCityInfo(queryUrl);
}

function initializeApp() {
  $('.js-submit').on('submit', event => {
    event.preventDefault();
    let queryTarget = $(event.currentTarget).find('.cityInput');
    let cityInput = queryTarget.val();
    queryTarget.val('');
    formUrl(cityInput);
  });
}

function searchMarker() {
  console.log ('ddsdsdcsd')
}

function initMap(lat, lng) {
  let pin = {
    lat: lat || 34.052,
    lng: lng || -118.244
  };
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: pin
  });
  let marker = new google.maps.Marker({
    position: pin,
    map: map,
    draggable: true
  });
}

$(initializeApp);
