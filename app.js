const STORE = {
  tempQueryAPIParameter: '&apikey=iLVflnmtCAdI8CSd9fnIgEh5Ys2jx2iY',
  tempQueryAPIParameter2: 'apikey=iLVflnmtCAdI8CSd9fnIgEh5Ys2jx2iY',
  cities: [],
  currentConditions: {},
  Precip1hr: {}
}
const autocompleteUrl = 'http://dataservice.accuweather.com/locations/v1/cities/autocomplete?language=en-us&q=';
const getCurrentConditions = 'http://dataservice.accuweather.com/currentconditions/v1/';
const cityUrl = 'http://dataservice.accuweather.com/locations/v1/cities/geoposition/search';
// apikey=6OZLurgb9tXTUxFourfGrlDeE3pIVPLU';
// apikey=iLVflnmtCAdI8CSd9fnIgEh5Ys2jx2iY';

function showWeatherInfo() {
  let temperature = STORE.currentConditions.Temperature.Imperial.Value;
  let tempUnit = STORE.currentConditions.Temperature.Imperial.Unit;
  let weatherText = STORE.currentConditions.WeatherText;
  let Precip1hr = STORE.currentConditions.Precip1hr;
  let city = STORE.cities[0].LocalizedName;
  let state = STORE.cities[0].AdministrativeArea.LocalizedName;
  let country = STORE.cities[0].Country.LocalizedName;
  $('.weather').html(`Temperature: ${temperature}º ${tempUnit}`);
  $('.forecast').html(`weatherText ${Precip1hr}`);
  $('.location').html(`Location: ${city}, ${state}, ${country}`);
}

function getWeather(highestRankedCityKey) {
  let currentConditionsUrl = getCurrentConditions
                           + highestRankedCityKey
                           + '?'
                           + STORE.tempQueryAPIParameter2;
  console.log('Current Condiitons URL: ', currentConditionsUrl);
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

function initMap() {
  let losAngeles = {lat: 34.0522, lng: -118.2437};
  let whittier = {lat: 33.9792, lng: -118.0328};
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: losAngeles
  });

  //sets marker and map to Los Angeles
  let marker = new google.maps.Marker({
    position: losAngeles,
    map: map,
    draggable: true
  });

  let marker2 = new google.maps.Marker({
    position: whittier,
    map: map,
    draggable: true
  });
}

$(initializeApp);
