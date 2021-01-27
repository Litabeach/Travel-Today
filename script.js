let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 10,
    
  });
}

//take the value of the search input box, get the coordinates for that city, plug those coordinates into the "center"
// how to get city coordinates?

$("#search").on("click", function (event) {
  event.preventDefault();
  var city = $("#enter-city").val().trim();
  if (city) {
    cities.push(city);
    //here run the function that populates the page with local attractions and restaurants
  }
});

//placeholder for testing
var city = "Minneapolis"

// geolocate URL
geolocateURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=AIzaSyBepTaWB2S-ZswMELWF7HxBIvUDpXCAG9o"
console.log(geolocateURL)

// AJAX call
$.ajax({
  url: geolocateURL,
  method: "GET"

})
  .then(function (response) {
    console.log(response)
    //setting the variables for longitude and latitude to plug in to line 5 for centering
    var latOne = response.results[0].geometry.location.lat
    console.log(latOne)
    var lonOne = response.results[0].geometry.location.lng
    console.log(lonOne)
  });

