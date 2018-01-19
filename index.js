function initMap() {
  let losAngeles = {lat: 34.0522, lng: -118.2437};
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: losAngeles
  });
  
  let marker = new google.maps.Marker({
    position: losAngeles,
    map: map
  });
}
