App.factory('api', function($http) {
    var accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjEwNDMyNzgsImV4cCI6MTQ5MjU3OTI3OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.dXZVC--uvtigrFB7T3fGTG84NIYlSnRqbgbT43xzFAw"
    var chosenOutgoingFlight, chosenReturningFlight, passengerData, bookingData, cabinetOutgoingClass, cabinetReturningClass, outgoingSeat, returnSeat;
    return {
        getAirports: function() {
            return $http({
                method: 'GET',
                url: '/api/airports',
                headers: {
                    'x-access-token': accessToken,
                    'website': 'AirBerlin'
                }
            })
        },
        getFlights: function(origin, destination, exitDate, returnDate) {
            if (!returnDate)
                return $http({
                    method: 'GET',
                    url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/0",
                    headers: {
                        'x-access-token': accessToken,
                        'other-hosts': 'false'

                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/0",
                    headers: {
                        'x-access-token': accessToken,
                        'other-hosts': 'false'


                    }
                })
        },
        getOtherFlightsEco: function(origin, destination, exitDate, returnDate) {
            if (!returnDate)
                return $http({
                    method: 'GET',
                    url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/economy",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/economy",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
        },
        getOtherFlightsBusi: function(origin, destination, exitDate, returnDate) {
            if (!returnDate)
                return $http({
                    method: 'GET',
                    url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/business",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/business",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
        },
        getAircrafts: function() {
            return $http({
                method: 'GET',
                url: '/api/aircrafts',
                headers: {
                    'x-access-token': accessToken,
                    'website': 'AirBerlin'
                }
            })
        },
        getCountries: function() {
            return $http({
                method: 'GET',
                url: '/api/countries',
                headers: {
                    'x-access-token': accessToken,
                    'website': 'AirBerlin'
                }
            })
        },
        setOutGoingFlight: function(flight) {
            chosenOutgoingFlight = flight;
        },
        setReturningFlight: function(flight) {
            chosenReturningFlight = flight;
        },
        setPassenger: function(passenger) {
            passengerData = passenger;
        },
        getCabinetOutgoingClass: function() {
            return cabinetOutgoingClass;
        },
        getCabinetReturningClass: function() {
            return cabinetReturningClass;
        },
        setBooking: function(booking) {

            if (!booking.exitIsEconomy)
                cabinetOutgoingClass = "Business"
            else
                cabinetOutgoingClass = "Economy"

            if (!booking.reEntryIsEconomy)
                cabinetReturningClass = "Business"

            else
                cabinetReturningClass = "Economy"


            bookingData = booking;
        },
        getPassenger: function() {
            return passengerData;
        },
        getBooking: function() {
            return bookingData;
        },
        getChosenOutGoingFlight: function() {
            return chosenOutgoingFlight;
        },
        getChosenReturningFlight: function() {
            return chosenReturningFlight;
        },
        getOutgoingSeat: function() {
            return outgoingSeat;
        },

        getReturnSeat: function() {
            return returnSeat;
        },
        setOutgoingSeat: function(seat) {
            outgoingSeat = seat;
        },
        setRetrunSeat: function(seat) {
            returnSeat = seat;
        },
        clearLocal: function() {
            chosenReturningFlight = {}
            chosenOutgoingFlight = {}
            passengerData = {}
            bookingData = {}
            cabinetOutgoingClass = {}
            cabinetReturningClass = {}
            outgoingSeat = {}
            returnSeat = {}
        },
        submitBooking: function() {
            return $http({
                method: 'POST',
                url: '/api/booking',
                headers: {
                    'x-access-token': accessToken
                },
                data: {
                    passenger: passengerData,
                    booking: bookingData,
                    outgoingSeatNumber: outgoingSeat,
                    returnSeatNumber: returnSeat
                }
            });
        }
    };
});

// @abdelrhman-essam
App.controller('confirmationCtrl', function($scope, $location,api) {
      $scope.pageClass = 'page-confirmation';
  $scope.title = "Confirm your flight";

  $scope.buttonTextNxt = "Confirm?";
  $scope.buttonTextBk = "Back";

  if(Type == 'desktop'){
    $scope.goNext = function() {
      api.submitBooking().then(function(data){
        console.log(data);
        alert(data.data)
        api.clearLocal();
      },function(err){

      })
      $location.path('/');
    }
    $scope.goBack = function() {
      $location.path('/payment');
    }

    if(!api.getChosenOutGoingFlight() || !api.getBooking()){
      $location.path('/flights');
      return;
    }
    if(!api.getPassenger()){
      $location.path('/passenger-details');
        return;
    }
    $scope.goSocial = function () {
      $location.path('/social');

    }
    $scope.flight = api.getChosenOutGoingFlight();

    $scope.passenger = api.getPassenger();
    $('#quotes-text').typeIt({
      strings: [
        '"Travel and change of place impart new vigor to the mind."-Seneca',
         '“Traveling tends to magnify all human emotions.” — Peter Hoeg',
         '“Traveling – it leaves you speechless, then turns you into a storyteller.” - Ibn Battuta',
        ' “We travel, some of us forever, to seek other places, other lives, other souls.” – Anais Nin'
      ],
      speed: 80,
      breakLines: false,
      loop: true
    });

  }

//
// console.log("chosenOutgoingFlight");
//   console.log(api.getChosenOutGoingFlight());
// console.log("chosenReturningFlight")
// console.log(api.getChosenReturningFlight());
// console.log("passenger")
// console.log(api.getPassenger())
// console.log("booking")
// console.log(api.getBooking())
// console.log("goingSeat")
// console.log(api.getOutgoingSeat())
// console.log("retrunSeat")
// console.log(api.getReturnSeat())


});

// @Nabila
App.controller('flightDetailsCtrl', function($scope, $location, api) {
  $scope.pageClass = 'page-flight';
  $scope.title = "Flight(s) Details";
  $scope.buttonTextNxt = "Next";
  $scope.buttonTextBk = "Back";



  if (Type == 'desktop') {
    $scope.goNext = function() {
      $location.path('/passenger-details');
    }
    $scope.goBack = function() {
      $location.path('/flights');
    }

    if (!api.getChosenOutGoingFlight() || !api.getBooking()) {
      $location.path('/flights');
      return;
    }
  }
  var outgoingFlight = api.getChosenOutGoingFlight();
  var returnFlight = api.getChosenReturningFlight();

  var booking = api.getBooking();

  var facilities = ["Smoking areas available", "Wi-Fi availability",
    "4 cultural cuisines", "Inflight entertainment", "Extra cozy sleeperette",
    "Screens to show your flight pattern, aircraft altitude and speed"
  ];
if (outgoingFlight){
  var departureDate = new Date(outgoingFlight.departureUTC);
  outgoingFlight.departureUTC = departureDate.toUTCString();
  var arrivalDate = new Date(outgoingFlight.arrivalUTC);
  outgoingFlight.arrivalUTC = arrivalDate.toUTCString();


  if (returnFlight) {
    departureDate = new Date(returnFlight.departureUTC);
    returnFlight.departureUTC = departureDate.toUTCString();
    arrivalDate = new Date(returnFlight.arrivalUTC);
    returnFlight.arrivalUTC = arrivalDate.toUTCString();
  }
  var aircrafts = [];
  var outAircrafthasSmoking = false;
  var outAircrafthasWifi = false;
  var reAircrafthasSmoking = false;
  var reAircrafthasWifi = false;
  api.getAircrafts().then(function mySucces(response) {
    aircrafts = response.data;
    for (var i = 0; i < aircrafts.length; i++) {
      if (aircrafts[i].tailNumber === outgoingFlight.refAircraftTailNumber) {
        outAircrafthasSmoking = aircrafts[i].hasSmoking;
        outAircrafthasWifi = aircrafts[i].hasWifi;
        $scope.outAircraftModel = aircrafts[i].model;
      }
      if (returnFlight) {
        if (aircrafts[i].tailNumber === returnFlight.refAircraftTailNumber) {
          reAircrafthasSmoking = aircrafts[i].hasSmoking;
          reAircrafthasWifi = aircrafts[i].hasWifi;
          $scope.reAircraftModel = aircrafts[i].model;
        }
      }

    }
  }, function myError(response) {
    console.log(response.statusText);
  });

  $scope.outRefOriginAirportName;
  $scope.outRefDestinationAirportName;
  var airports = [];
  api.getAirports().then(function mySucces(response) {
    airports = response.data;
    for (var i = 0; i < airports.length; i++) {
      if (airports[i].iata === outgoingFlight.refOriginAirport) {
        $scope.outRefOriginAirportName = airports[i].name;
      }
      if (airports[i].iata === outgoingFlight.refDestinationAirport) {
        $scope.outRefDestinationAirportName = airports[i].name;
      }
      if (returnFlight) {
        $scope.reRefOriginAirportName;
        $scope.reRefDestinationAirportName;
        if (airports[i].iata === returnFlight.refOriginAirport) {
          $scope.reRefOriginAirportName = airports[i].name;
        }
        if (airports[i].iata === returnFlight.refDestinationAirport) {
          $scope.reRefDestinationAirportName = airports[i].name;
        }

      }
    }
  }, function myError(response) {
    console.log(response.statusText);
  });
  var outbusinessOrEcon = "";
  var outfare = 0;

  if (booking.exitIsEconomy) {
    outbusinessOrEcon = "Economy";
    outfare = outgoingFlight.economyFare;
  } else {
    outbusinessOrEcon = "Business";
    outfare = outgoingFlight.businessFare;
  }
  if (returnFlight) {
    var rebusinessOrEcon = "";
    var refare = 0;
    if (booking.reEntryIsEconomy) {
      rebusinessOrEcon = "Economy";
      refare = returnFlight.economyFare;
    } else {
      rebusinessOrEcon = "Business";
      refare = returnFlight.businessFare;
    }
  }
  var outfacilitiesResult = [];
  if (outAircrafthasSmoking)
    outfacilitiesResult.push(facilities[0]);
  if (outAircrafthasWifi)
    outfacilitiesResult.push(facilities[1]);
  if (!booking.exitIsEconomy) {
    outfacilitiesResult.push(facilities[2]);
    outfacilitiesResult.push(facilities[3]);
    outfacilitiesResult.push(facilities[4]);
  }
  outfacilitiesResult.push(facilities[5]);
  if (returnFlight) {
    var refacilitiesResult = [];
    if (reAircrafthasSmoking)
      refacilitiesResult.push(facilities[0]);
    if (reAircrafthasWifi)
      refacilitiesResult.push(facilities[1]);
    if (!booking.reEntryIsEconomy) {
      refacilitiesResult.push(facilities[2]);
      refacilitiesResult.push(facilities[3]);
      refacilitiesResult.push(facilities[4]);
    }
    refacilitiesResult.push(facilities[5]);

    $scope.returnFlight = returnFlight;
    $scope.rebusinessOrEcon = rebusinessOrEcon;
    $scope.refare = refare;
    $scope.refacilitiesResult = refacilitiesResult;
  }
  $scope.outgoingFlight = outgoingFlight;
  $scope.outbusinessOrEcon = outbusinessOrEcon;
  $scope.outfare = outfare;
  $scope.outfacilitiesResult = outfacilitiesResult;

}
});

// @abdelrahman-maged
var flightController = function($scope, $location,$routeParams,api) {

      $scope.pageClass = 'page-flights';
      $scope.title = "Choose a Flight";
      $scope.buttonTextNxt = "Next";
      $scope.buttonTextBk = "Back";



      if(Type == 'desktop'){
        $scope.isCollapsed = true;
        $scope.isOutgoingFlightSelected = false;


        $scope.goNext = function() {

            api.setOutGoingFlight($scope.selectedOutgoingFlight);
            api.setReturningFlight($scope.selectedReturningFlight);
            api.setBooking($scope.selectedBooking);



            $location.path('/exit-flight');

        }

        $scope.goBack = function() {
            // check if the user has selected a flight
            // and then call api.setFlight(chosenFlight)
            //if the user hasn't selected a flight return prevent him from proceeding
            $location.path('/');
        }
        var origin = $routeParams.origin;
        var destination = $routeParams.destination;
        var exitDate = new Date($routeParams.exitDate * 1000);
        $scope.roundTrip = false;
        if ($routeParams.returnDate) {
            var returnDate = new Date($routeParams.returnDate * 1000);
            $scope.roundTrip = true;
        }

        $scope.selectedBooking = {
            "refPassengerID": null,
            "exitDepartureUTC": null,
            "reEntryDepartureUTC": null,
            "issueDate": null,
            "isOneWay": !$scope.roundTrip,
            "refExitFlightNumber": null,
            "refReEntryFlightNumber": null,
            "receiptNumber": null
        };

        // var origin = "TXL";
        // var destination = "JFK";
        // var exitDate = new Date(1459555200 * 1000);

        if (!origin || !destination || !exitDate) {
            $location.path('/');
        }

        var flights;
        var returnDateMill;
        if (returnDate)
            returnDateMill = returnDate.getTime();
            // console.log(exitDate.toISOString())
        api.getFlights(origin, destination, exitDate.getTime(), returnDateMill).then(function mySuccess(response) {
            // console.log(response)
            flights = response.data
            console.log(response.data)
            // formatting data to be presentable
            for (i = 0; i < flights.outgoingFlights.length; i++) {

                var departureDate = new Date(flights.outgoingFlights[i].departureUTC);
                flights.outgoingFlights[i].departureUTC = departureDate.toUTCString();

                var arrivalDate = new Date(flights.outgoingFlights[i].arrivalUTC);
                flights.outgoingFlights[i].arrivalUTC = arrivalDate.toUTCString();

                var hours = Math.floor(flights.outgoingFlights[i].duration / 60);
                var minutes = flights.outgoingFlights[i].duration % 60;

                flights.outgoingFlights[i].duration = hours + "h " + minutes + "m";

            }

            // throwing away flights.outgoingFlights not fitting constraints
            // function checkConstraints(flight) {
            //
            //     var flightDate = new Date(flight.departureUTC);
            //
            //     return flight.refOriginAirport === origin && flight.refDestinationAirport === destination && flightDate.getDay() === exitDate.getDay() && flightDate.getMonth() === exitDate.getMonth() && flightDate.getFullYear() === exitDate.getFullYear();
            //
            // }

            // $scope.flights = flights.filter(checkConstraints);
            if($scope.roundTrip )
            for (i = 0; i < flights.returnFlights.length; i++) {

                var departureDate = new Date(flights.returnFlights[i].departureUTC);
                flights.returnFlights[i].departureUTC = departureDate.toUTCString();

                var arrivalDate = new Date(flights.returnFlights[i].arrivalUTC);
                flights.returnFlights[i].arrivalUTC = arrivalDate.toUTCString();

                var hours = Math.floor(flights.returnFlights[i].duration / 60);
                var minutes = flights.returnFlights[i].duration % 60;

                flights.returnFlights[i].duration = hours + "h " + minutes + "m";

            }
            $scope.flights = flights;
            api.getAirports().then(function mySuccess(response) {

                airports = response.data;
                for (var i = 0; i < $scope.flights.outgoingFlights.length; i++) {

                    for (var j = 0; j < airports.length; j++) {

                        if (airports[j].iata === $scope.flights.outgoingFlights[i].refOriginAirport)
                            $scope.flights.outgoingFlights[i].refOriginAirportName = airports[j].name;

                        if (airports[j].iata === $scope.flights.outgoingFlights[i].refDestinationAirport)
                            $scope.flights.outgoingFlights[i].refDestinationAirportName = airports[j].name;


                    }

                }
                if($scope.roundTrip)
                for (var i = 0; i < $scope.flights.returnFlights.length; i++) {

                    for (var j = 0; j < airports.length; j++) {

                        if (airports[j].iata === $scope.flights.returnFlights[i].refOriginAirport)
                            $scope.flights.returnFlights[i].refOriginAirportName = airports[j].name;

                        if (airports[j].iata === $scope.flights.returnFlights[i].refDestinationAirport)
                            $scope.flights.returnFlights[i].refDestinationAirportName = airports[j].name;

                    }

                }

            }, function myError(response) {
                console.log(response.statusText);
            });



            api.getAircrafts().then(function mySuccess(response) {

                aircrafts = response.data;
                for (var i = 0; i < $scope.flights.outgoingFlights.length; i++) {

                    for (var j = 0; j < aircrafts.length; j++) {

                        if (aircrafts[j].tailNumber === $scope.flights.outgoingFlights[i].refAircraftTailNumber)
                            $scope.flights.outgoingFlights[i].refAircraftModel = aircrafts[j].model;

                    }

                }

                if($scope.roundTrip)
                for (var i = 0; i < $scope.flights.returnFlights.length; i++) {

                    for (var j = 0; j < aircrafts.length; j++) {

                        if (aircrafts[j].tailNumber === $scope.flights.returnFlights[i].refAircraftTailNumber)
                            $scope.flights.returnFlights[i].refAircraftModel = aircrafts[j].model;

                    }

                }

            }, function myError(response) {
                console.log(response.statusText);
            });

        }, function myError(response) {
            console.log(response.statusText);
        });



        $scope.selectOutgoingFlight = function(flight, isEconomy) {

            $scope.isOutgoingFlightSelected = true;
            $scope.selectedOutgoingFlight = flight;

            $scope.selectedBooking.exitDepartureUTC = flight.departureUTC;
            $scope.selectedBooking.exitIsEconomy = isEconomy;
            // $scope.selectedBooking.isOneWay = $scope.roundTrip;
            $scope.selectedBooking.refExitFlightNumber = flight.number;
        }

        $scope.selectReturningFlight = function(flight, isEconomy) {

            $scope.isReturningFlightSelected = true;
            $scope.selectedReturningFlight = flight;

            $scope.selectedBooking.reEntryDepartureUTC = flight.departureUTC;
            $scope.selectedBooking.reEntryIsEconomy = isEconomy;
            // $scope.selectedBooking.isOneWay = $scope.roundTrip;
            $scope.selectedBooking.refReEntryFlightNumber = flight.number;
        }


        $scope.checkNextBtnState = function() {
            if ($scope.roundTrip) {
                return $scope.isReturningFlightSelected && $scope.isOutgoingFlightSelected;
            } else {
                return $scope.isOutgoingFlightSelected;
            }
        }
      }else{

        $scope.chats = [{
          "number": "1000",
          "departureUTC": "2016-05-10T01:00:00Z",
          "arrivalUTC": "2016-05-10T03:00:00Z",
          "duration": 120,
          "status": "On Time",
          "refAircraftTailNumber": "D-CCCC",
          "refAircraftModel": null,
          "operatorAirline": "Air Berlin",
          "refOriginAirport": "CAI",
          "refOriginAirportName": null,
          "refDestinationAirport": "JED",
          "refDestinationAirportName": null,
          "boardingGate": "40",
          "boardingPeriod": 45.0,
          "boardingTerminal": "3",
          "arrivalTerminal": "1",
          "economyFare": 200.0,
          "businessFare": 300.0,
          "emptyEconomySeatsCount": null,
          "emptyBusinessSeatsCount": null,
          "economySeatSchema": null,
          "buisnessSeatSchema": null,
          "seatmap": null
        }, {
          "number": "1001",
          "departureUTC": "2016-05-10T06:00:00Z",
          "arrivalUTC": "2016-05-10T08:00:00Z",
          "duration": 120,
          "status": "On Time",
          "refAircraftTailNumber": "D-CCCC",
          "refAircraftModel": null,
          "operatorAirline": "Air Berlin",
          "refOriginAirport": "CAI",
          "refOriginAirportName": null,
          "refDestinationAirport": "JED",
          "refDestinationAirportName": null,
          "boardingGate": "40",
          "boardingPeriod": 45.0,
          "boardingTerminal": "3",
          "arrivalTerminal": "1",
          "economyFare": 200.0,
          "businessFare": 300.0,
          "emptyEconomySeatsCount": null,
          "emptyBusinessSeatsCount": null,
          "economySeatSchema": null,
          "buisnessSeatSchema": null,
          "seatmap": null
        }, {
          "number": "1002",
          "departureUTC": "2016-05-10T12:00:00Z",
          "arrivalUTC": "2016-05-10T14:00:00Z",
          "duration": 120,
          "status": "On Time",
          "refAircraftTailNumber": "D-CCCC",
          "refAircraftModel": null,
          "operatorAirline": "Air Berlin",
          "refOriginAirport": "CAI",
          "refOriginAirportName": null,
          "refDestinationAirport": "JED",
          "refDestinationAirportName": null,
          "boardingGate": "40",
          "boardingPeriod": 45.0,
          "boardingTerminal": "3",
          "arrivalTerminal": "1",
          "economyFare": 200.0,
          "businessFare": 300.0,
          "emptyEconomySeatsCount": null,
          "emptyBusinessSeatsCount": null,
          "economySeatSchema": null,
          "buisnessSeatSchema": null,
          "seatmap": null
        }, {
          "number": "1003",
          "departureUTC": "2016-05-10T17:00:00Z",
          "arrivalUTC": "2016-05-10T19:00:00Z",
          "duration": 120,
          "status": "On Time",
          "refAircraftTailNumber": "D-CCCC",
          "refAircraftModel": null,
          "operatorAirline": "Air Berlin",
          "refOriginAirport": "CAI",
          "refOriginAirportName": null,
          "refDestinationAirport": "JED",
          "refDestinationAirportName": null,
          "boardingGate": "40",
          "boardingPeriod": 45.0,
          "boardingTerminal": "3",
          "arrivalTerminal": "1",
          "economyFare": 200.0,
          "businessFare": 300.0,
          "emptyEconomySeatsCount": null,
          "emptyBusinessSeatsCount": null,
          "economySeatSchema": null,
          "buisnessSeatSchema": null,
          "seatmap": null
        }];

      }

      // console.log($scope.roundTrip)

      $scope.constructDate = function(date) {
        var dateOut = new Date(date);
        return dateOut;
      };


}

if(Type == 'mobile'){
  flightController.$inject = ['$scope', '$location', 'api'];
}else{
  flightController.$inject = ['$scope', '$location','$routeParams', 'api'];
}


App.controller('flightsCtrl', flightController);


var flightNewController = function($scope, $location,$routeParams,api) {
    $scope.pageClass = 'page-flights';
    $scope.title = "Choose a Flight";
    $scope.buttonTextNxt = "Next";
    $scope.buttonTextBk = "Back";
    $scope.isCollapsed = false;
    $scope.isOutgoingFlightSelected = false;


    $scope.goNext = function() {

        api.setOutGoingFlight($scope.selectedOutgoingFlight);
        api.setReturningFlight($scope.selectedReturningFlight);
        api.setBooking($scope.selectedBooking);



        $location.path('/exit-flight');

    }

    $scope.goBack = function() {
        // check if the user has selected a flight
        // and then call api.setFlight(chosenFlight)
        //if the user hasn't selected a flight return prevent him from proceeding
        $location.path('/');
    }

    var origin = $routeParams.origin;
    var destination = $routeParams.destination;
    var exitDate = new Date($routeParams.exitDate * 1000);
    $scope.roundTrip = false;
    if ($routeParams.returnDate) {
        var returnDate = new Date($routeParams.returnDate * 1000);
        $scope.roundTrip = true;
    }
    var flights;
    var returnDateMill;
    if (returnDate)
        returnDateMill = returnDate.getTime();
    console.log(exitDate.toISOString())
    api.getOtherFlightsEco(origin, destination, exitDate.getTime(), returnDateMill).then(function mySuccess(response) {
        console.log(response)
        $scope.flights = response.data;
    }, function myError(response) {
        console.log(response.statusText);
    })
}


if(Type == 'mobile'){
  flightNewController.$inject = ['$scope', '$location', 'api'];
}else{
  flightNewController.$inject = ['$scope', '$location','$routeParams', 'api'];
}


App.controller('flightsNewCtrl', flightNewController);

App.controller('mainCtrl', function($scope, $location, api) {
    $scope.pageClass = 'page-main';



    if(Type == 'desktop'){

      $('#main-text').typeIt({
          strings: [
              "Simple, convenient, instant confirmation.", "Destinations all around the globe.", "Experience authentic hospitality.", "Time to get enchanted."
          ],
          speed: 120,
          breakLines: false,
          loop: true
      });
      $scope.flight = {
          type: "one"
      }
      $scope.otherAirline = {
      value:false
      }
      $scope.goToFlights = function() {
          if ($scope.otherAirline.value) {
            if ($scope.flight.type == "one")
            $location.path('/flights-new').search('origin', $scope.selectedOrigin).search('destination', $scope.selectedDest).search('exitDate', ($scope.exitDate.getTime() / 1000).toFixed(0));
            else{
              $location.path('/flights-new')
                  .search('origin', $scope.selectedOrigin)
                  .search('destination', $scope.selectedDest)
                  .search('exitDate', ($scope.exitDate.getTime() / 1000).toFixed(0))
                  .search('returnDate', ($scope.returnDate.getTime() / 1000).toFixed(0));
            }
          } else {
              if ($scope.flight.type == "one")
                  $location.path('/flights').search('origin', $scope.selectedOrigin).search('destination', $scope.selectedDest).search('exitDate', ($scope.exitDate.getTime() / 1000).toFixed(0));
              else {
                  $location.path('/flights')
                      .search('origin', $scope.selectedOrigin)
                      .search('destination', $scope.selectedDest)
                      .search('exitDate', ($scope.exitDate.getTime() / 1000).toFixed(0))
                      .search('returnDate', ($scope.returnDate.getTime() / 1000).toFixed(0));
              }

          }

      };
      $location.url($location.path());
      setUpDate($scope);

      $scope.children = ['0 children', '1 child', '2 children', '3 children', '4 children'];
      $scope.childrenBtnText = $scope.children[0];
      $scope.changeChildren = function(text) {
          $scope.childrenBtnText = text;
      }



      $scope.adults = ['1 adult', '2 adults', '3 adults', '4 adults'];
      $scope.adultBtnText = $scope.adults[0];
      $scope.changeAdult = function(text) {
          $scope.adultBtnText = text;
      }

      $scope.infants = ['0 infants', '1 infant'];
      $scope.infantBtnText = $scope.infants[0];
      $scope.changeInfant = function(text) {
          $scope.infantBtnText = text;
      }

      api.getAirports().then(function mySucces(response) {
          $scope.airports = response.data;
      }, function myError(response) {
          console.log(response.statusText);
      });
      $scope.selectedOrigin = undefined;
      $scope.selectedDest = undefined;

      function airporsContains(iata) {
          for (var i = 0; i < $scope.airports.length; i++) {
              if (iata == $scope.airports[i]['iata'])
                  return true;
          }
          return false;
      }

      $scope.buttonState = function() {
          return !$scope.selectedOrigin || !$scope.selectedDest || !$scope.exitDate || $scope.selectedDest == $scope.selectedOrigin || !airporsContains($scope.selectedOrigin) || !airporsContains($scope.selectedDest);
      }
    }else{

    }
});

function setUpDate($scope) {
    $scope.today = function() {
        $scope.exitDate = new Date();
        $scope.returnDate = new Date();
    };
    $scope.today();

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };
    $scope.open = function() {
        $scope.popup.opened = true;
    };


    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }
    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };
    $scope.popup2 = {
        opened: false
    };
    $scope.popup = {
        opened: false
    };
}

// @yassmine
App.controller('passengerDetailsCtrl', function($scope, $location, api) {
  $scope.title = "Fill in your details";

  $scope.buttonTextNxt = "Next";
  $scope.buttonTextBk = "Back";

if(Type == 'desktop'){
  if(!api.getChosenOutGoingFlight() || !api.getBooking()){
    $location.path('/flights');
    return;
  }

  $scope.titles = ['Mr', 'Mrs', 'Ms', 'Dr'];
  $scope.titlesBtnText = $scope.titles[0];
  $scope.changeTitle = function(text) {
    $scope.titlesBtnText = text;
  }

  api.getCountries().then(function mySucces(response) {
    $scope.countries = response.data;
  }, function myError(response) {
    console.log(response.statusText);
  });




  $scope.passenger = {
        type: null,
        countryCode: null,
        nationality:null,
        sex: null,
        birthDate: null,
        birthPlace: null,
        nationalID: null,
        authority: null,
        issueDate: null,
        expiryDate: null,
        points: null,
        membership: null,
       firstName :null,
        middleName: null,
        lastName:null,
        passportNumber: null,
        phoneNumber:null,
        email: null

       };
  // ---------------------------------------- Now you have $scope.nationality and $scope.titlesBtnText you can use them in your object
  var complete = false;
  $scope.goNext = function() {

  /*if(!api.getChosenFlight())
  {
  $location.path('/flights');
  alert("You have to choose a flight");
  }*/
  //The reverting to the flights page

    $scope.passenger = {
      type: null,
      countryCode: null, //according to country
      nationality:$scope.nationality,
      sex: null,
      birthDate: null,
      birthPlace: null,
      nationalID: null,
      authority: null,
      issueDate: null,
      expiryDate: null,
      points: null,
      membership: null,
      title: $scope.titlesBtnText,
      firstName : $scope.firstName,
      middleName: $scope.middleName,
      lastName: $scope.lastName,
      passportNumber: $scope.passportNumber,
      phoneNumber: $scope.phoneNumber,
      email: $scope.email1


       };
    ///before you leave the page make sure that the passenger object is complete otherwise show alert("Fill in all data");



  if(complete == false){
        if(($scope.firstName ==null)||($scope.middleName ==null)||($scope.lastName ==null)||($scope.phoneNumber ==null)||($scope.passportNumber ==null))
        {
          alert("Please fill in data");

        }
        else{
          if($scope.email1!=$scope.emailver)
          alert("The repeated email doesnt match the first email");
          else {
            if(($scope.check==null))
            alert("Please check the box");
            else{
            complete = true;
          }
          }

        }


    }
      if(complete==true){
        api.setPassenger($scope.passenger);
          $location.path('/seating/outgoing');
        }

      }
  $scope.goBack = function() {
      $location.path('/exit-flight');
    }
}


});

// @mirna
App.controller('paymentCtrl', function($scope, $location,api) {
      $scope.pageClass = 'page-payment';
  $scope.title = "Choose your payment option";

  $scope.buttonTextNxt = "Pay!";
  $scope.buttonTextBk = "Back";
  $scope.goNext = function() {
    $location.path('/confirmation');
  }
  $scope.goBack = function() {
    $location.path('/seating');
  }

  if(Type == 'desktop'){

      if(!api.getChosenOutGoingFlight() || !api.getBooking()){
        $location.path('/flights');
        return;
      }
      if(!api.getPassenger()){
        $location.path('/passenger-details');
          return;
      }
      var price = 0;
      if(api.getCabinetOutgoingClass() == 'Economy')
        price = api.getChosenOutGoingFlight().economyFare
      else
        price = api.getChosenOutGoingFlight().businessFare

        if(api.getChosenReturningFlight()){

          if(api.getCabinetReturningClass() == 'Economy')
            price = price + api.getChosenReturningFlight().economyFare
          else
            price = price + api.getChosenReturningFlight().businessFare


        }


      $scope.price = price;
      $scope.years = ['2016','2017','2018','2019','2020','2021','2022','2023','2024'];
      $scope.yearsBtnText = $scope.years[0];
      $scope.changeYear = function(text) {
        $scope.yearsBtnText = text;
      }

      $scope.months = ['January','Feburary','March','April','May','June','July','August','September','October','November','December'];
      $scope.monthsBtnText = $scope.months[0];
      $scope.changeMonth = function(text) {
        $scope.monthsBtnText = text;
      }    
  }

});

// @ahmed-essmat
  var seatingController = function($scope, $location,$routeParams,api) {
    $scope.pageClass = 'page-seating';
    $scope.title = "Where would you like to sit?";

    $scope.buttonTextNxt = "Next";
    $scope.buttonTextBk = "Back";

    if(Type == 'desktop'){
      $scope.goNext = function() {
          if (api.getChosenReturningFlight())
              if ($routeParams.outgoing == "outgoing") {
                  $location.path('/seating/returing');
                  api.setOutgoingSeat($scope.seat);
              } else {
                  api.setRetrunSeat($scope.seat);
                  $location.path('/payment');
              }
          else {
              api.setOutgoingSeat($scope.seat);
              $location.path('/payment');
          }

      }
      $scope.goBack = function() {
          $location.path('/passenger-details');
      }



      if (!api.getChosenOutGoingFlight() || !api.getBooking()) {
          $location.path('/flights');
          return;
      }
      if (!api.getPassenger()) {
          $location.path('/passenger-details');
          return;
      }
      var seatmap;

      if ($routeParams.outgoing == "outgoing") {

          $scope.isEconomyText = api.getCabinetOutgoingClass();
          seatmap = api.getChosenOutGoingFlight().seatmap;
      } else {
          $scope.isEconomyText = api.getCabinetReturningClass();
          seatmap = api.getChosenReturningFlight().seatmap;
      }



      var alphabits = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', "M", "N"];
      var schema = [3, 5, 3, 20];

      $scope.array1 = [];

      $scope.array2 = [];

      $scope.array3 = [];

      $scope.bob = [];

      for (var i = 0; i < schema[0]; i++) {
          $scope.array1.push(alphabits[0]);
          alphabits.splice(0, 1);
      }

      for (var i = 0; i < schema[1]; i++) {
          $scope.array2.push(alphabits[0]);
          alphabits.splice(0, 1);
      }
      for (var i = 0; i < schema[2]; i++) {
          $scope.array3.push(alphabits[0]);
          alphabits.splice(0, 1);
      }

      for (var i = 0; i < schema[3]; i++) {
          $scope.bob.push(i);

      }



      $scope.searchColor = function(text) {
          if (!$scope.isEmpty(text))
              return 'seatOcu';
          else
              return 'seatEmpty';
      }
      $scope.isEmpty = function(text) {
          for (var i = 0; i < seatmap.length; i++) {
              if (seatmap[i]['number'] == text) {
                  return seatmap[i]['isEmpty']
              }
          }
          return true;
      }
      $scope.selectSeat = function(seat) {
          $scope.seat = seat;
      };
    }


};


if(Type == 'mobile'){
  seatingController.$inject = ['$scope', '$location', 'api'];
}else{
  seatingController.$inject = ['$scope', '$location','$routeParams', 'api'];
}


App.controller('seatingCtrl', seatingController);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5qcyIsImNvbnRyb2xsZXJzL2NvbmZpcm1hdGlvbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmxpZ2h0c0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRzTmV3Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcGFzc2VuZ2VyRGV0YWlsc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9wYXltZW50Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NlYXRpbmdDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIkFwcC5mYWN0b3J5KCdhcGknLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHZhciBhY2Nlc3NUb2tlbiA9IFwiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SnBjM01pT2lKUGJteHBibVVnU2xkVUlFSjFhV3hrWlhJaUxDSnBZWFFpT2pFME5qRXdORE15Tnpnc0ltVjRjQ0k2TVRRNU1qVTNPVEkzT0N3aVlYVmtJam9pZDNkM0xtVjRZVzF3YkdVdVkyOXRJaXdpYzNWaUlqb2lhbkp2WTJ0bGRFQmxlR0Z0Y0d4bExtTnZiU0o5LmRYWlZDLS11dnRpZ3JGQjdUM2ZHVEc4NE5JWWxTblJxYmdiVDQzeHpGQXdcIlxuICAgIHZhciBjaG9zZW5PdXRnb2luZ0ZsaWdodCwgY2hvc2VuUmV0dXJuaW5nRmxpZ2h0LCBwYXNzZW5nZXJEYXRhLCBib29raW5nRGF0YSwgY2FiaW5ldE91dGdvaW5nQ2xhc3MsIGNhYmluZXRSZXR1cm5pbmdDbGFzcywgb3V0Z29pbmdTZWF0LCByZXR1cm5TZWF0O1xuICAgIHJldHVybiB7XG4gICAgICAgIGdldEFpcnBvcnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2FpcnBvcnRzJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0RmxpZ2h0czogZnVuY3Rpb24ob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUsIHJldHVybkRhdGUpIHtcbiAgICAgICAgICAgIGlmICghcmV0dXJuRGF0ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiLzBcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAnZmFsc2UnXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9cIiArIHJldHVybkRhdGUgKyBcIi8wXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ2ZhbHNlJ1xuXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldE90aGVyRmxpZ2h0c0VjbzogZnVuY3Rpb24ob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUsIHJldHVybkRhdGUpIHtcbiAgICAgICAgICAgIGlmICghcmV0dXJuRGF0ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL2Vjb25vbXlcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ3RydWUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvXCIgKyByZXR1cm5EYXRlICsgXCIvZWNvbm9teVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldE90aGVyRmxpZ2h0c0J1c2k6IGZ1bmN0aW9uKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLCByZXR1cm5EYXRlKSB7XG4gICAgICAgICAgICBpZiAoIXJldHVybkRhdGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9idXNpbmVzc1wiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9cIiArIHJldHVybkRhdGUgKyBcIi9idXNpbmVzc1wiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldEFpcmNyYWZ0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2FwaS9haXJjcmFmdHMnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBnZXRDb3VudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIHVybDogJy9hcGkvY291bnRyaWVzJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgc2V0T3V0R29pbmdGbGlnaHQ6IGZ1bmN0aW9uKGZsaWdodCkge1xuICAgICAgICAgICAgY2hvc2VuT3V0Z29pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFJldHVybmluZ0ZsaWdodDogZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgICAgICAgICBjaG9zZW5SZXR1cm5pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFBhc3NlbmdlcjogZnVuY3Rpb24ocGFzc2VuZ2VyKSB7XG4gICAgICAgICAgICBwYXNzZW5nZXJEYXRhID0gcGFzc2VuZ2VyO1xuICAgICAgICB9LFxuICAgICAgICBnZXRDYWJpbmV0T3V0Z29pbmdDbGFzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FiaW5ldE91dGdvaW5nQ2xhc3M7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENhYmluZXRSZXR1cm5pbmdDbGFzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FiaW5ldFJldHVybmluZ0NsYXNzO1xuICAgICAgICB9LFxuICAgICAgICBzZXRCb29raW5nOiBmdW5jdGlvbihib29raW5nKSB7XG5cbiAgICAgICAgICAgIGlmICghYm9va2luZy5leGl0SXNFY29ub215KVxuICAgICAgICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0gXCJCdXNpbmVzc1wiXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSBcIkVjb25vbXlcIlxuXG4gICAgICAgICAgICBpZiAoIWJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSlcbiAgICAgICAgICAgICAgICBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MgPSBcIkJ1c2luZXNzXCJcblxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG5cblxuICAgICAgICAgICAgYm9va2luZ0RhdGEgPSBib29raW5nO1xuICAgICAgICB9LFxuICAgICAgICBnZXRQYXNzZW5nZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhc3NlbmdlckRhdGE7XG4gICAgICAgIH0sXG4gICAgICAgIGdldEJvb2tpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGJvb2tpbmdEYXRhO1xuICAgICAgICB9LFxuICAgICAgICBnZXRDaG9zZW5PdXRHb2luZ0ZsaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hvc2VuT3V0Z29pbmdGbGlnaHQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENob3NlblJldHVybmluZ0ZsaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hvc2VuUmV0dXJuaW5nRmxpZ2h0O1xuICAgICAgICB9LFxuICAgICAgICBnZXRPdXRnb2luZ1NlYXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIG91dGdvaW5nU2VhdDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRSZXR1cm5TZWF0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiByZXR1cm5TZWF0O1xuICAgICAgICB9LFxuICAgICAgICBzZXRPdXRnb2luZ1NlYXQ6IGZ1bmN0aW9uKHNlYXQpIHtcbiAgICAgICAgICAgIG91dGdvaW5nU2VhdCA9IHNlYXQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFJldHJ1blNlYXQ6IGZ1bmN0aW9uKHNlYXQpIHtcbiAgICAgICAgICAgIHJldHVyblNlYXQgPSBzZWF0O1xuICAgICAgICB9LFxuICAgICAgICBjbGVhckxvY2FsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNob3NlblJldHVybmluZ0ZsaWdodCA9IHt9XG4gICAgICAgICAgICBjaG9zZW5PdXRnb2luZ0ZsaWdodCA9IHt9XG4gICAgICAgICAgICBwYXNzZW5nZXJEYXRhID0ge31cbiAgICAgICAgICAgIGJvb2tpbmdEYXRhID0ge31cbiAgICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0ge31cbiAgICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IHt9XG4gICAgICAgICAgICBvdXRnb2luZ1NlYXQgPSB7fVxuICAgICAgICAgICAgcmV0dXJuU2VhdCA9IHt9XG4gICAgICAgIH0sXG4gICAgICAgIHN1Ym1pdEJvb2tpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2Jvb2tpbmcnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcGFzc2VuZ2VyOiBwYXNzZW5nZXJEYXRhLFxuICAgICAgICAgICAgICAgICAgICBib29raW5nOiBib29raW5nRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgb3V0Z29pbmdTZWF0TnVtYmVyOiBvdXRnb2luZ1NlYXQsXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblNlYXROdW1iZXI6IHJldHVyblNlYXRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbiIsIi8vIEBhYmRlbHJobWFuLWVzc2FtXG5BcHAuY29udHJvbGxlcignY29uZmlybWF0aW9uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLGFwaSkge1xuICAgICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLWNvbmZpcm1hdGlvbic7XG4gICRzY29wZS50aXRsZSA9IFwiQ29uZmlybSB5b3VyIGZsaWdodFwiO1xuXG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJDb25maXJtP1wiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgaWYoVHlwZSA9PSAnZGVza3RvcCcpe1xuICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGFwaS5zdWJtaXRCb29raW5nKCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIGFsZXJ0KGRhdGEuZGF0YSlcbiAgICAgICAgYXBpLmNsZWFyTG9jYWwoKTtcbiAgICAgIH0sZnVuY3Rpb24oZXJyKXtcblxuICAgICAgfSlcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfVxuICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpO1xuICAgIH1cblxuICAgIGlmKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoIWFwaS5nZXRQYXNzZW5nZXIoKSl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHNjb3BlLmdvU29jaWFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zb2NpYWwnKTtcblxuICAgIH1cbiAgICAkc2NvcGUuZmxpZ2h0ID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCk7XG5cbiAgICAkc2NvcGUucGFzc2VuZ2VyID0gYXBpLmdldFBhc3NlbmdlcigpO1xuICAgICQoJyNxdW90ZXMtdGV4dCcpLnR5cGVJdCh7XG4gICAgICBzdHJpbmdzOiBbXG4gICAgICAgICdcIlRyYXZlbCBhbmQgY2hhbmdlIG9mIHBsYWNlIGltcGFydCBuZXcgdmlnb3IgdG8gdGhlIG1pbmQuXCItU2VuZWNhJyxcbiAgICAgICAgICfigJxUcmF2ZWxpbmcgdGVuZHMgdG8gbWFnbmlmeSBhbGwgaHVtYW4gZW1vdGlvbnMu4oCdIOKAlCBQZXRlciBIb2VnJyxcbiAgICAgICAgICfigJxUcmF2ZWxpbmcg4oCTIGl0IGxlYXZlcyB5b3Ugc3BlZWNobGVzcywgdGhlbiB0dXJucyB5b3UgaW50byBhIHN0b3J5dGVsbGVyLuKAnSAtIElibiBCYXR0dXRhJyxcbiAgICAgICAgJyDigJxXZSB0cmF2ZWwsIHNvbWUgb2YgdXMgZm9yZXZlciwgdG8gc2VlayBvdGhlciBwbGFjZXMsIG90aGVyIGxpdmVzLCBvdGhlciBzb3Vscy7igJ0g4oCTIEFuYWlzIE5pbidcbiAgICAgIF0sXG4gICAgICBzcGVlZDogODAsXG4gICAgICBicmVha0xpbmVzOiBmYWxzZSxcbiAgICAgIGxvb3A6IHRydWVcbiAgICB9KTtcblxuICB9XG5cbi8vXG4vLyBjb25zb2xlLmxvZyhcImNob3Nlbk91dGdvaW5nRmxpZ2h0XCIpO1xuLy8gICBjb25zb2xlLmxvZyhhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSk7XG4vLyBjb25zb2xlLmxvZyhcImNob3NlblJldHVybmluZ0ZsaWdodFwiKVxuLy8gY29uc29sZS5sb2coYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpKTtcbi8vIGNvbnNvbGUubG9nKFwicGFzc2VuZ2VyXCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0UGFzc2VuZ2VyKCkpXG4vLyBjb25zb2xlLmxvZyhcImJvb2tpbmdcIilcbi8vIGNvbnNvbGUubG9nKGFwaS5nZXRCb29raW5nKCkpXG4vLyBjb25zb2xlLmxvZyhcImdvaW5nU2VhdFwiKVxuLy8gY29uc29sZS5sb2coYXBpLmdldE91dGdvaW5nU2VhdCgpKVxuLy8gY29uc29sZS5sb2coXCJyZXRydW5TZWF0XCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0UmV0dXJuU2VhdCgpKVxuXG5cbn0pO1xuIiwiLy8gQE5hYmlsYVxuQXBwLmNvbnRyb2xsZXIoJ2ZsaWdodERldGFpbHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSkge1xuICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtZmxpZ2h0JztcbiAgJHNjb3BlLnRpdGxlID0gXCJGbGlnaHQocykgRGV0YWlsc1wiO1xuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cblxuXG4gIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICB9XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgfVxuXG4gICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHZhciBvdXRnb2luZ0ZsaWdodCA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpO1xuICB2YXIgcmV0dXJuRmxpZ2h0ID0gYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpO1xuXG4gIHZhciBib29raW5nID0gYXBpLmdldEJvb2tpbmcoKTtcblxuICB2YXIgZmFjaWxpdGllcyA9IFtcIlNtb2tpbmcgYXJlYXMgYXZhaWxhYmxlXCIsIFwiV2ktRmkgYXZhaWxhYmlsaXR5XCIsXG4gICAgXCI0IGN1bHR1cmFsIGN1aXNpbmVzXCIsIFwiSW5mbGlnaHQgZW50ZXJ0YWlubWVudFwiLCBcIkV4dHJhIGNvenkgc2xlZXBlcmV0dGVcIixcbiAgICBcIlNjcmVlbnMgdG8gc2hvdyB5b3VyIGZsaWdodCBwYXR0ZXJuLCBhaXJjcmFmdCBhbHRpdHVkZSBhbmQgc3BlZWRcIlxuICBdO1xuaWYgKG91dGdvaW5nRmxpZ2h0KXtcbiAgdmFyIGRlcGFydHVyZURhdGUgPSBuZXcgRGF0ZShvdXRnb2luZ0ZsaWdodC5kZXBhcnR1cmVVVEMpO1xuICBvdXRnb2luZ0ZsaWdodC5kZXBhcnR1cmVVVEMgPSBkZXBhcnR1cmVEYXRlLnRvVVRDU3RyaW5nKCk7XG4gIHZhciBhcnJpdmFsRGF0ZSA9IG5ldyBEYXRlKG91dGdvaW5nRmxpZ2h0LmFycml2YWxVVEMpO1xuICBvdXRnb2luZ0ZsaWdodC5hcnJpdmFsVVRDID0gYXJyaXZhbERhdGUudG9VVENTdHJpbmcoKTtcblxuXG4gIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICBkZXBhcnR1cmVEYXRlID0gbmV3IERhdGUocmV0dXJuRmxpZ2h0LmRlcGFydHVyZVVUQyk7XG4gICAgcmV0dXJuRmxpZ2h0LmRlcGFydHVyZVVUQyA9IGRlcGFydHVyZURhdGUudG9VVENTdHJpbmcoKTtcbiAgICBhcnJpdmFsRGF0ZSA9IG5ldyBEYXRlKHJldHVybkZsaWdodC5hcnJpdmFsVVRDKTtcbiAgICByZXR1cm5GbGlnaHQuYXJyaXZhbFVUQyA9IGFycml2YWxEYXRlLnRvVVRDU3RyaW5nKCk7XG4gIH1cbiAgdmFyIGFpcmNyYWZ0cyA9IFtdO1xuICB2YXIgb3V0QWlyY3JhZnRoYXNTbW9raW5nID0gZmFsc2U7XG4gIHZhciBvdXRBaXJjcmFmdGhhc1dpZmkgPSBmYWxzZTtcbiAgdmFyIHJlQWlyY3JhZnRoYXNTbW9raW5nID0gZmFsc2U7XG4gIHZhciByZUFpcmNyYWZ0aGFzV2lmaSA9IGZhbHNlO1xuICBhcGkuZ2V0QWlyY3JhZnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgIGFpcmNyYWZ0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhaXJjcmFmdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhaXJjcmFmdHNbaV0udGFpbE51bWJlciA9PT0gb3V0Z29pbmdGbGlnaHQucmVmQWlyY3JhZnRUYWlsTnVtYmVyKSB7XG4gICAgICAgIG91dEFpcmNyYWZ0aGFzU21va2luZyA9IGFpcmNyYWZ0c1tpXS5oYXNTbW9raW5nO1xuICAgICAgICBvdXRBaXJjcmFmdGhhc1dpZmkgPSBhaXJjcmFmdHNbaV0uaGFzV2lmaTtcbiAgICAgICAgJHNjb3BlLm91dEFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbaV0ubW9kZWw7XG4gICAgICB9XG4gICAgICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgICAgIGlmIChhaXJjcmFmdHNbaV0udGFpbE51bWJlciA9PT0gcmV0dXJuRmxpZ2h0LnJlZkFpcmNyYWZ0VGFpbE51bWJlcikge1xuICAgICAgICAgIHJlQWlyY3JhZnRoYXNTbW9raW5nID0gYWlyY3JhZnRzW2ldLmhhc1Ntb2tpbmc7XG4gICAgICAgICAgcmVBaXJjcmFmdGhhc1dpZmkgPSBhaXJjcmFmdHNbaV0uaGFzV2lmaTtcbiAgICAgICAgICAkc2NvcGUucmVBaXJjcmFmdE1vZGVsID0gYWlyY3JhZnRzW2ldLm1vZGVsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9XG4gIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgfSk7XG5cbiAgJHNjb3BlLm91dFJlZk9yaWdpbkFpcnBvcnROYW1lO1xuICAkc2NvcGUub3V0UmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZTtcbiAgdmFyIGFpcnBvcnRzID0gW107XG4gIGFwaS5nZXRBaXJwb3J0cygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXMocmVzcG9uc2UpIHtcbiAgICBhaXJwb3J0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhaXJwb3J0cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IG91dGdvaW5nRmxpZ2h0LnJlZk9yaWdpbkFpcnBvcnQpIHtcbiAgICAgICAgJHNjb3BlLm91dFJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbaV0ubmFtZTtcbiAgICAgIH1cbiAgICAgIGlmIChhaXJwb3J0c1tpXS5pYXRhID09PSBvdXRnb2luZ0ZsaWdodC5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpIHtcbiAgICAgICAgJHNjb3BlLm91dFJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tpXS5uYW1lO1xuICAgICAgfVxuICAgICAgaWYgKHJldHVybkZsaWdodCkge1xuICAgICAgICAkc2NvcGUucmVSZWZPcmlnaW5BaXJwb3J0TmFtZTtcbiAgICAgICAgJHNjb3BlLnJlUmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZTtcbiAgICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IHJldHVybkZsaWdodC5yZWZPcmlnaW5BaXJwb3J0KSB7XG4gICAgICAgICAgJHNjb3BlLnJlUmVmT3JpZ2luQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tpXS5uYW1lO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhaXJwb3J0c1tpXS5pYXRhID09PSByZXR1cm5GbGlnaHQucmVmRGVzdGluYXRpb25BaXJwb3J0KSB7XG4gICAgICAgICAgJHNjb3BlLnJlUmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICAgIH1cblxuICAgICAgfVxuICAgIH1cbiAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICB9KTtcbiAgdmFyIG91dGJ1c2luZXNzT3JFY29uID0gXCJcIjtcbiAgdmFyIG91dGZhcmUgPSAwO1xuXG4gIGlmIChib29raW5nLmV4aXRJc0Vjb25vbXkpIHtcbiAgICBvdXRidXNpbmVzc09yRWNvbiA9IFwiRWNvbm9teVwiO1xuICAgIG91dGZhcmUgPSBvdXRnb2luZ0ZsaWdodC5lY29ub215RmFyZTtcbiAgfSBlbHNlIHtcbiAgICBvdXRidXNpbmVzc09yRWNvbiA9IFwiQnVzaW5lc3NcIjtcbiAgICBvdXRmYXJlID0gb3V0Z29pbmdGbGlnaHQuYnVzaW5lc3NGYXJlO1xuICB9XG4gIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICB2YXIgcmVidXNpbmVzc09yRWNvbiA9IFwiXCI7XG4gICAgdmFyIHJlZmFyZSA9IDA7XG4gICAgaWYgKGJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSkge1xuICAgICAgcmVidXNpbmVzc09yRWNvbiA9IFwiRWNvbm9teVwiO1xuICAgICAgcmVmYXJlID0gcmV0dXJuRmxpZ2h0LmVjb25vbXlGYXJlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWJ1c2luZXNzT3JFY29uID0gXCJCdXNpbmVzc1wiO1xuICAgICAgcmVmYXJlID0gcmV0dXJuRmxpZ2h0LmJ1c2luZXNzRmFyZTtcbiAgICB9XG4gIH1cbiAgdmFyIG91dGZhY2lsaXRpZXNSZXN1bHQgPSBbXTtcbiAgaWYgKG91dEFpcmNyYWZ0aGFzU21va2luZylcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1swXSk7XG4gIGlmIChvdXRBaXJjcmFmdGhhc1dpZmkpXG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMV0pO1xuICBpZiAoIWJvb2tpbmcuZXhpdElzRWNvbm9teSkge1xuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzJdKTtcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1szXSk7XG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNF0pO1xuICB9XG4gIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzVdKTtcbiAgaWYgKHJldHVybkZsaWdodCkge1xuICAgIHZhciByZWZhY2lsaXRpZXNSZXN1bHQgPSBbXTtcbiAgICBpZiAocmVBaXJjcmFmdGhhc1Ntb2tpbmcpXG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzBdKTtcbiAgICBpZiAocmVBaXJjcmFmdGhhc1dpZmkpXG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzFdKTtcbiAgICBpZiAoIWJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSkge1xuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1syXSk7XG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzNdKTtcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNF0pO1xuICAgIH1cbiAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzVdKTtcblxuICAgICRzY29wZS5yZXR1cm5GbGlnaHQgPSByZXR1cm5GbGlnaHQ7XG4gICAgJHNjb3BlLnJlYnVzaW5lc3NPckVjb24gPSByZWJ1c2luZXNzT3JFY29uO1xuICAgICRzY29wZS5yZWZhcmUgPSByZWZhcmU7XG4gICAgJHNjb3BlLnJlZmFjaWxpdGllc1Jlc3VsdCA9IHJlZmFjaWxpdGllc1Jlc3VsdDtcbiAgfVxuICAkc2NvcGUub3V0Z29pbmdGbGlnaHQgPSBvdXRnb2luZ0ZsaWdodDtcbiAgJHNjb3BlLm91dGJ1c2luZXNzT3JFY29uID0gb3V0YnVzaW5lc3NPckVjb247XG4gICRzY29wZS5vdXRmYXJlID0gb3V0ZmFyZTtcbiAgJHNjb3BlLm91dGZhY2lsaXRpZXNSZXN1bHQgPSBvdXRmYWNpbGl0aWVzUmVzdWx0O1xuXG59XG59KTtcbiIsIi8vIEBhYmRlbHJhaG1hbi1tYWdlZFxudmFyIGZsaWdodENvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwkcm91dGVQYXJhbXMsYXBpKSB7XG5cbiAgICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1mbGlnaHRzJztcbiAgICAgICRzY29wZS50aXRsZSA9IFwiQ2hvb3NlIGEgRmxpZ2h0XCI7XG4gICAgICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAgICAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG5cblxuICAgICAgaWYoVHlwZSA9PSAnZGVza3RvcCcpe1xuICAgICAgICAkc2NvcGUuaXNDb2xsYXBzZWQgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkID0gZmFsc2U7XG5cblxuICAgICAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGFwaS5zZXRPdXRHb2luZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodCk7XG4gICAgICAgICAgICBhcGkuc2V0UmV0dXJuaW5nRmxpZ2h0KCRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodCk7XG4gICAgICAgICAgICBhcGkuc2V0Qm9va2luZygkc2NvcGUuc2VsZWN0ZWRCb29raW5nKTtcblxuXG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZXhpdC1mbGlnaHQnKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgdGhlIHVzZXIgaGFzIHNlbGVjdGVkIGEgZmxpZ2h0XG4gICAgICAgICAgICAvLyBhbmQgdGhlbiBjYWxsIGFwaS5zZXRGbGlnaHQoY2hvc2VuRmxpZ2h0KVxuICAgICAgICAgICAgLy9pZiB0aGUgdXNlciBoYXNuJ3Qgc2VsZWN0ZWQgYSBmbGlnaHQgcmV0dXJuIHByZXZlbnQgaGltIGZyb20gcHJvY2VlZGluZ1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3JpZ2luID0gJHJvdXRlUGFyYW1zLm9yaWdpbjtcbiAgICAgICAgdmFyIGRlc3RpbmF0aW9uID0gJHJvdXRlUGFyYW1zLmRlc3RpbmF0aW9uO1xuICAgICAgICB2YXIgZXhpdERhdGUgPSBuZXcgRGF0ZSgkcm91dGVQYXJhbXMuZXhpdERhdGUgKiAxMDAwKTtcbiAgICAgICAgJHNjb3BlLnJvdW5kVHJpcCA9IGZhbHNlO1xuICAgICAgICBpZiAoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUpIHtcbiAgICAgICAgICAgIHZhciByZXR1cm5EYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUgKiAxMDAwKTtcbiAgICAgICAgICAgICRzY29wZS5yb3VuZFRyaXAgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZyA9IHtcbiAgICAgICAgICAgIFwicmVmUGFzc2VuZ2VySURcIjogbnVsbCxcbiAgICAgICAgICAgIFwiZXhpdERlcGFydHVyZVVUQ1wiOiBudWxsLFxuICAgICAgICAgICAgXCJyZUVudHJ5RGVwYXJ0dXJlVVRDXCI6IG51bGwsXG4gICAgICAgICAgICBcImlzc3VlRGF0ZVwiOiBudWxsLFxuICAgICAgICAgICAgXCJpc09uZVdheVwiOiAhJHNjb3BlLnJvdW5kVHJpcCxcbiAgICAgICAgICAgIFwicmVmRXhpdEZsaWdodE51bWJlclwiOiBudWxsLFxuICAgICAgICAgICAgXCJyZWZSZUVudHJ5RmxpZ2h0TnVtYmVyXCI6IG51bGwsXG4gICAgICAgICAgICBcInJlY2VpcHROdW1iZXJcIjogbnVsbFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHZhciBvcmlnaW4gPSBcIlRYTFwiO1xuICAgICAgICAvLyB2YXIgZGVzdGluYXRpb24gPSBcIkpGS1wiO1xuICAgICAgICAvLyB2YXIgZXhpdERhdGUgPSBuZXcgRGF0ZSgxNDU5NTU1MjAwICogMTAwMCk7XG5cbiAgICAgICAgaWYgKCFvcmlnaW4gfHwgIWRlc3RpbmF0aW9uIHx8ICFleGl0RGF0ZSkge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmbGlnaHRzO1xuICAgICAgICB2YXIgcmV0dXJuRGF0ZU1pbGw7XG4gICAgICAgIGlmIChyZXR1cm5EYXRlKVxuICAgICAgICAgICAgcmV0dXJuRGF0ZU1pbGwgPSByZXR1cm5EYXRlLmdldFRpbWUoKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGV4aXREYXRlLnRvSVNPU3RyaW5nKCkpXG4gICAgICAgIGFwaS5nZXRGbGlnaHRzKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLmdldFRpbWUoKSwgcmV0dXJuRGF0ZU1pbGwpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICAgICAgICAgIGZsaWdodHMgPSByZXNwb25zZS5kYXRhXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKVxuICAgICAgICAgICAgLy8gZm9ybWF0dGluZyBkYXRhIHRvIGJlIHByZXNlbnRhYmxlXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgIHZhciBkZXBhcnR1cmVEYXRlID0gbmV3IERhdGUoZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZGVwYXJ0dXJlVVRDKTtcbiAgICAgICAgICAgICAgICBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5kZXBhcnR1cmVVVEMgPSBkZXBhcnR1cmVEYXRlLnRvVVRDU3RyaW5nKCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgYXJyaXZhbERhdGUgPSBuZXcgRGF0ZShmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5hcnJpdmFsVVRDKTtcbiAgICAgICAgICAgICAgICBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5hcnJpdmFsVVRDID0gYXJyaXZhbERhdGUudG9VVENTdHJpbmcoKTtcblxuICAgICAgICAgICAgICAgIHZhciBob3VycyA9IE1hdGguZmxvb3IoZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZHVyYXRpb24gLyA2MCk7XG4gICAgICAgICAgICAgICAgdmFyIG1pbnV0ZXMgPSBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5kdXJhdGlvbiAlIDYwO1xuXG4gICAgICAgICAgICAgICAgZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZHVyYXRpb24gPSBob3VycyArIFwiaCBcIiArIG1pbnV0ZXMgKyBcIm1cIjtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB0aHJvd2luZyBhd2F5IGZsaWdodHMub3V0Z29pbmdGbGlnaHRzIG5vdCBmaXR0aW5nIGNvbnN0cmFpbnRzXG4gICAgICAgICAgICAvLyBmdW5jdGlvbiBjaGVja0NvbnN0cmFpbnRzKGZsaWdodCkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgICB2YXIgZmxpZ2h0RGF0ZSA9IG5ldyBEYXRlKGZsaWdodC5kZXBhcnR1cmVVVEMpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gZmxpZ2h0LnJlZk9yaWdpbkFpcnBvcnQgPT09IG9yaWdpbiAmJiBmbGlnaHQucmVmRGVzdGluYXRpb25BaXJwb3J0ID09PSBkZXN0aW5hdGlvbiAmJiBmbGlnaHREYXRlLmdldERheSgpID09PSBleGl0RGF0ZS5nZXREYXkoKSAmJiBmbGlnaHREYXRlLmdldE1vbnRoKCkgPT09IGV4aXREYXRlLmdldE1vbnRoKCkgJiYgZmxpZ2h0RGF0ZS5nZXRGdWxsWWVhcigpID09PSBleGl0RGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgLy8gJHNjb3BlLmZsaWdodHMgPSBmbGlnaHRzLmZpbHRlcihjaGVja0NvbnN0cmFpbnRzKTtcbiAgICAgICAgICAgIGlmKCRzY29wZS5yb3VuZFRyaXAgKVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGZsaWdodHMucmV0dXJuRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgdmFyIGRlcGFydHVyZURhdGUgPSBuZXcgRGF0ZShmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZGVwYXJ0dXJlVVRDKTtcbiAgICAgICAgICAgICAgICBmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZGVwYXJ0dXJlVVRDID0gZGVwYXJ0dXJlRGF0ZS50b1VUQ1N0cmluZygpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGFycml2YWxEYXRlID0gbmV3IERhdGUoZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLmFycml2YWxVVEMpO1xuICAgICAgICAgICAgICAgIGZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5hcnJpdmFsVVRDID0gYXJyaXZhbERhdGUudG9VVENTdHJpbmcoKTtcblxuICAgICAgICAgICAgICAgIHZhciBob3VycyA9IE1hdGguZmxvb3IoZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLmR1cmF0aW9uIC8gNjApO1xuICAgICAgICAgICAgICAgIHZhciBtaW51dGVzID0gZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLmR1cmF0aW9uICUgNjA7XG5cbiAgICAgICAgICAgICAgICBmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZHVyYXRpb24gPSBob3VycyArIFwiaCBcIiArIG1pbnV0ZXMgKyBcIm1cIjtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMgPSBmbGlnaHRzO1xuICAgICAgICAgICAgYXBpLmdldEFpcnBvcnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcblxuICAgICAgICAgICAgICAgIGFpcnBvcnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlycG9ydHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZPcmlnaW5BaXJwb3J0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZPcmlnaW5BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2pdLm5hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhaXJwb3J0c1tqXS5pYXRhID09PSAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmRGVzdGluYXRpb25BaXJwb3J0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZigkc2NvcGUucm91bmRUcmlwKVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlycG9ydHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmRGVzdGluYXRpb25BaXJwb3J0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2pdLm5hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgICAgIGFwaS5nZXRBaXJjcmFmdHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuXG4gICAgICAgICAgICAgICAgYWlyY3JhZnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlyY3JhZnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhaXJjcmFmdHNbal0udGFpbE51bWJlciA9PT0gJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkFpcmNyYWZ0VGFpbE51bWJlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmQWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tqXS5tb2RlbDtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZigkc2NvcGUucm91bmRUcmlwKVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlyY3JhZnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhaXJjcmFmdHNbal0udGFpbE51bWJlciA9PT0gJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZBaXJjcmFmdFRhaWxOdW1iZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZBaXJjcmFmdE1vZGVsID0gYWlyY3JhZnRzW2pdLm1vZGVsO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgIH0pO1xuXG5cblxuICAgICAgICAkc2NvcGUuc2VsZWN0T3V0Z29pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQsIGlzRWNvbm9teSkge1xuXG4gICAgICAgICAgICAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZE91dGdvaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLmV4aXREZXBhcnR1cmVVVEMgPSBmbGlnaHQuZGVwYXJ0dXJlVVRDO1xuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5leGl0SXNFY29ub215ID0gaXNFY29ub215O1xuICAgICAgICAgICAgLy8gJHNjb3BlLnNlbGVjdGVkQm9va2luZy5pc09uZVdheSA9ICRzY29wZS5yb3VuZFRyaXA7XG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJlZkV4aXRGbGlnaHROdW1iZXIgPSBmbGlnaHQubnVtYmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNlbGVjdFJldHVybmluZ0ZsaWdodCA9IGZ1bmN0aW9uKGZsaWdodCwgaXNFY29ub215KSB7XG5cbiAgICAgICAgICAgICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodCA9IGZsaWdodDtcblxuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZUVudHJ5RGVwYXJ0dXJlVVRDID0gZmxpZ2h0LmRlcGFydHVyZVVUQztcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSA9IGlzRWNvbm9teTtcbiAgICAgICAgICAgIC8vICRzY29wZS5zZWxlY3RlZEJvb2tpbmcuaXNPbmVXYXkgPSAkc2NvcGUucm91bmRUcmlwO1xuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZSZUVudHJ5RmxpZ2h0TnVtYmVyID0gZmxpZ2h0Lm51bWJlcjtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgJHNjb3BlLmNoZWNrTmV4dEJ0blN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkc2NvcGUuaXNSZXR1cm5pbmdGbGlnaHRTZWxlY3RlZCAmJiAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfWVsc2V7XG5cbiAgICAgICAgJHNjb3BlLmNoYXRzID0gW3tcbiAgICAgICAgICBcIm51bWJlclwiOiBcIjEwMDBcIixcbiAgICAgICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTBUMDE6MDA6MDBaXCIsXG4gICAgICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMFQwMzowMDowMFpcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiQWlyIEJlcmxpblwiLFxuICAgICAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcIm51bWJlclwiOiBcIjEwMDFcIixcbiAgICAgICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTBUMDY6MDA6MDBaXCIsXG4gICAgICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMFQwODowMDowMFpcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiQWlyIEJlcmxpblwiLFxuICAgICAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcIm51bWJlclwiOiBcIjEwMDJcIixcbiAgICAgICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTBUMTI6MDA6MDBaXCIsXG4gICAgICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMFQxNDowMDowMFpcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiQWlyIEJlcmxpblwiLFxuICAgICAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcIm51bWJlclwiOiBcIjEwMDNcIixcbiAgICAgICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTBUMTc6MDA6MDBaXCIsXG4gICAgICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMFQxOTowMDowMFpcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiQWlyIEJlcmxpblwiLFxuICAgICAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgICAgIH1dO1xuXG4gICAgICB9XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5yb3VuZFRyaXApXG5cbiAgICAgICRzY29wZS5jb25zdHJ1Y3REYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICB2YXIgZGF0ZU91dCA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICByZXR1cm4gZGF0ZU91dDtcbiAgICAgIH07XG5cblxufVxuXG5pZihUeXBlID09ICdtb2JpbGUnKXtcbiAgZmxpZ2h0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaSddO1xufWVsc2V7XG4gIGZsaWdodENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsJyRyb3V0ZVBhcmFtcycsICdhcGknXTtcbn1cblxuXG5BcHAuY29udHJvbGxlcignZmxpZ2h0c0N0cmwnLCBmbGlnaHRDb250cm9sbGVyKTtcbiIsIlxudmFyIGZsaWdodE5ld0NvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwkcm91dGVQYXJhbXMsYXBpKSB7XG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLWZsaWdodHMnO1xuICAgICRzY29wZS50aXRsZSA9IFwiQ2hvb3NlIGEgRmxpZ2h0XCI7XG4gICAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIk5leHRcIjtcbiAgICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG4gICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gZmFsc2U7XG4gICAgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZCA9IGZhbHNlO1xuXG5cbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgYXBpLnNldE91dEdvaW5nRmxpZ2h0KCRzY29wZS5zZWxlY3RlZE91dGdvaW5nRmxpZ2h0KTtcbiAgICAgICAgYXBpLnNldFJldHVybmluZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQpO1xuICAgICAgICBhcGkuc2V0Qm9va2luZygkc2NvcGUuc2VsZWN0ZWRCb29raW5nKTtcblxuXG5cbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9leGl0LWZsaWdodCcpO1xuXG4gICAgfVxuXG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjaGVjayBpZiB0aGUgdXNlciBoYXMgc2VsZWN0ZWQgYSBmbGlnaHRcbiAgICAgICAgLy8gYW5kIHRoZW4gY2FsbCBhcGkuc2V0RmxpZ2h0KGNob3NlbkZsaWdodClcbiAgICAgICAgLy9pZiB0aGUgdXNlciBoYXNuJ3Qgc2VsZWN0ZWQgYSBmbGlnaHQgcmV0dXJuIHByZXZlbnQgaGltIGZyb20gcHJvY2VlZGluZ1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgIH1cblxuICAgIHZhciBvcmlnaW4gPSAkcm91dGVQYXJhbXMub3JpZ2luO1xuICAgIHZhciBkZXN0aW5hdGlvbiA9ICRyb3V0ZVBhcmFtcy5kZXN0aW5hdGlvbjtcbiAgICB2YXIgZXhpdERhdGUgPSBuZXcgRGF0ZSgkcm91dGVQYXJhbXMuZXhpdERhdGUgKiAxMDAwKTtcbiAgICAkc2NvcGUucm91bmRUcmlwID0gZmFsc2U7XG4gICAgaWYgKCRyb3V0ZVBhcmFtcy5yZXR1cm5EYXRlKSB7XG4gICAgICAgIHZhciByZXR1cm5EYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUgKiAxMDAwKTtcbiAgICAgICAgJHNjb3BlLnJvdW5kVHJpcCA9IHRydWU7XG4gICAgfVxuICAgIHZhciBmbGlnaHRzO1xuICAgIHZhciByZXR1cm5EYXRlTWlsbDtcbiAgICBpZiAocmV0dXJuRGF0ZSlcbiAgICAgICAgcmV0dXJuRGF0ZU1pbGwgPSByZXR1cm5EYXRlLmdldFRpbWUoKTtcbiAgICBjb25zb2xlLmxvZyhleGl0RGF0ZS50b0lTT1N0cmluZygpKVxuICAgIGFwaS5nZXRPdGhlckZsaWdodHNFY28ob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUuZ2V0VGltZSgpLCByZXR1cm5EYXRlTWlsbCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXG4gICAgICAgICRzY29wZS5mbGlnaHRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgIH0pXG59XG5cblxuaWYoVHlwZSA9PSAnbW9iaWxlJyl7XG4gIGZsaWdodE5ld0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknXTtcbn1lbHNle1xuICBmbGlnaHROZXdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCckcm91dGVQYXJhbXMnLCAnYXBpJ107XG59XG5cblxuQXBwLmNvbnRyb2xsZXIoJ2ZsaWdodHNOZXdDdHJsJywgZmxpZ2h0TmV3Q29udHJvbGxlcik7XG4iLCJBcHAuY29udHJvbGxlcignbWFpbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpKSB7XG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLW1haW4nO1xuXG5cblxuICAgIGlmKFR5cGUgPT0gJ2Rlc2t0b3AnKXtcblxuICAgICAgJCgnI21haW4tdGV4dCcpLnR5cGVJdCh7XG4gICAgICAgICAgc3RyaW5nczogW1xuICAgICAgICAgICAgICBcIlNpbXBsZSwgY29udmVuaWVudCwgaW5zdGFudCBjb25maXJtYXRpb24uXCIsIFwiRGVzdGluYXRpb25zIGFsbCBhcm91bmQgdGhlIGdsb2JlLlwiLCBcIkV4cGVyaWVuY2UgYXV0aGVudGljIGhvc3BpdGFsaXR5LlwiLCBcIlRpbWUgdG8gZ2V0IGVuY2hhbnRlZC5cIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgc3BlZWQ6IDEyMCxcbiAgICAgICAgICBicmVha0xpbmVzOiBmYWxzZSxcbiAgICAgICAgICBsb29wOiB0cnVlXG4gICAgICB9KTtcbiAgICAgICRzY29wZS5mbGlnaHQgPSB7XG4gICAgICAgICAgdHlwZTogXCJvbmVcIlxuICAgICAgfVxuICAgICAgJHNjb3BlLm90aGVyQWlybGluZSA9IHtcbiAgICAgIHZhbHVlOmZhbHNlXG4gICAgICB9XG4gICAgICAkc2NvcGUuZ29Ub0ZsaWdodHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoJHNjb3BlLm90aGVyQWlybGluZS52YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCRzY29wZS5mbGlnaHQudHlwZSA9PSBcIm9uZVwiKVxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzLW5ldycpLnNlYXJjaCgnb3JpZ2luJywgJHNjb3BlLnNlbGVjdGVkT3JpZ2luKS5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdCkuc2VhcmNoKCdleGl0RGF0ZScsICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSk7XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMtbmV3JylcbiAgICAgICAgICAgICAgICAgIC5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbilcbiAgICAgICAgICAgICAgICAgIC5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdClcbiAgICAgICAgICAgICAgICAgIC5zZWFyY2goJ2V4aXREYXRlJywgKCRzY29wZS5leGl0RGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApKVxuICAgICAgICAgICAgICAgICAgLnNlYXJjaCgncmV0dXJuRGF0ZScsICgkc2NvcGUucmV0dXJuRGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoJHNjb3BlLmZsaWdodC50eXBlID09IFwib25lXCIpXG4gICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKS5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbikuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpLnNlYXJjaCgnZXhpdERhdGUnLCAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCkpO1xuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpXG4gICAgICAgICAgICAgICAgICAgICAgLnNlYXJjaCgnb3JpZ2luJywgJHNjb3BlLnNlbGVjdGVkT3JpZ2luKVxuICAgICAgICAgICAgICAgICAgICAgIC5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdClcbiAgICAgICAgICAgICAgICAgICAgICAuc2VhcmNoKCdleGl0RGF0ZScsICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSlcbiAgICAgICAgICAgICAgICAgICAgICAuc2VhcmNoKCdyZXR1cm5EYXRlJywgKCRzY29wZS5yZXR1cm5EYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCkpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICB9XG5cbiAgICAgIH07XG4gICAgICAkbG9jYXRpb24udXJsKCRsb2NhdGlvbi5wYXRoKCkpO1xuICAgICAgc2V0VXBEYXRlKCRzY29wZSk7XG5cbiAgICAgICRzY29wZS5jaGlsZHJlbiA9IFsnMCBjaGlsZHJlbicsICcxIGNoaWxkJywgJzIgY2hpbGRyZW4nLCAnMyBjaGlsZHJlbicsICc0IGNoaWxkcmVuJ107XG4gICAgICAkc2NvcGUuY2hpbGRyZW5CdG5UZXh0ID0gJHNjb3BlLmNoaWxkcmVuWzBdO1xuICAgICAgJHNjb3BlLmNoYW5nZUNoaWxkcmVuID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgICRzY29wZS5jaGlsZHJlbkJ0blRleHQgPSB0ZXh0O1xuICAgICAgfVxuXG5cblxuICAgICAgJHNjb3BlLmFkdWx0cyA9IFsnMSBhZHVsdCcsICcyIGFkdWx0cycsICczIGFkdWx0cycsICc0IGFkdWx0cyddO1xuICAgICAgJHNjb3BlLmFkdWx0QnRuVGV4dCA9ICRzY29wZS5hZHVsdHNbMF07XG4gICAgICAkc2NvcGUuY2hhbmdlQWR1bHQgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgJHNjb3BlLmFkdWx0QnRuVGV4dCA9IHRleHQ7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5pbmZhbnRzID0gWycwIGluZmFudHMnLCAnMSBpbmZhbnQnXTtcbiAgICAgICRzY29wZS5pbmZhbnRCdG5UZXh0ID0gJHNjb3BlLmluZmFudHNbMF07XG4gICAgICAkc2NvcGUuY2hhbmdlSW5mYW50ID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgICRzY29wZS5pbmZhbnRCdG5UZXh0ID0gdGV4dDtcbiAgICAgIH1cblxuICAgICAgYXBpLmdldEFpcnBvcnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgICAgICAgICRzY29wZS5haXJwb3J0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICB9KTtcbiAgICAgICRzY29wZS5zZWxlY3RlZE9yaWdpbiA9IHVuZGVmaW5lZDtcbiAgICAgICRzY29wZS5zZWxlY3RlZERlc3QgPSB1bmRlZmluZWQ7XG5cbiAgICAgIGZ1bmN0aW9uIGFpcnBvcnNDb250YWlucyhpYXRhKSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuYWlycG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKGlhdGEgPT0gJHNjb3BlLmFpcnBvcnRzW2ldWydpYXRhJ10pXG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUuYnV0dG9uU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gISRzY29wZS5zZWxlY3RlZE9yaWdpbiB8fCAhJHNjb3BlLnNlbGVjdGVkRGVzdCB8fCAhJHNjb3BlLmV4aXREYXRlIHx8ICRzY29wZS5zZWxlY3RlZERlc3QgPT0gJHNjb3BlLnNlbGVjdGVkT3JpZ2luIHx8ICFhaXJwb3JzQ29udGFpbnMoJHNjb3BlLnNlbGVjdGVkT3JpZ2luKSB8fCAhYWlycG9yc0NvbnRhaW5zKCRzY29wZS5zZWxlY3RlZERlc3QpO1xuICAgICAgfVxuICAgIH1lbHNle1xuXG4gICAgfVxufSk7XG5cbmZ1bmN0aW9uIHNldFVwRGF0ZSgkc2NvcGUpIHtcbiAgICAkc2NvcGUudG9kYXkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLmV4aXREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgJHNjb3BlLnJldHVybkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIH07XG4gICAgJHNjb3BlLnRvZGF5KCk7XG5cbiAgICAkc2NvcGUub3BlbjIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLnBvcHVwMi5vcGVuZWQgPSB0cnVlO1xuICAgIH07XG4gICAgJHNjb3BlLm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLnBvcHVwLm9wZW5lZCA9IHRydWU7XG4gICAgfTtcblxuXG4gICAgZnVuY3Rpb24gZGlzYWJsZWQoZGF0YSkge1xuICAgICAgICB2YXIgZGF0ZSA9IGRhdGEuZGF0ZSxcbiAgICAgICAgICAgIG1vZGUgPSBkYXRhLm1vZGU7XG4gICAgICAgIHJldHVybiBtb2RlID09PSAnZGF5JyAmJiAoZGF0ZS5nZXREYXkoKSA9PT0gMCB8fCBkYXRlLmdldERheSgpID09PSA2KTtcbiAgICB9XG4gICAgJHNjb3BlLmRhdGVPcHRpb25zID0ge1xuICAgICAgICBmb3JtYXRZZWFyOiAneXknLFxuICAgICAgICBtYXhEYXRlOiBuZXcgRGF0ZSgyMDIwLCA1LCAyMiksXG4gICAgICAgIG1pbkRhdGU6IG5ldyBEYXRlKCksXG4gICAgICAgIHN0YXJ0aW5nRGF5OiAxXG4gICAgfTtcbiAgICAkc2NvcGUucG9wdXAyID0ge1xuICAgICAgICBvcGVuZWQ6IGZhbHNlXG4gICAgfTtcbiAgICAkc2NvcGUucG9wdXAgPSB7XG4gICAgICAgIG9wZW5lZDogZmFsc2VcbiAgICB9O1xufVxuIiwiLy8gQHlhc3NtaW5lXG5BcHAuY29udHJvbGxlcigncGFzc2VuZ2VyRGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpKSB7XG4gICRzY29wZS50aXRsZSA9IFwiRmlsbCBpbiB5b3VyIGRldGFpbHNcIjtcblxuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbmlmKFR5cGUgPT0gJ2Rlc2t0b3AnKXtcbiAgaWYoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKXtcbiAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAkc2NvcGUudGl0bGVzID0gWydNcicsICdNcnMnLCAnTXMnLCAnRHInXTtcbiAgJHNjb3BlLnRpdGxlc0J0blRleHQgPSAkc2NvcGUudGl0bGVzWzBdO1xuICAkc2NvcGUuY2hhbmdlVGl0bGUgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgJHNjb3BlLnRpdGxlc0J0blRleHQgPSB0ZXh0O1xuICB9XG5cbiAgYXBpLmdldENvdW50cmllcygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXMocmVzcG9uc2UpIHtcbiAgICAkc2NvcGUuY291bnRyaWVzID0gcmVzcG9uc2UuZGF0YTtcbiAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICB9KTtcblxuXG5cblxuICAkc2NvcGUucGFzc2VuZ2VyID0ge1xuICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICBjb3VudHJ5Q29kZTogbnVsbCxcbiAgICAgICAgbmF0aW9uYWxpdHk6bnVsbCxcbiAgICAgICAgc2V4OiBudWxsLFxuICAgICAgICBiaXJ0aERhdGU6IG51bGwsXG4gICAgICAgIGJpcnRoUGxhY2U6IG51bGwsXG4gICAgICAgIG5hdGlvbmFsSUQ6IG51bGwsXG4gICAgICAgIGF1dGhvcml0eTogbnVsbCxcbiAgICAgICAgaXNzdWVEYXRlOiBudWxsLFxuICAgICAgICBleHBpcnlEYXRlOiBudWxsLFxuICAgICAgICBwb2ludHM6IG51bGwsXG4gICAgICAgIG1lbWJlcnNoaXA6IG51bGwsXG4gICAgICAgZmlyc3ROYW1lIDpudWxsLFxuICAgICAgICBtaWRkbGVOYW1lOiBudWxsLFxuICAgICAgICBsYXN0TmFtZTpudWxsLFxuICAgICAgICBwYXNzcG9ydE51bWJlcjogbnVsbCxcbiAgICAgICAgcGhvbmVOdW1iZXI6bnVsbCxcbiAgICAgICAgZW1haWw6IG51bGxcblxuICAgICAgIH07XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gTm93IHlvdSBoYXZlICRzY29wZS5uYXRpb25hbGl0eSBhbmQgJHNjb3BlLnRpdGxlc0J0blRleHQgeW91IGNhbiB1c2UgdGhlbSBpbiB5b3VyIG9iamVjdFxuICB2YXIgY29tcGxldGUgPSBmYWxzZTtcbiAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuXG4gIC8qaWYoIWFwaS5nZXRDaG9zZW5GbGlnaHQoKSlcbiAge1xuICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgYWxlcnQoXCJZb3UgaGF2ZSB0byBjaG9vc2UgYSBmbGlnaHRcIik7XG4gIH0qL1xuICAvL1RoZSByZXZlcnRpbmcgdG8gdGhlIGZsaWdodHMgcGFnZVxuXG4gICAgJHNjb3BlLnBhc3NlbmdlciA9IHtcbiAgICAgIHR5cGU6IG51bGwsXG4gICAgICBjb3VudHJ5Q29kZTogbnVsbCwgLy9hY2NvcmRpbmcgdG8gY291bnRyeVxuICAgICAgbmF0aW9uYWxpdHk6JHNjb3BlLm5hdGlvbmFsaXR5LFxuICAgICAgc2V4OiBudWxsLFxuICAgICAgYmlydGhEYXRlOiBudWxsLFxuICAgICAgYmlydGhQbGFjZTogbnVsbCxcbiAgICAgIG5hdGlvbmFsSUQ6IG51bGwsXG4gICAgICBhdXRob3JpdHk6IG51bGwsXG4gICAgICBpc3N1ZURhdGU6IG51bGwsXG4gICAgICBleHBpcnlEYXRlOiBudWxsLFxuICAgICAgcG9pbnRzOiBudWxsLFxuICAgICAgbWVtYmVyc2hpcDogbnVsbCxcbiAgICAgIHRpdGxlOiAkc2NvcGUudGl0bGVzQnRuVGV4dCxcbiAgICAgIGZpcnN0TmFtZSA6ICRzY29wZS5maXJzdE5hbWUsXG4gICAgICBtaWRkbGVOYW1lOiAkc2NvcGUubWlkZGxlTmFtZSxcbiAgICAgIGxhc3ROYW1lOiAkc2NvcGUubGFzdE5hbWUsXG4gICAgICBwYXNzcG9ydE51bWJlcjogJHNjb3BlLnBhc3Nwb3J0TnVtYmVyLFxuICAgICAgcGhvbmVOdW1iZXI6ICRzY29wZS5waG9uZU51bWJlcixcbiAgICAgIGVtYWlsOiAkc2NvcGUuZW1haWwxXG5cblxuICAgICAgIH07XG4gICAgLy8vYmVmb3JlIHlvdSBsZWF2ZSB0aGUgcGFnZSBtYWtlIHN1cmUgdGhhdCB0aGUgcGFzc2VuZ2VyIG9iamVjdCBpcyBjb21wbGV0ZSBvdGhlcndpc2Ugc2hvdyBhbGVydChcIkZpbGwgaW4gYWxsIGRhdGFcIik7XG5cblxuXG4gIGlmKGNvbXBsZXRlID09IGZhbHNlKXtcbiAgICAgICAgaWYoKCRzY29wZS5maXJzdE5hbWUgPT1udWxsKXx8KCRzY29wZS5taWRkbGVOYW1lID09bnVsbCl8fCgkc2NvcGUubGFzdE5hbWUgPT1udWxsKXx8KCRzY29wZS5waG9uZU51bWJlciA9PW51bGwpfHwoJHNjb3BlLnBhc3Nwb3J0TnVtYmVyID09bnVsbCkpXG4gICAgICAgIHtcbiAgICAgICAgICBhbGVydChcIlBsZWFzZSBmaWxsIGluIGRhdGFcIik7XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIGlmKCRzY29wZS5lbWFpbDEhPSRzY29wZS5lbWFpbHZlcilcbiAgICAgICAgICBhbGVydChcIlRoZSByZXBlYXRlZCBlbWFpbCBkb2VzbnQgbWF0Y2ggdGhlIGZpcnN0IGVtYWlsXCIpO1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYoKCRzY29wZS5jaGVjaz09bnVsbCkpXG4gICAgICAgICAgICBhbGVydChcIlBsZWFzZSBjaGVjayB0aGUgYm94XCIpO1xuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuXG4gICAgfVxuICAgICAgaWYoY29tcGxldGU9PXRydWUpe1xuICAgICAgICBhcGkuc2V0UGFzc2VuZ2VyKCRzY29wZS5wYXNzZW5nZXIpO1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvc2VhdGluZy9vdXRnb2luZycpO1xuICAgICAgICB9XG5cbiAgICAgIH1cbiAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9leGl0LWZsaWdodCcpO1xuICAgIH1cbn1cblxuXG59KTtcbiIsIi8vIEBtaXJuYVxuQXBwLmNvbnRyb2xsZXIoJ3BheW1lbnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sYXBpKSB7XG4gICAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtcGF5bWVudCc7XG4gICRzY29wZS50aXRsZSA9IFwiQ2hvb3NlIHlvdXIgcGF5bWVudCBvcHRpb25cIjtcblxuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiUGF5IVwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG4gICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAkbG9jYXRpb24ucGF0aCgnL2NvbmZpcm1hdGlvbicpO1xuICB9XG4gICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAkbG9jYXRpb24ucGF0aCgnL3NlYXRpbmcnKTtcbiAgfVxuXG4gIGlmKFR5cGUgPT0gJ2Rlc2t0b3AnKXtcblxuICAgICAgaWYoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKXtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmKCFhcGkuZ2V0UGFzc2VuZ2VyKCkpe1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHByaWNlID0gMDtcbiAgICAgIGlmKGFwaS5nZXRDYWJpbmV0T3V0Z29pbmdDbGFzcygpID09ICdFY29ub215JylcbiAgICAgICAgcHJpY2UgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgICAgZWxzZVxuICAgICAgICBwcmljZSA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLmJ1c2luZXNzRmFyZVxuXG4gICAgICAgIGlmKGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKSl7XG5cbiAgICAgICAgICBpZihhcGkuZ2V0Q2FiaW5ldFJldHVybmluZ0NsYXNzKCkgPT0gJ0Vjb25vbXknKVxuICAgICAgICAgICAgcHJpY2UgPSBwcmljZSArIGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHByaWNlID0gcHJpY2UgKyBhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuYnVzaW5lc3NGYXJlXG5cblxuICAgICAgICB9XG5cblxuICAgICAgJHNjb3BlLnByaWNlID0gcHJpY2U7XG4gICAgICAkc2NvcGUueWVhcnMgPSBbJzIwMTYnLCcyMDE3JywnMjAxOCcsJzIwMTknLCcyMDIwJywnMjAyMScsJzIwMjInLCcyMDIzJywnMjAyNCddO1xuICAgICAgJHNjb3BlLnllYXJzQnRuVGV4dCA9ICRzY29wZS55ZWFyc1swXTtcbiAgICAgICRzY29wZS5jaGFuZ2VZZWFyID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAkc2NvcGUueWVhcnNCdG5UZXh0ID0gdGV4dDtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLm1vbnRocyA9IFsnSmFudWFyeScsJ0ZlYnVyYXJ5JywnTWFyY2gnLCdBcHJpbCcsJ01heScsJ0p1bmUnLCdKdWx5JywnQXVndXN0JywnU2VwdGVtYmVyJywnT2N0b2JlcicsJ05vdmVtYmVyJywnRGVjZW1iZXInXTtcbiAgICAgICRzY29wZS5tb250aHNCdG5UZXh0ID0gJHNjb3BlLm1vbnRoc1swXTtcbiAgICAgICRzY29wZS5jaGFuZ2VNb250aCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgJHNjb3BlLm1vbnRoc0J0blRleHQgPSB0ZXh0O1xuICAgICAgfSAgICBcbiAgfVxuXG59KTtcbiIsIi8vIEBhaG1lZC1lc3NtYXRcbiAgdmFyIHNlYXRpbmdDb250cm9sbGVyID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sJHJvdXRlUGFyYW1zLGFwaSkge1xuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1zZWF0aW5nJztcbiAgICAkc2NvcGUudGl0bGUgPSBcIldoZXJlIHdvdWxkIHlvdSBsaWtlIHRvIHNpdD9cIjtcblxuICAgICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG4gICAgaWYoVHlwZSA9PSAnZGVza3RvcCcpe1xuICAgICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkpXG4gICAgICAgICAgICAgIGlmICgkcm91dGVQYXJhbXMub3V0Z29pbmcgPT0gXCJvdXRnb2luZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3NlYXRpbmcvcmV0dXJpbmcnKTtcbiAgICAgICAgICAgICAgICAgIGFwaS5zZXRPdXRnb2luZ1NlYXQoJHNjb3BlLnNlYXQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgYXBpLnNldFJldHJ1blNlYXQoJHNjb3BlLnNlYXQpO1xuICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50Jyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgYXBpLnNldE91dGdvaW5nU2VhdCgkc2NvcGUuc2VhdCk7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpO1xuICAgICAgICAgIH1cblxuICAgICAgfVxuICAgICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgIH1cblxuXG5cbiAgICAgIGlmICghYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkgfHwgIWFwaS5nZXRCb29raW5nKCkpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWFwaS5nZXRQYXNzZW5nZXIoKSkge1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgc2VhdG1hcDtcblxuICAgICAgaWYgKCRyb3V0ZVBhcmFtcy5vdXRnb2luZyA9PSBcIm91dGdvaW5nXCIpIHtcblxuICAgICAgICAgICRzY29wZS5pc0Vjb25vbXlUZXh0ID0gYXBpLmdldENhYmluZXRPdXRnb2luZ0NsYXNzKCk7XG4gICAgICAgICAgc2VhdG1hcCA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLnNlYXRtYXA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5pc0Vjb25vbXlUZXh0ID0gYXBpLmdldENhYmluZXRSZXR1cm5pbmdDbGFzcygpO1xuICAgICAgICAgIHNlYXRtYXAgPSBhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuc2VhdG1hcDtcbiAgICAgIH1cblxuXG5cbiAgICAgIHZhciBhbHBoYWJpdHMgPSBbJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJywgJ0cnLCAnSCcsICdJJywgJ0onLCAnSycsICdMJywgXCJNXCIsIFwiTlwiXTtcbiAgICAgIHZhciBzY2hlbWEgPSBbMywgNSwgMywgMjBdO1xuXG4gICAgICAkc2NvcGUuYXJyYXkxID0gW107XG5cbiAgICAgICRzY29wZS5hcnJheTIgPSBbXTtcblxuICAgICAgJHNjb3BlLmFycmF5MyA9IFtdO1xuXG4gICAgICAkc2NvcGUuYm9iID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzBdOyBpKyspIHtcbiAgICAgICAgICAkc2NvcGUuYXJyYXkxLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsxXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmFycmF5Mi5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzJdOyBpKyspIHtcbiAgICAgICAgICAkc2NvcGUuYXJyYXkzLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVszXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmJvYi5wdXNoKGkpO1xuXG4gICAgICB9XG5cblxuXG4gICAgICAkc2NvcGUuc2VhcmNoQ29sb3IgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgaWYgKCEkc2NvcGUuaXNFbXB0eSh0ZXh0KSlcbiAgICAgICAgICAgICAgcmV0dXJuICdzZWF0T2N1JztcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHJldHVybiAnc2VhdEVtcHR5JztcbiAgICAgIH1cbiAgICAgICRzY29wZS5pc0VtcHR5ID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VhdG1hcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBpZiAoc2VhdG1hcFtpXVsnbnVtYmVyJ10gPT0gdGV4dCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlYXRtYXBbaV1bJ2lzRW1wdHknXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgJHNjb3BlLnNlbGVjdFNlYXQgPSBmdW5jdGlvbihzZWF0KSB7XG4gICAgICAgICAgJHNjb3BlLnNlYXQgPSBzZWF0O1xuICAgICAgfTtcbiAgICB9XG5cblxufTtcblxuXG5pZihUeXBlID09ICdtb2JpbGUnKXtcbiAgc2VhdGluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknXTtcbn1lbHNle1xuICBzZWF0aW5nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywnJHJvdXRlUGFyYW1zJywgJ2FwaSddO1xufVxuXG5cbkFwcC5jb250cm9sbGVyKCdzZWF0aW5nQ3RybCcsIHNlYXRpbmdDb250cm9sbGVyKTtcbiJdfQ==
