function initMap() {
  let losAngeles = {lat: 34.0522, lng: -118.2437};
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: losAngeles
  });

  //sets marker and map to Los Angeles
  let marker = new google.maps.Marker({
    position: losAngeles,
    map: map
  });
}

//add markers
google.maps.event.addListener(map, 'click',
function(event){
  addMarker({coords:event.latlng});
});
