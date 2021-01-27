let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 10,
  //   this is the meat of the app -- zoom, select long/lat, styles
  //  how to implement places in here 
  });
}
