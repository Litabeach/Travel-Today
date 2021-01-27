let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 44.9778, lng: -93.2650 },
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
      //run function that populates the page with local attractions and restaurants
  }
});

// var city = "Minneapolis"

// geolocateURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=AIzaSyBepTaWB2S-ZswMELWF7HxBIvUDpXCAG9o"

// console.log(geolocateURL)
