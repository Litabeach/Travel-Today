let map;
let marker;
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var savePlaces = [];
var savePlacesCheck = JSON.parse(localStorage.getItem("results-saved-1"));
if (savePlacesCheck) {
  savePlaces = savePlacesCheck
    for (var i = 0; i < savePlaces.length; i++) {
      let foodNameEl = savePlaces[i].foodName;
      let foodAddressEl = savePlaces[i].foodAddress;
      let foodRatingEl = ("Rating: " + savePlaces[i].foodRating + " stars");
      let foodPriceEl = savePlaces[i].foodPrice;
      if (foodPriceEl == 1) {foodPriceEl = "Price Level: $"}
      if (foodPriceEl == 2) {foodPriceEl = "Price Level: $$"}
      if (foodPriceEl == 3) {foodPriceEl = "Price Level: $$$"}
      if (foodPriceEl == 4) {foodPriceEl = "Price Level: $$$$"}

      //append to the page
      var p = $(".saveItem");
      var nameList = $("<li class='name-title'>");
      nameList.append(foodNameEl);
      p.append(nameList);
      //on click event to get list details
      $(nameList).click(function (e) {
        e.preventDefault();
        var test = $("<div>");
        test.attr("class", "save-data");
        var foodR = $("<div class='save-rating'>");
        var foodP = $("<div class='save-price'>");
        var foodA = $("<div class='save-address'>");
        foodR.text(foodRatingEl);
        foodP.text(foodPriceEl);
        foodA.text(foodAddressEl);
        test.append(foodR, foodP, foodA);
        $(this).append(test);
      })
    }
}

//pulls up a blank map of Minneapolis on load
$(document).ready(function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 44.9778, lng: -93.2650 },
    zoom: 14,
  });
  //when map is dragged, runs the functions addRestaurants and addHotels based on the new center of map
  map.addListener('dragend', function () {
    var lat = this.getCenter().lat(); 
    var lng = this.getCenter().lng();
    addRestaurants(lat, lng);
    addHotels(lat, lng);
  });
  userLocate();
});

//populate the map with markers, places info according to what user has searched
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

