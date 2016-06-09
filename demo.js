var app = angular.module('GeoPoetryApp', []);

app.controller('GeoPoetryController', function GeoPoetryController($scope) {
	$scope.genres = ["Jazz", "Rock"];
	$scope.energy = 0.5;
	$scope.poetry_lines = ["Here is some poetry.", "I hope you like it."];
});