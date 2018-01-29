const autocompleteUrl = 'http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=6OZLurgb9tXTUxFourfGrlDeE3pIVPLU&language=en-us&q=';

const getWeatherUrl = 'http://dataservice.accuweather.com/currentconditions/v1/';

const temporaryVariable = '?apikey=6OZLurgb9tXTUxFourfGrlDeE3pIVPLU';

// 'http://dataservice.accuweather.com/currentconditions/v1/12345?apikey=6OZLurgb9tXTUxFourfGrlDeE3pIVPLU'

function showCityChoices(data) {
  for (let i = 0; i < data.length; i++) {
    console.log(data[i]);
  }
}

function getWeather(cityKey) {
  let tempUrl = getWeatherUrl + cityKey + temporaryVariable;
  console.log(tempUrl);
  fetch(tempUrl, {
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
        console.log('City Weather: ', data);
        showCityChoices(data);
    }).catch(function(err) {
      console.log('goFetch() Error :-S --> utils.js', err);
      return err;
    });
}

function queryWeatherAPI(queryUrl) {
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
        console.log(data);
        let cityKey = data[0].Key
        getWeather(cityKey);
    }).catch(function(err) {
      console.log('goFetch() Error :-S --> utils.js', err);
      return err;
    });
}

function formUrl(cityInput) {
  let queryUrl = autocompleteUrl + cityInput;
  queryWeatherAPI(queryUrl);
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

function initializeApp() {
  $('.js-submit').on('submit', event => {
    event.preventDefault();
    let queryTarget = $(event.currentTarget).find('.cityInput');
    let cityInput = queryTarget.val();
    queryTarget.val('');
    formUrl(cityInput);
  });
}

$(initializeApp);
