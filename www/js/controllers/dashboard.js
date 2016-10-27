angular.module('my2cent.controllers')

.controller('DashboardCtrl', function($scope, $stateParams, reviewService) {
    $scope.feeds = {};//reviewService.getByUserId($stateParams.userId);
    $scope.rate = 2;
    $scope.max = 5;
});
