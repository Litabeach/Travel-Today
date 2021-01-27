let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 10,
    //   this is the meat of the app -- zoom, select long/lat, styles
    //  how to implement places in here 
  });
}
  
//take the value of the search input box, get the coordinates for that city, plug those coordinates into the "center"
// how to get city coordinates?

$("#search").on("click", function (event) {
  event.preventDefault();
  var city = $("#enter-city").val().trim();
});

