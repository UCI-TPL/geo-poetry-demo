var DEFAULT_ENERGY = 0.5;
var SERVER_BASE_URL = "http://localhost:5000";

var app = angular.module('GeoPoetryApp', ['fcsa-number']);

app.controller('GeoPoetryController', ['$scope', '$http', '$timeout', '$filter', '$sce',
function GeoPoetryController($scope, $http, $timeout, $filter, $sce) {
	function logError(message, dataDictionary) {
		if ( console ) {
			logText = message + "\n";
			if ( dataDictionary ) {
				for (var key in dataDictionary) {
					if ( dataDictionary.hasOwnProperty(key) ) {
						logText += key + ": " + $filter('json')(dataDictionary[key]) + "\n";
					}
				}
			}
			console.log(logText);
		}
	}

	$scope.use_browser_gps = "Y";
	$scope.radius_units = "km";
	$scope.genres = [];
	$scope.selected_genre = "-";
	$scope.energy = 0.5;
	$scope.use_energy_function = "Y";
	$scope.energy_wave_period = 4;
	$scope.number_of_requests = 0;
	$scope.poetry_lines = [];
	$scope.poetry_loading = false;
	$scope.valence = '';

	function validationErrorDisplayer(message) {
		function displayValidationError(newVal, oldVal) {
			if ( (oldVal !== newVal) && (newVal === false) ) {
				$scope.error_message = message;
			}
		}
		return displayValidationError;
	}
	$scope.$watch('inputForm.lat.$valid', validationErrorDisplayer("Latitude must be a decimal number between -90 and 90."));
	$scope.$watch('inputForm.long.$valid', validationErrorDisplayer("Longitude must be a decimal number between -180 and 180."));
	$scope.$watch('inputForm.radius.$valid', validationErrorDisplayer("Radius must be a positive number."));
	$scope.$watch('inputForm.period.$valid', validationErrorDisplayer("Period must be a positive whole number."));
	$scope.$watch('inputForm.energy.$valid', validationErrorDisplayer("Energy must be a decimal between 0 and 1."));

	$scope.refreshGenreList = function() {
		$http.get(SERVER_BASE_URL+"/get-genres").then(function successCallback(response) {
			$scope.genres = response.data['genres'];
		},
		function errorCallback(response) {
			$scope.error_message = "Failed to fetch the list of genres from the server."
			logError($scope.error_message, { response: response });
		});
	}
	$scope.refreshGenreList();

	$scope.refreshGPS = function() {
		navigator.geolocation.getCurrentPosition(function success(position) {
			$scope.$apply(function() {
				$scope.latitude = position.coords.latitude;
				$scope.longitude = position.coords.longitude;
			});
		}, function error() {
			$scope.$apply(function() {
				$scope.error_message = "Could not get current location from the browser.";
				logError($scope.error_message);
			});
		});
	}
	$scope.refreshGPS();

	function getNextEnergy() {
		radians_per_request = (Math.PI*2) / $scope.energy_wave_period; // period -> radians (2pi per period)
		radians_offset = radians_per_request * $scope.number_of_requests; // offset by number of requests
		sine_value = Math.sin(radians_offset); // compute sine
		energy_value = (sine_value + 1) / 2; // sine range (-1 to 1) -> energy range (0 to 1)
		return energy_value;
	}
	$scope.resetEnergyFunction = function() {
		if ( $scope.use_energy_function == "Y" ) {
			$scope.number_of_requests = 0;
			$scope.energy = 0.5;
		}
	}

	$scope.submitForm = function() {
		navigator.geolocation.getCurrentPosition(function success(position) {
			$scope.$apply(function() {
				$scope.latitude = position.coords.latitude;
				$scope.longitude = position.coords.longitude;
				$scope.poetry_loading = true;
			});

			data = {
				latitude: $scope.latitude,
				longitude: $scope.longitude,
				song_energy: $scope.energy
			}
			if ( $scope.selected_genre != "-" )
				data['genre'] = $scope.selected_genre;
			if ( $scope.radius )
				data['radius'] = $scope.radius;
			if ( $scope.radius_units == 'mi' )
				data['imperial_units'] = true;
			
			console.log("Sending to server:"); //DEBUG
			console.log(data); // DEBUG
			$http.post(SERVER_BASE_URL+"/geo-poetry", data).then(function successCallback(response) {
				result = response.data;
				console.log("Server responded:"); // DEBUG
				console.log(result);
				$timeout(function(){ // Prevent synchronous handling
					$scope.$apply(function() {
						$scope.poetry_lines = result['poetry'].split("\n");
						$scope.poetry_loading = false;
						spotify_uri = result['track'];
						$scope.spotify_embed_url = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri='
							 + spotify_uri + '&amp;view=coverart');
						$scope.valence = result['sentiment'];

						if ( $scope.use_energy_function == "Y" ) {
							$scope.number_of_requests += 1;
							$scope.energy = getNextEnergy();
							if ( $scope.number_of_requests == $scope.energy_wave_period ) {
								// reset number of requests to zero when period reached
								$scope.number_of_requests = 0;
								$scope.energy = 0.5;
							}
						}
					});
				}, 0);
			}, function errorCallback(response) {
				$timeout(function(){ // Prevent synchronous handling
					$scope.$apply(function(){
						$scope.poetry_loading = false;
						$scope.error_message = "Fetching of poetry failed.";
						logError($scope.error_message, {response: response});
					});
				}, 0);
			});
		}, function error() {
			$scope.$apply(function() {
				$scope.error_message = "Could not get current location from the browser.";
				logError($scope.error_message);
			});
		});
	};
}]);