angular.module('my2cent.controllers')
.controller('RatingCtrl', function($scope) {
    // set the rate and max variables
    $scope.rate = 1;
    $scope.max = 5;
    $scope.isReadonly = false;

});