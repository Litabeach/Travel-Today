let map;

function initMap(city) {
  // geolocate URL
geolocateURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=AIzaSyBepTaWB2S-ZswMELWF7HxBIvUDpXCAG9o"
console.log(geolocateURL)

  // AJAX call for geolocate
$.ajax({
  url: geolocateURL,
  method: "GET"

})
  .then(function (response) {
    //setting the variables for longitude and latitude to plug in to line 20 to center
    var latOne = response.results[0].geometry.location.lat
    var lonOne = response.results[0].geometry.location.lng
 
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: latOne, lng: lonOne },
        zoom: 10,
    });
  });
}

// on-click event for search button
$("#search").on("click", function (event) {
  event.preventDefault();
  //sets the variable "city" to the value of the input div
  var city = $("#enter-city").val().trim();
  if (city) {
    initMap(city)
  // here run the function that updates the map 
  // here run the function that populates the page with local attractions and restaurants
  }
});