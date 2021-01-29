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
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ': ' + xhr.statusText
      alert('Error - ' + errorMessage);
    },
    success: function (response) {
      //setting the variables for longitude and latitude to plug in to line 25 to center:
      var latOne = parseFloat(response.results[0].geometry.location.lat)
      var lonOne = parseFloat(response.results[0].geometry.location.lng)

      //  gets the map, sets parameters:
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: latOne, lng: lonOne },
        zoom: 14,
      });

      var request = {
        location: new google.maps.LatLng(latOne, lonOne),
        radius: 1500,
        type: ['restaurant']
      };
      // var request = {
      //   location: new google.maps.LatLng(latOne, lonOne),
      //   radius: 1500,
      //   type: ['lodging']
      // };
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            // createMarker(results[i]);
            var name = results[i].name
            var placeID = results[i].place_id
            var marker = new google.maps.Marker({
              place:{
                placeId: placeID,
                location: results[i].geometry.location
            },
              title: name,
            });
            var eatDiv = $("<div>");
            var eatNameEl = $("<h1>");
            eatNameEl.attr(name);
            $(".restaurant-container-md").append(eatDiv);
            eatDiv.append(eatNameEl);

            marker.setMap(map);
         
          }
          map.setCenter(results[0].geometry.location);
        }
        console.log(results, status)
      });
    }
  });
}

    //leaving this for reference
    // .then(function (yellow) {
    //   var eatName = yellow.results[i].name;
    //   var eatPhoto = yellow.results[i].photos[2];
    //   // var eatPhoto = yellow.results[i].photos.photo_reference;
    //   var eatDiv = $("<div>");

    //   var eatNameEl = $("<h1>");
    //   eatNameEl.attr(eatName);

    //   var eatPhotoEl = $("<img>");
    //   eatPhotoEl.attr("src", eatPhoto);

    //   $(".restaurant-container-md").append(eatDiv);
    //   eatDiv.append(eatNameEl);
    //   eatDiv.append(eatPhotoEl);
    // });


// on-click event for search button
$("#search").on("click", function (event) {
  event.preventDefault();
  //sets the variable "city" to the value of the input div
  var city = $("#enter-city").val().trim();
  if (city) {
    initMap(city);
  }
});

  // constructing location details HTML 
  // var cityName = $("<h1>").text(city);
  // $("#location-div").append(cityName);
  // $("#location-div").empty();
  // $("#location-div").append(cityName);
