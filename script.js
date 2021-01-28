let map;
let marker;

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
    //setting the variables for longitude and latitude to plug in to line 20 to center:
    var latOne = response.results[0].geometry.location.lat
    var lonOne = response.results[0].geometry.location.lng

    //  gets the map, sets parameters:
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: latOne, lng: lonOne },
        zoom: 10,
    });
      var marker = new google.maps.Marker({
        position: { lat: latOne, lng: lonOne },
        title:"You wanna go here for xyz!",
  });
  marker.setMap(map);
  
  });
  
}


// on-click event for search button
$("#search").on("click", function (event) {
  event.preventDefault();
  //sets the variable "city" to the value of the input div
  var city = $("#enter-city").val().trim();
  if (city) {
    initMap(city)

  // constructing location details HTML 
  var cityName = $("<h1>").text(city);
  $("#location-div").append(cityName);
  
  // here run the function that populates the page with local attractions and restaurants
  }
});