var DEFAULT_ENERGY = 0.5;
var SERVER_BASE_URL = "http://127.0.0.1:5000";

var app = angular.module('GeoPoetryApp', []);

app.controller('GeoPoetryController', ['$scope', '$http', function GeoPoetryController($scope, $http) {
	$scope.genres = [];
	$scope.selected_genre = "-";
	$scope.energy = 0.5;
	$scope.poetry_lines = ["Here is some poetry.", "I hope you like it."];

	$http.get(SERVER_BASE_URL+"/get-genres").then(
		function successCallback(response) {
			$scope.genres = response.data['genres'];
		},
		function errorCallback(response) {
			// TODO
			console.log(response);
		}
	)

	$scope.submitForm = function() {
		// TODO
	};
}]);