//set the center of the map to the user's location
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
        let name = results[i].name;
        let placeID = results[i].place_id;
        let photo = results[i].photos[0].getUrl
        let rating = results[i].rating;
        let address = results[i].vicinity;

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
        var modalHotelBtn = $("<button class='myModalBtn'>");
        modalHotelBtn.html("Expand");

        //add it to the page
        hotelDiv.append(newRow);
        newRow.append(imageCol, descriptionCol);
        imageCol.append(photoEl);
        descriptionCol.append(nameEl, addressEl, ratingEl, hotelBtn, modalHotelBtn);

        //save button on click event
        $(hotelBtn).click(function () {
          //adding element data to local storage
          var placeData = {
            hotelName: JSON.stringify(name),
            hotelAddress: JSON.stringify(address),
            hotelRating: JSON.stringify(rating)
          }
          savePlaces.push(placeData);
          localStorage.setItem("results-saved-1", JSON.stringify(savePlaces));
          // run function to load results
          loadResults();
        });

        // function to get results from local storage
        function loadResults() {
          var savePlaces = JSON.parse(localStorage.getItem("results-saved-1"));
          $(".saveItem").empty();
          for (var i = 0; i < savePlaces.length; i++) {
            let hotelNameEl = savePlaces[i].hotelName;
            let hotelAddressEl = savePlaces[i].hotelAddress;
            let hotelRatingEl = ("Rating: " + savePlaces[i].hotelRating + " stars");
        
          //append to the page
          var p = $(".saveItem");
          var nameList = $("<li class='name-title'>");
          nameList.append(hotelNameEl);
          p.append(nameList);
          //on click event to get list details
          $(nameList).click(function (e) {
            e.preventDefault();
            var test = $("<div>");
            test.attr("class", "save-data");
            var hotelR = $("<div class='save-rating'>");
            var hotelA = $("<div class='save-address'>");
            hotelR.text(hotelRatingEl);
            hotelA.text(hotelAddressEl);
            test.append(hotelR, hotelA);
            $(this).append(test);
          })
        }}

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
        //change price 1-4 to $$$
        if (price == 1) {priceEl = "Price Level: $"}
        if (price == 2) {priceEl = "Price Level: $$"}
        if (price == 3) {priceEl = "Price Level: $$$"}
        if (price == 4) {priceEl = "Price Level: $$$$"}
       
        linebreak = $("<br>")

        //save button
        var restBtn = $("<button id='add-to-savelist'>");
        restBtn.html("Save to List");
        var modalRestBtn = $("<button class='myModalBtn'>");
        modalRestBtn.html("Expand");

        //add it to the page
        restarauntDiv.append(createRow);
        createRow.append(newImgCol, newDescriptCol);
        newImgCol.append(photoEl);
        newDescriptCol.append(nameEl, addressEl, ratingEl, priceEl, linebreak, restBtn, modalRestBtn);

        //save button on click event
        $(restBtn).click(function () {
          //adding element data to local storage
          var placeData = {
            foodName: JSON.stringify(name),
            foodAddress: JSON.stringify(address),
            foodRating: JSON.stringify(rating),
            foodPrice: JSON.stringify(price)
          }
          savePlaces.push(placeData);
          localStorage.setItem("results-saved-1", JSON.stringify(savePlaces));
          // run function to load results
          loadResults();
        });

        // function to get results from local storage
        function loadResults() {
          var savePlaces = JSON.parse(localStorage.getItem("results-saved-1"));
          $(".saveItem").empty();
          for (var i = 0; i < savePlaces.length; i++) {
            let foodNameEl = savePlaces[i].foodName;
            let foodAddressEl = savePlaces[i].foodAddress;
            let foodRatingEl = ("Rating: " + savePlaces[i].foodRating + " stars");
            let foodPriceEl = savePlaces[i].foodPrice;
            if (foodPriceEl == 1) {foodPriceEl = "Price Level: $"}
            if (foodPriceEl == 2) {foodPriceEl = "Price Level: $$"}
            if (foodPriceEl == 3) {foodPriceEl = "Price Level: $$$"}
            if (foodPriceEl == 4) {foodPriceEl = "Price Level: $$$$"}

          //append to the page
          var p = $(".saveItem");
          var nameList = $("<li class='name-title'>");
          nameList.append(foodNameEl);
          p.append(nameList);
          //on click event to get list details
          $(nameList).click(function (e) {
            e.preventDefault();
            var test = $("<div>");
            test.attr("class", "save-data");
            var foodR = $("<div class='save-rating'>");
            var foodP = $("<div class='save-price'>");
            var foodA = $("<div class='save-address'>");
            foodR.text(foodRatingEl);
            foodP.text(foodPriceEl);
            foodA.text(foodAddressEl);
            test.append(foodR, foodP, foodA);
            $(this).append(test);

            //nav bar clear button function
            var clearBtn = $(".btn-clear");
            $(clearBtn).click(function () {
              localStorage.clear();
              var p = $(".saveItem");
              p.clear();
            })
          })
        }}

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

//Opens and closes nav overlay
function openNav() { 
  document.getElementById( 
      "myNav").style.height = "100%"; 
} 

function closeNav() { 
  document.getElementById( 
      "myNav").style.height = "0%"; 
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

// On-click event for modal box to pop up if you hit the expand button
$(document).on("click", ".myModalBtn", function () {
  var modalPhotoEl = $("#modal-img");
  var modalPhoto = $(this).parent().siblings().children()[0].src
  modalPhotoEl.attr("src", modalPhoto);
  modalPhotoEl.addClass("modal-photo");
  var modalNameEl = $("#modal-name");
  var modalName = $(this).siblings()[0].textContent;
  modalNameEl.text(modalName);
  modalNameEl.addClass("results-title");
  var modalAddressEl = $("#modal-address");
  var modalAddress = $(this).siblings()[1].textContent;
  modalAddressEl.text(modalAddress);
  var modalRatingEl = $("#modal-rating");
  var modalRating = $(this).siblings()[2].textContent;
  modalRatingEl.text(modalRating);

  modal.style.display = "block";
});

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
