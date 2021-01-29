let map;
let marker;

function initMap(city) {
  // geolocate URL
geolocateURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=AIzaSyBepTaWB2S-ZswMELWF7HxBIvUDpXCAG9o"
// console.log(geolocateURL)

  // AJAX call for geolocate
$.ajax({
  url: geolocateURL,
  method: "GET",
  error: function(xhr, status, error){
    var errorMessage = xhr.status + ': ' + xhr.statusText
    alert('Error - ' + errorMessage);
  
},
success: function (response) {
    //setting the variables for longitude and latitude to plug in to line 25 to center:
    var latOne = response.results[0].geometry.location.lat
    var lonOne = response.results[0].geometry.location.lng

    //  gets the map, sets parameters:
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: latOne, lng: lonOne },
        zoom: 10,
    });
      var marker = new google.maps.Marker({
        position: { lat: latOne, lng: lonOne },
        title:"You will find joy here!",
  });
  marker.setMap(map);
  }});
  nearbyURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latOne,lonOne + "&radius=1500&type=restaurant=&key=AIzaSyBnSoYvrdN8o3qt17rQzeCUE9bJJj2k8DE"
console.log(nearbyURL)

  // AJAX call for nearbyURL
$.ajax({
  url: nearbyURL,
  method: "GET"

})
.then(function (yellow) {
  var eatName = yellow.results.name;
  var eatPhoto = yellow.results.photos[2];
  // var eatPhoto = yellow.results.photos.photo_reference;
  var eatDiv = $("<div>");

  var eatNameEl = $("<h1>");
  eatNameEl.attr(eatName);

  var eatPhotoEl = $("<img>");
  eatPhotoEl.attr("src", eatPhoto);

  $(".restaurant-container-md").append(eatDiv);
  eatDiv.append(eatNameEl);
  eatDiv.append(eatPhotoEl);
});
}

function getRestaurants(latOne,lonOne) {
  // nearbysearches URL
nearbyURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latOne,lonOne + "&radius=1500&type=restaurant=&key=AIzaSyBnSoYvrdN8o3qt17rQzeCUE9bJJj2k8DE"
console.log(nearbyURL)

  // AJAX call for nearbyURL
$.ajax({
  url: nearbyURL,
  method: "GET"

})
.then(function (yellow) {
  var eatName = yellow.results.name;
  var eatPhoto = yellow.results.photos[2];
  // var eatPhoto = yellow.results.photos.photo_reference;
  var eatDiv = $("<div>");

  var eatNameEl = $("<h1>");
  eatNameEl.attr(eatName);

  var eatPhotoEl = $("<img>");
  eatPhotoEl.attr("src", eatPhoto);

  $(".restaurant-container-md").append(eatDiv);
  eatDiv.append(eatNameEl);
  eatDiv.append(eatPhotoEl);
});
}

// on-click event for search button
$("#search").on("click", function (event) {
  event.preventDefault();
  //sets the variable "city" to the value of the input div
  var city = $("#enter-city").val().trim();
  if (city) {
    initMap(city);
    getRestaurants(latOne, lonOne) 
  // here run the function that populates the page with local attractions and restaurants
  }
});


  // constructing location details HTML 
  // var cityName = $("<h1>").text(city);
  // $("#location-div").append(cityName);
  // $("#location-div").empty();
  // $("#location-div").append(cityName);
  