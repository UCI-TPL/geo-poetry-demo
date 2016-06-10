var DEFAULT_ENERGY = 0.5;
var SERVER_BASE_URL = "http://127.0.0.1:5000";

var app = angular.module('GeoPoetryApp', ['fcsa-number']);

function logError(message, dataDictionary) {
	if ( console ) {
		logText = message + "\n";
		if ( dataDictionary ) {
			for (var key in dataDictionary) {
				if ( dataDictionary.hasOwnProperty(key) ) {
					logText += key + ": " + dataDictionary[key] + "\n";
				}
			}
		}
		console.log(logText);
	}
}

app.controller('GeoPoetryController', ['$scope', '$http', function GeoPoetryController($scope, $http) {
	$scope.use_browser_gps = "1";
	$scope.radius_units = "km";
	$scope.genres = [];
	$scope.selected_genre = "-";
	$scope.energy = 0.5;
	$scope.poetry_lines = ["Here is some poetry.", "I hope you like it."];

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
			});
			logError($scope.error_message);
		});
	}
	$scope.refreshGPS();

	$scope.submitForm = function() {
		navigator.geolocation.getCurrentPosition(function success(position) {
			$scope.$apply(function() {
				$scope.latitude = position.coords.latitude;
				$scope.longitude = position.coords.longitude;
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
			//TODO Send to backend
		}, function error() {
			$scope.$apply(function() {
				$scope.error_message = "Could not get current location from the browser.";
			});
			logError($scope.error_message);
		});
	};
}]);