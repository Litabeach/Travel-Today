let map;
let marker;

//pulls up a blank map of Minneapolis on load
$(document).ready(function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 44.9778, lng: -93.2650 },
    zoom: 14,
  });
  userLocate();
});

//populate the map with markers, places info according to what user had searched
function initMap(city) {
  geolocateURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=AIzaSyBepTaWB2S-ZswMELWF7HxBIvUDpXCAG9o"

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

      //  changes map center to searched city, runs functions for restaurants and hotels:
      map.setCenter({ lat: latOne, lng: lonOne })
      addRestaurants(latOne, lonOne);
      addHotels(latOne, lonOne);
    }
  });
}

//function to set the center of the map to the user location
function userLocate() {
  infoWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement("button");
  locationButton.textContent = "Go to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          $(".col-md-5").removeClass("hide");
          addRestaurants(pos.lat, pos.lng);
          addHotels(pos.lat, pos.lng);
          infoWindow.setPosition(pos);
          infoWindow.setContent("You are here");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

// on-click event for search button
$("#search").on("click", function (event) {
  event.preventDefault();
  $(".col-md-5").removeClass("hide")
  //sets the variable "city" to the value of the input div
  var city = $("#enter-city").val().trim();
  if (city) {
    initMap(city);
    addRestaurants();
    addHotels();
  }
});

//handle errors for user location
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

//function that grabs hotel information from Google Places API and paints it on the page
function addHotels(latOne, lonOne) {
  var request2 = {
    location: new google.maps.LatLng(latOne, lonOne),
    radius: 3000,
    type: ['lodging']
  };

  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request2, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      $(".hotel-container-md").empty()
      for (var i = 0; i < 10; i++) {
        //if results are not available i.e there is not photo for a listing, moves on to the next listing.
        if (!results[i] || !results[i].photos || !results[i].name || !results[i].place_id
          || !results[i].rating || !results[i].vicinity) {
          continue;
        }
        var name = results[i].name;
        var placeID = results[i].place_id;
        var photo = results[i].photos[0].getUrl
        var rating = results[i].rating;
        var address = results[i].vicinity;

        // create new divs and add variables in them
        var hotelDiv = $(".hotel-container-md")
        var newRow = $("<div class= 'row'>")
        var imageCol = $("<div class= 'col-md-5'>")
        var descriptionCol = $("<div class='col-md-7'>")
        var nameEl = $(("<p class='results-title'>"));
        nameEl.html(name);
        var ratingEl = $("<p>");
        ratingEl.html("Rating: " + rating + " stars");
        var photoEl = $("<img class='photo-size'>");
        photoEl.attr("src", photo);
        var addressEl = $("<p>");
        addressEl.html(address);
        var hotelBtn = $("<button id='add-to-savelist'>");
        hotelBtn.html("Save to List");

        //add it to the page
        hotelDiv.append(newRow);
        newRow.append(imageCol, descriptionCol);
        imageCol.append(photoEl);
        descriptionCol.append(nameEl, addressEl, ratingEl, hotelBtn);

        //button on click event
        $(hotelBtn).click(function(){
          console.log("The button was clicked.");
          //creating list element
          var userStoryDiv = $(".saveitem");
          var testOne = $("<p>");
          testOne.html("Whoop!!! The button was clicked!");
          userStoryDiv.prepend(testOne);
          //adding element data to local storage
          for (let i = 0; i < name.length; i++){
          localStorage.setItem("nameSave", JSON.stringify(name));
          localStorage.setItem("addressSave", JSON.stringify(address));
          localStorage.setItem("ratingSave", JSON.stringify(rating));
          localStorage.setItem("priceSave", JSON.stringify(price));
          }
        });
       //create markers on map
        var marker = new google.maps.Marker({
          place: {
            placeId: placeID,
            location: results[i].geometry.location,
          },
          title: name,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
          },
        });
        marker.setMap(map);
      }
      map.setCenter(results[0].geometry.location);
    }
  }
  );
}

function addRestaurants(latOne, lonOne) {
  var request = {
    location: new google.maps.LatLng(latOne, lonOne),
    radius: 3000,
    type: ['restaurant']
  };

  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, function (results, status) {
    $(".restaurant-container-md").empty();
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < 10; i++) {
        if (!results[i] || !results[i].photos || !results[i].name || !results[i].place_id
          || !results[i].rating || !results[i].vicinity || !results[i].price_level) {
          continue;
        }
        //set variables
        let name = results[i].name;
        let placeID = results[i].place_id;
        let photo = results[i].photos[0].getUrl
        let rating = results[i].rating;
        let price = results[i].price_level;
        let address = results[i].vicinity;
    
          // create new divs and add variables in them
        var restarauntDiv = $(".restaurant-container-md")
        var createRow = $("<div class= 'row'>")
        var newImgCol = $("<div class= 'col-md-5'>")
        var newDescriptCol = $("<div class='col-md-7'>")
        var nameEl = $("<p class='results-title'>");
        nameEl.html(name);
        var addressEl = $("<p>");
        addressEl.html(address);
        var ratingEl = $("<p>");
        ratingEl.html("Rating: " + rating + " stars");
        var photoEl = $("<img class='photo-size'>");
        photoEl.attr("src", photo);
        var priceEl = $("<p>");
        priceEl.html(price);
        //change price 1-5 to $$$
        if (price == 1) {
          priceEl = "Price Level: $"
        }
        if (price == 2) {
          priceEl = "Price Level: $$"
        }
        if (price == 3) {
          priceEl = "Price Level: $$$"
        }
        if (price == 4) {
          priceEl = "Price Level: $$$$"
        }
        if (price == 5) {
          priceEl = "Price Level: $$$$$"
        }
        linebreak = $("<br>")

        //save button
        var restBtn = $("<button id='add-to-savelist'>");
        restBtn.html("Save to List");

        //add it to the page
        restarauntDiv.append(createRow);
        createRow.append(newImgCol, newDescriptCol);
        newImgCol.append(photoEl);
        newDescriptCol.append(nameEl, addressEl, ratingEl, priceEl, linebreak, restBtn);

        //button on click event - simple test
        $(restBtn).click(function(){
          console.log("The button was clicked.");
          //creating list element
          var userStoryDiv = $(".saveitem");
          var testOne = $("<p>");
          testOne.html("Whoop!!! The button was clicked!");
          userStoryDiv.prepend(testOne);
          //adding element data to local storage
          for (let i = 0; i < name.length; i++){
          localStorage.setItem("nameSave", JSON.stringify(name));
          localStorage.setItem("addressSave", JSON.stringify(address));
          localStorage.setItem("ratingSave", JSON.stringify(rating));
          localStorage.setItem("priceSave", JSON.stringify(price));
          }
        });

        //add markers to map
        var marker = new google.maps.Marker({
          place: {
            placeId: placeID,
            location: results[i].geometry.location,
          },
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          },
          title: name,
        });
        marker.setMap(map);
      }
      map.setCenter(results[0].geometry.location);
    }
  })
}

