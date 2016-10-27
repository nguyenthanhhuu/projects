angular.module('my2cent.controllers')
.controller('RequestReviewCtrl', function($scope) {
    $scope.selectedOption = 1;
    $scope.showGroup = true;
    $scope.selectTypeChange = function(){
        var value = $scope.selectedOption;
        if(value == 1){ // select group
            $scope.showGroup = true;
        }else{ //select recepient
            $scope.showGroup = false;
        }
    };
});